import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { BookHeart, ChevronDown, LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "../hooks/use-auth";

export function Header() {
  const {
    isAuthenticated,
    isLoading,
    isInitializing,
    principalText,
    login,
    logout,
  } = useAuth();

  const shortPrincipal = principalText
    ? `${principalText.slice(0, 5)}...${principalText.slice(-3)}`
    : null;

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-2.5" data-ocid="header-brand">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <BookHeart className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-semibold text-foreground tracking-tight">
              Family Memories
            </span>
          </div>

          {/* Auth controls */}
          <div className="flex items-center gap-3">
            {isInitializing ? (
              <div className="flex items-center gap-2">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="w-24 h-4 hidden sm:block" />
              </div>
            ) : isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 h-9 px-2 rounded-full hover:bg-secondary transition-smooth"
                    data-ocid="header-user-menu"
                  >
                    <Avatar className="w-8 h-8 border-2 border-primary/20">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium font-display">
                        {principalText?.slice(0, 2).toUpperCase() ?? "FM"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:block text-sm text-foreground font-medium max-w-[120px] truncate">
                      {shortPrincipal}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2">
                    <p className="text-xs text-muted-foreground mb-0.5">
                      Signed in as
                    </p>
                    <p className="text-xs font-mono text-foreground break-all leading-relaxed">
                      {principalText}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2 text-muted-foreground">
                    <User className="w-4 h-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="gap-2 text-destructive focus:text-destructive"
                    onClick={logout}
                    data-ocid="header-logout-btn"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={login}
                disabled={isLoading}
                className="gap-2 rounded-full"
                data-ocid="header-login-btn"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign in</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
