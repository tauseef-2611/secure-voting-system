"use client";
import { useEffect, useState } from "react";
import { getSession } from "@/app/actions";
import { JWTPayload } from "jose";
import { Card, CardContent, CardHeader, CardTitle,CardDescription } from "@/components/ui/card";
import { Overview } from "./components/overview";
import axios from "axios";

type Session = JWTPayload & {
  user: {
    username: string;
    password: string;
  };
  expires: string;
};

type VotersAnalytics = {
  total: number;
  voted: number;
  notVoted: number;
  present: number;
  areaWisePresent: Record<string, number>;
  areaWiseVoted: Record<string, number>;
};

export default function MainSide() {
  const [session, setSession] = useState<Session | null>(null);
  const [votersAnalytics, setVotersAnalytics] = useState<VotersAnalytics | null>(null);

  useEffect(() => {
    async function fetchSession() {
      const sessionData = await getSession();
      if (sessionData === null || (sessionData as Session).user.username !== "admin") {
        window.location.href = "/admin";
      } else {
        setSession(sessionData as Session);
      }
    }
    const checkElection = async () => {
      try {
        const response = await axios.get("/api/admin/check-election");
        const data = response.data;
        if (!data) {
          window.location.href = "/dashboard/new-election";
        }
      } catch (error: any) {
        if (error.response && error.response.status === 404) {
          window.location.href = "/dashboard/new-election";
        } else {
          console.error("An error occurred:", error);
        }
      }
    };
    
    checkElection();

    async function fetchVotersAnalytics() {
      const response = await fetch("/api/admin/voter-analytics");
      const data = await response.json();
      setVotersAnalytics(data);
    }
    fetchSession();
    fetchVotersAnalytics();
  }, []);

  return (
    <div className="flex w-full">

            <div className="hidden flex-col md:flex">
            <div className="border-b">
            <div className="space-y-10 w-full">

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Voters</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{votersAnalytics?.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Voters Present</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{votersAnalytics?.present}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Voters Voted</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{votersAnalytics?.voted}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Voters Not Voted</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{votersAnalytics?.notVoted}</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Area wise Voted</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview displayData={votersAnalytics?.areaWiseVoted || {}}/>
          </CardContent>
        </Card>
        <Card className="col-span-3">
        <CardHeader>
            <CardTitle>Area wise Present</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview displayData={votersAnalytics?.areaWisePresent || {}}/>
          </CardContent>
        </Card>
      </div>
      </div>
      </div>
      </div>
    </div>
  );
}