import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const uri = process.env.MONGODB_URI as string;

if (!uri) {
    throw new Error("🚨 MONGODB_URI is not defined in .env file!");
}

const options = {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
};

// Define the global type for MongoDB client
declare global {
    var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const client = new MongoClient(uri, options);
const clientPromise: Promise<MongoClient> = global._mongoClientPromise ?? client.connect();

if (process.env.NODE_ENV !== "production") {
    global._mongoClientPromise = clientPromise;
}

export default clientPromise;
