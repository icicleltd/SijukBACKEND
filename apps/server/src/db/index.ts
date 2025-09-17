import mongoose from "mongoose";

await mongoose.connect(process.env.DATABASE_URL || "").catch((error) =>
{
	console.log("Error connecting to database:", error);
});

const dbName = "sijuk";
const db = mongoose.connection.getClient().db(dbName);

export { db };

