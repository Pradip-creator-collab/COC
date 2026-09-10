// ======================================================================
// Firebase config — this is the one place to update it if it ever changes.
// ======================================================================
const firebaseConfig = {
  apiKey: "AIzaSyBK_vqB5BsErSLjI2At4BikstHKjjyXMuI",
  authDomain: "clash-of-clans-bot-6da4b.firebaseapp.com",
  projectId: "clash-of-clans-bot-6da4b",
  storageBucket: "clash-of-clans-bot-6da4b.firebasestorage.app",
  messagingSenderId: "1063531941080",
  appId: "1:1063531941080:web:e304d081b783b1e01e1bad",
};
firebase.initializeApp(firebaseConfig);
window.__auth = firebase.auth();
window.__db = firebase.firestore();
// Session-only persistence: closing the browser/tab clears the login,
// so returning later requires signing in again.
window.__auth.setPersistence(firebase.auth.Auth.Persistence.SESSION).catch(function (e) {
  console.error("Auth persistence error:", e);
});

// ======================================================================
// Shared game data — edit here and it applies to every page.
// ======================================================================
const BUILDER_CATEGORIES = ["buildings", "buildings2", "traps", "traps2"];

const CATEGORY_MAP = {
  buildings: { label: "Building", color: "#5FB0E0" },
  buildings2: { label: "Building (Builder Base)", color: "#5FB0E0" },
  traps: { label: "Trap", color: "#B44B4B" },
  traps2: { label: "Trap (Builder Base)", color: "#B44B4B" },
  heroes: { label: "Hero", color: "#9ED4F0" },
  heroes2: { label: "Hero (Builder Base)", color: "#9ED4F0" },
  units: { label: "Troop (Lab)", color: "#E08A8A" },
  units2: { label: "Troop (Builder Base Lab)", color: "#E08A8A" },
  spells: { label: "Spell (Lab)", color: "#E08A8A" },
  pets: { label: "Pet House", color: "#B44B4B" },
  siege_machines: { label: "Siege Workshop", color: "#5FB0E0" },
  guardians: { label: "Guardian", color: "#9ED4F0" },
};

// Built-in fallback names for known internal IDs (from a verified code->name list).
// A per-item custom name in nameMap always takes priority over this.
const DEFAULT_NAMES = {
  "1000000": "Army Camp", "1000001": "Town Hall", "1000002": "Elixir Collector",
  "1000003": "Elixir Storage", "1000004": "Gold Mine", "1000005": "Gold Storage",
  "1000006": "Barracks", "1000007": "Laboratory", "1000009": "Archer Tower",
  "1000010": "Wall", "1000011": "Wizard Tower", "1000012": "Air Defense",
  "1000013": "Mortar", "1000014": "Clan Castle", "1000015": "Builder's Hut",
  "1000019": "Hidden Tesla", "1000020": "Spell Factory", "1000021": "X-Bow",
  "1000023": "Dark Elixir Drill", "1000024": "Dark Elixir Storage", "1000026": "Dark Barracks",
  "1000027": "Inferno Tower", "1000028": "Air Sweeper", "1000029": "Dark Spell Factory",
  "1000032": "Bomb Tower", "1000033": "Wall (Builder Base)", "1000034": "Builder Hall",
  "1000035": "Elixir Collector (Builder Base)", "1000036": "Elixir Storage (Builder Base)",
  "1000037": "Gold Mine (Builder Base)", "1000038": "Gold Storage (Builder Base)",
  "1000039": "Clock Tower", "1000040": "Builder Barracks", "1000041": "Double Cannon",
  "1000042": "Army Camp (Builder Base)", "1000043": "Hidden Tesla (Builder Base)",
  "1000044": "Cannon (Builder Base)", "1000045": "Multi Mortar", "1000046": "Star Laboratory",
  "1000048": "Archer Tower (Builder Base)", "1000049": "Reinforcement Camp",
  "1000050": "Firecrackers", "1000051": "Guard Post", "1000052": "Mega Tesla",
  "1000053": "Battle Machine Altar", "1000054": "Air Bombs (Builder Base)", "1000055": "Crusher",
  "1000056": "Roaster", "1000057": "Giant Cannon", "1000058": "Gem Mine", "1000059": "Workshop",
  "1000063": "Lava Launcher", "1000064": "B.O.B's Hut", "1000065": "B.O.B Control",
  "1000067": "Scattershot", "1000068": "Pet House", "1000070": "Blacksmith",
  "1000071": "Hero Hall", "1000072": "Spell Tower", "1000077": "Monolith",
  "1000078": "O.T.T.O's Outpost", "1000079": "Multi-Gear Tower", "1000080": "Battle Copter Altar",
  "1000081": "X-Bow (Builder Base)", "1000082": "Healing Hut", "1000084": "Multi-Archer Tower",
  "1000085": "Ricochet Cannon", "1000086": "Revenge Tower", "1000089": "Firespitter",
  "1000093": "Helper Hut", "1000097": "Crafting Station", "1000102": "Super Wizard Tower",
  "4000000": "Barbarian", "4000001": "Archer", "4000002": "Goblin", "4000003": "Giant",
  "4000004": "Wall Breaker", "4000005": "Balloon", "4000006": "Wizard", "4000007": "Healer",
  "4000008": "Dragon", "4000009": "P.E.K.K.A", "4000010": "Minion", "4000011": "Hog Rider",
  "4000012": "Valkyrie", "4000013": "Golem", "4000015": "Witch", "4000017": "Lava Hound",
  "4000022": "Bowler", "4000023": "Baby Dragon", "4000024": "Miner",
  "4000031": "Raged Barbarian", "4000032": "Sneaky Archer", "4000033": "Beta Minion",
  "4000034": "Boxer Giant", "4000035": "Bomber", "4000036": "Power P.E.K.K.A",
  "4000037": "Cannon Cart", "4000038": "Drop Ship", "4000041": "Baby Dragon (Builder Base)",
  "4000042": "Night Witch", "4000051": "Wall Wrecker", "4000052": "Battle Blimp",
  "4000053": "Yeti", "4000058": "Ice Golem", "4000059": "Electro Dragon",
  "4000062": "Stone Slammer", "4000065": "Dragon Rider", "4000070": "Hog Glider",
  "4000075": "Siege Barracks", "4000082": "Headhunter", "4000087": "Log Launcher",
  "4000091": "Flame Flinger", "4000092": "Battle Drill", "4000095": "Electro Titan",
  "4000097": "Apprentice Warden", "4000106": "Electrofire Wizard", "4000109": "Ruin Witch",
  "4000110": "Root Rider", "4000123": "Druid", "4000132": "Thrower",
  "4000135": "Troop Launcher", "4000150": "Furnace", "4000177": "Meteor Golem",
  "4000188": "Sky Wagon",
  "12000000": "Bomb", "12000001": "Spring Trap", "12000002": "Giant Bomb",
  "12000005": "Air Bomb", "12000006": "Seeking Air Mine", "12000008": "Skeleton Trap",
  "12000010": "Spring Trap (Builder Base)", "12000011": "Push Trap", "12000013": "Mine",
  "12000014": "Mega Mine", "12000016": "Tornado Trap", "12000020": "Giga Bomb",
  "26000000": "Lightning Spell", "26000001": "Healing Spell", "26000002": "Rage Spell",
  "26000003": "Jump Spell", "26000005": "Freeze Spell", "26000009": "Poison Spell",
  "26000010": "Earthquake Spell", "26000011": "Haste Spell", "26000016": "Clone Spell",
  "26000017": "Skeleton Spell", "26000028": "Bat Spell", "26000035": "Invisibility Spell",
  "26000053": "Recall Spell", "26000070": "Overgrowth Spell", "26000098": "Revive Spell",
  "26000109": "Ice Block Spell", "26000120": "Totem Spell",
  "28000000": "Barbarian King", "28000001": "Archer Queen", "28000002": "Grand Warden",
  "28000004": "Royal Champion", "28000006": "Minion Prince", "28000007": "Dragon Duke",
  "73000000": "L.A.S.S.I", "73000001": "Mighty Yak", "73000002": "Electro Owl",
  "73000003": "Unicorn", "73000004": "Phoenix", "73000007": "Poison Lizard",
  "73000008": "Diggy", "73000009": "Frosty", "73000010": "Spirit Fox",
  "73000011": "Angry Jelly", "73000016": "Sneezy", "73000017": "Greedy Raven",
  "90000000": "Barbarian Puppet", "90000001": "Rage Vial", "90000002": "Archer Puppet",
  "90000003": "Invisibility Vial", "90000004": "Giant Gauntlet", "90000008": "Earthquake Boots",
  "90000010": "Giant Gauntlet", "90000011": "Vampstache", "90000015": "Frozen Arrow",
  "90000040": "Electro Boots", "90000043": "Dark Orb", "90000048": "Action Figure",
  "90000052": "Fire Heart",
  "93000000": "Builder's Apprentice", "93000001": "Lab Assistant",
  "102000033": "Hot Candle - HP", "102000034": "Hot Candle - DPS", "102000035": "Hot Candle - TSA",
  "102000036": "Hero Hunter Hitpoints", "102000037": "Hero Hunter DPS", "102000038": "Hero Hunter PSL",
  "102000039": "Cake-A-Pult Hitpoints", "102000040": "Cake-A-Pult DPH", "102000041": "Cake-A-Pult ED",
  "103000011": "Hot Candle", "103000013": "Cake-A-Pult", "105000012": "Hero Hunter",
  "107000000": "Longshot", "107000001": "Smasher", "107000008": "Logger",
};

// ======================================================================
// Shared helper functions
// ======================================================================
function usernameToEmail(username) {
  return `${username.trim().toLowerCase().replace(/[^a-z0-9_.-]/g, "")}@coc-tracker.local`;
}

function formatRemaining(ms) {
  if (ms <= 0) return "Ready";
  const totalSec = Math.floor(ms / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;
  if (days > 0) return `${days}d ${hours}h ${mins}m`;
  if (hours > 0) return `${hours}h ${mins}m ${secs}s`;
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
}

function formatClockTime(ms) {
  return new Date(ms).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

function parseVillageJSON(raw) {
  const parsed = JSON.parse(raw);
  if (typeof parsed.timestamp !== "number") throw new Error("no timestamp");
  const items = [];
  Object.keys(CATEGORY_MAP).forEach((key) => {
    const arr = parsed[key];
    if (!Array.isArray(arr)) return;
    arr.forEach((entry) => {
      if (typeof entry.timer === "number") {
        items.push({
          category: key, id: entry.data, lvl: entry.lvl, timerSec: entry.timer,
          completionMs: (parsed.timestamp + entry.timer) * 1000,
          recurrent: !!entry.helper_recurrent,
        });
      }
    });
  });
  let clockTowerReadyMs = null;
  if (parsed.boosts && typeof parsed.boosts.clocktower_cooldown === "number") {
    clockTowerReadyMs = (parsed.timestamp + parsed.boosts.clocktower_cooldown) * 1000;
  }
  return { importedAt: Date.now(), items, clockTowerReadyMs, tag: parsed.tag || "" };
}
