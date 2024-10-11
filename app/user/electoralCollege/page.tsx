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
    const { user } = useUser();

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            try {
                // Check if the user is present
                const presentRes = await axios.get(`/api/voter-present/${user.voter_id}`);
                if (!presentRes.data.present) {
                    toast.error("Your attendance is not marked");
                    router.push('/user');
                    return;
                }
                toast.success("Your attendance is marked");
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Something went wrong");
                router.push('/');
            }
        };

        const checkType = () => {
            axios.get('/api/election')
                .then((res) => {
                    if (res.data[0].type !== 'Electoral College') {
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
        checkType();

        fetchData();
    }, [user, router]);

    return (
        <div>
            {electionData && <ElectionDetails election={electionData} />}
        </div>
    );
}