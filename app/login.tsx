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
import  {doLogin}  from "@/app/actions";
import CalendarDateRangePicker from "@/components/date-range-picker";
import { DatePickerDemo } from "@/components/date-picker";


export function CardWithForm() {
  const router = useRouter();

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const handleDateChange = (date: Date) => {
    console.log(date);
    setPassword(date.toISOString());
  };

  React.useEffect(() => {
    // This ensures the state is only set on the client side
    setUsername('');
    setPassword('');
  }, []);
  async function handleLogin(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    alert(process.env.NEXT_PUBLIC_MONGODB_URI);
    console.log('Logging in with:', username, password);
    try {
      const result = await doLogin(username, password);
      if (result === "Success") {
        router.push('/user');
      } else {
        alert(result); // Display the specific error message
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  }
  

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Smart & Secure Elections</CardDescription>
      </CardHeader>
      <CardContent>
        <p>CHeck</p>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
            <DatePickerDemo onDateChange={handleDateChange} />
              {/* <Input
                id="password"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              /> */}

            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={handleLogin}>Login</Button>
      </CardFooter>
    </Card>
  );
}