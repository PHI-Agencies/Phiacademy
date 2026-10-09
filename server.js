const express = require("express");
const path = require("path");
const crypto = require("crypto");
const axios = require("axios");
const cookieParser = require("cookie-parser");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();

/* =========================================================
   CONFIGURATION
========================================================= */

const PORT = process.env.PORT || 3000;

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME || "Phiacademy";

const PAYDUNYA_CHECKOUT_URL =
  "https://app.paydunya.com/api/v1/checkout-invoice/create";

const PAYDUNYA_MASTER_KEY = process.env.MASTER_KEY;
const PAYDUNYA_PRIVATE_KEY = process.env.PRIVATE_KEY;
const PAYDUNYA_TOKEN = process.env.TOKEN;

const CALLBACK_URL = process.env.CALLBACK_URL;
const RETURN_URL = process.env.RETURN_URL;
const CANCEL_URL =
  process.env.CANCEL_URL || RETURN_URL || CALLBACK_URL;

const ADMIN_EMAIL = String(process.env.ADMIN_EMAIL || "")
  .trim()
  .toLowerCase();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";

const MEMBERSHIP_PRICE = 10000;
const REFERRAL_COMMISSION = 3000;

/* =========================================================
   EXPRESS
========================================================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  "/images",
  express.static(
    path.join(__dirname, "public", "images")
  )
);

app.use(
  express.static(
    path.join(__dirname, "dist")
  )
);

/* =========================================================
   MONGODB
========================================================= */

let mongoClient;
let db;

async function connectDB() {
  if (!MONGO_URI) {
    throw new Error(
      "MONGO_URI est manquant dans le fichier .env"
    );
  }

  mongoClient = new MongoClient(MONGO_URI);

  await mongoClient.connect();

  db = mongoClient.db(DB_NAME);

  console.log("MongoDB connecté.");

  await createIndexes();

  console.log("Indexes MongoDB vérifiés.");

  await ensureAdmin();

  console.log("Administrateur vérifié.");
}

/* =========================================================
   INDEXES
========================================================= */

async function createIndexes() {
  const users = db.collection("users");
  const payments = db.collection("payments");
  const withdrawals = db.collection("withdrawals");
  const admins = db.collection("admins");
  const transactions = db.collection("transactions");

  await users.createIndex(
    { email: 1 },
    { unique: true }
  );

  await users.createIndex(
    { phone: 1 },
    { unique: true }
  );

  await users.createIndex(
    { referralCode: 1 },
    { unique: true }
  );

  /*
   * IMPORTANT :
   * "sparse" est une option d'index MongoDB.
   * Elle doit être placée dans le deuxième argument
   * de createIndex(), et non dans la clé de l'index.
   */
  await users.createIndex(
    { sessionTokenHash: 1 },
    {
      unique: true,
      sparse: true
    }
  );

  await payments.createIndex(
    { paydunyaToken: 1 },
    {
      unique: true,
      sparse: true
    }
  );

  await payments.createIndex({
    userId: 1,
    status: 1
  });

  await withdrawals.createIndex({
    userId: 1,
    createdAt: -1
  });

  await withdrawals.createIndex({
    status: 1,
    createdAt: -1
  });

  await admins.createIndex(
    { email: 1 },
    { unique: true }
  );

  /*
   * Même correction pour les sessions administrateur.
   */
  await admins.createIndex(
    { sessionTokenHash: 1 },
    {
      unique: true,
      sparse: true
    }
  );

  await transactions.createIndex({
    userId: 1,
    createdAt: -1
  });

  await transactions.createIndex(
    {
      type: 1,
      paymentId: 1
    },
    {
      unique: true,
      partialFilterExpression: {
        type: "referral_commission",
        paymentId: {
          $exists: true
        }
      }
    }
  );
}

/* =========================================================
   OUTILS
========================================================= */

function normalizeEmail(email) {
  return String(email || "")
    .trim()
    .toLowerCase();
}

function normalizePhone(phone) {
  return String(phone || "")
    .trim()
    .replace(/\s+/g, "");
}

function normalizeReferralCode(code) {
  return String(code || "")
    .trim()
    .toUpperCase();
}

function generateReferralCode() {
  return crypto
    .randomBytes(5)
    .toString("hex")
    .toUpperCase();
}

function generateSessionToken() {
  return crypto.randomBytes(48).toString("hex");
}

function hashSessionToken(token) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

/* =========================================================
   MOT DE PASSE (CORRIGÉ)
========================================================= */

function hashPassword(password) {
  return new Promise((resolve, reject) => {
    // Génère un sel unique de 16 octets
    const salt = crypto.randomBytes(16).toString("hex");

    crypto.scrypt(password, salt, 64, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }

      // Stocke au format "sel:hash_hexadécimal"
      resolve(`${salt}:${derivedKey.toString("hex")}`);
    });
  });
}

function verifyPassword(password, storedHash) {
  return new Promise((resolve, reject) => {
    try {
      if (!storedHash || typeof storedHash !== "string") {
        resolve(false);
        return;
      }

      const [salt, key] = storedHash.split(":");

      if (!salt || !key) {
        resolve(false);
        return;
      }

      // On dérive le mot de passe entré par l'utilisateur avec le MÊME sel
      crypto.scrypt(password, salt, 64, (error, derivedKey) => {
        if (error) {
          reject(error);
          return;
        }

        const keyBuffer = Buffer.from(key, "hex");

        // Comparaison sécurisée contre les attaques par analyse temporelle (timing attacks)
        if (keyBuffer.length !== derivedKey.length) {
          resolve(false);
          return;
        }

        resolve(crypto.timingSafeEqual(keyBuffer, derivedKey));
      });
    } catch (err) {
      resolve(false);
    }
  });
}

/* =========================================================
   SESSION MEMBRE
========================================================= */

function setSessionCookie(
  res,
  token
) {
  res.cookie(
    "phi_session",
    token,
    {
      httpOnly: true,
      secure:
        process.env.NODE_ENV ===
        "production",
      sameSite: "lax",
      maxAge:
        1000 *
        60 *
        60 *
        24 *
        30
    }
  );
}

function clearSessionCookie(res) {
  res.clearCookie(
    "phi_session",
    {
      httpOnly: true,
      secure:
        process.env.NODE_ENV ===
        "production",
      sameSite: "lax"
    }
  );
}

async function getAuthenticatedUser(req) {
  const token =
    req.cookies?.phi_session;

  if (!token) {
    return null;
  }

  const sessionHash =
    hashSessionToken(token);

  const user =
    await db
      .collection("users")
      .findOne({
        sessionTokenHash:
          sessionHash
      });

  return user || null;
}

/* =========================================================
   SESSION ADMINISTRATEUR
========================================================= */

function setAdminSessionCookie(
  res,
  token
) {
  res.cookie(
    "phi_admin_session",
    token,
    {
      httpOnly: true,
      secure:
        process.env.NODE_ENV ===
        "production",
      sameSite: "lax",
      maxAge:
        1000 *
        60 *
        60 *
        8
    }
  );
}

function clearAdminSessionCookie(res) {
  res.clearCookie(
    "phi_admin_session",
    {
      httpOnly: true,
      secure:
        process.env.NODE_ENV ===
        "production",
      sameSite: "lax"
    }
  );
}

async function getAuthenticatedAdmin(req) {
  const token =
    req.cookies?.phi_admin_session;

  if (!token) {
    return null;
  }

  const sessionHash =
    hashSessionToken(token);

  const admin =
    await db
      .collection("admins")
      .findOne({
        sessionTokenHash:
          sessionHash,

        active:
          true
      });

  return admin || null;
}

/* =========================================================
   CRÉATION / VÉRIFICATION ADMINISTRATEUR
========================================================= */

async function ensureAdmin() {
  if (
    !ADMIN_EMAIL ||
    !ADMIN_PASSWORD
  ) {
    console.warn(
      "ADMIN_EMAIL ou ADMIN_PASSWORD absent. Aucun administrateur n'a été créé automatiquement."
    );

    return;
  }

  if (
    ADMIN_PASSWORD.length < 12
  ) {
    throw new Error(
      "ADMIN_PASSWORD doit contenir au moins 12 caractères."
    );
  }

  const admins =
    db.collection("admins");

  const existingAdmin =
    await admins.findOne({
      email:
        ADMIN_EMAIL
    });

  if (existingAdmin) {
    return;
  }

  const passwordHash =
    await hashPassword(
      ADMIN_PASSWORD
    );

  await admins.insertOne({
    email:
      ADMIN_EMAIL,

    passwordHash,

    role:
      "admin",

    active:
      true,

    sessionTokenHash:
      null,

    createdAt:
      new Date(),

    updatedAt:
      new Date()
  });

  console.log(
    `Administrateur initial créé : ${ADMIN_EMAIL}`
  );
}

/* =========================================================
   MIDDLEWARE AUTH MEMBRE
========================================================= */

async function requireAuth(
  req,
  res,
  next
) {
  try {
    const user =
      await getAuthenticatedUser(
        req
      );

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Connexion requise."
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error(
      "Erreur authentification :",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Erreur serveur."
    });
  }
}

async function requireActiveUser(
  req,
  res,
  next
) {
  try {
    const user =
      await getAuthenticatedUser(
        req
      );

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Connexion requise."
      });
    }

    if (
      user.status !==
      "active"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Votre compte n'est pas encore actif."
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error(
      "Erreur vérification compte :",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Erreur serveur."
    });
  }
}

/* =========================================================
   MIDDLEWARE ADMIN
========================================================= */

async function requireAdmin(
  req,
  res,
  next
) {
  try {
    const admin =
      await getAuthenticatedAdmin(
        req
      );

    if (!admin) {
      return res.status(401).json({
        success: false,
        message:
          "Accès administrateur requis."
      });
    }

    if (
      admin.active !== true ||
      admin.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Droits administrateur insuffisants."
      });
    }

    req.admin = admin;

    next();
  } catch (error) {
    console.error(
      "Erreur authentification admin :",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Erreur serveur."
    });
  }
}

/* =========================================================
   UTILITAIRES PAYDUNYA
========================================================= */

function parsePayDunyaData(body) {
  let data =
    body?.data;

  if (!data) {
    return null;
  }

  if (
    typeof data ===
    "string"
  ) {
    try {
      data =
        JSON.parse(data);
    } catch {
      return null;
    }
  }

  return data;
}

function createPayDunyaHash() {
  return crypto
    .createHash("sha512")
    .update(
      PAYDUNYA_MASTER_KEY || ""
    )
    .digest("hex");
}

function verifyPayDunyaHash(
  receivedHash
) {
  if (
    !receivedHash ||
    !PAYDUNYA_MASTER_KEY
  ) {
    return false;
  }

  const expectedHash =
    createPayDunyaHash();

  const receivedBuffer =
    Buffer.from(
      String(
        receivedHash
      ).toLowerCase()
    );

  const expectedBuffer =
    Buffer.from(
      expectedHash.toLowerCase()
    );

  if (
    receivedBuffer.length !==
    expectedBuffer.length
  ) {
    return false;
  }

  return crypto.timingSafeEqual(
    receivedBuffer,
    expectedBuffer
  );
}

/* =========================================================
   COMMISSION PARRAINAGE
========================================================= */

async function processReferralCommission(
  session,
  payment,
  user
) {
  if (
    !payment ||
    !user
  ) {
    return false;
  }

  if (!user.referredBy) {
    await db
      .collection("payments")
      .updateOne(
        {
          _id:
            payment._id,

          commissionStatus: {
            $ne:
              "paid"
          }
        },
        {
          $set: {
            commissionStatus:
              "not_applicable",

            updatedAt:
              new Date()
          }
        },
        {
          session
        }
      );

    return false;
  }

  const transactionExists =
    await db
      .collection("transactions")
      .findOne(
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

  if (transactionExists) {
    return false;
  }

  const referrer =
    await db
      .collection("users")
      .findOne(
        {
          _id:
            user.referredBy
        },
        {
          session
        }
      );

  if (!referrer) {
    await db
      .collection("payments")
      .updateOne(
        {
          _id:
            payment._id
        },
        {
          $set: {
            commissionStatus:
              "failed",

            commissionError:
              "Parrain introuvable.",

            updatedAt:
              new Date()
          }
        },
        {
          session
        }
      );

    return false;
  }

  await db
    .collection("users")
    .updateOne(
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

  await db
    .collection("transactions")
    .insertOne(
      {
        userId:
          referrer._id,

        type:
          "referral_commission",

        amount:
          REFERRAL_COMMISSION,

        paymentId:
          payment._id,

        referredUserId:
          user._id,

        description:
          "Commission de parrainage",

        createdAt:
          new Date()
      },
      {
        session
      }
    );

  await db
    .collection("payments")
    .updateOne(
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

  return true;
}

/* =========================================================
   FINALISATION PAIEMENT
========================================================= */

async function completePaymentByToken(
  token
) {
  if (!token) {
    throw new Error(
      "TOKEN_PAYDUNYA_MANQUANT"
    );
  }

  const session =
    mongoClient.startSession();

  try {
    let result =
      null;

    await session.withTransaction(
      async () => {
        const payments =
          db.collection(
            "payments"
          );

        const users =
          db.collection(
            "users"
          );

        const payment =
          await payments.findOne(
            {
              paydunyaToken:
                token
            },
            {
              session
            }
          );

        if (!payment) {
          throw new Error(
            "PAIEMENT_LOCAL_INTROUVABLE"
          );
        }

        const user =
          await users.findOne(
            {
              _id:
                payment.userId
            },
            {
              session
            }
          );

        if (!user) {
          throw new Error(
            "UTILISATEUR_INTROUVABLE"
          );
        }

        if (
          payment.status ===
          "completed"
        ) {
          result = {
            alreadyCompleted:
              true,

            userId:
              user._id
          };

          return;
        }

        await payments.updateOne(
          {
            _id:
              payment._id,

            status: {
              $ne:
                "completed"
            }
          },
          {
            $set: {
              status:
                "completed",

              completedAt:
                new Date(),

              paydunyaStatus:
                "completed",

              updatedAt:
                new Date()
            }
          },
          {
            session
          }
        );

        await users.updateOne(
          {
            _id:
              user._id
          },
          {
            $set: {
              status:
                "active",

              updatedAt:
                new Date()
            }
          },
          {
            session
          }
        );

        await processReferralCommission(
          session,
          payment,
          user
        );

        result = {
          alreadyCompleted:
            false,

          userId:
            user._id
        };
      }
    );

    return result;
  } finally {
    await session.endSession();
  }
}

/* =========================================================
   API HEALTH
========================================================= */

app.get(
  "/api/health",
  (req, res) => {
    res.json({
      success:
        true,

      message:
        "Serveur PHI Academy opérationnel."
    });
  }
);

/* =========================================================
   INSCRIPTION
========================================================= */

app.post(
  "/api/auth/register",
  async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        phone,
        email,
        password,
        referralCode
      } = req.body;

      const cleanFirstName =
        String(
          firstName || ""
        ).trim();

      const cleanLastName =
        String(
          lastName || ""
        ).trim();

      const cleanPhone =
        normalizePhone(
          phone
        );

      const cleanEmail =
        normalizeEmail(
          email
        );

      const cleanReferralCode =
        normalizeReferralCode(
          referralCode
        );

      if (
        !cleanFirstName ||
        !cleanLastName ||
        !cleanPhone ||
        !cleanEmail ||
        !password ||
        !cleanReferralCode
      ) {
        return res.status(400).json({
          success:
            false,

          message:
            "Tous les champs sont obligatoires."
        });
      }

      if (
        String(password).length <
        8
      ) {
        return res.status(400).json({
          success:
            false,

          message:
            "Le mot de passe doit contenir au moins 8 caractères."
        });
      }

      const referrer =
        await db
          .collection("users")
          .findOne({
            referralCode:
              cleanReferralCode
          });

      if (!referrer) {
        return res.status(400).json({
          success:
            false,

          message:
            "Code parrain invalide."
        });
      }

      if (
        referrer.email ===
          cleanEmail ||
        referrer.phone ===
          cleanPhone
      ) {
        return res.status(400).json({
          success:
            false,

          message:
            "Vous ne pouvez pas utiliser votre propre code."
        });
      }

      const existingUser =
        await db
          .collection("users")
          .findOne({
            $or: [
              {
                email:
                  cleanEmail
              },

              {
                phone:
                  cleanPhone
              }
            ]
          });

      if (existingUser) {
        return res.status(409).json({
          success:
            false,

          message:
            "Un compte existe déjà avec cet email ou ce numéro."
        });
      }

      const passwordHash =
        await hashPassword(
          password
        );

      let newReferralCode;

      while (true) {
        newReferralCode =
          generateReferralCode();

        const exists =
          await db
            .collection("users")
            .findOne({
              referralCode:
                newReferralCode
            });

        if (!exists) {
          break;
        }
      }

      const now =
        new Date();

      const sessionToken =
        generateSessionToken();

      const sessionHash =
        hashSessionToken(
          sessionToken
        );

      const newUser = {
        firstName:
          cleanFirstName,

        lastName:
          cleanLastName,

        phone:
          cleanPhone,

        email:
          cleanEmail,

        passwordHash,

        referralCode:
          newReferralCode,

        referredBy:
          referrer._id,

        status:
          "pending",

        balance:
          0,

        pendingWithdrawal:
          0,

        sessionTokenHash:
          sessionHash,

        createdAt:
          now,

        updatedAt:
          now
      };

      const result =
        await db
          .collection("users")
          .insertOne(
            newUser
          );

      setSessionCookie(
        res,
        sessionToken
      );

      return res.status(201).json({
        success:
          true,

        message:
          "Compte créé. Vous pouvez maintenant effectuer le paiement.",

        userId:
          result.insertedId.toString()
      });
    } catch (error) {
      console.error(
        "Erreur inscription :",
        error
      );

      if (
        error?.code ===
        11000
      ) {
        return res.status(409).json({
          success:
            false,

          message:
            "Un compte existe déjà avec ces informations."
        });
      }

      return res.status(500).json({
        success:
          false,

        message:
          "Erreur lors de l'inscription."
      });
    }
  }
);

/* =========================================================
   CRÉATION PAIEMENT PAYDUNYA
========================================================= */

app.post(
  "/api/payment/create",
  requireAuth,
  async (req, res) => {
    try {
      const user =
        req.user;

      if (
        user.status ===
        "active"
      ) {
        return res.status(400).json({
          success:
            false,

          message:
            "Ce compte est déjà actif."
        });
      }

      if (
        !PAYDUNYA_MASTER_KEY ||
        !PAYDUNYA_PRIVATE_KEY ||
        !PAYDUNYA_TOKEN ||
        !CALLBACK_URL ||
        !RETURN_URL
      ) {
        console.error(
          "Configuration PayDunya incomplète."
        );

        return res.status(500).json({
          success:
            false,

          message:
            "La configuration du paiement est incomplète."
        });
      }

      const existingPayment =
        await db
          .collection("payments")
          .findOne(
            {
              userId:
                user._id,

              status:
                "pending",

              paymentUrl: {
                $exists:
                  true,

                $ne:
                  null
              }
            },
            {
              sort: {
                createdAt:
                  -1
              }
            }
          );

      if (existingPayment) {
        return res.json({
          success:
            true,

          paymentUrl:
            existingPayment.paymentUrl,

          paymentId:
            existingPayment._id.toString()
        });
      }

      const payment = {
        userId:
          user._id,

        amount:
          MEMBERSHIP_PRICE,

        currency:
          "XOF",

        status:
          "pending",

        paydunyaToken:
          null,

        paymentUrl:
          null,

        commissionStatus:
          "pending",

        commissionAmount:
          REFERRAL_COMMISSION,

        createdAt:
          new Date(),

        completedAt:
          null,

        updatedAt:
          new Date()
      };

      const paymentResult =
        await db
          .collection("payments")
          .insertOne(
            payment
          );

      const paymentData = {
        invoice: {
          total_amount:
            MEMBERSHIP_PRICE,

          currency:
            "XOF",

          description:
            "Abonnement PHI Academy"
        },

        store: {
          name:
            "PHI Academy"
        },

        actions: {
          return_url:
            RETURN_URL,

          cancel_url:
            CANCEL_URL,

          callback_url:
            CALLBACK_URL
        },

        customer: {
          name:
            `${user.firstName} ${user.lastName}`,

          phone_number:
            user.phone,

          email:
            user.email
        },

        metadata: {
          userId:
            user._id.toString(),

          paymentId:
            paymentResult.insertedId.toString()
        }
      };

      const response =
        await axios.post(
          PAYDUNYA_CHECKOUT_URL,
          paymentData,
          {
            headers: {
              "Content-Type":
                "application/json",

              "PAYDUNYA-MASTER-KEY":
                PAYDUNYA_MASTER_KEY,

              "PAYDUNYA-PRIVATE-KEY":
                PAYDUNYA_PRIVATE_KEY,

              "PAYDUNYA-TOKEN":
                PAYDUNYA_TOKEN
            }
          }
        );

      const result =
        response.data;

      if (
        String(
          result.response_code
        ) !== "00"
      ) {
        await db
          .collection("payments")
          .updateOne(
            {
              _id:
                paymentResult.insertedId
            },
            {
              $set: {
                status:
                  "failed",

                errorMessage:
                  result.response_text ||
                  null,

                updatedAt:
                  new Date()
              }
            }
          );

        return res.status(400).json({
          success:
            false,

          message:
            result.response_text ||
            "Impossible de créer le paiement."
        });
      }

      const paymentUrl =
        result.response_text;

      const paydunyaToken =
        result.token ||
        result.invoice_token ||
        null;

      if (
        !paymentUrl ||
        !paydunyaToken
      ) {
        await db
          .collection("payments")
          .updateOne(
            {
              _id:
                paymentResult.insertedId
            },
            {
              $set: {
                status:
                  "failed",

                errorMessage:
                  "Réponse PayDunya incomplète.",

                updatedAt:
                  new Date()
              }
            }
          );

        return res.status(502).json({
          success:
            false,

          message:
            "Réponse de paiement PayDunya incomplète."
        });
      }

      await db
        .collection("payments")
        .updateOne(
          {
            _id:
              paymentResult.insertedId
          },
          {
            $set: {
              paydunyaToken,
              paymentUrl,

              updatedAt:
                new Date()
            }
          }
        );

      return res.json({
        success:
          true,

        paymentUrl,

        paymentId:
          paymentResult.insertedId.toString()
      });
    } catch (error) {
      console.error(
        "Erreur création paiement :",
        error.response?.data ||
          error
      );

      return res.status(500).json({
        success:
          false,

        message:
          "Erreur lors de la création du paiement."
      });
    }
  }
);

/* =========================================================
   CALLBACK / IPN PAYDUNYA
========================================================= */

app.post(
  "/api/payment/callback",
  async (req, res) => {
    try {
      const data =
        parsePayDunyaData(
          req.body
        );

      if (!data) {
        console.error(
          "Callback PayDunya invalide : data absente."
        );

        return res.status(400).json({
          success:
            false,

          message:
            "Données PayDunya invalides."
        });
      }

      const receivedHash =
        data.hash;

      if (
        !verifyPayDunyaHash(
          receivedHash
        )
      ) {
        console.error(
          "Hash PayDunya invalide."
        );

        return res.status(401).json({
          success:
            false,

          message:
            "Signature PayDunya invalide."
        });
      }

      const status =
        String(
          data.status || ""
        ).toLowerCase();

      const invoice =
        data.invoice || {};

      const token =
        invoice.token ||
        data.token ||
        data.invoice_token;

      if (!token) {
        return res.status(400).json({
          success:
            false,

          message:
            "Token PayDunya manquant."
        });
      }

      if (
        status ===
          "completed" ||
        status ===
          "success"
      ) {
        try {
          await completePaymentByToken(
            token
          );

          console.log(
            `Paiement PayDunya confirmé : ${token}`
          );
        } catch (error) {
          console.error(
            "Erreur finalisation paiement :",
            error
          );

          return res.status(500).json({
            success:
              false,

            message:
              "Impossible de finaliser le paiement."
          });
        }
      } else {
        await db
          .collection("payments")
          .updateOne(
            {
              paydunyaToken:
                token,

              status:
                "pending"
            },
            {
              $set: {
                paydunyaStatus:
                  status,

                updatedAt:
                  new Date()
              }
            }
          );
      }

      return res.status(200).json({
        success:
          true
      });
    } catch (error) {
      console.error(
        "Erreur callback PayDunya :",
        error
      );

      return res.status(500).json({
        success:
          false,

        message:
          "Erreur serveur."
      });
    }
  }
);

/* =========================================================
   RETOUR APRÈS PAYDUNYA
========================================================= */

app.get(
  "/api/payment/return",
  async (req, res) => {
    try {
      const token =
        req.query.token ||
        req.query.invoice_token;

      if (!token) {
        return res.redirect(
          "/connexion-cursus?payment=error"
        );
      }

      const payment =
        await db
          .collection("payments")
          .findOne({
            paydunyaToken:
              token
          });

      if (!payment) {
        return res.redirect(
          "/connexion-cursus?payment=pending"
        );
      }

      if (
        payment.status ===
        "completed"
      ) {
        return res.redirect(
          "/connexion-cursus?payment=success"
        );
      }

      return res.redirect(
        "/connexion-cursus?payment=pending"
      );
    } catch (error) {
      console.error(
        "Erreur retour paiement :",
        error
      );

      return res.redirect(
        "/connexion-cursus?payment=error"
      );
    }
  }
);

/* =========================================================
   CONNEXION MEMBRE
========================================================= */

app.post(
  "/api/auth/login",
  async (req, res) => {
    try {
      const {
        email,
        password
      } = req.body;

      const cleanEmail =
        normalizeEmail(
          email
        );

      if (
        !cleanEmail ||
        !password
      ) {
        return res.status(400).json({
          success:
            false,

          message:
            "Email et mot de passe requis."
        });
      }

      const user =
        await db
          .collection("users")
          .findOne({
            email:
              cleanEmail
          });

      if (!user) {
        return res.status(401).json({
          success:
            false,

          message:
            "Email ou mot de passe incorrect."
        });
      }

      const validPassword =
        await verifyPassword(
          password,
          user.passwordHash
        );

      if (!validPassword) {
        return res.status(401).json({
          success:
            false,

          message:
            "Email ou mot de passe incorrect."
        });
      }

      const sessionToken =
        generateSessionToken();

      const sessionHash =
        hashSessionToken(
          sessionToken
        );

      await db
        .collection("users")
        .updateOne(
          {
            _id:
              user._id
          },
          {
            $set: {
              sessionTokenHash:
                sessionHash,

              updatedAt:
                new Date()
            }
          }
        );

      setSessionCookie(
        res,
        sessionToken
      );

      return res.json({
        success:
          true,

        user: {
          id:
            user._id.toString(),

          firstName:
            user.firstName,

          lastName:
            user.lastName,

          email:
            user.email,

          phone:
            user.phone,

          status:
            user.status,

          balance:
            user.balance ||
            0,

          referralCode:
            user.referralCode
        },

        redirect:
          user.status ===
          "active"
            ? "/cursus"
            : "/"
      });
    } catch (error) {
      console.error(
        "Erreur connexion :",
        error
      );

      return res.status(500).json({
        success:
          false,

        message:
          "Erreur serveur."
      });
    }
  }
);

/* =========================================================
   SESSION ACTUELLE MEMBRE
========================================================= */

app.get(
  "/api/auth/me",
  requireAuth,
  async (req, res) => {
    const user =
      req.user;

    return res.json({
      success:
        true,

      user: {
        id:
          user._id.toString(),

        firstName:
          user.firstName,

        lastName:
          user.lastName,

        email:
          user.email,

        phone:
          user.phone,

        status:
          user.status,

        balance:
          user.balance ||
          0,

        pendingWithdrawal:
          user.pendingWithdrawal ||
          0,

        referralCode:
          user.referralCode
      }
    });
  }
);

/* =========================================================
   DÉCONNEXION MEMBRE
========================================================= */

app.post(
  "/api/auth/logout",
  requireAuth,
  async (req, res) => {
    await db
      .collection("users")
      .updateOne(
        {
          _id:
            req.user._id
        },
        {
          $set: {
            sessionTokenHash:
              null,

            updatedAt:
              new Date()
          }
        }
      );

    clearSessionCookie(
      res
    );

    return res.json({
      success:
        true,

      message:
        "Déconnexion réussie."
    });
  }
);

/* =========================================================
   CONNEXION ADMINISTRATEUR
========================================================= */

app.post(
  "/api/admin/login",
  async (req, res) => {
    try {
      const {
        email,
        password
      } = req.body;

      const cleanEmail =
        normalizeEmail(
          email
        );

      if (
        !cleanEmail ||
        !password
      ) {
        return res.status(400).json({
          success:
            false,

          message:
            "Email et mot de passe requis."
        });
      }

      const admin =
        await db
          .collection("admins")
          .findOne({
            email:
              cleanEmail,

            active:
              true
          });

      if (!admin) {
        return res.status(401).json({
          success:
            false,

          message:
            "Identifiants administrateur incorrects."
        });
      }

      const validPassword =
        await verifyPassword(
          password,
          admin.passwordHash
        );

      if (!validPassword) {
        return res.status(401).json({
          success:
            false,

          message:
            "Identifiants administrateur incorrects."
        });
      }

      const sessionToken =
        generateSessionToken();

      const sessionHash =
        hashSessionToken(
          sessionToken
        );

      await db
        .collection("admins")
        .updateOne(
          {
            _id:
              admin._id
          },
          {
            $set: {
              sessionTokenHash:
                sessionHash,

              lastLoginAt:
                new Date(),

              updatedAt:
                new Date()
            }
          }
        );

      setAdminSessionCookie(
        res,
        sessionToken
      );

      return res.json({
        success:
          true,

        admin: {
          id:
            admin._id.toString(),

          email:
            admin.email,

          role:
            admin.role
        }
      });
    } catch (error) {
      console.error(
        "Erreur connexion admin :",
        error
      );

      return res.status(500).json({
        success:
          false,

        message:
          "Erreur serveur."
      });
    }
  }
);

/* =========================================================
   SESSION ADMINISTRATEUR
========================================================= */

app.get(
  "/api/admin/me",
  requireAdmin,
  async (req, res) => {
    return res.json({
      success:
        true,

      admin: {
        id:
          req.admin._id.toString(),

        email:
          req.admin.email,

        role:
          req.admin.role
      }
    });
  }
);

/* =========================================================
   DÉCONNEXION ADMINISTRATEUR
========================================================= */

app.post(
  "/api/admin/logout",
  requireAdmin,
  async (req, res) => {
    await db
      .collection("admins")
      .updateOne(
        {
          _id:
            req.admin._id
        },
        {
          $set: {
            sessionTokenHash:
              null,

            updatedAt:
              new Date()
          }
        }
      );

    clearAdminSessionCookie(
      res
    );

    return res.json({
      success:
        true,

      message:
        "Déconnexion administrateur réussie."
    });
  }
);

/* =========================================================
   ACCÈS CURSUS
========================================================= */

app.get(
  "/api/cursus/access",
  requireActiveUser,
  async (req, res) => {
    return res.json({
      success:
        true,

      access:
        true
    });
  }
);

/* =========================================================
   PARRAINAGE
========================================================= */

app.get(
  "/api/referral",
  requireActiveUser,
  async (req, res) => {
    try {
      const user =
        req.user;

      const referrals =
        await db
          .collection("users")
          .find({
            referredBy:
              user._id,

            status:
              "active"
          })
          .project({
            firstName:
              1,

            lastName:
              1,

            createdAt:
              1,

            _id:
              0
          })
          .sort({
            createdAt:
              -1
          })
          .toArray();

      const transactions =
        await db
          .collection("transactions")
          .find({
            userId:
              user._id
          })
          .sort({
            createdAt:
              -1
          })
          .limit(100)
          .toArray();

      const withdrawals =
        await db
          .collection("withdrawals")
          .find({
            userId:
              user._id
          })
          .sort({
            createdAt:
              -1
          })
          .limit(100)
          .toArray();

      const generatedCommissions =
        await db
          .collection("transactions")
          .find({
            userId:
              user._id,

            type:
              "referral_commission"
          })
          .sort({
            createdAt:
              -1
          })
          .limit(100)
          .toArray();

      return res.json({
        success:
          true,

        referralCode:
          user.referralCode,

        balance:
          user.balance ||
          0,

        pendingWithdrawal:
          user.pendingWithdrawal ||
          0,

        referrals,

        transactions,

        generatedCommissions,

        withdrawals
      });
    } catch (error) {
      console.error(
        "Erreur parrainage :",
        error
      );

      return res.status(500).json({
        success:
          false,

        message:
          "Erreur serveur."
      });
    }
  }
);

/* =========================================================
   DEMANDE DE RETRAIT
========================================================= */

app.post(
  "/api/withdrawals",
  requireActiveUser,
  async (req, res) => {
    const session =
      mongoClient.startSession();

    try {
      const amount =
        Number(
          req.body.amount
        );

      if (
        !Number.isFinite(
          amount
        ) ||
        amount <= 0
      ) {
        return res.status(400).json({
          success:
            false,

          message:
            "Montant de retrait invalide."
        });
      }

      if (
        !Number.isInteger(
          amount
        )
      ) {
        return res.status(400).json({
          success:
            false,

          message:
            "Le montant doit être un nombre entier."
        });
      }

      let withdrawal;

      await session.withTransaction(
        async () => {
          const users =
            db.collection(
              "users"
            );

          const withdrawals =
            db.collection(
              "withdrawals"
            );

          const updateResult =
            await users.updateOne(
              {
                _id:
                  req.user._id,

                $expr: {
                  $gte: [
                    {
                      $subtract: [
                        {
                          $ifNull: [
                            "$balance",
                            0
                          ]
                        },

                        {
                          $ifNull: [
                            "$pendingWithdrawal",
                            0
                          ]
                        }
                      ]
                    },

                    amount
                  ]
                }
              },
              {
                $inc: {
                  pendingWithdrawal:
                    amount
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

          if (
            updateResult.modifiedCount !==
            1
          ) {
            throw new Error(
              "SOLDE_INSUFFISANT"
            );
          }

          const withdrawalDocument = {
            userId:
              req.user._id,

            amount,

            phone:
              req.user.phone,

            status:
              "pending",

            createdAt:
              new Date(),

            processedAt:
              null
          };

          const result =
            await withdrawals.insertOne(
              withdrawalDocument,
              {
                session
              }
            );

          withdrawal = {
            id:
              result.insertedId.toString(),

            amount,

            status:
              "pending"
          };
        }
      );

      return res.status(201).json({
        success:
          true,

        message:
          "Demande de retrait enregistrée.",

        withdrawal
      });
    } catch (error) {
      if (
        error.message ===
        "SOLDE_INSUFFISANT"
      ) {
        return res.status(400).json({
          success:
            false,

          message:
            "Solde disponible insuffisant."
        });
      }

      console.error(
        "Erreur retrait :",
        error
      );

      return res.status(500).json({
        success:
          false,

        message:
          "Impossible d'enregistrer le retrait."
      });
    } finally {
      await session.endSession();
    }
  }
);

/* =========================================================
   HISTORIQUE FINANCIER
========================================================= */

app.get(
  "/api/financial-history",
  requireActiveUser,
  async (req, res) => {
    try {
      const withdrawals =
        await db
          .collection(
            "withdrawals"
          )
          .find({
            userId:
              req.user._id
          })
          .sort({
            createdAt:
              -1
          })
          .toArray();

      const payments =
        await db
          .collection(
            "payments"
          )
          .find({
            userId:
              req.user._id
          })
          .sort({
            createdAt:
              -1
          })
          .toArray();

      const transactions =
        await db
          .collection(
            "transactions"
          )
          .find({
            userId:
              req.user._id
          })
          .sort({
            createdAt:
              -1
          })
          .toArray();

      return res.json({
        success:
          true,

        balance:
          req.user.balance ||
          0,

        pendingWithdrawal:
          req.user.pendingWithdrawal ||
          0,

        payments,

        withdrawals,

        transactions
      });
    } catch (error) {
      console.error(
        "Erreur historique :",
        error
      );

      return res.status(500).json({
        success:
          false,

        message:
          "Erreur serveur."
      });
    }
  }
);

/* =========================================================
   API ADMIN — DASHBOARD
========================================================= */

app.get(
  "/api/admin/dashboard",
  requireAdmin,
  async (req, res) => {
    try {
      const users =
        db.collection(
          "users"
        );

      const payments =
        db.collection(
          "payments"
        );

      const withdrawals =
        db.collection(
          "withdrawals"
        );

      const [
        totalMembers,
        activeMembers,
        pendingMembers,
        completedPayments,
        pendingPayments,
        pendingWithdrawals,
        revenueResult,
        commissionResult
      ] =
        await Promise.all([
          users.countDocuments(),

          users.countDocuments({
            status:
              "active"
          }),

          users.countDocuments({
            status:
              "pending"
          }),

          payments.countDocuments({
            status:
              "completed"
          }),

          payments.countDocuments({
            status:
              "pending"
          }),

          withdrawals.countDocuments({
            status:
              "pending"
          }),

          payments
            .aggregate([
              {
                $match: {
                  status:
                    "completed"
                }
              },

              {
                $group: {
                  _id:
                    null,

                  total: {
                    $sum:
                      "$amount"
                  }
                }
              }
            ])
            .toArray(),

          payments
            .aggregate([
              {
                $match: {
                  status:
                    "completed",

                  commissionStatus:
                    "paid"
                }
              },

              {
                $group: {
                  _id:
                    null,

                  total: {
                    $sum:
                      "$commissionAmount"
                  }
                }
              }
            ])
            .toArray()
        ]);

      const pendingWithdrawalResult =
        await withdrawals
          .aggregate([
            {
              $match: {
                status:
                  "pending"
              }
            },

            {
              $group: {
                _id:
                  null,

                total: {
                  $sum:
                    "$amount"
                }
              }
            }
          ])
          .toArray();

      return res.json({
        success:
          true,

        stats: {
          totalMembers,

          activeMembers,

          pendingMembers,

          completedPayments,

          pendingPayments,

          pendingWithdrawals,

          revenue:
            revenueResult[0]
              ?.total ||
            0,

          commissions:
            commissionResult[0]
              ?.total ||
            0,

          pendingWithdrawalAmount:
            pendingWithdrawalResult[0]
              ?.total ||
            0
        }
      });
    } catch (error) {
      console.error(
        "Erreur dashboard admin :",
        error
      );

      return res.status(500).json({
        success:
          false,

        message:
          "Impossible de charger le dashboard."
      });
    }
  }
);

/* =========================================================
   API ADMIN — MEMBRES
========================================================= */

app.get(
  "/api/admin/members",
  requireAdmin,
  async (req, res) => {
    try {
      const search =
        String(
          req.query.search ||
            ""
        ).trim();

      const query = {};

      if (search) {
        const escaped =
          search.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
          );

        const regex =
          new RegExp(
            escaped,
            "i"
          );

        query.$or = [
          {
            firstName:
              regex
          },

          {
            lastName:
              regex
          },

          {
            email:
              regex
          },

          {
            phone:
              regex
          },

          {
            referralCode:
              regex
          }
        ];
      }

      const members =
        await db
          .collection("users")
          .find(query)
          .project({
            passwordHash:
              0,

            sessionTokenHash:
              0
          })
          .sort({
            createdAt:
              -1
          })
          .limit(200)
          .toArray();

      return res.json({
        success:
          true,

        members
      });
    } catch (error) {
      console.error(
        "Erreur membres admin :",
        error
      );

      return res.status(500).json({
        success:
          false,

        message:
          "Impossible de charger les membres."
      });
    }
  }
);

/* =========================================================
   API ADMIN — PAIEMENTS
========================================================= */

app.get(
  "/api/admin/payments",
  requireAdmin,
  async (req, res) => {
    try {
      const payments =
        await db
          .collection(
            "payments"
          )
          .aggregate([
            {
              $sort: {
                createdAt:
                  -1
              }
            },

            {
              $limit:
                300
            },

            {
              $lookup: {
                from:
                  "users",

                localField:
                  "userId",

                foreignField:
                  "_id",

                as:
                  "user"
              }
            },

            {
              $unwind: {
                path:
                  "$user",

                preserveNullAndEmptyArrays:
                  true
              }
            },

            {
              $project: {
                amount:
                  1,

                currency:
                  1,

                status:
                  1,

                paydunyaToken:
                  1,

                commissionStatus:
                  1,

                commissionAmount:
                  1,

                createdAt:
                  1,

                completedAt:
                  1,

                userId:
                  1,

                user: {
                  firstName:
                    "$user.firstName",

                  lastName:
                    "$user.lastName",

                  email:
                    "$user.email",

                  phone:
                    "$user.phone"
                }
              }
            }
          ])
          .toArray();

      return res.json({
        success:
          true,

        payments
      });
    } catch (error) {
      console.error(
        "Erreur paiements admin :",
        error
      );

      return res.status(500).json({
        success:
          false,

        message:
          "Impossible de charger les paiements."
      });
    }
  }
);

/* =========================================================
   API ADMIN — RETRAITS
========================================================= */

app.get(
  "/api/admin/withdrawals",
  requireAdmin,
  async (req, res) => {
    try {
      const withdrawals =
        await db
          .collection(
            "withdrawals"
          )
          .aggregate([
            {
              $sort: {
                createdAt:
                  -1
              }
            },

            {
              $limit:
                300
            },

            {
              $lookup: {
                from:
                  "users",

                localField:
                  "userId",

                foreignField:
                  "_id",

                as:
                  "user"
              }
            },

            {
              $unwind: {
                path:
                  "$user",

                preserveNullAndEmptyArrays:
                  true
              }
            },

            {
              $project: {
                amount:
                  1,

                phone:
                  1,

                status:
                  1,

                createdAt:
                  1,

                processedAt:
                  1,

                userId:
                  1,

                user: {
                  firstName:
                    "$user.firstName",

                  lastName:
                    "$user.lastName",

                  email:
                    "$user.email"
                }
              }
            }
          ])
          .toArray();

      return res.json({
        success:
          true,

        withdrawals
      });
    } catch (error) {
      console.error(
        "Erreur retraits admin :",
        error
      );

      return res.status(500).json({
        success:
          false,

        message:
          "Impossible de charger les retraits."
      });
    }
  }
);

/* =========================================================
   API ADMIN — TRAITER UN RETRAIT
========================================================= */

app.patch(
  "/api/admin/withdrawals/:id",
  requireAdmin,
  async (req, res) => {
    const withdrawalId =
      req.params.id;

    const action =
      String(
        req.body.action ||
          ""
      )
        .trim()
        .toLowerCase();

    if (
      !ObjectId.isValid(
        withdrawalId
      )
    ) {
      return res.status(400).json({
        success:
          false,

        message:
          "Identifiant de retrait invalide."
      });
    }

    if (
      action !== "paid" &&
      action !== "rejected"
    ) {
      return res.status(400).json({
        success:
          false,

        message:
          "Action de retrait invalide."
      });
    }

    const session =
      mongoClient.startSession();

    try {
      const withdrawalObjectId =
        new ObjectId(
          withdrawalId
        );

      await session.withTransaction(
        async () => {
          const withdrawals =
            db.collection(
              "withdrawals"
            );

          const users =
            db.collection(
              "users"
            );

          const transactions =
            db.collection(
              "transactions"
            );

          const withdrawal =
            await withdrawals.findOne(
              {
                _id:
                  withdrawalObjectId
              },
              {
                session
              }
            );

          if (!withdrawal) {
            throw new Error(
              "RETRAIT_INTROUVABLE"
            );
          }

          if (
            withdrawal.status !==
            "pending"
          ) {
            throw new Error(
              "RETRAIT_DEJA_TRAITE"
            );
          }

          const user =
            await users.findOne(
              {
                _id:
                  withdrawal.userId
              },
              {
                session
              }
            );

          if (!user) {
            throw new Error(
              "UTILISATEUR_INTROUVABLE"
            );
          }

          if (
            action ===
            "paid"
          ) {
            const updateResult =
              await users.updateOne(
                {
                  _id:
                    user._id,

                  $expr: {
                    $gte: [
                      {
                        $ifNull: [
                          "$balance",
                          0
                        ]
                      },

                      withdrawal.amount
                    ]
                  }
                },
                {
                  $inc: {
                    balance:
                      -withdrawal.amount,

                    pendingWithdrawal:
                      -withdrawal.amount
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

            if (
              updateResult.modifiedCount !==
              1
            ) {
              throw new Error(
                "SOLDE_INSUFFISANT"
              );
            }

            await withdrawals.updateOne(
              {
                _id:
                  withdrawalObjectId,

                status:
                  "pending"
              },
              {
                $set: {
                  status:
                    "paid",

                  processedAt:
                    new Date(),

                  processedBy:
                    req.admin._id,

                  updatedAt:
                    new Date()
                }
              },
              {
                session
              }
            );

            await transactions.insertOne(
              {
                userId:
                  user._id,

                type:
                  "withdrawal_paid",

                amount:
                  -withdrawal.amount,

                withdrawalId:
                  withdrawal._id,

                description:
                  "Retrait payé",

                createdAt:
                  new Date()
              },
              {
                session
              }
            );
          } else {
            await users.updateOne(
              {
                _id:
                  user._id
              },
              {
                $inc: {
                  pendingWithdrawal:
                    -withdrawal.amount
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

            await withdrawals.updateOne(
              {
                _id:
                  withdrawalObjectId,

                status:
                  "pending"
              },
              {
                $set: {
                  status:
                    "rejected",

                  processedAt:
                    new Date(),

                  processedBy:
                    req.admin._id,

                  updatedAt:
                    new Date()
                }
              },
              {
                session
              }
            );

            await transactions.insertOne(
              {
                userId:
                  user._id,

                type:
                  "withdrawal_rejected",

                amount:
                  0,

                withdrawalId:
                  withdrawal._id,

                description:
                  "Demande de retrait rejetée",

                createdAt:
                  new Date()
              },
              {
                session
              }
            );
          }
        }
      );

      return res.json({
        success:
          true,

        message:
          action ===
          "paid"
            ? "Retrait marqué comme payé."
            : "Retrait rejeté."
      });
    } catch (error) {
      if (
        error.message ===
        "RETRAIT_INTROUVABLE"
      ) {
        return res.status(404).json({
          success:
            false,

          message:
            "Retrait introuvable."
        });
      }

      if (
        error.message ===
        "RETRAIT_DEJA_TRAITE"
      ) {
        return res.status(409).json({
          success:
            false,

          message:
            "Ce retrait a déjà été traité."
        });
      }

      if (
        error.message ===
        "UTILISATEUR_INTROUVABLE"
      ) {
        return res.status(404).json({
          success:
            false,

          message:
            "Utilisateur introuvable."
        });
      }

      if (
        error.message ===
        "SOLDE_INSUFFISANT"
      ) {
        return res.status(400).json({
          success:
            false,

          message:
            "Le solde disponible est insuffisant pour traiter ce retrait."
        });
      }

      console.error(
        "Erreur traitement retrait admin :",
        error
      );

      return res.status(500).json({
        success:
          false,

        message:
          "Impossible de traiter le retrait."
      });
    } finally {
      await session.endSession();
    }
  }
);

/* =========================================================
   API ADMIN — CURSUS
========================================================= */

app.get(
  "/api/admin/cursus",
  requireAdmin,
  async (req, res) => {
    try {
      const modules =
        await db
          .collection(
            "cursus_modules"
          )
          .find({})
          .sort({
            order:
              1
          })
          .toArray();

      return res.json({
        success:
          true,

        modules
      });
    } catch (error) {
      console.error(
        "Erreur cursus admin :",
        error
      );

      return res.status(500).json({
        success:
          false,

        message:
          "Impossible de charger le cursus."
      });
    }
  }
);

app.post(
  "/api/admin/cursus",
  requireAdmin,
  async (req, res) => {
    try {
      const {
        title,
        description,
        order
      } = req.body;

      const cleanTitle =
        String(
          title || ""
        ).trim();

      const cleanDescription =
        String(
          description || ""
        ).trim();

      const cleanOrder =
        Number(order);

      if (!cleanTitle) {
        return res.status(400).json({
          success:
            false,

          message:
            "Le titre du module est obligatoire."
        });
      }

      const result =
        await db
          .collection(
            "cursus_modules"
          )
          .insertOne({
            title:
              cleanTitle,

            description:
              cleanDescription,

            order:
              Number.isFinite(
                cleanOrder
              )
                ? cleanOrder
                : 0,

            lessons:
              [],

            createdAt:
              new Date(),

            updatedAt:
              new Date()
          });

      return res.status(201).json({
        success:
          true,

        moduleId:
          result.insertedId.toString()
      });
    } catch (error) {
      console.error(
        "Erreur création module :",
        error
      );

      return res.status(500).json({
        success:
          false,

        message:
          "Impossible de créer le module."
      });
    }
  }
);

app.patch(
  "/api/admin/cursus/:id",
  requireAdmin,
  async (req, res) => {
    try {
      const moduleId =
        req.params.id;

      if (
        !ObjectId.isValid(
          moduleId
        )
      ) {
        return res.status(400).json({
          success:
            false,

          message:
            "Identifiant de module invalide."
        });
      }

      const update = {};

      if (
        req.body.title !==
        undefined
      ) {
        update.title =
          String(
            req.body.title
          ).trim();
      }

      if (
        req.body.description !==
        undefined
      ) {
        update.description =
          String(
            req.body.description
          ).trim();
      }

      if (
        req.body.order !==
        undefined
      ) {
        const order =
          Number(
            req.body.order
          );

        if (
          !Number.isFinite(
            order
          )
        ) {
          return res.status(400).json({
            success:
              false,

            message:
              "Ordre invalide."
          });
        }

        update.order =
          order;
      }

      update.updatedAt =
        new Date();

      const result =
        await db
          .collection(
            "cursus_modules"
          )
          .updateOne(
            {
              _id:
                new ObjectId(
                  moduleId
                )
            },
            {
              $set:
                update
            }
          );

      if (
        result.matchedCount !==
        1
      ) {
        return res.status(404).json({
          success:
            false,

          message:
            "Module introuvable."
        });
      }

      return res.json({
        success:
          true,

        message:
          "Module mis à jour."
      });
    } catch (error) {
      console.error(
        "Erreur modification module :",
        error
      );

      return res.status(500).json({
        success:
          false,

        message:
          "Impossible de modifier le module."
      });
    }
  }
);

app.delete(
  "/api/admin/cursus/:id",
  requireAdmin,
  async (req, res) => {
    try {
      const moduleId =
        req.params.id;

      if (
        !ObjectId.isValid(
          moduleId
        )
      ) {
        return res.status(400).json({
          success:
            false,

          message:
            "Identifiant de module invalide."
        });
      }

      const result =
        await db
          .collection(
            "cursus_modules"
          )
          .deleteOne({
            _id:
              new ObjectId(
                moduleId
              )
          });

      if (
        result.deletedCount !==
        1
      ) {
        return res.status(404).json({
          success:
            false,

          message:
            "Module introuvable."
        });
      }

      return res.json({
        success:
          true,

        message:
          "Module supprimé."
      });
    } catch (error) {
      console.error(
        "Erreur suppression module :",
        error
      );

      return res.status(500).json({
        success:
          false,

        message:
          "Impossible de supprimer le module."
      });
    }
  }
);

/* =========================================================
   404 API
========================================================= */

app.use(
  "/api",
  (req, res) => {
    res.status(404).json({
      success:
        false,

      message:
        "Route API introuvable."
    });
  }
);

/* =========================================================
   ROUTES FRONTEND
========================================================= */

app.get(
  "/{*splat}",
  (req, res, next) => {
    if (
      req.path.startsWith(
        "/api"
      )
    ) {
      return next();
    }

    const indexPath =
      path.join(
        __dirname,
        "dist",
        "index.html"
      );

    res.sendFile(
      indexPath
    );
  }
);

/* =========================================================
   ERREUR GLOBALE
========================================================= */

app.use(
  (
    error,
    req,
    res,
    next
  ) => {
    console.error(
      "Erreur globale :",
      error
    );

    if (
      res.headersSent
    ) {
      return next(
        error
      );
    }

    return res.status(500).json({
      success:
        false,

      message:
        "Erreur interne du serveur."
    });
  }
);

/* =========================================================
   ARRÊT PROPRE
========================================================= */

async function shutdown() {
  console.log(
    "Arrêt du serveur PHI Academy..."
  );

  if (mongoClient) {
    await mongoClient.close();
  }

  process.exit(0);
}

process.on(
  "SIGINT",
  shutdown
);

process.on(
  "SIGTERM",
  shutdown
);

/* =========================================================
   DÉMARRAGE
========================================================= */

async function startServer() {
  try {
    await connectDB();

    app.listen(
      PORT,
      () => {
        console.log(
          `PHI Academy serveur lancé sur le port ${PORT}`
        );
      }
    );
  } catch (error) {
    console.error(
      "Impossible de démarrer le serveur :",
      error
    );

    process.exit(1);
  }
}

startServer();

