"use client";
import { useState, useEffect } from 'react';
import DataTableDemo from "./vote/dataTable";
import axios from 'axios';
import { useRouter } from "next/navigation";
import { Election } from "@/utils/Types/election";
import ElectionDetails from './electionDetails';
import { Tabs, TabsContent, TabsTrigger,TabsList } from '@/components/ui/tabs';

export default function VotePage() {
    const [electionData, setElectionData] = useState<Election | null>(null);
    const router = useRouter();

    useEffect(() => {
        document.title = "Vote | Intekhaab";
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

        checkType();
    }, [router]);

    return (
        <div>
           {electionData&& <ElectionDetails election={electionData} />}
        </div>
    );
}