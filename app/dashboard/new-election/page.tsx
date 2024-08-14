"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectValue,
} from "@/components/ui/select";

export default function NewElection() {
  const router=useRouter();
 
  const [electionType, setElectionType] = useState("");
  const [councilSize, setCouncilSize] = useState("");
  const [maxNominees, setmaxNominees] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('area', (event.target as any).area.value);
    formData.append('date', new Date().toISOString());
    formData.append('presidedBy', (event.target as any).presidedBy.value);
    formData.append('type', electionType);
    formData.append('votersList', (event.target as any)["Voters List"].files[0]);
    //if the election type is not Electoral Collage, then append the candidates list
    if (electionType !== "Electoral Collage")
    formData.append('candidatesList', (event.target as any)["Candidates List"].files[0]);

    if (electionType === "Advisory Council") {
      formData.append('councilSize', councilSize);
    }

    if (electionType === "Electoral Collage") {
      formData.append('maxNominees', maxNominees);
    }

    console.log("New Election Payload");
    console.log(formData);

    axios.post("/api/admin/new-election", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then((res) => {
      console.log(res);
    });
    router.push("/dashboard/election");
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">New Election</CardTitle>
        <CardDescription>
          Enter your information to create new election
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="area">Area</Label>
              <Input id="area" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="presidedBy">Polling Officer</Label>
              <Input id="presidedBy" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <Select onValueChange={setElectionType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select election type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Presidential">Presidential</SelectItem>
                    <SelectItem value="Advisory Council">Advisory Council</SelectItem>
                    <SelectItem value="Electoral Collage">Electoral Collage</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {electionType === "Advisory Council" && (
              <div className="grid gap-2">
                <Label htmlFor="councilSize">Council Size</Label>
                <Input
                  id="councilSize"
                  type="number"
                  value={councilSize}
                  onChange={(e) => setCouncilSize(e.target.value)}
                  required
                />
              </div>
            )}
            {electionType === "Electoral Collage" && (
              <div className="grid gap-2">
                <Label htmlFor="maxNominees">Max Nominees </Label>
                <Input
                  id="maxNominees"
                  type="number"
                  value={maxNominees}
                  onChange={(e) => setmaxNominees(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="Voters List">Voters List</Label>
              <Input id="Voters List" type="file" />
            </div>

            {electionType !== "Electoral Collage" && (
              <div className="grid gap-2">
                <Label htmlFor="Candidates List">Candidates List</Label>
                <Input id="Candidates List" type="file" />
              </div>
            )}
            <Button type="submit" className="w-full">
              Create Election
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}