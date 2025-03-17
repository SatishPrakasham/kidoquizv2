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

// Use `let` instead of `var` to fix ESLint `no-var` error
declare global {
    // Ensure global type safety
    // Avoid using `var` (deprecated) and enforce type safety
    // Prevents TypeScript "has no index signature" error
    // Ensures the global variable exists only in the NodeJS global scope
    // Avoids race conditions in development
    var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// Fix: Use `const` since `clientPromise` is never reassigned
const client = new MongoClient(uri, options);
const clientPromise: Promise<MongoClient> = global._mongoClientPromise || client.connect();

// Ensure `global` variable is assigned in development mode only (prevents memory leaks)
if (process.env.NODE_ENV !== "production") {
    global._mongoClientPromise = clientPromise;
}

export default clientPromise;
