import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface SplashScreenProps {
  onUnlock: () => void;
  passphrase: string;
}

const SplashScreen = ({ onUnlock, passphrase }: SplashScreenProps) => {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.toLowerCase().trim() === passphrase.toLowerCase().trim()) {
      onUnlock();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 relative z-10">
      <div
        className={`flex flex-col items-center gap-6 max-w-sm w-full ${
          shake ? "animate-shake" : ""
        }`}
      >
        <Heart className="w-16 h-16 text-primary animate-pulse-glow fill-primary" />
        <h1 className="text-3xl font-bold text-foreground text-center">
          Enter the Secret Phrase 💌
        </h1>
        <p className="text-muted-foreground text-center text-sm">
          Only the chosen one knows the magic words...
        </p>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <Input
            type="text"
            placeholder="Type the passphrase..."
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError(false);
            }}
            className={`text-center text-lg py-6 bg-card border-2 ${
              error ? "border-destructive" : "border-primary/30 focus:border-primary"
            }`}
          />
          {error && (
            <p className="text-destructive text-sm text-center">
              Nope! Try again, sweetie 😘
            </p>
          )}
          <Button
            type="submit"
            size="lg"
            className="w-full text-lg py-6 animate-pulse-glow"
          >
            Unlock 💕
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SplashScreen;
