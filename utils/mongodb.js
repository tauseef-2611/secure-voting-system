import mongoose from 'mongoose';

const NEXT_PUBLIC_MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI;

if (!NEXT_PUBLIC_MONGODB_URI) {
    throw new Error(
        
        'Please define the NEXT_PUBLIC_MONGODB_URI environment variable inside .env.local'
    );
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
    console.log('NEXT_PUBLIC_MONGODB_URI:', NEXT_PUBLIC_MONGODB_URI);
    if (cached.conn) {
        console.log('Using cached database connection');
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };

        cached.promise = mongoose.connect(NEXT_PUBLIC_MONGODB_URI, opts).then((mongoose) => {
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
        console.log('Connected to database');
    } catch (error) {
        console.error('Database connection failed:', error);
        throw new Error('Database connection failed');
    }

    return cached.conn;
}