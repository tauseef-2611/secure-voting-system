"use client";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect } from "react";
import { doLogout } from "@/app/actions";
import { User } from "@/utils/Types/user";
import { useUser } from "./UserContext";


export function Header() {
  const {user} =useUser();
  const handleLogout = async () => {
    console.log("Logging out");
    await doLogout();
    window.location.href = '/';
  };

  return (
    <div className="flex-col md:flex">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <h1 className="text-2xl font-bold">Intekhaab</h1>
          <div className="ml-auto flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/01.png" alt="@shadcn" />
                    <AvatarFallback>PF</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.phone}
                    </p>


                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                  <p className="text-xs leading-none text-muted-foreground">
                      <strong>Unit: </strong>{user?.unit}
                    </p>
                    
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                  <p className="text-xs leading-none text-muted-foreground">
                      <strong>Area: </strong>{user?.area}
                    </p>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                  <p className="text-xs leading-none text-muted-foreground">
                      <strong>DoB: </strong>{user?.date_of_birth}
                    </p>
 
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                  <p className="text-xs leading-none text-muted-foreground">
                      <strong>YoM: </strong>{user?.year_of_membership}
                    </p> 
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}