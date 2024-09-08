"use client";
import { useEffect, useState } from "react";
import { Header } from "./header";
import axios from 'axios';
import { useRouter } from "next/navigation";
import { Election } from '@/utils/Types/election';
import { User } from '@/utils/Types/user';
import { getSession } from '@/app/actions';
import QRCode from 'qrcode.react';
import { Button } from "@/components/ui/button"; // Import ShadCN Button component
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"; // Import ShadCN Card components

export default function VotePage() {
    const router = useRouter();
    const [election, setElection] = useState<Election>();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [buttonLoading, setButtonLoading] = useState(false); // State for button loading

    useEffect(() => {
        document.title = "Vote | Intekhaab";

        axios.get('/api/election')
            .then((res) => {
                setElection(res.data[0]);
            })
            .catch((err) => {
                console.log(err);
            });

        const checkSession = async () => {
            const session = await getSession();
            if (!session) {
                alert("You are not logged in");
                router.push('/');
            } else {
                setUser(session.user as User);
            }
            setLoading(false);
        };
        checkSession();
    }, [router]);

    const handleRoute = () => {
        if (!election) return;
        setButtonLoading(true);

        if (election.type === 'Presidential') {
            router.push('/user/presidential');
        } else if (election.type === 'Advisory Council') {
            router.push('/user/advisoryCouncil');
        } else if (election.type === 'Electoral College') {
            router.push('/user/electoralCollege');
        }
    };

    if (loading) {
        return (
            <div className="p-2">
                <div className="flex items-center justify-center h-screen">
                    <div className="flex flex-col items-center space-y-4">
                        <h1 className="text-3xl font-bold">Loading...</h1>
                        <div className="w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="">
            <div className="flex items-center justify-center h-screen">
                <Card className="w-full max-w-md h-auto p-4 mx-3">                    
                    <CardHeader>
                        <CardTitle>Welcome</CardTitle>
                        <CardDescription>Use this QR to mark yourself present</CardDescription>                    
                    </CardHeader>
                    <CardContent className="flex flex-col  space-y-4">
                        {user && (
                            <>
                                <div className="flex flex-col p-4 bg-white rounded-lg items-center shadow-md">
                                    <QRCode value={JSON.stringify(user)} size={250} className="rounded-lg" />
                                </div>
                                <Button onClick={handleRoute} disabled={buttonLoading}>
                                    {buttonLoading ? 'Loading...' : 'Next'}
                                </Button>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}