import { useState, useEffect } from "react";

const INGREDIENTS = [
  { id: "flour",  emoji: "🌾", name: "Flour"  },
  { id: "egg",    emoji: "🥚", name: "Egg"    },
  { id: "butter", emoji: "🧈", name: "Butter" },
  { id: "berry",  emoji: "🍓", name: "Berry"  },
  { id: "lemon",  emoji: "🍋", name: "Lemon"  },
  { id: "water",  emoji: "💧", name: "Water"  },
  { id: "choco",  emoji: "🍫", name: "Choco"  },
  { id: "flower", emoji: "🌸", name: "Flower" },
];

const RECIPES = [
  { ingredients: ["flour",  "egg"   ], result: { emoji: "🍪", name: "Cookie"      } },
  { ingredients: ["flour",  "butter"], result: { emoji: "🥐", name: "Croissant"   } },
  { ingredients: ["berry",  "water" ], result: { emoji: "🧃", name: "Berry Juice" } },
  { ingredients: ["lemon",  "water" ], result: { emoji: "🍋", name: "Lemonade"    } },
  { ingredients: ["flower", "water" ], result: { emoji: "✨", name: "Magic Potion"} },
  { ingredients: ["choco",  "egg"   ], result: { emoji: "🍩", name: "Donut"       } },
  { ingredients: ["berry",  "flour" ], result: { emoji: "🧁", name: "Muffin"      } },
  { ingredients: ["choco",  "butter"], result: { emoji: "🍫", name: "Choco Bar"   } },
];

const CUSTOMERS = [
  { emoji: "🐰", name: "Bunny",   wants: "Cookie",       color: "#FFB3D1" },
  { emoji: "🐻", name: "Bear",    wants: "Donut",        color: "#FFD4A3" },
  { emoji: "🦊", name: "Fox",     wants: "Muffin",       color: "#FFAA80" },
  { emoji: "🐨", name: "Koala",   wants: "Croissant",    color: "#B3E5FC" },
  { emoji: "🦄", name: "Unicorn", wants: "Magic Potion", color: "#E1BEE7" },
  { emoji: "🐸", name: "Frog",    wants: "Lemonade",     color: "#C8E6C9" },
  { emoji: "🐼", name: "Panda",   wants: "Berry Juice",  color: "#F8BBD0" },
  { emoji: "🐱", name: "Kitty",   wants: "Choco Bar",    color: "#E8D5B7" },
];

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap');
*{box-sizing:border-box}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
@keyframes happy{0%,100%{transform:scale(1) rotate(0)}25%{transform:scale(1.15) rotate(-6deg)}75%{transform:scale(1.15) rotate(6deg)}}
@keyframes pop{0%{transform:scale(0);opacity:0}70%{transform:scale(1.25)}100%{transform:scale(1);opacity:1}}
@keyframes wobble{0%,100%{transform:rotate(0)}20%{transform:rotate(-13deg)}40%{transform:rotate(13deg)}60%{transform:rotate(-8deg)}80%{transform:rotate(8deg)}}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
.ing{transition:transform .15s,box-shadow .15s}
.ing:hover:not(:disabled){transform:scale(1.13)!important}
.ing:active:not(:disabled){transform:scale(.93)!important}
.mixbtn{transition:all .18s}
.mixbtn:hover:not(:disabled){transform:scale(1.06)!important}
.mixbtn:active:not(:disabled){transform:scale(.95)!important}
`;

const font = "'Nunito','Comic Sans MS',cursive,sans-serif";

function Bowl({ phase, crafted, bowlItems }) {
  return (
    <div style={{
      width:154, height:112,
      background:"white",
      borderRadius:"12px 12px 65px 65px",
      border:"4px solid #C44B8A",
      display:"flex", alignItems:"center", justifyContent:"center",
      fontSize:44, gap:4, position:"relative",
      boxShadow:"0 6px 22px rgba(196,75,138,.22)",
    }}>
      <div style={{
        position:"absolute", top:-10, left:-8, right:-8, height:24,
        background:"#E991C4", borderRadius:14, zIndex:-1,
      }}/>
      {phase === "fail" &&
        <span style={{animation:"wobble .45s ease",fontSize:52}}>💥</span>}
      {(phase === "success" || phase === "wrongItem") && crafted &&
        <span style={{animation:"pop .4s ease",fontSize:56}}>{crafted.emoji}</span>}
      {phase === "picking" && bowlItems.map((ing, i) =>
        <span key={i}>{ing?.emoji}</span>)}
      {phase === "picking" && bowlItems.length === 0 &&
        <span style={{fontSize:13,color:"#CCC",textAlign:"center",lineHeight:1.4}}>Pick 2<br/>things!</span>}
    </div>
  );
}

export default function MagicKitchen({ onRecipeComplete, onHome, onViewCollection }) {
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = STYLES;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  const [selected,    setSelected]    = useState([]);
  const [phase,       setPhase]       = useState("picking");
  const [customerIdx, setCustomerIdx] = useState(0);
  const [score,       setScore]       = useState(0);
  const [crafted,     setCrafted]     = useState(null);
  const [showHint,    setShowHint]    = useState(false);
  const [discovered,  setDiscovered]  = useState([]);
  const [stars,       setStars]       = useState([]);

  const customer = CUSTOMERS[customerIdx % CUSTOMERS.length];

  const findRecipe = (items) => {
    const key = [...items].sort().join(",");
    return RECIPES.find(r => [...r.ingredients].sort().join(",") === key);
  };

  const pickIngredient = (id) => {
    if (phase !== "picking") return;
    if (selected.includes(id)) {
      setSelected(prev => prev.filter(s => s !== id));
    } else if (selected.length < 2) {
      setSelected(prev => [...prev, id]);
    }
  };

  const mix = () => {
    if (selected.length !== 2 || phase !== "picking") return;
    const recipe = findRecipe(selected);
    if (recipe) {
      const item = recipe.result;
      setCrafted(item);
      if (!discovered.includes(item.name))
        setDiscovered(prev => [...prev, item.name]);
      if (item.name === customer.wants) {
        setPhase("success");
        setScore(s => s + 1);
        setStars(prev => [...prev, Date.now()]);
        setTimeout(() => {
          setPhase("picking"); setSelected([]); setCrafted(null);
          setShowHint(false); setCustomerIdx(i => i + 1);
          if (onRecipeComplete) onRecipeComplete(item.name);
        }, 2000);
      } else {
        setPhase("wrongItem");
        setTimeout(() => { setPhase("picking"); setSelected([]); setCrafted(null); }, 2000);
      }
    } else {
      setPhase("fail");
      setTimeout(() => { setPhase("picking"); setSelected([]); }, 1600);
    }
  };

  const hintRecipe = RECIPES.find(r => r.result.name === customer.wants);
  const hintIngredients = hintRecipe
    ? hintRecipe.ingredients.map(id => INGREDIENTS.find(i => i.id === id))
    : [];
  const bowlItems = selected.map(id => INGREDIENTS.find(i => i.id === id));

  const statusMsg = () => {
    if (phase === "picking") {
      if (selected.length === 0) return { text: "Pick 2 ingredients from the shelf!", color: "#9B59B6" };
      if (selected.length === 1) return { text: "Pick 1 more ingredient! 👆", color: "#9B59B6" };
      return { text: "Great! Now press Mix! ✨", color: "#8E44AD" };
    }
    if (phase === "fail") return { text: "Hmm, that didn't work! Try again 💫", color: "#E57373" };
    if (phase === "success") return { text: `🎉 ${customer.name} loves it! Here's a star!`, color: "#4CAF50" };
    if (phase === "wrongItem" && crafted)
      return { text: `Made ${crafted.emoji} ${crafted.name} — but ${customer.name} wants ${customer.wants}!`, color: "#FF9800" };
    return { text: "", color: "#9B59B6" };
  };
  const msg = statusMsg();

  return (
    <div style={{
      minHeight:"100vh",
      background:"linear-gradient(135deg,#FFE4F5 0%,#EBE4FF 50%,#E4F5FF 100%)",
      fontFamily: font,
      padding:"16px",
      display:"flex", flexDirection:"column", alignItems:"center",
    }}>
      {/* NAV BAR */}
      <div style={{
        width:"100%", maxWidth:680, display:"flex",
        justifyContent:"space-between", marginBottom:8,
      }}>
        <button onClick={onHome} style={{
          background:"rgba(196,75,138,0.1)", border:"2px solid #FFB3D1",
          borderRadius:14, padding:"6px 14px", cursor:"pointer",
          fontWeight:800, color:"#C44B8A", fontSize:13, fontFamily:font,
        }}>🏠 Home</button>
        <button onClick={onViewCollection} style={{
          background:"rgba(155,89,182,0.1)", border:"2px solid #D2B4DE",
          borderRadius:14, padding:"6px 14px", cursor:"pointer",
          fontWeight:800, color:"#9B59B6", fontSize:13, fontFamily:font,
        }}>💎 Crystals</button>
      </div>

      {/* HEADER */}
      <div style={{textAlign:"center", marginBottom:14}}>
        <div style={{fontSize:28, fontWeight:900, color:"#C44B8A", letterSpacing:-0.5}}>
          🌟 Magic Kitchen 🌟
        </div>
        <div style={{fontSize:18, color:"#9B59B6", fontWeight:800, minHeight:28}}>
          {score === 0
            ? "Make treats for the cute animals!"
            : `${"⭐".repeat(Math.min(score, 12))}  ${score} star${score !== 1 ? "s" : ""}!`}
        </div>
      </div>

      {/* MAIN ROW */}
      <div style={{
        display:"flex", gap:12, width:"100%", maxWidth:680,
        flexWrap:"wrap", justifyContent:"center", marginBottom:14,
      }}>
        {/* CUSTOMER CARD */}
        <div style={{
          background:"white", borderRadius:24, padding:16,
          boxShadow:"0 4px 20px rgba(196,75,138,.15)",
          flex:"0 0 164px", textAlign:"center",
          border:`3px solid ${customer.color}`,
        }}>
          <div style={{fontSize:11, fontWeight:900, color:"#BBB", marginBottom:4,
            textTransform:"uppercase", letterSpacing:1}}>Customer</div>
          <div style={{
            fontSize:58, lineHeight:1, marginBottom:6, display:"inline-block",
            animation: phase === "success" ? "happy .4s ease 4" : "float 2.8s ease-in-out infinite",
          }}>
            {customer.emoji}
          </div>
          <div style={{fontWeight:900, color:"#444", marginBottom:8}}>{customer.name}</div>
          <div style={{background:customer.color+"55", borderRadius:14, padding:"8px 10px"}}>
            <div style={{fontSize:12, color:"#999"}}>I want:</div>
            <div style={{fontWeight:900, color:"#333", fontSize:17}}>
              {RECIPES.find(r => r.result.name === customer.wants)?.result.emoji} {customer.wants}
            </div>
          </div>

          {phase === "success" &&
            <div style={{marginTop:10, fontSize:22, animation:"pop .4s ease"}}>😄 Yay!</div>}
          {phase === "wrongItem" &&
            <div style={{marginTop:10, fontSize:13, color:"#E57373", fontWeight:700,
              animation:"wobble .4s ease"}}>That's not it... 😔</div>}

          <button onClick={() => setShowHint(h => !h)} style={{
            marginTop:10, background:"#FFF0F7", border:"2px solid #FFB3D1",
            borderRadius:12, padding:"5px 12px", cursor:"pointer",
            fontWeight:800, color:"#C44B8A", fontSize:13, fontFamily:font,
          }}>
            {showHint ? "🙈 Hide hint" : "💡 Hint?"}
          </button>
          {showHint && (
            <div style={{
              marginTop:8, background:"#FFFDE7", borderRadius:12, padding:8,
              fontSize:24, fontWeight:900, border:"2px dashed #FFD54F",
            }}>
              {hintIngredients.map(i => i?.emoji).join(" + ")}
            </div>
          )}
        </div>

        {/* MIXING AREA */}
        <div style={{
          flex:"1 1 200px", display:"flex", flexDirection:"column",
          alignItems:"center", gap:10,
        }}>
          <Bowl phase={phase} crafted={crafted} bowlItems={bowlItems} />

          <div style={{
            fontSize:14, fontWeight:800, textAlign:"center",
            color: msg.color, minHeight:22, maxWidth:220,
          }}>
            {msg.text}
          </div>

          <button
            className="mixbtn"
            onClick={mix}
            disabled={selected.length !== 2 || phase !== "picking"}
            style={{
              background: selected.length === 2 && phase === "picking"
                ? "linear-gradient(135deg,#FF6EB4,#C44B8A)"
                : "#DDD",
              color:"white", border:"none", borderRadius:22,
              padding:"14px 34px", fontSize:22, fontWeight:900,
              cursor: selected.length === 2 && phase === "picking" ? "pointer" : "default",
              boxShadow: selected.length === 2 && phase === "picking"
                ? "0 5px 20px rgba(196,75,138,.45)" : "none",
              fontFamily:font,
              transform: selected.length === 2 && phase === "picking" ? "scale(1)" : "scale(.9)",
            }}
          >
            ✨ Mix!
          </button>

          {/* Discovered recipes */}
          {discovered.length > 0 && (
            <div style={{
              background:"white", borderRadius:18, padding:"10px 14px",
              width:"100%", boxShadow:"0 2px 12px rgba(0,0,0,.08)",
            }}>
              <div style={{fontSize:12, fontWeight:900, color:"#9B59B6", marginBottom:6}}>
                📖 Recipes found: {discovered.length} / {RECIPES.length}
              </div>
              <div style={{display:"flex", flexWrap:"wrap", gap:6}}>
                {discovered.map(name => {
                  const r = RECIPES.find(r => r.result.name === name);
                  return (
                    <span key={name} style={{
                      background:"#FFF0F7", border:"2px solid #FFB3D1",
                      borderRadius:10, padding:"3px 9px",
                      fontSize:13, fontWeight:800, color:"#C44B8A",
                    }}>
                      {r?.result.emoji} {name}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* INGREDIENT SHELF */}
      <div style={{
        background:"white", borderRadius:24, padding:"14px 18px",
        boxShadow:"0 4px 20px rgba(196,75,138,.12)",
        width:"100%", maxWidth:680,
      }}>
        <div style={{fontWeight:900, color:"#C44B8A", marginBottom:10, fontSize:15}}>
          🧺 Ingredient Shelf
        </div>
        <div style={{display:"flex", flexWrap:"wrap", gap:10, justifyContent:"center"}}>
          {INGREDIENTS.map(ing => {
            const isSel = selected.includes(ing.id);
            const isDisabled = !isSel && selected.length >= 2;
            return (
              <button
                key={ing.id}
                className="ing"
                onClick={() => pickIngredient(ing.id)}
                disabled={isDisabled || phase !== "picking"}
                style={{
                  background: isSel
                    ? "linear-gradient(135deg,#FFB3D1,#FF6EB4)"
                    : "#FFF5FB",
                  border:`3px solid ${isSel ? "#C44B8A" : "#FFD4EA"}`,
                  borderRadius:18, padding:"10px 14px",
                  cursor: isDisabled || phase !== "picking" ? "default" : "pointer",
                  display:"flex", flexDirection:"column", alignItems:"center", gap:3,
                  opacity: isDisabled ? .35 : 1,
                  transform: isSel ? "scale(1.08)" : "scale(1)",
                  boxShadow: isSel ? "0 4px 14px rgba(196,75,138,.38)" : "0 2px 6px rgba(0,0,0,.05)",
                  fontFamily:font, minWidth:72, transition:"all .15s",
                }}
              >
                <span style={{fontSize:34}}>{ing.emoji}</span>
                <span style={{fontSize:12, fontWeight:900, color: isSel ? "white" : "#C44B8A"}}>
                  {ing.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* FOOTER */}
      <div style={{marginTop:14, fontSize:13, color:"#B39DDB", fontWeight:700}}>
        Mix 2 ingredients to make a treat for the animal! 🍪🧁🍩✨
      </div>
    </div>
  );
}
