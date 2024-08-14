"use client";
import { Metadata } from "next";
import { z } from "zod";
import { useState, useEffect } from "react";
import axios from "axios";

import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { CandidateSchema } from "./data/candidateschema";
import ImportData from "./import";

interface Candidate {
  candidate_id: string;
  name: string;
  phone: string;
  year_of_membership: number;
  date_of_birth: string;
  unit: string;
  area: string;
  votes: number;
}

async function getCandidates(): Promise<Candidate[]> {
  try {
    const response = await axios.get('/api/admin/candidates');
    const candidates = response.data;

    if (!Array.isArray(candidates)) {
      throw new Error("API response is not an array");
    }

    console.log("Candidates fetched successfully");
    console.log(candidates);

    return z.array(CandidateSchema).parse(candidates);
  } catch (error) {
    console.error("Error fetching candidates:", error);
    return [];
  }
}

export default function TaskPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    const fetchCandidates = async () => {
      const data = await getCandidates();
      setCandidates(data);
    };

    fetchCandidates();
  }, []);

  return (
    <>
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2"></div>        
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Candidates</h2>
            <p className="text-muted-foreground">
              These are the candidates for the ongoing election.
            </p>
          </div>        
        <DataTable data={candidates} columns={columns} />
      </div>
    </>
  );
}