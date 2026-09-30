const express = require("express");
const crypto = require("crypto");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const router = express.Router();

/* =========================================================
   CONFIGURATION
========================================================= */

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME || "Phiacademy";

const MEMBERSHIP_PRICE = 10000;
const REFERRAL_COMMISSION = 3000;

const MASTER_KEY = process.env.MASTER_KEY;

/* =========================================================
   MONGODB
========================================================= */

let mongoClient;
let db;

async function connectDB() {
  if (!MONGO_URI) {
    throw new Error("MONGO_URI manquant.");
  }

  mongoClient = new MongoClient(MONGO_URI);

  await mongoClient.connect();

  db = mongoClient.db(DB_NAME);

  console.log("Webhook : MongoDB connecté.");
}

/* =========================================================
   VÉRIFICATION HASH PAYDUNYA
========================================================= */

function verifyPaydunyaHash(receivedHash) {
  if (!MASTER_KEY || !receivedHash) {
    return false;
  }

  const generatedHash = crypto
    .createHash("sha512")
    .update(MASTER_KEY)
    .digest("hex");

  const generatedBuffer =
    Buffer.from(generatedHash, "utf8");

  const receivedBuffer =
    Buffer.from(String(receivedHash), "utf8");

  if (
    generatedBuffer.length !==
    receivedBuffer.length
  ) {
    return false;
  }

  return crypto.timingSafeEqual(
    generatedBuffer,
    receivedBuffer
  );
}

/* =========================================================
   EXTRACTION DES DONNÉES PAYDUNYA
========================================================= */

function extractPaydunyaData(body) {
  /*
     PayDunya envoie normalement :

     req.body.data

     avec application/x-www-form-urlencoded.

     Selon le middleware utilisé, "data" peut
     parfois arriver sous forme de chaîne JSON.
  */

  let data = body?.data;

  if (!data) {
    return null;
  }

  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch (error) {
      console.error(
        "Impossible de parser req.body.data."
      );

      return null;
    }
  }

  return data;
}

/* =========================================================
   WEBHOOK PAYDUNYA
========================================================= */

router.post("/paydunya", async (req, res) => {
  try {
    console.log(
      "Webhook PayDunya reçu."
    );

    /* =====================================================
       RÉCUPÉRATION DES DONNÉES
    ===================================================== */

    const data =
      extractPaydunyaData(req.body);

    if (!data) {
      console.error(
        "Webhook refusé : données PayDunya absentes."
      );

      return res.status(400).json({
        success: false,
        message:
          "Données PayDunya invalides."
      });
    }

    /*
       Structure officielle :

       data.status
       data.hash
       data.invoice.total_amount
       data.invoice.token
       data.custom_data
    */

    const status = String(
      data.status || ""
    ).toLowerCase();

    const amount = Number(
      data.invoice?.total_amount || 0
    );

    const receivedHash =
      data.hash || null;

    const paydunyaToken =
      data.invoice?.token || null;

    const customData =
      data.custom_data || {};

    /*
       Ces données peuvent être présentes
       dans la notification PayDunya.

       Mais pour la sécurité, nous ne nous
       basons pas dessus pour déterminer
       l'utilisateur à créditer.

       Nous allons d'abord retrouver le
       paiement dans notre propre MongoDB.
    */

    const paymentId =
      customData.paymentId ||
      customData.payment_id ||
      null;

    /* =====================================================
       LOG DE CONTRÔLE
    ===================================================== */

    console.log(
      "Statut PayDunya :",
      status
    );

    console.log(
      "Montant PayDunya :",
      amount
    );

    console.log(
      "Token PayDunya :",
      paydunyaToken
    );

    /* =====================================================
       VÉRIFICATION HASH
    ===================================================== */

    if (
      !verifyPaydunyaHash(
        receivedHash
      )
    ) {
      console.error(
        "Webhook refusé : hash PayDunya invalide."
      );

      return res.status(401).json({
        success: false,
        message: "Signature invalide."
      });
    }

    console.log(
      "Hash PayDunya valide."
    );

    /* =====================================================
       RECHERCHE DU PAIEMENT
    ===================================================== */

    let payment = null;

    /*
       1. Recherche par notre ID interne.
    */

    if (paymentId) {
      try {
        payment =
          await db
            .collection("payments")
            .findOne({
              _id: new ObjectId(
                paymentId
              )
            });
      } catch {
        payment = null;
      }
    }

    /*
       2. Si nécessaire, recherche par
          token PayDunya.
    */

    if (
      !payment &&
      paydunyaToken
    ) {
      payment =
        await db
          .collection("payments")
          .findOne({
            paydunyaToken
          });
    }

    if (!payment) {
      console.error(
        "Paiement introuvable dans MongoDB."
      );

      return res.status(404).json({
        success: false,
        message:
          "Paiement introuvable."
      });
    }

    /* =====================================================
       VÉRIFICATION DU MONTANT
    ===================================================== */

    if (
      amount !== MEMBERSHIP_PRICE
    ) {
      console.error(
        `Montant incorrect : ${amount} XOF.`
      );

      /*
         On ne valide jamais un paiement
         avec un montant différent du prix
         fixé par le serveur.
      */

      await db
        .collection("payments")
        .updateOne(
          {
            _id: payment._id,

            status: "pending"
          },
          {
            $set: {
              status: "failed",

              failureReason:
                "Montant incorrect.",

              updatedAt:
                new Date()
            }
          }
        );

      return res.status(400).json({
        success: false,
        message:
          "Montant de paiement incorrect."
      });
    }

    /* =====================================================
       PAIEMENT NON COMPLÉTÉ
    ===================================================== */

    if (
      status !== "completed"
    ) {
      console.log(
        `Paiement non complété : ${status}`
      );

      let newStatus = "failed";

      if (
        status === "cancelled"
      ) {
        newStatus = "cancelled";
      }

      await db
        .collection("payments")
        .updateOne(
          {
            _id: payment._id,

            status: "pending"
          },
          {
            $set: {
              status: newStatus,

              updatedAt:
                new Date()
            }
          }
        );

      /*
         On répond correctement à PayDunya,
         mais aucun compte n'est activé.
      */

      return res.json({
        success: true,
        message:
          "Notification reçue."
      });
    }

    /* =====================================================
       PROTECTION CONTRE LE DOUBLE TRAITEMENT
    ===================================================== */

    if (
      payment.status === "completed"
    ) {
      console.log(
        "Paiement déjà traité."
      );

      return res.json({
        success: true,
        message:
          "Paiement déjà traité."
      });
    }

    /* =====================================================
       UTILISATEUR
    ===================================================== */

    const user =
      await db
        .collection("users")
        .findOne({
          _id: payment.userId
        });

    if (!user) {
      console.error(
        "Utilisateur associé au paiement introuvable."
      );

      return res.status(404).json({
        success: false,
        message:
          "Utilisateur introuvable."
      });
    }

    /* =====================================================
       TRANSACTION MONGODB
    ===================================================== */

    const session =
      mongoClient.startSession();

    try {
      await session.withTransaction(
        async () => {
          const users =
            db.collection("users");

          const payments =
            db.collection("payments");

          const transactions =
            db.collection("transactions");

          /* -----------------------------------------------
             1. TRANSITION DU PAIEMENT

             pending → completed

             Cette condition empêche deux traitements
             simultanés du même paiement.
          ------------------------------------------------ */

          const paymentUpdate =
            await payments.updateOne(
              {
                _id: payment._id,

                status: "pending"
              },
              {
                $set: {
                  status: "completed",

                  paydunyaToken:
                    paydunyaToken ||
                    payment.paydunyaToken ||
                    null,

                  completedAt:
                    new Date(),

                  updatedAt:
                    new Date()
                }
              },
              {
                session
              }
            );

          /*
             Si aucun document n'a été modifié,
             un autre webhook a déjà traité
             ce paiement.
          */

          if (
            paymentUpdate.modifiedCount !== 1
          ) {
            return;
          }

          /* -----------------------------------------------
             2. ACTIVATION DU COMPTE
          ------------------------------------------------ */

          await users.updateOne(
            {
              _id: user._id,

              status: "pending"
            },
            {
              $set: {
                status: "active",

                updatedAt:
                  new Date()
              }
            },
            {
              session
            }
          );

          /* -----------------------------------------------
             3. COMMISSION DU PARRAIN
          ------------------------------------------------ */

          if (
            user.referredBy
          ) {
            /*
               Vérifie si une commission existe
               déjà pour CE paiement.
            */

            const existingCommission =
              await transactions.findOne(
                {
                  type:
                    "referral_commission",

                  paymentId:
                    payment._id
                },
                {
                  session
                }
              );

            /*
               Si aucune commission n'existe,
               on peut la créer.
            */

            if (
              !existingCommission
            ) {
              const referrer =
                await users.findOne(
                  {
                    _id:
                      user.referredBy
                  },
                  {
                    session
                  }
                );

              if (referrer) {
                /* -----------------------------------------
                   Crédit du parrain
                ------------------------------------------ */

                await users.updateOne(
                  {
                    _id:
                      referrer._id
                  },
                  {
                    $inc: {
                      balance:
                        REFERRAL_COMMISSION
                    },

                    $set: {
                      updatedAt:
                        new Date()
                    }
                  },
                  {
                    session
                  }
                );

                /* -----------------------------------------
                   Historique financier
                ------------------------------------------ */

                await transactions.insertOne(
                  {
                    userId:
                      referrer._id,

                    type:
                      "referral_commission",

                    amount:
                      REFERRAL_COMMISSION,

                    direction:
                      "credit",

                    paymentId:
                      payment._id,

                    referredUserId:
                      user._id,

                    createdAt:
                      new Date()
                  },
                  {
                    session
                  }
                );

                /* -----------------------------------------
                   Marquer la commission comme payée
                ------------------------------------------ */

                await payments.updateOne(
                  {
                    _id:
                      payment._id
                  },
                  {
                    $set: {
                      commissionStatus:
                        "paid",

                      commissionAmount:
                        REFERRAL_COMMISSION,

                      commissionPaidTo:
                        referrer._id,

                      commissionPaidAt:
                        new Date(),

                      updatedAt:
                        new Date()
                    }
                  },
                  {
                    session
                  }
                );

                console.log(
                  `Commission de ${REFERRAL_COMMISSION} FCFA attribuée au parrain ${referrer._id}.`
                );
              }
            }
          }
        }
      );
    } finally {
      await session.endSession();
    }

    console.log(
      `Paiement confirmé pour ${user.email}.`
    );

    return res.json({
      success: true,
      message:
        "Paiement confirmé et compte activé."
    });
  } catch (error) {
    console.error(
      "Erreur webhook PayDunya :",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Erreur lors du traitement du paiement."
    });
  }
});

/* =========================================================
   DÉMARRAGE
========================================================= */

connectDB()
  .then(() => {
    console.log(
      "Webhook PayDunya prêt."
    );
  })
  .catch((error) => {
    console.error(
      "Impossible de connecter le webhook à MongoDB :",
      error
    );

    process.exit(1);
  });

module.exports = router;