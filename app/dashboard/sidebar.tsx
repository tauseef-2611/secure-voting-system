import Link from "next/link";
import {
  Bell,
  CircleUser,
  Home,
  LayoutDashboard,
  LineChart,
  Menu,
  Package,
  Package2,
  Power,
  Search,
  ShoppingCart,
  User,
  UserRoundCheck,
  Users,
  VoteIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import axios from "axios";

export function SideNav() {
  const pathname = usePathname();
  const [electionState, setElectionState] = useState("");


  const getNavLinkClass = (path: string) => {
    return pathname === path
      ? "flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
      : "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary";
  };


  const handleElectionStateChange = async (value: string) => {
    setElectionState(value);
    try {
      await axios.post('/api/admin/update-status', { status: value });
      alert("Election state updated successfully");
      window.location.reload();
    } catch (err) {
      alert("Something went wrong");
    }
  };

  return (
    <div className="hidden md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <VoteIcon className="h-6 w-6" />
            <span className="">Intekhaab Admin</span>
          </Link>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
                <Power className="h-4 w-4" />
                <span className="sr-only">Election State</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Select onValueChange={handleElectionStateChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Switch State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ready">Ready</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <Link href="/dashboard" className={getNavLinkClass('/dashboard')}>
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link href="/dashboard/election" className={getNavLinkClass('/dashboard/election')}>
              <Package className="h-4 w-4" />
              Election
            </Link>
            <Link href="/dashboard/analytics" className={getNavLinkClass('/dashboard/analytics')}>
              <LineChart className="h-4 w-4" />
              Analytics
            </Link>
            <Link href="/dashboard/voters" className={getNavLinkClass('/dashboard/voters')}>
              <Users className="h-4 w-4" />
              Voters
              {/* <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                6
              </Badge> */}
            </Link>
            <Link href="/dashboard/candidates" className={getNavLinkClass('/dashboard/candidates')}>
              <UserRoundCheck className="h-4 w-4" />
              Candidates
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}