import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export function LogoutButton() {
  const { logout } = useAuth();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={logout}
      className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
    >
      Logout
    </Button>
  );
}
