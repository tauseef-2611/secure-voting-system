"use client";
import { CardWithForm } from "./login";
import { useEffect, useState } from "react";

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Render nothing on the server
  }

  return (
    <div className="flex w-full justify-center items-center min-h-screen">
      <CardWithForm />
    </div>
  );
}