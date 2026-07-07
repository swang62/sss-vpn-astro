import { navigate } from "astro:transitions/client";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import {
  Cog,
  Edit,
  Home,
  LogOut,
  Mail,
  RotateCcw,
  User as UserIcon,
  Wrench,
} from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import useSWR from "swr";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SITE_EMAIL } from "@/config/constants";
import { fetchUser, type User } from "@/lib/api-clients";
import {
  admin,
  revokeSession,
  type Session,
  signOut,
  type UserSession,
} from "@/lib/auth-clients";
import { cn } from "@/lib/utils";

interface AvatarProps {
  session: Session;
  user?: User | UserSession;
}

function AvatarMenu({ session, user }: AvatarProps) {
  let reset = null;
  if (!user) {
    const { data, mutate } = useSWR("fetchUser", fetchUser);
    user = data?.user;
    reset = mutate;
  }

  const nameLetter = user?.name?.length && user.name[0].toUpperCase();
  const isAdmin = user?.role === "admin" || false;
  const isImpersonating = !!session?.impersonatedBy;

  // Handlers
  const logout = async () => {
    await signOut();
    if (session?.token) {
      await revokeSession({ token: session.token });
    }
    navigate("/");
  };

  const stopImpersonating = async () => {
    const { data, error } = await admin.stopImpersonating();
    if (!data || error) {
      toast.error(error?.message);
      return;
    }
    navigate("/dashboard/debug");
  };

  // Lifecycle
  useEffect(() => {
    if (!reset) return;
    reset();
  }, [user?.name, session?.userId]);

  // Styles
  const buttonStyle = cn("m-0 h-8 w-full justify-start px-2 py-0");
  const menuStyle = "px-0 py-1";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" className="h-8 w-8 rounded-full">
          {nameLetter || <UserIcon suppressHydrationWarning />}
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="flex flex-col p-2 text-muted-foreground text-sm">
          <span className="text-foreground">{user?.name}</span>
          <span>{user?.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className={menuStyle}>
          <a href="/dashboard" className="w-full">
            <Button variant="ghost" className={buttonStyle}>
              <Home />
              Dashboard
            </Button>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem className={menuStyle}>
          <a href="/dashboard/account" className="w-full">
            <Button variant="ghost" className={buttonStyle}>
              <Edit />
              My account
            </Button>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem className={menuStyle}>
          <a
            href={`mailto:${SITE_EMAIL}`}
            target="_blank"
            rel="noreferrer"
            className="w-full"
          >
            <Button variant="ghost" className={buttonStyle}>
              <Mail />
              Support
            </Button>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem className={menuStyle}>
          <a href="/dashboard/settings" className="w-full">
            <Button variant="ghost" className={buttonStyle}>
              <Cog />
              Settings
            </Button>
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        {isImpersonating && (
          <DropdownMenuItem className={menuStyle}>
            <Button
              variant="ghost"
              className={buttonStyle}
              onClick={stopImpersonating}
            >
              <RotateCcw className="text-destructive" />
              <span>Stop Impersonating</span>
            </Button>
          </DropdownMenuItem>
        )}

        {isAdmin && (
          <DropdownMenuItem className={menuStyle}>
            <a href="/dashboard/debug" className="w-full">
              <Button variant="ghost" className={buttonStyle}>
                <Wrench className="text-secondary" />
                <span>Admin API</span>
              </Button>
            </a>
          </DropdownMenuItem>
        )}
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
