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
    var _mongoClientPromise: Promise<MongoClient> | undefined; // eslint-disable-line no-var
}

// Create MongoDB client with connection handling
const clientPromise: Promise<MongoClient> = global._mongoClientPromise ?? new MongoClient(uri, options).connect();

if (!global._mongoClientPromise) {
    console.log("🔄 Connecting to MongoDB...");
    
    global._mongoClientPromise = clientPromise.then((client) => {
        console.log("✅ Successfully connected to MongoDB!");
        return client;
    }).catch((error) => {
        console.error("🚨 MongoDB Connection Failed:", error);
        throw error;
    });
}

// Prevent memory leaks by setting global in development mode only
if (process.env.NODE_ENV !== "production") {
    global._mongoClientPromise = clientPromise;
}

export default clientPromise;
