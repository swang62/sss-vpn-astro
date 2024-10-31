import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import { navigate } from "astro:transitions/client";
import { Cog, Edit, Home, LogOut, User } from "lucide-react";
import useSWR from "swr";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fetchUser } from "@/lib/api-clients";
import { signOut } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

interface Props {}

function AvatarMenu(_props: Props) {
  const { data } = useSWR("fetchUser", fetchUser);
  const user = data?.user;

  // Handlers
  const logout = async () => {
    await signOut();
    navigate("/login");
  };

  // Styles
  const buttonStyle = cn("py-0 px-2 h-8 w-full m-0 justify-start");
  const menuStyle = "px-0 py-1";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" className="w-8 h-8 rounded-full">
          <User />
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="flex flex-col p-2 text-sm text-muted-foreground">
          <span className="text-foreground">{user?.name}</span>
          <span>{user?.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className={menuStyle}>
          <a href="/dashboard" className="w-full">
            <Button variant="ghost" className={buttonStyle}>
              <Home />
              <span>Dashboard</span>
            </Button>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem className={menuStyle}>
          <a href="/dashboard/account" className="w-full">
            <Button variant="ghost" className={buttonStyle}>
              <Edit />
              <span>Manage account</span>
            </Button>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem className={menuStyle}>
          <a href="/dashboard/settings" className="w-full">
            <Button variant="ghost" className={buttonStyle}>
              <Cog />
              <span>Settings</span>
            </Button>
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className={menuStyle}>
          <Button variant="ghost" className={buttonStyle} onClick={logout}>
            <LogOut />
            <span>Log out</span>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default AvatarMenu;
