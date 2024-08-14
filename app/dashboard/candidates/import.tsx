"use client";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardDescription } from '@/components/ui/card';
import axios from 'axios';

export default function ImportData() {
  const handleClick = () => {
    axios.post("/api/admin/transferpresent", {})
    .then((res) => {
        console.log(res);
        alert("Data imported successfully");
    }
    )
      .catch((e) => {console.log(e); alert("Error in importing data")});
  };

  return (
        <Button className="m-2 " variant={"secondary"} onClick={handleClick}>
          Import Presentees
        </Button>
  );
}