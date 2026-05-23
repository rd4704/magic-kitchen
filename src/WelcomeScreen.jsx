import { useState } from "react";
import { playWelcomeChime } from "./sounds";
import { loadCollection } from "./crystals";

const font = "'Nunito','Comic Sans MS',cursive,sans-serif";

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap');
@keyframes doorGlow {
  0%, 100% { box-shadow: 0 0 30px rgba(255,182,193,0.4), inset 0 0 30px rgba(255,255,255,0.1); }
  50% { box-shadow: 0 0 60px rgba(255,182,193,0.8), inset 0 0 50px rgba(255,255,255,0.2); }
}
@keyframes steam {
  0% { transform: translateY(0) scale(1); opacity: 0.7; }
  100% { transform: translateY(-40px) scale(1.5); opacity: 0; }
}
@keyframes twinkle {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.3; transform: scale(0.5); }
}
@keyframes floatSlow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}
@keyframes doorOpen {
  0% { transform: perspective(800px) rotateY(0deg); }
  100% { transform: perspective(800px) rotateY(-75deg); }
}
@keyframes welcomeFade {
  0% { opacity: 1; }
  100% { opacity: 0; transform: scale(1.1); }
}
`;

export default function WelcomeScreen({ onEnter, onViewCollection }) {
  const [entering, setEntering] = useState(false);
  const crystals = loadCollection();

  const handleEnter = () => {
    setEntering(true);
    playWelcomeChime();
    setTimeout(() => onEnter(), 800);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #1a0533 0%, #2d1b69 30%, #4a2c8a 60%, #7b4fa2 100%)",
      fontFamily: font,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      overflow: "hidden", position: "relative",
      animation: entering ? "welcomeFade 0.8s ease forwards" : undefined,
    }}>
      <style>{STYLES}</style>

      {/* Stars */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          top: `${Math.random() * 60}%`,
          left: `${Math.random() * 100}%`,
          width: 4, height: 4,
          background: "white",
          borderRadius: "50%",
          animation: `twinkle ${1.5 + Math.random() * 2}s ease-in-out infinite`,
          animationDelay: `${Math.random() * 2}s`,
        }} />
      ))}

      {/* Title */}
      <div style={{
        fontSize: 42, fontWeight: 900, color: "#FFD700",
        textShadow: "0 0 20px rgba(255,215,0,0.5), 0 4px 8px rgba(0,0,0,0.3)",
        marginBottom: 8, textAlign: "center",
        animation: "floatSlow 3s ease-in-out infinite",
      }}>
        🌟 Magic Kitchen 🌟
      </div>
      <div style={{
        fontSize: 16, color: "#E8DAEF", fontWeight: 700, marginBottom: 30,
        textAlign: "center",
      }}>
        A magical place where treats come to life!
      </div>

      {/* Kitchen Door */}
      <div style={{
        position: "relative",
        width: 220, height: 300,
        perspective: "800px",
      }}>
        {/* Door frame */}
        <div style={{
          position: "absolute", inset: -12,
          background: "linear-gradient(135deg, #8B4513, #A0522D, #D2691E)",
          borderRadius: "120px 120px 8px 8px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        }} />

        {/* Door */}
        <button
          onClick={handleEnter}
          style={{
            position: "relative",
            width: "100%", height: "100%",
            background: "linear-gradient(135deg, #C44B8A, #9B59B6)",
            borderRadius: "110px 110px 4px 4px",
            border: "none",
            cursor: "pointer",
            animation: entering ? "doorOpen 0.8s ease forwards" : "doorGlow 2s ease-in-out infinite",
            transformOrigin: "left center",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: 12,
            fontFamily: font,
          }}
        >
          {/* Door window */}
          <div style={{
            width: 80, height: 80,
            background: "linear-gradient(135deg, #FFE4B5, #FFF8DC)",
            borderRadius: "50%",
            border: "4px solid #DAA520",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 36,
            boxShadow: "inset 0 0 20px rgba(255,215,0,0.3)",
          }}>
            🍪
          </div>

          {/* Steam from window */}
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              position: "absolute",
              top: 60 - i * 10,
              left: 90 + i * 15,
              fontSize: 16,
              animation: `steam 2s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}>☁️</div>
          ))}

          {/* Door handle */}
          <div style={{
            position: "absolute",
            right: 22, top: "55%",
            width: 16, height: 16,
            background: "linear-gradient(135deg, #FFD700, #DAA520)",
            borderRadius: "50%",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }} />

          {/* Enter text */}
          <div style={{
            color: "white",
            fontSize: 18,
            fontWeight: 900,
            textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            padding: "8px 20px",
            background: "rgba(255,255,255,0.15)",
            borderRadius: 20,
            backdropFilter: "blur(4px)",
          }}>
            Tap to Enter! 🚪
          </div>
        </button>
      </div>

      {/* Crystal collection button */}
      {crystals.length > 0 && (
        <button
          onClick={onViewCollection}
          style={{
            marginTop: 30,
            background: "rgba(255,255,255,0.1)",
            borderRadius: 20,
            padding: "12px 24px",
            color: "#E8DAEF",
            fontSize: 15,
            fontWeight: 700,
            backdropFilter: "blur(4px)",
            border: "2px solid rgba(255,255,255,0.2)",
            cursor: "pointer",
            fontFamily: font,
            transition: "all 0.2s",
          }}
        >
          💎 View My Crystals ({crystals.length}) →
        </button>
      )}

      {/* Floor mat */}
      <div style={{
        marginTop: 30,
        width: 260, height: 20,
        background: "linear-gradient(90deg, #8B4513, #A0522D, #8B4513)",
        borderRadius: 10,
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      }} />
    </div>
  );
}
