import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";

interface ValentineQuestionProps {
  onYes: () => void;
}

type TrickMode =
  | "runaway"
  | "dropdown"
  | "tiny"
  | "expand-yes"
  | "disappear"
  | "spin-away"
  | "swap-text"
  | "melt";

const ALL_TRICKS: TrickMode[] = [
  "runaway",
  "dropdown",
  "tiny",
  "expand-yes",
  "disappear",
  "spin-away",
  "swap-text",
  "melt",
];

const SWAP_TEXTS = [
  "Okay fine, Yes 💖",
  "I meant Yes!",
  "Yes (pretending to be No)",
  "Also Yes 💕",
  "Yes but shy",
  "Yes in disguise 🥸",
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const ValentineQuestion = ({ onYes }: ValentineQuestionProps) => {
  const trickOrder = useMemo(() => shuffle(ALL_TRICKS), []);
  const [trickIndex, setTrickIndex] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [noScale, setNoScale] = useState(1);
  const [yesScale, setYesScale] = useState(1);
  const [noOpacity, setNoOpacity] = useState(1);
  const [noRotation, setNoRotation] = useState(0);
  const [noText, setNoText] = useState("No 😢");
  const [noSkewY, setNoSkewY] = useState(0);
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentTrick = trickOrder[trickIndex % trickOrder.length];

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  const getRandomPosition = useCallback(() => {
    const maxX = window.innerWidth - 120;
    const maxY = window.innerHeight - 60;
    return {
      x: Math.random() * maxX - maxX / 2,
      y: Math.random() * maxY - maxY / 2,
    };
  }, []);

  const handleNoInteraction = useCallback(() => {
    const trick = trickOrder[trickIndex % trickOrder.length];

    switch (trick) {
      case "runaway":
        setNoPosition(getRandomPosition());
        break;
      case "dropdown":
        setNoPosition({ x: 0, y: 300 });
        break;
      case "tiny":
        setNoScale((prev) => prev * 0.4);
        setYesScale((prev) => Math.min(prev * 1.3, 3));
        break;
      case "expand-yes":
        setYesScale((prev) => Math.min(prev * 1.5, 4));
        setNoScale((prev) => prev * 0.3);
        break;
      case "disappear":
        setNoOpacity(0);
        setTimeout(() => {
          setNoPosition(getRandomPosition());
          setNoOpacity(1);
          setNoScale(0.6);
        }, 800);
        break;
      case "spin-away":
        setNoRotation((prev) => prev + 720);
        setNoPosition(getRandomPosition());
        setNoScale((prev) => prev * 0.7);
        break;
      case "swap-text":
        setNoText(SWAP_TEXTS[Math.floor(Math.random() * SWAP_TEXTS.length)]);
        setYesScale((prev) => Math.min(prev * 1.2, 3));
        break;
      case "melt":
        setNoSkewY(40);
        setNoScale((prev) => prev * 0.5);
        setNoPosition((prev) => ({ ...prev, y: prev.y + 100 }));
        setTimeout(() => setNoSkewY(0), 600);
        break;
    }
    setTrickIndex((prev) => prev + 1);
  }, [trickIndex, trickOrder, getRandomPosition]);

  return (
    <div
      ref={containerRef}
      className={`flex flex-col items-center justify-center min-h-screen px-6 relative z-10 transition-all duration-700 ${
        visible ? "opacity-100 scale-100" : "opacity-0 scale-90"
      }`}
    >
      <div className="flex flex-col items-center gap-8 max-w-lg">
        <span className="text-7xl animate-bounce-in">💝</span>
        <h1
          className="text-4xl md:text-5xl font-bold text-foreground text-center leading-tight"
          style={{ animationDelay: "0.2s" }}
        >
          Will you be my{" "}
          <span className="text-gradient">Valentine?</span>
        </h1>
        <p className="text-muted-foreground text-center">
          Choose wisely... there's really only one correct answer 😏
        </p>

        <div className="flex items-center gap-6 mt-4 relative">
          <Button
            onClick={onYes}
            size="lg"
            className="text-xl px-10 py-7 animate-pulse-glow transition-transform duration-300"
            style={{ transform: `scale(${yesScale})`, zIndex: 10 }}
          >
            Yes! 💖
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="text-xl px-10 py-7 border-muted-foreground/30"
            style={{
              transform: `translate(${noPosition.x}px, ${noPosition.y}px) scale(${noScale}) rotate(${noRotation}deg) skewY(${noSkewY}deg)`,
              opacity: noOpacity,
              transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
              position: "relative",
              zIndex: 5,
            }}
            onMouseEnter={handleNoInteraction}
            onTouchStart={handleNoInteraction}
            onClick={(e) => {
              e.preventDefault();
              handleNoInteraction();
            }}
          >
            {noText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ValentineQuestion;
