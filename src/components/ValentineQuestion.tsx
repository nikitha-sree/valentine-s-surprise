import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Heart, HeartCrack, Sparkles } from "lucide-react";

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
  "Okay fine, Yes",
  "I meant Yes!",
  "Yes (pretending to be No)",
  "Also Yes",
  "Yes but shy",
  "Yes in disguise",
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
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const originalPositionRef = useRef<{ x: number; y: number } | null>(null);
  const originalSizeRef = useRef<{ width: number; height: number } | null>(null);

  const currentTrick = trickOrder[trickIndex % trickOrder.length];

  const clampPositionToViewport = useCallback((position: { x: number; y: number }) => {
    if (!noButtonRef.current || !originalPositionRef.current || !originalSizeRef.current) return position;
    
    const padding = 20;
    
    // Get button dimensions (accounting for scale)
    const btnWidth = originalSizeRef.current.width * noScale;
    const btnHeight = originalSizeRef.current.height * noScale;
    
    // Calculate absolute position (original + translate offset)
    const absoluteX = originalPositionRef.current.x + position.x;
    const absoluteY = originalPositionRef.current.y + position.y;
    
    // Calculate viewport bounds
    const minX = padding;
    const minY = padding;
    const maxX = window.innerWidth - btnWidth - padding;
    const maxY = window.innerHeight - btnHeight - padding;
    
    // Clamp the absolute position
    const clampedX = Math.max(minX, Math.min(maxX, absoluteX));
    const clampedY = Math.max(minY, Math.min(maxY, absoluteY));
    
    // Return relative position (clamped absolute - original)
    return {
      x: clampedX - originalPositionRef.current.x,
      y: clampedY - originalPositionRef.current.y,
    };
  }, [noScale]);

  const getRandomPosition = useCallback(() => {
    if (!noButtonRef.current || !originalPositionRef.current || !originalSizeRef.current) return { x: 0, y: 0 };
    
    const padding = 20;
    const btnWidth = originalSizeRef.current.width * noScale;
    const btnHeight = originalSizeRef.current.height * noScale;
    
    const minX = padding;
    const minY = padding;
    const maxX = window.innerWidth - btnWidth - padding;
    const maxY = window.innerHeight - btnHeight - padding;
    
    // Generate random absolute position
    const targetAbsoluteX = Math.max(minX, Math.min(maxX, Math.random() * (maxX - minX) + minX));
    const targetAbsoluteY = Math.max(minY, Math.min(maxY, Math.random() * (maxY - minY) + minY));
    
    // Convert to relative position
    return {
      x: targetAbsoluteX - originalPositionRef.current.x,
      y: targetAbsoluteY - originalPositionRef.current.y,
    };
  }, [noScale]);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  // Capture original button position and size
  useEffect(() => {
    if (noButtonRef.current && !originalPositionRef.current) {
      const rect = noButtonRef.current.getBoundingClientRect();
      originalPositionRef.current = { x: rect.left, y: rect.top };
      originalSizeRef.current = { width: rect.width, height: rect.height };
    }
  }, [visible]);

  // Ensure button stays within viewport when scale changes
  useEffect(() => {
    if (originalPositionRef.current) {
      setNoPosition((prev) => clampPositionToViewport(prev));
    }
  }, [noScale, clampPositionToViewport]);

  // Ensure button stays within viewport on window resize
  useEffect(() => {
    const handleResize = () => {
      if (originalPositionRef.current) {
        setNoPosition((prev) => clampPositionToViewport(prev));
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [clampPositionToViewport]);

  const handleNoInteraction = useCallback(() => {
    const trick = trickOrder[trickIndex % trickOrder.length];

    switch (trick) {
      case "runaway":
        setNoPosition((prev) => clampPositionToViewport(getRandomPosition()));
        setYesScale((prev) => Math.min(prev + 0.15, 4));
        break;
      case "dropdown":
        setNoPosition((prev) => clampPositionToViewport({ x: 0, y: Math.min(300, window.innerHeight - 200) }));
        setYesScale((prev) => Math.min(prev + 0.15, 4));
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
        setYesScale((prev) => Math.min(prev + 0.15, 4));
        setTimeout(() => {
          setNoPosition((prev) => clampPositionToViewport(getRandomPosition()));
          setNoOpacity(1);
          setNoScale(0.6);
        }, 800);
        break;
      case "spin-away":
        setNoRotation((prev) => prev + 720);
        setNoPosition((prev) => clampPositionToViewport(getRandomPosition()));
        setNoScale((prev) => prev * 0.7);
        setYesScale((prev) => Math.min(prev + 0.15, 4));
        break;
      case "swap-text":
        setNoText(SWAP_TEXTS[Math.floor(Math.random() * SWAP_TEXTS.length)]);
        setYesScale((prev) => Math.min(prev * 1.2, 3));
        break;
      case "melt":
        setNoSkewY(40);
        setNoScale((prev) => prev * 0.5);
        setNoPosition((prev) => clampPositionToViewport({ ...prev, y: prev.y + 100 }));
        setYesScale((prev) => Math.min(prev + 0.15, 4));
        setTimeout(() => setNoSkewY(0), 600);
        break;
    }
    setTrickIndex((prev) => prev + 1);
  }, [trickIndex, trickOrder, getRandomPosition, clampPositionToViewport]);

  return (
    <div
      ref={containerRef}
      className={`flex flex-col items-center justify-center min-h-screen px-6 relative z-10 transition-all duration-700 ${
        visible ? "opacity-100 scale-100" : "opacity-0 scale-90"
      }`}
    >
      <div className="flex flex-col items-center gap-8 max-w-lg">
        <Heart className="w-16 h-16 text-primary fill-primary animate-bounce-in" />
        <h1
          className="text-4xl md:text-5xl font-bold text-foreground text-center leading-tight"
          style={{ animationDelay: "0.2s" }}
        >
          Will you be my{" "}
          <span className="text-gradient">Valentine?</span>
        </h1>
        <p className="text-muted-foreground text-center flex items-center gap-1 justify-center">
          Choose wisely... there's really only one correct answer <Sparkles className="w-4 h-4 text-accent" />
        </p>

        <div className="flex items-center gap-6 mt-4 relative">
          <Button
            onClick={onYes}
            size="lg"
            className="text-xl px-10 py-7 transition-transform duration-300"
            style={{ transform: `scale(${yesScale})`, zIndex: 10 }}
          >
            <Heart className="w-5 h-5 fill-current" /> Yes!
          </Button>

          <Button
            ref={noButtonRef}
            variant="outline"
            size="lg"
            data-no-btn
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
            <HeartCrack className="w-5 h-5" /> {noText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ValentineQuestion;
