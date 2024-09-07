"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from "next/navigation";
import { Election } from "@/utils/Types/election";
import ElectionDetails from './electionDetails';
import { toast } from 'sonner';
import { useUser } from '../UserContext';

export default function VotePage() {
    const [electionData, setElectionData] = useState<Election | null>(null);
    const router = useRouter();
    const {user}= useUser();
    useEffect(() => {
        if (!user) return;

        const checkPresent = async () => {
            console.log(`Requesting: /api/voter-present/${user?.voter_id}`);

            axios.get(`/api/voter-present/${user?.voter_id}`)
                .then((res) => {
                    if (res.data.present) {
                        toast.success("Your attendance is marked");
                    } else {
                        toast.error("You attedance is not marked");
                        router.push('/user');
                    }
                })
                .catch((err) => {
                    console.log(err);
                    toast.error("Your attendance is not marked");
                    router.push('/user');
                });
        };

        const checkType = () => {
            axios.get('/api/election')
                .then((res) => {
                    console.log(res.data[0]);
                    if (res.data[0].type !== 'Electoral College') {
                        alert("You are not allowed to access this page");
                        router.push('/');
                    } else {
                        setElectionData(res.data[0]);
                    }
                })
                .catch((err) => {
                    console.log(err);
                    alert("Something went wrong");
                    router.push('/');
                });
        };

        checkPresent();
        checkType();
        console.log(electionData)
    }, [user, router]);

    return (
        <div>
            {electionData && <ElectionDetails election={electionData} />}
        </div>
    );
}