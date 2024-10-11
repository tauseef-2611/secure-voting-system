"use client";
import { useState, useEffect } from 'react';
import DataTableDemo from "./dataTable";
import axios from 'axios';
import { useRouter } from "next/navigation";
import { Election } from '@/utils/Types/election';
import { User } from '@/utils/Types/user';
import { getSession } from '@/app/actions';
import { set } from 'mongoose';
import { useUser } from '../../UserContext';
import { toast } from 'sonner';

export default function VotePage() {
    const router = useRouter();
    const [election, setElection] = useState<Election | null>(null);
    const {user}=useUser();

    useEffect(() => {

        document.title = "Vote | Intekhaab";
        const checkType = () => {
            axios.get('/api/election')
                .then((res) => {

                    if (res.data[0].type !== 'Presidential') {
                        router.push('/');
                    } 
                    else {
                        if(res.data[0].status !== 'ongoing')
                        {
                            toast.error("Election not yet started");
                            router.push('/user');
                        }
                        else if(res.data[0].status === 'completed')
                        {
                            toast.error("Election is completed");
                            router.push('/user');
                        }
                        setElection(res.data[0]);
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
            <DataTableDemo election={election} user={user}/>
        </div>
    );
}