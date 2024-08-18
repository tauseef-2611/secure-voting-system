"use client";
import { useState, useEffect } from 'react';
import DataTableDemo from "./vote/dataTable";
import axios from 'axios';
import { useRouter } from "next/navigation";
import { Election } from "@/utils/Types/election";
import ElectionDetails from './electionDetails';
import { Tabs, TabsContent, TabsTrigger, TabsList } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { User } from '@/utils/Types/user';
import { getSession } from '@/app/actions';
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
                    toast.error("You are not present in the electoral collage");
                    router.push('/user');
                });
        };

        const checkType = () => {
            axios.get('/api/election')
                .then((res) => {
                    console.log(res.data[0]);
                    if (res.data[0].type !== 'Electoral Collage') {
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