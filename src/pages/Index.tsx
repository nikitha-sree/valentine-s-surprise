import { useState } from "react";
import FloatingHearts from "@/components/FloatingHearts";
import SplashScreen from "@/components/SplashScreen";
import ValentineQuestion from "@/components/ValentineQuestion";
import Celebration from "@/components/Celebration";

type Screen = "splash" | "question" | "celebration";

const PASSPHRASE = "tagoochimogunnibeltthokodatha";

const Index = () => {
  const [screen, setScreen] = useState<Screen>("splash");

  return (
    <div className="min-h-screen overflow-hidden relative">
      <FloatingHearts />
      {screen === "splash" && (
        <SplashScreen
          passphrase={PASSPHRASE}
          onUnlock={() => setScreen("question")}
        />
      )}
      {screen === "question" && (
        <ValentineQuestion onYes={() => setScreen("celebration")} />
      )}
      {screen === "celebration" && <Celebration />}
    </div>
  );
};

export default Index;
