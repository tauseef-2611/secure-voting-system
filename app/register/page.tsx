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
function capitalizeFirstLetterOfEachWord(str: string): string {
    return str.replace(/\b\w/g, char => char.toUpperCase());
  }
  

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = React.useState({
    name: '',
    phone: '',
    dob: '',
    area: '',
    unit: '',
  });
  const [loading, setLoading] = React.useState(false);

  const handleDateChange = (date: Date) => {
    console.log(date);
    setFormData({ ...formData, dob: date.toISOString() });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = () => {
    setLoading(true);
    axios.post('/api/register', {
        name: capitalizeFirstLetterOfEachWord(formData.name),
        phone: formData.phone,
        dob: formatDate(formData.dob),
        area: capitalizeFirstLetterOfEachWord(formData.area),
        unit: capitalizeFirstLetterOfEachWord(formData.unit),
      })
      .then(response => {
        // console.log('Register response:', response.data);
        toast.success('Registered successfully!');})
      .then(() => {

        router.push('/');
      })
      .catch(error => {
        console.error('Register failed:', error);
        toast.error(error.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-[400px] shadow-lg">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Enter your details to register.<br/> Get verified by an admin to log in.</CardDescription>        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="Mobile Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="dob">Date Of Birth</Label>
                <DatePickerDemo onDateChange={handleDateChange} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="area">Area</Label>
                <Input
                  id="area"
                  placeholder="Area"
                  value={formData.area}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  placeholder="Unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Loading...' : 'Register'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}