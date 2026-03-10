import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Target, ArrowLeft, CheckCircle2, Phone } from "lucide-react";
import { toast } from "sonner";

interface SignupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = "info" | "otp" | "success";

export function SignupModal({ open, onOpenChange }: SignupModalProps) {
  const [step, setStep] = useState<Step>("info");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!firstName.trim()) e.firstName = "Requis";
    if (!lastName.trim()) e.lastName = "Requis";
    if (!email.trim() || !email.includes("@")) e.email = "Email invalide";
    if (!phoneNumber.trim() || phoneNumber.replace(/\D/g, "").length < 10) e.phone = "Numéro invalide (10 chiffres min.)";
    if (password.length < 6) e.password = "6 caractères minimum";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSendOtp = () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("otp");
      toast.info(`📱 Code envoyé au ${phoneNumber}`);
    }, 1200);
  };

  const handleVerifyOtp = () => {
    if (otpCode.length < 6) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("success");
      toast.success("✅ Compte créé avec succès !");
    }, 1200);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep("info");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhoneNumber("");
      setPassword("");
      setOtpCode("");
      setErrors({});
      setLoading(false);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card [&>button]:hidden">
        <DialogHeader className="items-center text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Target className="h-7 w-7 text-primary" />
            <span className="font-display text-xl font-bold tracking-wider text-foreground">PIGE IMMO</span>
          </div>

          {step === "info" && (
            <>
              <DialogTitle className="text-lg font-display">Créer un compte</DialogTitle>
              <DialogDescription>Inscrivez-vous pour accéder à la plateforme</DialogDescription>
            </>
          )}
          {step === "otp" && (
            <>
              <DialogTitle className="text-lg font-display">Vérification du portable</DialogTitle>
              <DialogDescription>
                Entrez le code à 6 chiffres envoyé au <span className="font-medium text-foreground">{phoneNumber}</span>
              </DialogDescription>
            </>
          )}
          {step === "success" && (
            <>
              <DialogTitle className="text-lg font-display">Bienvenue ! 🎉</DialogTitle>
              <DialogDescription>Votre compte a bien été créé</DialogDescription>
            </>
          )}
        </DialogHeader>

        {/* Step 1: Info */}
        {step === "info" && (
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-display text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">Prénom</label>
                <Input placeholder="Prénom" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="bg-background" />
                {errors.firstName && <p className="text-[10px] text-destructive mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="font-display text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">Nom</label>
                <Input placeholder="Nom" value={lastName} onChange={(e) => setLastName(e.target.value)} className="bg-background" />
                {errors.lastName && <p className="text-[10px] text-destructive mt-1">{errors.lastName}</p>}
              </div>
            </div>
            <div>
              <label className="font-display text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">Email professionnel</label>
              <Input type="email" placeholder="prenom.nom@iadfrance.fr" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-background" />
              {errors.email && <p className="text-[10px] text-destructive mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="font-display text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">
                <Phone className="inline h-3 w-3 mr-1" />Numéro de portable <span className="text-destructive">*</span>
              </label>
              <Input type="tel" placeholder="06 12 34 56 78" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="bg-background" />
              {errors.phone && <p className="text-[10px] text-destructive mt-1">{errors.phone}</p>}
              <p className="text-[10px] text-muted-foreground mt-1">📱 Un code de vérification sera envoyé par SMS</p>
            </div>
            <div>
              <label className="font-display text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">Mot de passe</label>
              <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-background" />
              {errors.password && <p className="text-[10px] text-destructive mt-1">{errors.password}</p>}
            </div>
            <Button className="w-full gap-2 mt-2" variant="attack" onClick={handleSendOtp} disabled={loading}>
              {loading ? (
                <span className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
              ) : null}
              {loading ? "Envoi du code..." : "Recevoir le code SMS"}
            </Button>
            <p className="text-[10px] text-center text-muted-foreground">
              En vous inscrivant, vous acceptez les conditions d'utilisation
            </p>
          </div>
        )}

        {/* Step 2: OTP */}
        {step === "otp" && (
          <div className="space-y-5 pt-2">
            <div className="flex justify-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Phone className="h-7 w-7 text-primary" />
              </div>
            </div>
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <Button className="w-full gap-2" variant="attack" onClick={handleVerifyOtp} disabled={loading || otpCode.length < 6}>
              {loading ? (
                <span className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              {loading ? "Vérification..." : "Vérifier et créer le compte"}
            </Button>
            <div className="flex items-center justify-between">
              <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors" onClick={() => setStep("info")}>
                <ArrowLeft className="h-3 w-3" /> Retour
              </button>
              <button className="text-xs text-primary hover:text-primary/80 transition-colors" onClick={() => toast.info(`📱 Code renvoyé au ${phoneNumber}`)}>
                Renvoyer le code
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {step === "success" && (
          <div className="text-center py-4 space-y-4">
            <div className="h-16 w-16 mx-auto bg-success/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <div>
              <p className="text-sm text-foreground font-medium">{firstName} {lastName}</p>
              <p className="text-xs text-muted-foreground">{email}</p>
              <p className="text-xs text-primary mt-1">📱 {phoneNumber} — vérifié</p>
            </div>
            <Button className="w-full" variant="attack" onClick={handleClose}>
              Accéder à la plateforme
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
