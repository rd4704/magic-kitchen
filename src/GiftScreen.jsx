import { useState, useEffect } from "react";
import { playGiftOpen, playCrystalReveal } from "./sounds";
import { getRandomCrystal, addCrystalToCollection } from "./crystals";

const font = "'Nunito','Comic Sans MS',cursive,sans-serif";

const STYLES = `
@keyframes giftBounce {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-8px) rotate(-3deg); }
  75% { transform: translateY(-8px) rotate(3deg); }
}
@keyframes giftShake {
  0%, 100% { transform: rotate(0deg); }
  20% { transform: rotate(-15deg); }
  40% { transform: rotate(15deg); }
  60% { transform: rotate(-10deg); }
  80% { transform: rotate(10deg); }
}
@keyframes lidOpen {
  0% { transform: translateY(0) rotate(0deg); }
  100% { transform: translateY(-80px) rotate(-30deg); opacity: 0; }
}
@keyframes crystalRise {
  0% { transform: translateY(40px) scale(0); opacity: 0; }
  60% { transform: translateY(-10px) scale(1.2); opacity: 1; }
  100% { transform: translateY(0) scale(1); opacity: 1; }
}
@keyframes sparkle {
  0%, 100% { transform: scale(0) rotate(0deg); opacity: 0; }
  50% { transform: scale(1) rotate(180deg); opacity: 1; }
}
@keyframes crystalGlow {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.3); }
}
@keyframes confetti {
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(300px) rotate(720deg); opacity: 0; }
}
`;

export default function GiftScreen({ recipeName, onContinue, onHome }) {
  const [phase, setPhase] = useState("gift"); // gift, opening, revealed
  const [crystal, setCrystal] = useState(null);
  const [confetti, setConfetti] = useState([]);

  const handleOpen = () => {
    setPhase("opening");
    playGiftOpen();

    setTimeout(() => {
      const c = getRandomCrystal();
      setCrystal(c);
      addCrystalToCollection(c);
      setPhase("revealed");
      playCrystalReveal();

      // Generate confetti
      const pieces = Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        color: ["#FF6EB4", "#FFD700", "#9B59B6", "#2ECC71", "#3498DB", "#E74C3C"][Math.floor(Math.random() * 6)],
        delay: Math.random() * 0.5,
        duration: 1.5 + Math.random(),
      }));
      setConfetti(pieces);
    }, 600);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: phase === "revealed"
        ? `radial-gradient(circle, ${crystal?.glow || "rgba(255,255,255,0.3)"} 0%, #1a0533 70%)`
        : "linear-gradient(135deg, #1a0533 0%, #2d1b69 50%, #4a2c8a 100%)",
      fontFamily: font,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      overflow: "hidden", position: "relative",
      transition: "background 0.8s ease",
    }}>
      <style>{STYLES}</style>

      {/* Confetti */}
      {confetti.map(p => (
        <div key={p.id} style={{
          position: "absolute",
          top: 0,
          left: `${p.left}%`,
          width: 10, height: 10,
          background: p.color,
          borderRadius: Math.random() > 0.5 ? "50%" : "2px",
          animation: `confetti ${p.duration}s ease-out forwards`,
          animationDelay: `${p.delay}s`,
        }} />
      ))}

      {/* Title */}
      <div style={{
        fontSize: 24, fontWeight: 900, color: "#FFD700",
        textShadow: "0 0 15px rgba(255,215,0,0.5)",
        marginBottom: 10, textAlign: "center",
      }}>
        {phase === "revealed" ? "✨ You found a crystal! ✨" : "🎁 You made a treat! 🎁"}
      </div>

      {recipeName && phase !== "revealed" && (
        <div style={{
          fontSize: 16, color: "#E8DAEF", fontWeight: 700, marginBottom: 30,
        }}>
          Amazing {recipeName}! Here's your reward...
        </div>
      )}

      {/* Gift Box */}
      {phase !== "revealed" && (
        <button
          onClick={phase === "gift" ? handleOpen : undefined}
          disabled={phase !== "gift"}
          style={{
            background: "none", border: "none", cursor: phase === "gift" ? "pointer" : "default",
            position: "relative",
            animation: phase === "gift" ? "giftBounce 1.5s ease-in-out infinite" : undefined,
          }}
        >
          {/* Box body */}
          <div style={{
            width: 160, height: 130,
            background: "linear-gradient(135deg, #FF6EB4, #C44B8A)",
            borderRadius: 12,
            position: "relative",
            boxShadow: "0 8px 32px rgba(196,75,138,0.5)",
            animation: phase === "opening" ? "giftShake 0.5s ease" : undefined,
          }}>
            {/* Ribbon vertical */}
            <div style={{
              position: "absolute",
              left: "50%", top: 0, bottom: 0,
              width: 20, marginLeft: -10,
              background: "linear-gradient(180deg, #FFD700, #FFA500)",
            }} />
            {/* Ribbon horizontal */}
            <div style={{
              position: "absolute",
              top: "50%", left: 0, right: 0,
              height: 20, marginTop: -10,
              background: "linear-gradient(90deg, #FFD700, #FFA500)",
            }} />
          </div>

          {/* Box lid */}
          <div style={{
            position: "absolute",
            top: -20, left: -10,
            width: 180, height: 40,
            background: "linear-gradient(135deg, #FF85C8, #E056A0)",
            borderRadius: 8,
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            animation: phase === "opening" ? "lidOpen 0.6s ease forwards" : undefined,
          }}>
            {/* Bow */}
            <div style={{
              position: "absolute",
              top: -20, left: "50%", marginLeft: -20,
              fontSize: 36,
            }}>🎀</div>
          </div>

          {phase === "gift" && (
            <div style={{
              marginTop: 20,
              color: "#FFD700", fontSize: 16, fontWeight: 900,
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              textAlign: "center",
              fontFamily: font,
            }}>
              Tap to open! 🎁
            </div>
          )}
        </button>
      )}

      {/* Crystal Reveal */}
      {phase === "revealed" && crystal && (
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          animation: "crystalRise 0.8s ease-out",
        }}>
          {/* Crystal */}
          <div style={{
            width: 120, height: 140,
            background: crystal.gradient,
            clipPath: "polygon(50% 0%, 85% 25%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 15% 25%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 48,
            animation: "crystalGlow 2s ease-in-out infinite",
            boxShadow: `0 0 40px ${crystal.glow}, 0 0 80px ${crystal.glow}`,
            position: "relative",
          }}>
            {/* Sparkles around crystal */}
            {[0, 1, 2, 3, 4, 5].map(i => (
              <div key={i} style={{
                position: "absolute",
                top: `${20 + Math.random() * 60}%`,
                left: `${10 + Math.random() * 80}%`,
                width: 6, height: 6,
                background: "white",
                borderRadius: "50%",
                animation: `sparkle ${1 + Math.random()}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
              }} />
            ))}
          </div>

          <div style={{
            marginTop: 20,
            fontSize: 28, fontWeight: 900,
            color: crystal.color,
            textShadow: `0 0 20px ${crystal.glow}`,
          }}>
            {crystal.emoji} {crystal.name} {crystal.emoji}
          </div>

          <div style={{
            marginTop: 8,
            fontSize: 14, color: "#B39DDB", fontWeight: 700,
          }}>
            Added to your crystal collection!
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 12, marginTop: 30 }}>
            <button onClick={onContinue} style={{
              background: "linear-gradient(135deg, #FF6EB4, #C44B8A)",
              color: "white", border: "none", borderRadius: 22,
              padding: "12px 28px", fontSize: 16, fontWeight: 900,
              cursor: "pointer", fontFamily: font,
              boxShadow: "0 4px 16px rgba(196,75,138,0.4)",
            }}>
              Keep Cooking! 🍳
            </button>
            <button onClick={onHome} style={{
              background: "rgba(255,255,255,0.1)",
              color: "#E8DAEF", border: "2px solid rgba(255,255,255,0.3)",
              borderRadius: 22, padding: "12px 28px", fontSize: 16,
              fontWeight: 900, cursor: "pointer", fontFamily: font,
            }}>
              🏠 Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
