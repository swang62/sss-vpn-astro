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
import { fetchUser, signOut } from "@/lib/clients";
import { cn } from "@/lib/utils";

interface Props {}

function AvatarMenu(_props: Props) {
  const { data } = useSWR("/api/user", fetchUser);
  const user = data?.user;

  // Handlers
  const logout = async () => {
    await signOut();
    navigate("/login");
  };

  // Styles
  const cssButton = cn("py-0 px-0 h-6");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" className="h-8 w-8 rounded-full">
          <User />
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="p-2 text-sm text-muted-foreground">
          {user?.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href="/dashboard">
            <Button variant="ghost" className={cssButton}>
              <Home />
              <span>Dashboard</span>
            </Button>
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <a href="/dashboard/subscription">
            <Button variant="ghost" className={cssButton}>
              <Edit />
              <span>Manage Subscription</span>
            </Button>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="/dashboard/settings">
            <Button variant="ghost" className={cssButton}>
              <Cog />
              <span>Settings</span>
            </Button>
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href="/dashboard">
            <Button variant="ghost" className={cssButton} onClick={logout}>
              <LogOut />
              <span>Log out</span>
            </Button>
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default AvatarMenu;
