import { useEffect, useState } from "react";
import { PartyPopper, Heart, Camera } from "lucide-react";
import picImage from "./pic.png";

interface ConfettiPiece {
  id: number;
  left: number;
  color: string;
  delay: number;
  size: number;
}

const COLORS = [
  "hsl(350, 80%, 55%)",
  "hsl(20, 80%, 65%)",
  "hsl(340, 60%, 70%)",
  "hsl(0, 85%, 65%)",
  "hsl(30, 90%, 70%)",
  "hsl(350, 70%, 80%)",
];

const Celebration = () => {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const pieces: ConfettiPiece[] = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 2,
      size: Math.random() * 10 + 5,
    }));
    setConfetti(pieces);
    setTimeout(() => setShow(true), 100);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 relative z-10">
      {/* Confetti */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-20">
        {confetti.map((piece) => (
          <div
            key={piece.id}
            className="absolute top-0 animate-confetti-fall"
            style={{
              left: `${piece.left}%`,
              animationDelay: `${piece.delay}s`,
              width: `${piece.size}px`,
              height: `${piece.size}px`,
              backgroundColor: piece.color,
              borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            }}
          />
        ))}
      </div>

      <div
        className={`flex flex-col items-center gap-6 max-w-md transition-all duration-1000 ${
          show ? "opacity-100 scale-100" : "opacity-0 scale-50"
        }`}
      >
        <PartyPopper className="w-20 h-20 text-accent animate-bounce-in" />
        <h1 className="text-4xl md:text-5xl font-bold text-foreground text-center flex items-center gap-2 justify-center">
          Yaaay! <Heart className="w-8 h-8 text-primary fill-primary" />
        </h1>
        <p className="text-xl text-muted-foreground text-center">
          I knew you'd say yes! Happy Valentine's Day, my love!
        </p>

        {/* Photo */}
        <div className="w-72 h-72 rounded-2xl overflow-hidden border-4 border-primary/30 shadow-lg shadow-primary/20 mt-4 animate-bounce-in flex items-center justify-center bg-secondary" style={{ animationDelay: "0.4s" }}>
          <img
            src={picImage}
            alt="Us together"
            className="w-full h-full object-contain"
          />
        </div>
        <p className="text-sm text-muted-foreground italic flex items-center gap-1">
          <Camera className="w-4 h-4" /> 
        </p>
      </div>
    </div>
  );
};

export default Celebration;
