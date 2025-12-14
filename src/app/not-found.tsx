"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white text-center px-4">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <h2 className="text-2xl mb-6">Page Not Found</h2>
            <p className="text-gray-400 mb-8">
                Sorry, the page you're looking for doesn't exist or has been moved.
            </p>
            <Link href="/">
                <Button className="bg-blue-600 cursor-pointer hover:bg-blue-500 text-white px-6 py-2 rounded-md">
                    Go to Home Page
                </Button>
            </Link>
        </div>
    );
}
