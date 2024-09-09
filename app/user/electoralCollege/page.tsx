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

                // Check the election type
                const electionRes = await axios.get('/api/election');
                const election = electionRes.data[0];

                if (election.type !== 'Electoral College') {
                    alert("You are not allowed to access this page");
                    router.push('/');
                    return;
                }
                else if (election.status === 'ongoing')
                {
                    setElectionData(election);
                }
                else {
                    toast.error("The election is not yet started or has ended");
                    router.push('/user');
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Something went wrong");
                router.push('/');
            }
        };

        fetchData();
    }, [user, router]);

    return (
        <div>
            {electionData && <ElectionDetails election={electionData} />}
        </div>
    );
}