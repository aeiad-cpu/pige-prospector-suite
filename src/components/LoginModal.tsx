import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Target } from "lucide-react";
import { toast } from "sonner";

interface LoginModalProps {
  open: boolean;
  onLogin: (email: string) => void;
}

export function LoginModal({ open, onLogin }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleLogin = () => {
    setLoading(true);
    setError("");
    setTimeout(() => {
      if (!email.endsWith("@iadfrance.fr")) {
        setError("Seules les adresses email en @iadfrance.fr sont autorisées.");
        setLoading(false);
        return;
      }
      setLoading(false);
      toast.success("Connexion réussie !");
      onLogin(email);
    }, 1200);
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md [&>button]:hidden">
        <DialogHeader className="items-center text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Target className="h-8 w-8 text-primary" />
            <span className="font-display text-xl font-bold tracking-wider text-foreground">PIGE IMMO</span>
          </div>
          <DialogTitle className="text-lg">Connexion requise</DialogTitle>
          <DialogDescription>
            Connectez-vous avec votre compte Google professionnel
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div>
            <label className="font-display text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">
              Adresse email professionnelle
            </label>
            <Input
              type="email"
              placeholder="prenom.nom@iadfrance.fr"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleGoogleLogin()}
              className="bg-background"
            />
            {error && (
              <p className="text-xs text-destructive mt-1.5">{error}</p>
            )}
            <p className="text-[10px] text-muted-foreground mt-1">
              ⚠️ Seules les adresses @iadfrance.fr sont autorisées
            </p>
          </div>

          <Button
            className="w-full gap-2"
            onClick={handleGoogleLogin}
            disabled={loading || !email}
          >
            {loading ? (
              <span className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
            ) : (
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            {loading ? "Connexion..." : "Se connecter avec Google"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
