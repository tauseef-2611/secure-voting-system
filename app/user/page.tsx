"use client";
import { useEffect } from "react";
import DataTableDemo from "./dataTable";
import { Header } from "./header";
import axios from 'axios';
import { useRouter } from "next/navigation";

export default function VotePage() {
    const router = useRouter();
    useEffect(() => {
        document.title = "Vote | Intekhaab";
        const checkType=()=>{
            axios.get('/api/election').then((res)=>{
                console.log(res.data[0]);
                if(res.data[0].type==='presidential'){
                    router.push('/user/presidential');
                }
                else if(res.data[0].type==='Advisory Council'){
                    router.push('/user/advisoryCouncil');
                }
                else if(res.data[0].type==='Electoral Collage'){
                    router.push('/user/electoralCollage');
                }
            }).catch((err)=>{
                console.log(err);
        }
        )

    }
    checkType();

    }
    , []);

    return (
        <div>
        <div className="p-2">
        <div className="flex items-center justify-center h-screen">
            <div className="flex flex-col items-center space-y-4">
                <h1 className="text-3xl font-bold">Loading...</h1>
                <div className="w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
            </div>
        </div>
            </div>
        </div>
    )
}