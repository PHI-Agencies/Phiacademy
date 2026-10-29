/* =========================================================
   PHI ACADEMY — RETRAITS
   ---------------------------------------------------------
   Règles :
   - minimum de retrait, frais en pourcentage ;
   - accès protégé par la reconnexion (mot de passe), voir
     requireSecureUser dans server.js ;
   - 3 statuts : "pending" (En attente), "paid" (Payé),
     "refused" (Refusé) ;
   - paiement manuel par l'équipe, depuis la page /admin.

   Modèle de solde (déjà utilisé dans server.js) :
   - users.balance            : solde total
   - users.pendingWithdrawal  : montant réservé par les retraits
                                en attente
   - solde disponible = balance - pendingWithdrawal

   Le solde n'est débité qu'au moment du paiement ("paid").
   Un refus libère simplement la réservation.
========================================================= */

const { parsePhoneNumberFromString } = require("libphonenumber-js");

/* =========================================================
   CONFIGURATION (lue au moment de l'appel : .env déjà chargé)
========================================================= */

function getConfig() {
  const minAmount = Number(process.env.WITHDRAW_MIN_AMOUNT || 10000);

  const rawFee =
    process.env.WITHDRAW_FEE_PERCENT === undefined ||
    process.env.WITHDRAW_FEE_PERCENT === ""
      ? 7
      : Number(process.env.WITHDRAW_FEE_PERCENT);

  return {
    minAmount:
      Number.isInteger(minAmount) && minAmount > 0
        ? minAmount
        : 10000,

    feePercent:
      Number.isFinite(rawFee) && rawFee >= 0 && rawFee < 100
        ? rawFee
        : 7,

  };
}

const ALLOWED_OPERATORS = [
  "Orange Money",
  "Moov Money",
  "Wave",
  "Autre"
];

/* =========================================================
   OUTILS
========================================================= */

function formatFcfa(value) {
  return `${Number(value || 0).toLocaleString("fr-FR")} FCFA`;
}

function calculateFee(amount, feePercent) {
  return Math.round((amount * feePercent) / 100);
}

/*
 * Formate un retrait pour le navigateur.
 * Gère aussi les anciens retraits (statut "rejected",
 * sans frais ni opérateur).
 */
function serializeWithdrawal(withdrawal) {
  const status =
    withdrawal.status === "rejected"
      ? "refused"
      : withdrawal.status;

  const fee = Number(withdrawal.fee || 0);

  return {
    _id: String(withdrawal._id),
    amount: withdrawal.amount,
    fee,
    netAmount:
      withdrawal.netAmount ??
      withdrawal.amount - fee,
    operator: withdrawal.operator || null,
    phone: withdrawal.phone || null,
    status,
    createdAt: withdrawal.createdAt,
    paidAt:
      withdrawal.paidAt ||
      (status === "paid"
        ? withdrawal.processedAt
        : null) ||
      null,
    reference: withdrawal.reference || null,
    refusalReason: withdrawal.refusalReason || null
  };
}

/* =========================================================
   INDEX
========================================================= */

async function ensureWithdrawalIndexes(db) {
  const withdrawals = db.collection("withdrawals");

  const tasks = [
    // Une seule demande "En attente" par membre
    () =>
      withdrawals.createIndex(
        { userId: 1 },
        {
          unique: true,
          name: "one_pending_withdrawal_per_user",
          partialFilterExpression: { status: "pending" }
        }
      )
  ];

  /*
   * Un index qui échoue (par exemple parce que d'anciennes
   * données contiennent déjà deux retraits en attente pour le
   * même membre) ne doit pas empêcher le serveur de démarrer.
   * La règle "une demande à la fois" reste vérifiée dans le code.
   */
  for (const task of tasks) {
    try {
      await task();
    } catch (error) {
      console.warn(
        "[RETRAITS] Index non créé :",
        error.message
      );
    }
  }
}

/* =========================================================
   ROUTES
========================================================= */

function registerWithdrawalRoutes({
  app,
  getDb,
  getClient,
  requireSecureUser,
  requireAdmin,
  ObjectId
}) {
  /* -------------------------------------------------------
     GET /api/withdrawals
     Solde disponible, règles et historique du membre
  ------------------------------------------------------- */

  app.get(
    "/api/withdrawals",
    requireSecureUser,
    async (req, res) => {
      try {
        const config = getConfig();

        const withdrawals = await getDb()
          .collection("withdrawals")
          .find({ userId: req.user._id })
          .sort({ createdAt: -1 })
          .limit(100)
          .toArray();

        const available = Math.max(
          0,
          Number(req.user.balance || 0) -
            Number(req.user.pendingWithdrawal || 0)
        );

        return res.json({
          success: true,
          balance: available,
          minAmount: config.minAmount,
          feePercent: config.feePercent,
          withdrawals: withdrawals.map(serializeWithdrawal)
        });
      } catch (error) {
        console.error("Erreur liste retraits :", error);

        return res.status(500).json({
          success: false,
          message: "Impossible de charger vos retraits."
        });
      }
    }
  );

  /* -------------------------------------------------------
     POST /api/withdrawals
     Crée la demande (accès protégé par la reconnexion)
  ------------------------------------------------------- */

  app.post(
    "/api/withdrawals",
    requireSecureUser,
    async (req, res) => {
      const config = getConfig();
      const db = getDb();
      const session = getClient().startSession();

      try {
        /* ---------- 1. Validation des champs ---------- */

        const amount = Number(req.body.amount);

        if (!Number.isInteger(amount) || amount <= 0) {
          return res.status(400).json({
            success: false,
            message: "Montant de retrait invalide."
          });
        }

        if (amount < config.minAmount) {
          return res.status(400).json({
            success: false,
            message: `Le montant minimum de retrait est de ${formatFcfa(
              config.minAmount
            )}.`
          });
        }

        const operator = String(req.body.operator || "").trim();

        if (!ALLOWED_OPERATORS.includes(operator)) {
          return res.status(400).json({
            success: false,
            message: "Opérateur de paiement invalide."
          });
        }

        const parsedPhone = parsePhoneNumberFromString(
          String(req.body.phone || "").trim()
        );

        if (!parsedPhone || !parsedPhone.isValid()) {
          return res.status(400).json({
            success: false,
            message: "Numéro de paiement invalide."
          });
        }

        const phone = parsedPhone.number; // format international

        /* ---------- 2. Création de la demande ---------- */

        const fee = calculateFee(amount, config.feePercent);
        const netAmount = amount - fee;

        let withdrawal = null;

        await session.withTransaction(async () => {
          withdrawal = null;

          const users = db.collection("users");
          const withdrawals = db.collection("withdrawals");

          const alreadyPending = await withdrawals.findOne(
            { userId: req.user._id, status: "pending" },
            { session, projection: { _id: 1 } }
          );

          if (alreadyPending) {
            throw new Error("DEMANDE_EN_COURS");
          }

          const reservation = await users.updateOne(
            {
              _id: req.user._id,

              $expr: {
                $gte: [
                  {
                    $subtract: [
                      { $ifNull: ["$balance", 0] },
                      { $ifNull: ["$pendingWithdrawal", 0] }
                    ]
                  },
                  amount
                ]
              }
            },
            {
              $inc: { pendingWithdrawal: amount },
              $set: { updatedAt: new Date() }
            },
            { session }
          );

          if (reservation.modifiedCount !== 1) {
            throw new Error("SOLDE_INSUFFISANT");
          }

          const document = {
            userId: req.user._id,
            amount,
            fee,
            feePercent: config.feePercent,
            netAmount,
            operator,
            phone,
            status: "pending",
            createdAt: new Date(),
            processedAt: null,
            paidAt: null,
            reference: null,
            refusalReason: null
          };

          const inserted = await withdrawals.insertOne(document, {
            session
          });

          withdrawal = {
            ...document,
            _id: inserted.insertedId
          };
        });

        return res.status(201).json({
          success: true,
          message: "Demande de retrait enregistrée.",
          withdrawal: serializeWithdrawal(withdrawal)
        });
      } catch (error) {
        const known = {
          DEMANDE_EN_COURS: [
            409,
            "Vous avez déjà une demande de retrait en attente."
          ],
          SOLDE_INSUFFISANT: [
            400,
            "Solde disponible insuffisant."
          ]
        }[error.message];

        if (known) {
          return res.status(known[0]).json({
            success: false,
            message: known[1]
          });
        }

        // Violation de l'index "une seule demande en attente"
        if (error?.code === 11000) {
          return res.status(409).json({
            success: false,
            message:
              "Vous avez déjà une demande de retrait en attente."
          });
        }

        console.error("Erreur retrait :", error);

        return res.status(500).json({
          success: false,
          message: "Impossible d'enregistrer le retrait."
        });
      } finally {
        await session.endSession();
      }
    }
  );

  /* -------------------------------------------------------
     GET /api/admin/withdrawals
     Toutes les demandes, pour la page /admin
  ------------------------------------------------------- */

  app.get(
    "/api/admin/withdrawals",
    requireAdmin,
    async (req, res) => {
      try {
        const rows = await getDb()
          .collection("withdrawals")
          .aggregate([
            { $sort: { createdAt: -1 } },
            { $limit: 300 },
            {
              $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user"
              }
            },
            {
              $unwind: {
                path: "$user",
                preserveNullAndEmptyArrays: true
              }
            },
            {
              $project: {
                amount: 1,
                fee: 1,
                netAmount: 1,
                operator: 1,
                phone: 1,
                status: 1,
                createdAt: 1,
                processedAt: 1,
                paidAt: 1,
                reference: 1,
                refusalReason: 1,
                user: {
                  firstName: "$user.firstName",
                  lastName: "$user.lastName",
                  email: "$user.email"
                }
              }
            }
          ])
          .toArray();

        const withdrawals = rows.map((row) => ({
          ...serializeWithdrawal(row),
          user: row.user || null
        }));

        return res.json({
          success: true,
          withdrawals
        });
      } catch (error) {
        console.error("Erreur retraits admin :", error);

        return res.status(500).json({
          success: false,
          message: "Impossible de charger les retraits."
        });
      }
    }
  );

  /* -------------------------------------------------------
     PATCH /api/admin/withdrawals/:id
     { status: "paid", reference? }
     { status: "refused", reason }
  ------------------------------------------------------- */

  app.patch(
    "/api/admin/withdrawals/:id",
    requireAdmin,
    async (req, res) => {
      const withdrawalId = req.params.id;

      if (!ObjectId.isValid(withdrawalId)) {
        return res.status(400).json({
          success: false,
          message: "Identifiant de retrait invalide."
        });
      }

      // "action" / "rejected" : anciens noms, toujours acceptés
      let status = String(
        req.body.status || req.body.action || ""
      )
        .trim()
        .toLowerCase();

      if (status === "rejected") {
        status = "refused";
      }

      if (status !== "paid" && status !== "refused") {
        return res.status(400).json({
          success: false,
          message: "Action de retrait invalide."
        });
      }

      const reference = String(req.body.reference || "")
        .trim()
        .slice(0, 100);

      const reason = String(req.body.reason || "")
        .trim()
        .slice(0, 200);

      if (status === "refused" && !reason) {
        return res.status(400).json({
          success: false,
          message: "Le motif du refus est obligatoire."
        });
      }

      const db = getDb();
      const session = getClient().startSession();

      try {
        const withdrawalObjectId = new ObjectId(withdrawalId);


        await session.withTransaction(async () => {
          const withdrawals = db.collection("withdrawals");
          const users = db.collection("users");
          const transactions = db.collection("transactions");

          const withdrawal = await withdrawals.findOne(
            { _id: withdrawalObjectId },
            { session }
          );

          if (!withdrawal) {
            throw new Error("RETRAIT_INTROUVABLE");
          }

          if (withdrawal.status !== "pending") {
            throw new Error("RETRAIT_DEJA_TRAITE");
          }

          const user = await users.findOne(
            { _id: withdrawal.userId },
            { session }
          );

          if (!user) {
            throw new Error("UTILISATEUR_INTROUVABLE");
          }

          const now = new Date();

          if (status === "paid") {
            /*
             * Paiement : le montant quitte vraiment le solde
             * et la réservation est libérée.
             */
            const debit = await users.updateOne(
              {
                _id: user._id,

                $expr: {
                  $gte: [{ $ifNull: ["$balance", 0] }, withdrawal.amount]
                }
              },
              {
                $inc: {
                  balance: -withdrawal.amount,
                  pendingWithdrawal: -withdrawal.amount
                },
                $set: { updatedAt: now }
              },
              { session }
            );

            if (debit.modifiedCount !== 1) {
              throw new Error("SOLDE_INSUFFISANT");
            }

            const update = await withdrawals.updateOne(
              { _id: withdrawal._id, status: "pending" },
              {
                $set: {
                  status: "paid",
                  paidAt: now,
                  processedAt: now,
                  processedBy: req.admin._id,
                  reference: reference || null,
                  updatedAt: now
                }
              },
              { session }
            );

            if (update.modifiedCount !== 1) {
              throw new Error("RETRAIT_DEJA_TRAITE");
            }

            await transactions.insertOne(
              {
                userId: user._id,
                type: "withdrawal_paid",
                amount: -withdrawal.amount,
                withdrawalId: withdrawal._id,
                description: "Retrait payé",
                createdAt: now
              },
              { session }
            );
          } else {
            /*
             * Refus : le solde n'a jamais été débité, on libère
             * simplement la réservation. Le montant redevient
             * disponible pour le membre.
             */
            await users.updateOne(
              { _id: user._id },
              {
                $inc: { pendingWithdrawal: -withdrawal.amount },
                $set: { updatedAt: now }
              },
              { session }
            );

            const update = await withdrawals.updateOne(
              { _id: withdrawal._id, status: "pending" },
              {
                $set: {
                  status: "refused",
                  refusalReason: reason,
                  refusedAt: now,
                  processedAt: now,
                  processedBy: req.admin._id,
                  updatedAt: now
                }
              },
              { session }
            );

            if (update.modifiedCount !== 1) {
              throw new Error("RETRAIT_DEJA_TRAITE");
            }

            await transactions.insertOne(
              {
                userId: user._id,
                type: "withdrawal_rejected",
                amount: 0,
                withdrawalId: withdrawal._id,
                description: "Demande de retrait refusée",
                createdAt: now
              },
              { session }
            );
          }

        });

        return res.json({
          success: true,
          message:
            status === "paid"
              ? "Retrait marqué comme payé."
              : "Retrait refusé."
        });
      } catch (error) {
        const known = {
          RETRAIT_INTROUVABLE: [404, "Retrait introuvable."],
          RETRAIT_DEJA_TRAITE: [
            409,
            "Ce retrait a déjà été traité."
          ],
          UTILISATEUR_INTROUVABLE: [404, "Utilisateur introuvable."],
          SOLDE_INSUFFISANT: [
            400,
            "Le solde du membre est insuffisant pour traiter ce retrait."
          ]
        }[error.message];

        if (known) {
          return res.status(known[0]).json({
            success: false,
            message: known[1]
          });
        }

        console.error("Erreur traitement retrait admin :", error);

        return res.status(500).json({
          success: false,
          message: "Impossible de traiter le retrait."
        });
      } finally {
        await session.endSession();
      }
    }
  );
}

module.exports = {
  registerWithdrawalRoutes,
  ensureWithdrawalIndexes,
  // exportés pour les tests
  calculateFee,
  serializeWithdrawal,
  getConfig
};
