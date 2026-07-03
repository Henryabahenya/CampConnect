require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});
const mongoose = require("mongoose");
const User = require("../models/User");
const Notification = require("../models/Notification");

let Post = null;
try {
  Post = require("../models/Post");
} catch (error) {
  // Post model may not exist in this codebase yet. We'll still clear the posts collection if present.
}

const collectionsToClear = [
  { name: "users", model: User },
  { name: "notifications", model: Notification },
  { name: "posts", model: Post },
];

const clearMockData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI is required to run this cleanup script.");
    }

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB cluster securely...");

    for (const collection of collectionsToClear) {
      if (collection.model) {
        const result = await collection.model.deleteMany({});
        console.log(
          `Cleared ${result.deletedCount} document(s) from the ${collection.name} collection.`,
        );
      } else {
        const exists = await mongoose.connection.db
          .listCollections({ name: collection.name })
          .hasNext();
        if (exists) {
          await mongoose.connection.db
            .collection(collection.name)
            .deleteMany({});
          console.log(
            `Cleared all documents from the ${collection.name} collection.`,
          );
        } else {
          console.log(`Skipped ${collection.name}: collection does not exist.`);
        }
      }
    }

    console.log(
      "SUCCESS: All fake users, mock notifications, and placeholder posts successfully deleted from the database.",
    );
    process.exit(0);
  } catch (error) {
    console.error("Database purge failed:", error);
    process.exit(1);
  }
};

clearMockData();
