import React from 'react';

export default function Loading() {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="flex flex-col items-center space-y-4">
                <h1 className="text-3xl font-bold">Loading...</h1>
                <div className="w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
            </div>
        </div>
    );
}