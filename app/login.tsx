"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { doLogin } from "@/app/actions";
import { DatePickerDemo } from "@/components/date-picker";
import axios from "axios";
import { toast } from 'sonner'; // Import Sonner toast

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB').replace(/\//g, '-'); // Replace slashes with dashes
}

export function CardWithForm() {
  const router = useRouter();

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleDateChange = (date: Date) => {
    console.log(date);
    setPassword(date.toISOString());
  };

  React.useEffect(() => {
    // This ensures the state is only set on the client side
    setUsername('');
    setPassword('');
  }, []);

  function handleLogin(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setLoading(true);

axios.post('/api/voter', {
    phone: username,
    dob: formatDate(password)
  })
  .then(response => {
    if (response.data.verified === false) {
      toast.error('User not verified!'); // Display error
      router.push('/');
      return Promise.reject('User not verified'); // Stop further execution
    } else {
      return doLogin(response.data);
    }
  })
  .then(() => {
    console.log('Login successful');
    router.push('/user');
  })
  .catch(error => {
    console.error('Login failed:', error);
    if (error.response && error.response.data && error.response.data.message) {
      toast.error(error.response.data.message); // Display error toast
    } else {
      toast.error(error); // Display generic error toast
    }
  })
  .finally(() => {
    setLoading(false);
  });
}

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Intekhaab</CardTitle>
        <CardDescription>Simple & Secure Elections</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="username">Phone</Label>
              <Input
                id="username"
                placeholder="Mobile Number"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Date Of Birth</Label>
              <DatePickerDemo onDateChange={handleDateChange} />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-left gap-2">
        <Button onClick={handleLogin} disabled={loading}>
          {loading ? 'Loading...' : 'Login'}
        </Button>
        <Button variant="ghost"className="underline text-xs text-gray-400" onClick={() => router.push('/register')}>
          Register
        </Button>
      </CardFooter>
    </Card>
  );
}