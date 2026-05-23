export const CRYSTALS = [
  { id: "amethyst",    name: "Amethyst",    color: "#9B59B6", gradient: "linear-gradient(135deg, #9B59B6, #6C3483)", emoji: "💜", glow: "rgba(155, 89, 182, 0.6)" },
  { id: "rose_quartz", name: "Rose Quartz", color: "#F1948A", gradient: "linear-gradient(135deg, #F1948A, #E74C8B)", emoji: "💗", glow: "rgba(241, 148, 138, 0.6)" },
  { id: "citrine",     name: "Citrine",     color: "#F4D03F", gradient: "linear-gradient(135deg, #F4D03F, #F39C12)", emoji: "💛", glow: "rgba(244, 208, 63, 0.6)" },
  { id: "emerald",     name: "Emerald",     color: "#2ECC71", gradient: "linear-gradient(135deg, #2ECC71, #1ABC9C)", emoji: "💚", glow: "rgba(46, 204, 113, 0.6)" },
  { id: "sapphire",    name: "Sapphire",    color: "#3498DB", gradient: "linear-gradient(135deg, #3498DB, #2471A3)", emoji: "💙", glow: "rgba(52, 152, 219, 0.6)" },
  { id: "ruby",        name: "Ruby",        color: "#E74C3C", gradient: "linear-gradient(135deg, #E74C3C, #922B21)", emoji: "❤️", glow: "rgba(231, 76, 60, 0.6)" },
  { id: "opal",        name: "Opal",        color: "#ECF0F1", gradient: "linear-gradient(135deg, #ECF0F1, #BDC3C7, #AED6F1, #F9E79F)", emoji: "🤍", glow: "rgba(236, 240, 241, 0.8)" },
  { id: "topaz",       name: "Topaz",       color: "#E67E22", gradient: "linear-gradient(135deg, #E67E22, #D35400)", emoji: "🧡", glow: "rgba(230, 126, 34, 0.6)" },
  { id: "aquamarine",  name: "Aquamarine",  color: "#76D7C4", gradient: "linear-gradient(135deg, #76D7C4, #48C9B0)", emoji: "💎", glow: "rgba(118, 215, 196, 0.6)" },
  { id: "diamond",     name: "Diamond",     color: "#D6EAF8", gradient: "linear-gradient(135deg, #D6EAF8, #AED6F1, #FFFFFF)", emoji: "✨", glow: "rgba(214, 234, 248, 0.9)" },
];

export function getRandomCrystal() {
  return CRYSTALS[Math.floor(Math.random() * CRYSTALS.length)];
}

export function loadCollection() {
  try {
    const data = localStorage.getItem("magic-kitchen-crystals");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveCollection(collection) {
  localStorage.setItem("magic-kitchen-crystals", JSON.stringify(collection));
}

export function addCrystalToCollection(crystal) {
  const collection = loadCollection();
  collection.push({ ...crystal, wonAt: Date.now() });
  saveCollection(collection);
  return collection;
}
