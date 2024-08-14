"use client";
import { useState, useEffect } from 'react';
import DataTableDemo from "./dataTable";
import axios from 'axios';
import { useRouter } from "next/navigation";
import { Election } from '@/utils/Types/election';
import { User } from '@/utils/Types/user';
import { getSession } from '@/app/actions';
import { set } from 'mongoose';

export default function VotePage() {
    const router = useRouter();
    const [election, setElection] = useState<Election | null>(null);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        async function fetchSession() {
            const sessionData = await getSession();
            if (sessionData === null) {
                router.push('/');
            } else {
                setUser(sessionData.user as User);
            }
        }
        document.title = "Vote | Intekhaab";
        const checkType = () => {
            axios.get('/api/election')
                .then((res) => {

                    if (res.data[0].type !== 'Advisory Council') {
                        router.push('/');
                    } 
                    else {
                        if(res.data[0].status !== 'ongoing')
                        {
                            alert("Election is not yet started");
                            router.push('/user');
                        }
                        else if(res.data[0].status === 'completed')
                        {
                            alert("Election is completed");
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
        fetchSession();
        checkType();
    }, [router]);

    return (
        <div>
            <DataTableDemo election={election} user={user}/>
        </div>
    );
}