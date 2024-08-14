"use client";
import { Metadata } from "next";
import { z } from "zod";
import { useState, useEffect } from "react";
import axios from "axios";

import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { VoterSchema } from "./data/voterschema";

interface Voter {
  voter_id: string;
  name: string;
  phone: string;
  year_of_membership: number;
  date_of_birth: string;
  unit: string;
  area: string;
  verified: boolean;
  present: boolean;
  voted: boolean;
}

async function getVoters(): Promise<Voter[]> {
  try {
    const response = await axios.get('/api/admin/voters');
    const voters = response.data;

    if (!Array.isArray(voters)) {
      throw new Error("API response is not an array");
    }

    console.log("Voters fetched successfully");
    console.log(voters);

    return z.array(VoterSchema).parse(voters);
  } catch (error) {
    console.error("Error fetching voters:", error);
    return [];
  }
}

export default function TaskPage() {
  const [voters, setVoters] = useState<Voter[]>([]);

  useEffect(() => {
    const fetchVoters = async () => {
      const data = await getVoters();
      setVoters(data);
    };

    fetchVoters();
  }, []);

  return (
    <>
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-"></div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Voters</h2>
              <p className="text-muted-foreground">
                These are the voters who will participate in the election.
              </p>
            </div>
            <DataTable data={voters} columns={columns} />
      </div>
    </>
  );
}