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
    },
    ssl: true,
    tls: true,
    tlsAllowInvalidCertificates: true, // For debugging TLS issues
    tlsAllowInvalidHostnames: true,    // For debugging TLS issues
    minPoolSize: 1,
    maxPoolSize: 10,
    connectTimeoutMS: 30000,
    socketTimeoutMS: 45000
};

// Define the global type for MongoDB client
declare global {
    var _mongoClientPromise: Promise<MongoClient> | undefined; // eslint-disable-line no-var
}

async function connectToMongoDB(): Promise<MongoClient> {
    try {
        const client = new MongoClient(uri, options);
        console.log("🔄 Attempting to connect to MongoDB...");
        
        // Connect and test the connection
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("✅ MongoDB connection test successful!");
        
        return client;
    } catch (error) {
        console.error("🚨 Initial MongoDB connection test failed:", error);
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
        .catch((error) => {
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
