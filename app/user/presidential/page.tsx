"use client";
import { useState, useEffect } from 'react';
import DataTableDemo from "./vote/dataTable";
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
        document.title = "Vote | Intekhaab";
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
                    // console.log(res.data[0]);
                    if (res.data[0].type !== "Presidential") {
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
        const takeAttendance = async () => {
            try {
                const takeAttendance = await axios.get('/api/take-attendance');
                console.log(takeAttendance.data);
                if (takeAttendance.data) {
                    fetchData();
                }
            } catch (error) {
                console.error("Error taking attendance:", error);
                toast.error("Something went wrong");
                router.push('/');
            }
        };
        takeAttendance();
        checkType();
    }, [router]);

    return (
        <div>
           {electionData&& <ElectionDetails election={electionData} />}
        </div>
    );
}