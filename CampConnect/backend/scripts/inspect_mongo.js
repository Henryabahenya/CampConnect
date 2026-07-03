require("dotenv").config();
const mongoose = require("mongoose");

const uri = process.env.MONGO_URI;

async function inspect() {
  if (!uri) {
    console.error("No MONGO_URI in environment. Please set backend/.env");
    process.exit(1);
  }

  try {
    // Connect with a short timeout
    await mongoose.connect(uri, {
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000,
    });
    const client = mongoose.connection.getClient
      ? mongoose.connection.getClient()
      : mongoose.connection.client;
    const admin = client.db().admin();

    const dbs = await admin.listDatabases();
    console.log("Databases found:");
    dbs.databases.forEach((d) => console.log(" -", d.name));

    // Prefer 'campconnect' if present, otherwise iterate first user DB
    const targetDbName =
      dbs.databases.find((d) => d.name.toLowerCase().includes("campconnect"))
        ?.name || dbs.databases[0].name;
    console.log("\nInspecting database:", targetDbName);

    const db = client.db(targetDbName);
    const collections = await db.listCollections().toArray();
    console.log("Collections:");
    for (const c of collections) {
      try {
        console.log(" -", c.name);
        const coll = db.collection(c.name);
        const sample = await coll.findOne({});
        if (!sample) {
          console.log("    (no documents)");
          continue;
        }
        // Print top-level field names and types for the sample (redact values)
        const summary = {};
        for (const [k, v] of Object.entries(sample)) {
          summary[k] = Array.isArray(v)
            ? "Array"
            : v === null
              ? "null"
              : typeof v === "object"
                ? v.constructor.name
                : typeof v;
        }
        console.log("    Sample document fields:", JSON.stringify(summary));
      } catch (err) {
        console.error("    Failed to inspect collection", c.name, err.message);
      }
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Connection/inspection failed:", err.message);
    process.exit(2);
  }
}

inspect();
