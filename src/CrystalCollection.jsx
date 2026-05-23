import { loadCollection, CRYSTALS } from "./crystals";

const font = "'Nunito','Comic Sans MS',cursive,sans-serif";

const STYLES = `
@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
@keyframes gentleFloat {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-5px) rotate(2deg); }
}
@keyframes boxLidWiggle {
  0%, 100% { transform: rotate(-2deg); }
  50% { transform: rotate(2deg); }
}
`;

export default function CrystalCollection({ onBack }) {
  const collection = loadCollection();

  // Count crystals by type
  const crystalCounts = {};
  collection.forEach(c => {
    crystalCounts[c.id] = (crystalCounts[c.id] || 0) + 1;
  });

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1a0533 0%, #2d1b69 40%, #4a2c8a 100%)",
      fontFamily: font,
      padding: 16,
      display: "flex", flexDirection: "column", alignItems: "center",
    }}>
      <style>{STYLES}</style>

      {/* Header */}
      <div style={{ width: "100%", maxWidth: 600, marginBottom: 20 }}>
        <button onClick={onBack} style={{
          background: "rgba(255,255,255,0.1)",
          border: "2px solid rgba(255,255,255,0.2)",
          borderRadius: 16, padding: "8px 16px",
          color: "#E8DAEF", fontSize: 14, fontWeight: 800,
          cursor: "pointer", fontFamily: font,
        }}>
          ← Back Home
        </button>
      </div>

      <div style={{
        fontSize: 32, fontWeight: 900, color: "#FFD700",
        textShadow: "0 0 20px rgba(255,215,0,0.4)",
        marginBottom: 6, textAlign: "center",
      }}>
        💎 Crystal Tinker Box 💎
      </div>
      <div style={{
        fontSize: 14, color: "#B39DDB", fontWeight: 700, marginBottom: 24,
      }}>
        {collection.length} crystal{collection.length !== 1 ? "s" : ""} collected
      </div>

      {/* Tinker Box */}
      <div style={{
        width: "100%", maxWidth: 500,
        position: "relative",
      }}>
        {/* Box Lid */}
        <div style={{
          width: "100%", height: 40,
          background: "linear-gradient(90deg, #8B4513, #D2691E, #8B4513)",
          borderRadius: "12px 12px 0 0",
          border: "3px solid #5C3317",
          borderBottom: "none",
          display: "flex", alignItems: "center", justifyContent: "center",
          animation: "boxLidWiggle 4s ease-in-out infinite",
          transformOrigin: "bottom center",
        }}>
          {/* Latch */}
          <div style={{
            width: 30, height: 20,
            background: "linear-gradient(135deg, #FFD700, #DAA520)",
            borderRadius: 6,
            border: "2px solid #B8860B",
          }} />
        </div>

        {/* Box Body */}
        <div style={{
          background: "linear-gradient(180deg, #4a1a0a 0%, #2a0f05 100%)",
          borderRadius: "0 0 16px 16px",
          border: "3px solid #5C3317",
          borderTop: "2px solid #8B4513",
          padding: 20,
          minHeight: 200,
          boxShadow: "0 8px 32px rgba(0,0,0,0.5), inset 0 2px 20px rgba(139,69,19,0.3)",
        }}>
          {/* Velvet lining */}
          <div style={{
            background: "linear-gradient(135deg, #4a0e4e, #2d0a30)",
            borderRadius: 12,
            padding: 16,
            minHeight: 160,
            border: "2px solid #6a1b6a",
            boxShadow: "inset 0 2px 12px rgba(0,0,0,0.4)",
          }}>
            {collection.length === 0 ? (
              <div style={{
                textAlign: "center", color: "#8E44AD",
                fontSize: 16, fontWeight: 700, padding: 40,
              }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🔮</div>
                No crystals yet!<br />
                Cook treats to earn crystals! ✨
              </div>
            ) : (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))",
                gap: 12,
              }}>
                {CRYSTALS.map(crystalType => {
                  const count = crystalCounts[crystalType.id] || 0;
                  if (count === 0) return null;
                  return (
                    <div key={crystalType.id} style={{
                      display: "flex", flexDirection: "column",
                      alignItems: "center", gap: 4,
                      animation: "gentleFloat 3s ease-in-out infinite",
                      animationDelay: `${Math.random() * 2}s`,
                    }}>
                      {/* Crystal gem */}
                      <div style={{
                        width: 50, height: 58,
                        background: crystalType.gradient,
                        clipPath: "polygon(50% 0%, 80% 20%, 100% 55%, 70% 100%, 30% 100%, 0% 55%, 20% 20%)",
                        boxShadow: `0 0 15px ${crystalType.glow}`,
                        position: "relative",
                      }}>
                        {/* Shine */}
                        <div style={{
                          position: "absolute",
                          top: "20%", left: "25%",
                          width: "20%", height: "20%",
                          background: "rgba(255,255,255,0.6)",
                          borderRadius: "50%",
                          filter: "blur(2px)",
                        }} />
                      </div>
                      <div style={{
                        fontSize: 11, fontWeight: 900,
                        color: crystalType.color,
                        textAlign: "center",
                        textShadow: `0 0 8px ${crystalType.glow}`,
                      }}>
                        {crystalType.name}
                      </div>
                      {count > 1 && (
                        <div style={{
                          fontSize: 10, fontWeight: 900,
                          color: "#FFD700",
                          background: "rgba(255,215,0,0.15)",
                          borderRadius: 8, padding: "2px 6px",
                        }}>
                          ×{count}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Box feet */}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "0 20px" }}>
          {[0, 1].map(i => (
            <div key={i} style={{
              width: 24, height: 8,
              background: "#5C3317",
              borderRadius: "0 0 6px 6px",
            }} />
          ))}
        </div>
      </div>

      {/* Stats */}
      {collection.length > 0 && (
        <div style={{
          marginTop: 24,
          background: "rgba(255,255,255,0.05)",
          borderRadius: 16, padding: "12px 20px",
          border: "1px solid rgba(255,255,255,0.1)",
          textAlign: "center",
        }}>
          <div style={{ fontSize: 12, color: "#B39DDB", fontWeight: 700, marginBottom: 6 }}>
            🏆 Unique types found
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#FFD700" }}>
            {Object.keys(crystalCounts).length} / {CRYSTALS.length}
          </div>
        </div>
      )}
    </div>
  );
}
