import { useState, useEffect } from "react";
import WelcomeScreen from "./WelcomeScreen";
import MagicKitchen from "./MagicKitchen";
import GiftScreen from "./GiftScreen";
import CrystalCollection from "./CrystalCollection";
import { startBackgroundMusic, stopBackgroundMusic } from "./sounds";

export default function App() {
  const [screen, setScreen] = useState("welcome"); // welcome, kitchen, gift, collection
  const [lastRecipe, setLastRecipe] = useState(null);

  const handleEnterKitchen = () => {
    setScreen("kitchen");
    startBackgroundMusic();
  };

  const handleRecipeComplete = (recipeName) => {
    setLastRecipe(recipeName);
    stopBackgroundMusic();
    setScreen("gift");
  };

  const handleContinueCooking = () => {
    setScreen("kitchen");
    startBackgroundMusic();
  };

  const handleGoHome = () => {
    stopBackgroundMusic();
    setScreen("welcome");
  };

  const handleViewCollection = () => {
    setScreen("collection");
  };

  useEffect(() => {
    return () => stopBackgroundMusic();
  }, []);

  switch (screen) {
    case "welcome":
      return <WelcomeScreen onEnter={handleEnterKitchen} onViewCollection={handleViewCollection} />;
    case "kitchen":
      return <MagicKitchen onRecipeComplete={handleRecipeComplete} onHome={handleGoHome} onViewCollection={handleViewCollection} />;
    case "gift":
      return <GiftScreen recipeName={lastRecipe} onContinue={handleContinueCooking} onHome={handleGoHome} />;
    case "collection":
      return <CrystalCollection onBack={handleGoHome} />;
    default:
      return <WelcomeScreen onEnter={handleEnterKitchen} />;
  }
}
