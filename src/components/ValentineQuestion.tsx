import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ValentineQuestionProps {
  onYes: () => void;
}

type TrickMode = "runaway" | "dropdown" | "tiny" | "expand-yes";
const TRICKS: TrickMode[] = ["runaway", "dropdown", "tiny", "expand-yes"];

const ValentineQuestion = ({ onYes }: ValentineQuestionProps) => {
  const [trickIndex, setTrickIndex] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [noScale, setNoScale] = useState(1);
  const [yesScale, setYesScale] = useState(1);
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const noRef = useRef<HTMLButtonElement>(null);

  const currentTrick = TRICKS[trickIndex % TRICKS.length];

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
    switch (currentTrick) {
      case "runaway":
        setNoPosition(getRandomPosition());
        break;
      case "dropdown":
        setNoPosition({ x: 0, y: 300 });
        break;
      case "tiny":
        setNoScale((prev) => prev * 0.5);
        setYesScale((prev) => Math.min(prev * 1.3, 3));
        break;
      case "expand-yes":
        setYesScale((prev) => Math.min(prev * 1.5, 4));
        setNoScale((prev) => prev * 0.3);
        break;
    }
    setTrickIndex((prev) => prev + 1);
  }, [currentTrick, getRandomPosition]);

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
            ref={noRef}
            variant="outline"
            size="lg"
            className="text-xl px-10 py-7 transition-all duration-300 border-muted-foreground/30"
            style={{
              transform: `translate(${noPosition.x}px, ${noPosition.y}px) scale(${noScale})`,
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
            No 😢
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ValentineQuestion;
