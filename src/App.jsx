import { useState, useEffect, useRef, useCallback } from "react";

const DIETARY_PROFILES = [
  { id: "low_lectin", label: "Low Lectin" },
  { id: "low_phytic", label: "Low Phytic Acid" },
  { id: "low_oxalate", label: "Low Oxalate" },
  { id: "low_histamine", label: "Low Histamine" },
  { id: "low_salicylate", label: "Low Salicylate" },
  { id: "low_sulphur", label: "Low Sulphur" },
  { id: "low_copper", label: "Low Copper" },
  { id: "low_mercury", label: "Low Mercury" },
  { id: "low_cadmium", label: "Low Cadmium" },
  { id: "low_lead", label: "Low Lead" },
  { id: "nightshade_free", label: "Nightshade Free" },
  { id: "low_nightshade", label: "Low Nightshade" },
  { id: "low_fodmap", label: "Low FODMAP" },
  { id: "moderate_fodmap", label: "Moderate FODMAP" },
  { id: "grain_free", label: "Grain Free" },
  { id: "low_grain", label: "Low Grain" },
  { id: "dairy_free", label: "Dairy Free" },
  { id: "keto", label: "Keto" },
  { id: "aip", label: "AIP (Autoimmune Protocol)" },
  { id: "paleo", label: "Paleo" },
  { id: "whole30", label: "Whole30" },
  { id: "blood_type_a", label: "Blood Type A (Lectin-Aware)" },
  { id: "blood_type_b", label: "Blood Type B (Lectin-Aware)" },
  { id: "blood_type_ab", label: "Blood Type AB (Lectin-Aware)" },
  { id: "blood_type_o", label: "Blood Type O (Lectin-Aware)" },
];

const LANGUAGES = [
  { code: "en-US", label: "English (US)" },
  { code: "en-GB", label: "English (UK)" },
  { code: "fr-FR", label: "French" },
  { code: "es-ES", label: "Spanish" },
  { code: "de-DE", label: "German" },
  { code: "it-IT", label: "Italian" },
  { code: "pt-BR", label: "Portuguese (Brazil)" },
  { code: "ja-JP", label: "Japanese" },
  { code: "zh-CN", label: "Chinese (Mandarin)" },
];

const INGREDIENT_GROUPS = ["fridge", "pantry", "freezer", "produce", "spices"];

const C = {
  bg: "#F7F2F3",
  card: "#fdf9fa",
  primary: "#75424b",
  primaryLight: "#e8d5d8",
  primaryMid: "#a06070",
  cream: "#ede0e2",
  text: "#2d1f22",
  muted: "#9a7a80",
  border: "#dcc8cb",
  onLight: "#2d1f22",
  white: "#ffffff",
  adBg: "#fff8e7",
  adBorder: "#f0d080",
  plusGold: "#b8860b",
};

const AdBanner = ({ slot = "top" }) => (
  <div style={{ background: C.adBg, border: `1px solid ${C.adBorder}`, borderRadius: 10, margin: "8px 16px", padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>Advertisement</div>
      {/* ── Replace the div below with your Google AdSense <ins> tag ── */}
      <div style={{ fontSize: 13, color: "#555", fontStyle: "italic" }}>[ AdSense ad unit — {slot} ]</div>
    </div>
    <div style={{ fontSize: 10, color: C.muted, textAlign: "right", lineHeight: 1.4 }}>
      Go ad-free<br />
      <span style={{ color: C.plusGold, fontWeight: 700 }}>→ Plus</span>
    </div>
  </div>
);

const IHerbBanner = ({ context = "general" }) => {
  // ── Replace YOUR_IHERB_CODE with your actual iHerb referral code ──
  const IHERB_URL = "https://www.iherb.com/?rcode=YOUR_IHERB_CODE";
  const messages = {
    general: { text: "Shop clean supplements & pantry staples", sub: "Trusted by KitchAssist" },
    grocery: { text: "Shop your ingredients on iHerb", sub: "Clean, delivered to your door" },
    swap: { text: "Find dietary-friendly swaps on iHerb", sub: "Vetted for your protocol" },
  };
  const msg = messages[context] || messages.general;
  return (
    <a href={IHERB_URL} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block", margin: "8px 16px" }}>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ fontSize: 22 }}>🌿</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.primary }}>{msg.text}</div>
          <div style={{ fontSize: 11, color: C.muted }}>{msg.sub} · iHerb affiliate</div>
        </div>
        <div style={{ fontSize: 12, color: C.primary, fontWeight: 700 }}>Shop →</div>
      </div>
    </a>
  );
};

const UpgradeBanner = ({ onUpgrade }) => (
  <div style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.primaryMid})`, borderRadius: 14, margin: "8px 16px", padding: "16px", color: C.white, textAlign: "center" }}>
    <div style={{ fontSize: 18, marginBottom: 4 }}>✨ KitchAssist Plus</div>
    <div style={{ fontSize: 13, opacity: 0.9, marginBottom: 12 }}>Go ad-free · Unlock exclusive recipes & chef voices</div>
    <div style={{ display: "flex", gap: 8, justifyContent: "center", alignItems: "center", marginBottom: 10 }}>
      <span style={{ fontSize: 22, fontWeight: 700 }}>$7.99</span>
      <span style={{ fontSize: 13, opacity: 0.8 }}>one-time payment</span>
    </div>
    <button onClick={onUpgrade} style={{ background: C.white, color: C.primary, border: "none", borderRadius: 10, padding: "10px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
      Upgrade to Plus
    </button>
    <div style={{ fontSize: 10, opacity: 0.7, marginTop: 8 }}>One-time · No subscription · No recurring fees</div>
  </div>
);

export default function KitchAssist() {
  const [screen, setScreen] = useState("home");
  const [activeRecipe, setActiveRecipe] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [mode, setMode] = useState("steps");
  const [groceryList, setGroceryList] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [importUrl, setImportUrl] = useState("");
  const [dietaryProfile, setDietaryProfile] = useState([]);
  const [customSwaps, setCustomSwaps] = useState([]);
  const [newSwap, setNewSwap] = useState({ from: "", to: "" });
  const [micOpen, setMicOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiReply, setAiReply] = useState("");
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [language, setLanguage] = useState("en-US");
  const [speechRate, setSpeechRate] = useState(1);
  const [ingredientChunkSize, setIngredientChunkSize] = useState(2);
  const [ingredientOrder, setIngredientOrder] = useState("default");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("recipes");
  const [aiChat, setAiChat] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [isPlus, setIsPlus] = useState(false);
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  useEffect(() => {
    const load = () => { const v = synthRef.current.getVoices(); if (v.length) { setVoices(v); setSelectedVoice(v[0]?.name || null); } };
    load();
    synthRef.current.onvoiceschanged = load;
  }, []);

  const speak = useCallback((text) => {
    synthRef.current.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    const v = voices.find(x => x.name === selectedVoice);
    if (v) utt.voice = v;
    utt.lang = language;
    utt.rate = speechRate;
    synthRef.current.speak(utt);
  }, [voices, selectedVoice, language, speechRate]);

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) { alert("Try Chrome for voice support."); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = language; rec.continuous = micOpen; rec.interimResults = false;
    rec.onresult = (e) => { const t = e.results[e.results.length - 1][0].transcript.trim().toLowerCase(); setTranscript(t); handleVoiceCommand(t); };
    rec.onend = () => { if (micOpen) rec.start(); else setListening(false); };
    rec.start(); recognitionRef.current = rec; setListening(true);
  }, [micOpen, language]);

  const stopListening = () => { recognitionRef.current?.stop(); setListening(false); };

  const handleVoiceCommand = (cmd) => {
    if (cmd.includes("next")) nextStep();
    else if (cmd.includes("back") || cmd.includes("previous")) prevStep();
    else if (cmd.includes("repeat")) repeatStep();
    else if (cmd.includes("start with") && cmd.includes("veggie")) setIngredientOrder("produce");
    else if (cmd.includes("start with") && cmd.includes("fridge")) setIngredientOrder("fridge");
    else if (cmd.includes("start with") && cmd.includes("pantry")) setIngredientOrder("pantry");
    else if (cmd.includes("ingredient")) { setMode("ingredients"); speak("Switching to ingredients mode."); }
    else if (cmd.includes("step")) { setMode("steps"); speak("Switching to steps mode."); }
    else askAI(cmd);
  };

  const nextStep = () => {
    if (!activeRecipe) return;
    if (mode === "steps") { const n = Math.min(currentStep + 1, activeRecipe.steps.length - 1); setCurrentStep(n); speak(activeRecipe.steps[n]); }
    else { const chunks = getIngredientChunks(); const n = Math.min(currentStep + 1, chunks.length - 1); setCurrentStep(n); speak(chunks[n].map(i => `${i.amount} ${i.name}`).join(", ")); }
  };
  const prevStep = () => { const p = Math.max(currentStep - 1, 0); setCurrentStep(p); if (mode === "steps" && activeRecipe) speak(activeRecipe.steps[p]); };
  const repeatStep = () => { if (!activeRecipe) return; if (mode === "steps") speak(activeRecipe.steps[currentStep]); else { const chunks = getIngredientChunks(); speak(chunks[currentStep]?.map(i => `${i.amount} ${i.name}`).join(", ") || ""); } };

  const getIngredientChunks = () => {
    if (!activeRecipe) return [];
    let ings = [...activeRecipe.ingredients];
    if (ingredientOrder !== "default") ings = [...ings.filter(i => i.location === ingredientOrder), ...ings.filter(i => i.location !== ingredientOrder)];
    const chunks = [];
    for (let i = 0; i < ings.length; i += ingredientChunkSize) chunks.push(ings.slice(i, i + ingredientChunkSize));
    return chunks;
  };

  const startRecipe = (recipe) => {
    setActiveRecipe(recipe); setCurrentStep(0); setMode("ingredients"); setScreen("cook");
    speak(`Starting ${recipe.title}. Let's gather your ingredients first.`);
    setTimeout(() => { const c = getIngredientChunks(); if (c[0]) speak(c[0].map(i => `${i.amount} ${i.name}`).join(", ")); }, 2000);
  };

  const addToGrocery = (recipe) => {
    const items = recipe.ingredients.map(i => ({ ...i, recipe: recipe.title, checked: false, id: Math.random() }));
    setGroceryList(prev => [...prev, ...items.filter(ni => !prev.find(p => p.name === ni.name))]);
  };

  const askAI = async (question) => {
    if (!question.trim()) return;
    setLoading(true);
    const dietLabels = dietaryProfile.map(d => DIETARY_PROFILES.find(p => p.id === d)?.label).filter(Boolean).join(", ");
    const swapCtx = customSwaps.length ? `User's custom swaps: ${customSwaps.map(s => `${s.from} → ${s.to}`).join(", ")}.` : "";
    const recCtx = activeRecipe ? `Currently cooking: ${activeRecipe.title}. Step ${currentStep + 1}: ${activeRecipe.steps[currentStep]}.` : "";
    const sys = `You are KitchAssist, a warm, supportive hands-free kitchen companion for people managing executive function challenges or task fatigue. Keep responses SHORT, clear, encouraging. Calm, kind tone — not a textbook. ${dietLabels ? `Dietary needs: ${dietLabels}.` : ""} ${swapCtx} ${recCtx} Always respect the user's dietary profile for substitutions.`;
    try {
      const msgs = [...aiChat, { role: "user", content: question }];
      const res = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: sys, messages: msgs }) });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Sorry, try again!";
      setAiChat([...msgs, { role: "assistant", content: reply }]);
      setAiReply(reply); speak(reply);
    } catch { speak("Connection issue. Please try again."); }
    setLoading(false);
  };

  const importRecipe = async () => {
    if (!importUrl.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: `Extract the recipe from: "${importUrl}". Return ONLY raw JSON: {title, time, serves, tags (array), ingredients (array of {name, amount, location: fridge/pantry/freezer/produce/spices}), steps (array)}. No markdown.` }] }) });
      const data = await res.json();
      const recipe = JSON.parse((data.content?.[0]?.text || "").replace(/```json|```/g, "").trim());
      recipe.id = Date.now();
      setSavedRecipes(prev => [...prev, recipe]);
      setImportUrl(""); speak(`Recipe imported: ${recipe.title}`);
    } catch { speak("Couldn't import. Try pasting recipe text directly."); }
    setLoading(false);
  };

  const handleUpgrade = () => {
    // ── Replace with your Lemon Squeezy or Stripe checkout link ──
    // window.open("https://your-checkout-link.com", "_blank");
    setIsPlus(true);
    speak("Welcome to KitchAssist Plus! Enjoy your ad-free experience.");
  };

  const filteredVoices = voices.filter(v => v.lang.startsWith(language.split("-")[0]));

  const s = {
    app: { fontFamily: "'Segoe UI', sans-serif", background: C.bg, minHeight: "100vh", color: C.text, maxWidth: 480, margin: "0 auto", paddingBottom: 80 },
    header: { background: C.primary, color: C.white, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" },
    title: { fontSize: 26, fontWeight: 600, margin: 0, fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: "0.04em" },
    sub: { fontSize: 11, opacity: 0.8, margin: 0, letterSpacing: "0.06em" },
    card: { background: C.card, borderRadius: 16, padding: 16, margin: "12px 16px", border: `1px solid ${C.border}`, boxShadow: "0 2px 8px rgba(117,66,75,0.06)" },
    btn: (col = C.primary, light = false) => ({ background: col, color: light ? C.onLight : C.white, border: "none", borderRadius: 12, padding: "12px 20px", fontSize: 15, fontWeight: 600, cursor: "pointer", width: "100%" }),
    sBtn: (col = C.primary, light = false) => ({ background: col, color: light ? C.onLight : C.white, border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer" }),
    input: { width: "100%", padding: "10px 12px", borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 14, background: C.bg, boxSizing: "border-box", color: C.text },
    tag: { background: C.cream, color: C.primary, fontSize: 11, padding: "2px 8px", borderRadius: 20, display: "inline-block", margin: "2px", fontWeight: 600 },
    micBtn: (active) => ({ width: 64, height: 64, borderRadius: "50%", border: "none", background: active ? C.primaryLight : C.primary, color: active ? C.onLight : C.white, fontSize: 28, cursor: "pointer", boxShadow: active ? `0 0 0 8px ${C.primaryLight}` : "none", transition: "all 0.3s" }),
    select: { padding: "8px 10px", borderRadius: 8, border: `1px solid ${C.border}`, background: C.bg, fontSize: 13, width: "100%", color: C.text },
    label: { fontSize: 12, color: C.muted, display: "block", marginBottom: 4 },
    stepBox: { background: C.cream, borderRadius: 14, padding: 20, margin: "12px 0", textAlign: "center", fontSize: 17, lineHeight: 1.6 },
    dot: (active, done) => ({ width: active ? 20 : 8, height: 8, borderRadius: 4, background: done ? C.primary : active ? C.primaryMid : C.border, transition: "all 0.3s" }),
  };

  const HomeScreen = () => (
    <div>
      {isPlus && <div style={{ background: C.cream, textAlign: "center", padding: "6px", fontSize: 12, color: C.primary, fontWeight: 600 }}>✨ KitchAssist Plus — Ad-free & loving it</div>}
      {!isPlus && <AdBanner slot="top" />}
      <div style={{ padding: "12px 16px 4px", display: "flex", gap: 8, flexWrap: "wrap" }}>
        {["recipes", "grocery", "chat", "settings"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={tab === t ? s.sBtn(C.primary) : { ...s.sBtn(C.primaryLight, true) }}>
            {t === "grocery" ? "🛒 Grocery" : t === "chat" ? "💬 Ask AI" : t === "settings" ? "⚙️ Settings" : "🍳 Recipes"}
          </button>
        ))}
      </div>

      {tab === "recipes" && (
        <div>
          <div style={s.card}>
            <p style={{ fontSize: 13, color: C.muted, margin: "0 0 8px" }}>Import a recipe by URL or paste text:</p>
            <input style={s.input} value={importUrl} onChange={e => setImportUrl(e.target.value)} placeholder="Paste URL, Pinterest/Instagram link, or recipe text…" />
            <div style={{ height: 8 }} />
            <button style={s.btn()} onClick={importRecipe} disabled={loading}>{loading ? "Importing…" : "Import Recipe"}</button>
          </div>
          {!isPlus && <IHerbBanner context="general" />}
          {!isPlus && <AdBanner slot="mid" />}
          {savedRecipes.length === 0 && (
            <div style={{ ...s.card, textAlign: "center", color: C.muted, fontSize: 14, padding: "32px 20px" }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>🍴</div>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>No recipes yet</div>
              <div>Import a recipe above to get started!</div>
            </div>
          )}
          {savedRecipes.map(r => (
            <div key={r.id} style={s.card}>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{r.title}</div>
              <div style={{ fontSize: 12, color: C.muted }}>{r.time} · Serves {r.serves}</div>
              <div style={{ marginTop: 6 }}>{(r.tags || []).slice(0, 3).map(t => <span key={t} style={s.tag}>{t.replace(/_/g, " ")}</span>)}</div>
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button style={{ ...s.sBtn(C.primary), flex: 1 }} onClick={() => startRecipe(r)}>▶ Start Cooking</button>
                <button style={{ ...s.sBtn(C.primaryLight, true), flex: 1 }} onClick={() => addToGrocery(r)}>🛒 Add to List</button>
              </div>
            </div>
          ))}
          {!isPlus && <UpgradeBanner onUpgrade={handleUpgrade} />}
        </div>
      )}

      {tab === "grocery" && (
        <div>
          <div style={s.card}>
            <h3 style={{ margin: "0 0 12px", fontSize: 17 }}>🛒 Grocery List</h3>
            {groceryList.length === 0 && <p style={{ color: C.muted, fontSize: 14 }}>No items yet. Add from a recipe!</p>}
            {INGREDIENT_GROUPS.map(loc => {
              const items = groceryList.filter(i => i.location === loc);
              if (!items.length) return null;
              return (
                <div key={loc} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.primary, textTransform: "uppercase", marginBottom: 6 }}>{loc}</div>
                  {items.map(item => (
                    <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: `1px solid ${C.border}` }}>
                      <input type="checkbox" checked={item.checked} onChange={() => setGroceryList(prev => prev.map(i => i.id === item.id ? { ...i, checked: !i.checked } : i))} />
                      <span style={{ textDecoration: item.checked ? "line-through" : "none", color: item.checked ? C.muted : C.text, fontSize: 14 }}>{item.amount} {item.name}</span>
                    </div>
                  ))}
                </div>
              );
            })}
            {groceryList.length > 0 && <button style={s.btn()} onClick={() => speak(groceryList.filter(i => !i.checked).map(i => `${i.amount} ${i.name}`).join(", "))}>🔊 Read List Aloud</button>}
          </div>
          {!isPlus && <IHerbBanner context="grocery" />}
          {!isPlus && <AdBanner slot="grocery" />}
          {!isPlus && <UpgradeBanner onUpgrade={handleUpgrade} />}
        </div>
      )}

      {tab === "chat" && (
        <div style={s.card}>
          <h3 style={{ margin: "0 0 12px", fontSize: 17 }}>💬 Ask KitchAssist</h3>
          <div style={{ maxHeight: 260, overflowY: "auto", marginBottom: 12 }}>
            {aiChat.length === 0 && <p style={{ color: C.muted, fontSize: 14 }}>Ask me anything — substitutions, timings, tips!</p>}
            {aiChat.map((m, i) => (
              <div key={i} style={{ marginBottom: 10, textAlign: m.role === "user" ? "right" : "left" }}>
                <div style={{ display: "inline-block", background: m.role === "user" ? C.primary : C.cream, color: m.role === "user" ? C.white : C.text, borderRadius: 12, padding: "8px 12px", fontSize: 14, maxWidth: "80%" }}>{m.content}</div>
              </div>
            ))}
            {loading && <div style={{ color: C.muted, fontSize: 13 }}>Thinking…</div>}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input style={{ ...s.input, flex: 1 }} value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (askAI(chatInput), setChatInput(""))} placeholder="Type or use mic…" />
            <button style={s.sBtn(C.primaryLight, true)} onClick={() => { askAI(chatInput); setChatInput(""); }}>Send</button>
          </div>
          <div style={{ marginTop: 10 }}>
            <button style={s.btn(listening ? C.primaryLight : C.primary, listening)} onClick={listening ? stopListening : startListening}>{listening ? "🔴 Listening…" : "🎙️ Voice Ask"}</button>
          </div>
          {!isPlus && <div style={{ marginTop: 12 }}><AdBanner slot="chat" /></div>}
          {!isPlus && <IHerbBanner context="swap" />}
        </div>
      )}

      {tab === "settings" && (
        <div>
          {isPlus ? (
            <div style={{ ...s.card, textAlign: "center", background: C.cream }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>✨ You're on KitchAssist Plus</div>
              <div style={{ fontSize: 13, color: C.muted }}>Ad-free · Thank you for your support!</div>
            </div>
          ) : (
            <UpgradeBanner onUpgrade={handleUpgrade} />
          )}
          <div style={s.card}>
            <h3 style={{ margin: "0 0 12px", fontSize: 17 }}>🎙️ Voice & Language</h3>
            <label style={s.label}>Language</label>
            <select style={s.select} value={language} onChange={e => { setLanguage(e.target.value); setSelectedVoice(null); }}>
              {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
            </select>
            <div style={{ height: 10 }} />
            <label style={s.label}>Voice</label>
            <select style={s.select} value={selectedVoice || ""} onChange={e => setSelectedVoice(e.target.value)}>
              {(filteredVoices.length ? filteredVoices : voices).map(v => <option key={v.name} value={v.name}>{v.name}</option>)}
            </select>
            <div style={{ height: 10 }} />
            <label style={s.label}>Speech Speed: {speechRate}x</label>
            <input type="range" min="0.5" max="2" step="0.1" value={speechRate} onChange={e => setSpeechRate(Number(e.target.value))} style={{ width: "100%" }} />
            <div style={{ height: 10 }} />
            <label style={s.label}>Ingredients read at once: {ingredientChunkSize}</label>
            <input type="range" min="1" max="4" step="1" value={ingredientChunkSize} onChange={e => setIngredientChunkSize(Number(e.target.value))} style={{ width: "100%" }} />
            <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>Up to 4 ingredients read aloud per step</div>
            <div style={{ height: 10 }} />
            <label style={s.label}>Default ingredient order</label>
            <select style={s.select} value={ingredientOrder} onChange={e => setIngredientOrder(e.target.value)}>
              <option value="default">Default (recipe order)</option>
              {INGREDIENT_GROUPS.map(g => <option key={g} value={g}>Start with {g}</option>)}
            </select>
            <div style={{ height: 10 }} />
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input type="checkbox" id="micopen" checked={micOpen} onChange={e => setMicOpen(e.target.checked)} />
              <label htmlFor="micopen" style={{ fontSize: 14 }}>Always-on mic (hands-free mode)</label>
            </div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>Say "next", "repeat", "back", "start with fridge"…</div>
            <div style={{ height: 8 }} />
            <button style={s.btn()} onClick={() => speak("KitchAssist is ready. Let's cook something wonderful!")}>🔊 Test Voice</button>
          </div>
          <div style={s.card}>
            <h3 style={{ margin: "0 0 12px", fontSize: 17 }}>🥗 Dietary Profile</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {DIETARY_PROFILES.map(p => (
                <button key={p.id} onClick={() => setDietaryProfile(prev => prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id])}
                  style={{ padding: "6px 12px", borderRadius: 20, border: `2px solid ${dietaryProfile.includes(p.id) ? C.primary : C.border}`, background: dietaryProfile.includes(p.id) ? C.primary : C.bg, color: dietaryProfile.includes(p.id) ? C.white : C.text, fontSize: 12, cursor: "pointer", fontWeight: dietaryProfile.includes(p.id) ? 600 : 400 }}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div style={s.card}>
            <h3 style={{ margin: "0 0 12px", fontSize: 17 }}>🔄 My Custom Swaps</h3>
            {customSwaps.map((sw, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: `1px solid ${C.border}`, fontSize: 14 }}>
                <span>{sw.from} → {sw.to}</span>
                <button onClick={() => setCustomSwaps(prev => prev.filter((_, j) => j !== i))} style={{ background: "none", border: "none", color: C.primary, cursor: "pointer", fontSize: 16 }}>✕</button>
              </div>
            ))}
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <input style={{ ...s.input, flex: 1 }} placeholder="Replace…" value={newSwap.from} onChange={e => setNewSwap(p => ({ ...p, from: e.target.value }))} />
              <input style={{ ...s.input, flex: 1 }} placeholder="With…" value={newSwap.to} onChange={e => setNewSwap(p => ({ ...p, to: e.target.value }))} />
            </div>
            <div style={{ height: 8 }} />
            <button style={s.btn()} onClick={() => { if (newSwap.from && newSwap.to) { setCustomSwaps(p => [...p, newSwap]); setNewSwap({ from: "", to: "" }); } }}>Add Swap</button>
          </div>
        </div>
      )}
    </div>
  );

  const CookScreen = () => {
    if (!activeRecipe) return null;
    const chunks = getIngredientChunks();
    const totalItems = mode === "steps" ? activeRecipe.steps.length : chunks.length;
    return (
      <div>
        {!isPlus && <AdBanner slot="cook-top" />}
        <div style={{ ...s.card, textAlign: "center" }}>
          <div style={{ fontSize: 13, color: C.muted, marginBottom: 4 }}>{activeRecipe.title}</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 12 }}>
            <button style={mode === "ingredients" ? s.sBtn(C.primary) : s.sBtn(C.primaryLight, true)} onClick={() => { setMode("ingredients"); setCurrentStep(0); }}>🧂 Ingredients</button>
            <button style={mode === "steps" ? s.sBtn(C.primary) : s.sBtn(C.primaryLight, true)} onClick={() => { setMode("steps"); setCurrentStep(0); }}>👨‍🍳 Steps</button>
          </div>
          <div style={{ display: "flex", gap: 4, justifyContent: "center", margin: "8px 0" }}>
            {Array.from({ length: totalItems }).map((_, i) => <div key={i} style={s.dot(i === currentStep, i < currentStep)} />)}
          </div>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>{mode === "steps" ? "Step" : "Ingredients"} {currentStep + 1} of {totalItems}</div>
          <div style={s.stepBox}>
            {mode === "steps" ? activeRecipe.steps[currentStep]
              : chunks[currentStep]?.map((ing, i) => (
                <div key={i} style={{ padding: "4px 0", borderBottom: i < chunks[currentStep].length - 1 ? `1px solid ${C.border}` : "none" }}>
                  <strong>{ing.amount}</strong> {ing.name} <span style={{ fontSize: 11, color: C.muted }}>({ing.location})</span>
                </div>
              ))}
          </div>
          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            <button style={{ ...s.sBtn(C.primaryLight, true), flex: 1 }} onClick={prevStep}>◀ Back</button>
            <button style={{ ...s.sBtn(C.primary), flex: 1 }} onClick={repeatStep}>🔊 Repeat</button>
            <button style={{ ...s.sBtn(C.primary), flex: 1 }} onClick={nextStep}>Next ▶</button>
          </div>
          <button style={s.micBtn(listening)} onClick={listening ? stopListening : startListening}>{listening ? "🔴" : "🎙️"}</button>
          {listening && <div style={{ fontSize: 12, color: C.primary, marginTop: 6 }}>{micOpen ? "Always-on mic active" : "Listening…"} {transcript && `· "${transcript}"`}</div>}
          {aiReply && <div style={{ background: C.cream, borderRadius: 10, padding: 10, marginTop: 10, fontSize: 13, textAlign: "left", color: C.text }}><strong>KitchAssist:</strong> {aiReply}</div>}
        </div>
        <div style={s.card}>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>Voice: "next", "back", "repeat", "start with fridge"</div>
          <div style={{ display: "flex", gap: 8 }}>
            <input style={{ ...s.input, flex: 1 }} value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (askAI(chatInput), setChatInput(""))} placeholder="Ask anything mid-cook…" />
            <button style={s.sBtn(C.primaryLight, true)} onClick={() => { askAI(chatInput); setChatInput(""); }}>Ask</button>
          </div>
        </div>
        {!isPlus && <IHerbBanner context="swap" />}
        {!isPlus && <AdBanner slot="cook-bottom" />}
        <div style={{ padding: "0 16px 16px" }}>
          <button style={s.btn(C.muted)} onClick={() => { setScreen("home"); setActiveRecipe(null); synthRef.current.cancel(); stopListening(); }}>← Back to Recipes</button>
        </div>
      </div>
    );
  };

  return (
    <div style={s.app}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&display=swap" rel="stylesheet" />
      <div style={s.header}>
        <div>
          <p style={s.title}>KitchAssist</p>
          <p style={s.sub}>A Voice-Guided Cooking App</p>
        </div>
        <div style={{ textAlign: "right", fontSize: 11, opacity: 0.8 }}>
          {isPlus && <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 8, padding: "2px 8px", marginBottom: 2 }}>✨ Plus</div>}
          {dietaryProfile.length > 0 && <div>{dietaryProfile.length} filters</div>}
          {!isPlus && <button onClick={() => { setTab("settings"); setScreen("home"); }} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: C.white, fontSize: 10, padding: "3px 8px", borderRadius: 8, cursor: "pointer", marginTop: 2 }}>Upgrade →</button>}
        </div>
      </div>
      {screen === "home" ? <HomeScreen /> : <CookScreen />}
    </div>
  );
}
