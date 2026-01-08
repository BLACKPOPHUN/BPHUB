const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

admin.initializeApp();

exports.sendToDiscord = functions.database
  .ref("/lovepage_answers/{id}")
  .onCreate(async (snap) => {

    const data = snap.val();

    const webhookSnap = await admin.database()
      .ref("config/discord/webhook")
      .once("value");

    if (!webhookSnap.exists()) {
      console.log("❌ ไม่มี webhook ใน database");
      return null;
    }

    const webhook = webhookSnap.val();

    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "LovePage 💖",
        content: `มีคนตอบ: ${data.answer}`
      })
    });

    return null;
  });
