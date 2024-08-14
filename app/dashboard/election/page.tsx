"use client";
import { useState, useEffect } from "react";
import { Election } from "@/utils/Types/election";
import axios from "axios";
import ElectionDetails from "./electionDetails";
import { useRouter } from "next/navigation";

export default function Elections() {
  const [electionData, setElectionData] = useState<Election | null>(null);
  const router = useRouter();

  useEffect(() => {
    document.title = "Vote | Intekhaab";
    const checkType = () => {
      axios.get('/api/election')
        .then((res) => {
            setElectionData(res.data[0]);
            console.log(electionData)
        })
        .catch((err) => {
          router.push('/dashboard');
          console.log(err);
        });
    };
    checkType();
  }, [router]);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      {electionData && <ElectionDetails election={electionData} />}
    </div>
  );
}