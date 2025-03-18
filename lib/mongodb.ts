import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';
import tls from 'tls';

dotenv.config(); // Load environment variables

// Configure Node.js TLS settings
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Warning: Only for debugging
tls.DEFAULT_MIN_VERSION = 'TLSv1.2';
tls.DEFAULT_MAX_VERSION = 'TLSv1.3';

const uri = process.env.MONGODB_URI as string;

if (!uri) {
    throw new Error("🚨 MONGODB_URI is not defined in .env file!");
}

const options = {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
    ssl: true,
    tls: true,
    tlsCAFile: undefined, // Let Node.js use its own CA store
    tlsAllowInvalidHostnames: true, // For debugging
    tlsAllowInvalidCertificates: true, // For debugging
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000
};

// Define the global type for MongoDB client
declare global {
    var _mongoClientPromise: Promise<MongoClient> | undefined; // eslint-disable-line no-var
}

interface MongoDBError extends Error {
    code?: string | number;
    cause?: Error;
}

async function connectToMongoDB(): Promise<MongoClient> {
    try {
        console.log("🔄 Attempting to connect to MongoDB...");
        // Log URI without credentials for debugging
        const maskedUri = uri.replace(/\/\/(.*):(.*)@/, '//****:****@');
        console.log("Using URI:", maskedUri);
        
        const client = new MongoClient(uri, options);
        
        // Connect and test the connection
        await client.connect();
        
        // Test the connection with a simple command
        const db = client.db("QuizApp");
        await db.command({ ping: 1 });
        
        console.log("✅ MongoDB connection test successful!");
        return client;
    } catch (error) {
        console.error("🚨 Initial MongoDB connection test failed");
        const mongoError = error as MongoDBError;
        if (mongoError.code) console.error("Error code:", mongoError.code);
        if (mongoError.cause) console.error("Error cause:", mongoError.cause);
        if (mongoError.message) console.error("Error message:", mongoError.message);
        throw error;
    }
}

// Initialize client promise
if (!global._mongoClientPromise) {
    console.log("🔄 Setting up global MongoDB connection...");
    global._mongoClientPromise = connectToMongoDB()
        .then((client) => {
            console.log("✅ Successfully connected to MongoDB!");
            return client;
        })
        .catch((error: MongoDBError) => {
            console.error("🚨 MongoDB Connection Failed:", error);
            throw error;
        });
}

const clientPromise = global._mongoClientPromise;

// Prevent memory leaks by setting global in development mode only
if (process.env.NODE_ENV !== "production") {
    global._mongoClientPromise = clientPromise;
}

export default clientPromise;
