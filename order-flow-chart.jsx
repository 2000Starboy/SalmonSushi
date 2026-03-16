import { useState } from "react";

// ── Color palette ─────────────────────────────────────────────────────────────
const C = {
  orange:    { bg: "bg-orange-500",    border: "border-orange-500",    text: "text-orange-500",    light: "bg-orange-50",    lightBorder: "border-orange-200"    },
  green:     { bg: "bg-green-500",     border: "border-green-500",     text: "text-green-500",     light: "bg-green-50",     lightBorder: "border-green-200"     },
  blue:      { bg: "bg-blue-500",      border: "border-blue-500",      text: "text-blue-500",      light: "bg-blue-50",      lightBorder: "border-blue-200"      },
  purple:    { bg: "bg-purple-500",    border: "border-purple-500",    text: "text-purple-500",    light: "bg-purple-50",    lightBorder: "border-purple-200"    },
  red:       { bg: "bg-red-500",       border: "border-red-500",       text: "text-red-500",       light: "bg-red-50",       lightBorder: "border-red-200"       },
  gray:      { bg: "bg-gray-400",      border: "border-gray-300",      text: "text-gray-500",      light: "bg-gray-50",      lightBorder: "border-gray-200"      },
  amber:     { bg: "bg-amber-500",     border: "border-amber-400",     text: "text-amber-500",     light: "bg-amber-50",     lightBorder: "border-amber-200"     },
};

// ── Small building blocks ─────────────────────────────────────────────────────
const Node = ({ label, sub, color = C.gray, icon, pill, className = "" }) => (
  <div className={`relative flex flex-col items-center text-center px-3 py-2.5 rounded-xl border-2 shadow-sm ${color.light} ${color.lightBorder} ${className}`} style={{ minWidth: 120 }}>
    {pill && <span className={`absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full text-white ${color.bg}`}>{pill}</span>}
    <span className="text-lg leading-none mb-0.5">{icon}</span>
    <span className={`text-xs font-bold ${color.text}`}>{label}</span>
    {sub && <span className="text-[9px] text-gray-400 mt-0.5 leading-tight">{sub}</span>}
  </div>
);

const BugNode = ({ label }) => (
  <div className="flex items-center space-x-1 px-2 py-1 bg-red-50 border border-red-200 rounded-lg">
    <span className="text-red-500 text-xs">⚠️</span>
    <span className="text-[9px] text-red-500 font-semibold">{label}</span>
  </div>
);

const GoodNode = ({ label }) => (
  <div className="flex items-center space-x-1 px-2 py-1 bg-green-50 border border-green-200 rounded-lg">
    <span className="text-green-500 text-xs">✅</span>
    <span className="text-[9px] text-green-600 font-semibold">{label}</span>
  </div>
);

const Arrow = ({ label, color = "border-gray-300", vertical = true }) =>
  vertical ? (
    <div className="flex flex-col items-center py-0.5">
      <div className={`w-px h-5 border-l-2 ${color}`} />
      <div className={`w-0 h-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent ${color.replace("border-", "border-t-")}`}
        style={{ borderTopWidth: 6, borderLeftWidth: 4, borderRightWidth: 4, borderLeftColor: "transparent", borderRightColor: "transparent", borderTopColor: color.includes("orange") ? "#f97316" : color.includes("green") ? "#22c55e" : color.includes("blue") ? "#3b82f6" : color.includes("red") ? "#ef4444" : "#9ca3af" }}
      />
      {label && <span className="text-[8px] text-gray-400 mt-0.5">{label}</span>}
    </div>
  ) : null;

const SectionTitle = ({ children, accent }) => (
  <div className={`text-center text-sm font-black uppercase tracking-widest mb-4 pb-2 border-b-2 ${accent}`}>
    {children}
  </div>
);

const FlowGroup = ({ title, color, children }) => (
  <div className={`p-3 rounded-2xl border-2 ${color.lightBorder} ${color.light}`}>
    <div className={`text-[9px] font-black uppercase tracking-widest mb-2 ${color.text}`}>{title}</div>
    {children}
  </div>
);

// ── Arrow Down SVG (clean) ────────────────────────────────────────────────────
const ArrowDown = ({ color = "#9ca3af", dashed = false }) => (
  <div className="flex justify-center my-1">
    <svg width="16" height="28" viewBox="0 0 16 28">
      <line x1="8" y1="0" x2="8" y2="22" stroke={color} strokeWidth="2" strokeDasharray={dashed ? "4,3" : "none"} />
      <polygon points="0,18 16,18 8,28" fill={color} />
    </svg>
  </div>
);

const ArrowRight2 = ({ color = "#9ca3af" }) => (
  <div className="flex items-center mx-1">
    <svg width="28" height="16" viewBox="0 0 28 16">
      <line x1="0" y1="8" x2="22" y2="8" stroke={color} strokeWidth="2" />
      <polygon points="18,0 18,16 28,8" fill={color} />
    </svg>
  </div>
);

const BranchLine = ({ color = "#9ca3af" }) => (
  <div className="flex justify-center">
    <svg width="300" height="24" viewBox="0 0 300 24">
      <line x1="50" y1="0" x2="50" y2="12" stroke={color} strokeWidth="2" />
      <line x1="150" y1="0" x2="150" y2="12" stroke={color} strokeWidth="2" />
      <line x1="250" y1="0" x2="250" y2="12" stroke={color} strokeWidth="2" />
      <line x1="50" y1="12" x2="250" y2="12" stroke={color} strokeWidth="2" />
    </svg>
  </div>
);

// ── CURRENT FLOW ──────────────────────────────────────────────────────────────
const CurrentFlow = () => (
  <div className="space-y-3">
    <SectionTitle accent="border-red-300 text-red-600">⚡ Flux Actuel — Problèmes Identifiés</SectionTitle>

    {/* Entry points */}
    <FlowGroup title="Points d'entrée" color={C.gray}>
      <div className="grid grid-cols-4 gap-2">
        <Node icon="🏠" label="Hero" sub='"Commander"' color={C.orange} />
        <Node icon="📱" label="Navbar Desktop" sub="Dropdown" color={C.orange} />
        <Node icon="☰" label="Mobile Menu" sub="Hamburger" color={C.orange} />
        <Node icon="🛒" label="Icône Panier" sub="Cart icon" color={C.orange} />
      </div>
    </FlowGroup>

    <ArrowDown color="#f97316" />

    {/* Mode picker */}
    <FlowGroup title="Sélection du Mode" color={C.amber}>
      <div className="text-center text-[10px] text-amber-600 font-semibold mb-2">Modal / Dropdown / Mobile Menu</div>
      <div className="grid grid-cols-3 gap-2">
        <Node icon="🍽️" label="Sur Place" color={C.orange} />
        <Node icon="🥡" label="À Emporter" color={C.green} />
        <Node icon="📦" label="En Ligne" sub="→ sub-options" color={C.blue} />
      </div>
    </FlowGroup>

    <div className="grid grid-cols-3 gap-2 text-center">
      {/* Dine In flow */}
      <div className="flex flex-col items-center space-y-1">
        <ArrowDown color="#f97316" />
        <FlowGroup title="DineInFlow" color={C.orange}>
          <div className="space-y-1 text-[9px]">
            {["Choisir table","Parcourir menu","Panier interne","Caisse","✅ Confirmation"].map((s, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className={`px-2 py-1 rounded-lg text-xs font-semibold w-full text-center ${i===4?"bg-green-100 border border-green-200 text-green-700":"bg-white border border-orange-200 text-orange-700"}`}>{s}</div>
                {i < 4 && <div className="w-px h-2 bg-orange-300" />}
              </div>
            ))}
          </div>
        </FlowGroup>
        <GoodNode label="Flux complet ✓" />
      </div>

      {/* Take Away flow */}
      <div className="flex flex-col items-center space-y-1">
        <ArrowDown color="#22c55e" />
        <FlowGroup title="TakeAwayFlow" color={C.green}>
          <div className="space-y-1 text-[9px]">
            {["Menu interne","Panier privé","Formulaire nom/tel","✅ Confirmation"].map((s, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className={`px-2 py-1 rounded-lg text-xs font-semibold w-full text-center ${i===3?"bg-green-100 border border-green-200 text-green-700":"bg-white border border-green-200 text-green-700"}`}>{s}</div>
                {i < 3 && <div className="w-px h-2 bg-green-300" />}
              </div>
            ))}
          </div>
        </FlowGroup>
        <BugNode label="Panier isolé!" />
        <BugNode label="Pas de sync globale" />
      </div>

      {/* Online */}
      <div className="flex flex-col items-center space-y-1">
        <ArrowDown color="#3b82f6" />
        <FlowGroup title="Commander en Ligne" color={C.blue}>
          <div className="space-y-1">
            <div className="flex items-center space-x-1">
              <div className="px-2 py-1 bg-white border border-blue-200 text-blue-700 rounded-lg text-[9px] font-semibold flex-1 text-center">🌐 Notre site</div>
              <ArrowRight2 color="#3b82f6" />
              <div className="px-2 py-1 bg-blue-100 border border-blue-300 text-blue-700 rounded-lg text-[9px] font-semibold text-center">MenuPage</div>
            </div>
            <div className="flex items-center space-x-1">
              <div className="px-2 py-1 bg-white border border-blue-200 text-blue-700 rounded-lg text-[9px] font-semibold flex-1 text-center">🛵 Glovo</div>
              <ArrowRight2 color="#9ca3af" />
              <div className="px-2 py-1 bg-gray-100 border border-gray-200 text-gray-500 rounded-lg text-[9px] font-semibold text-center">↗ Externe</div>
            </div>
          </div>
        </FlowGroup>
        <BugNode label="Pas de checkout!" />
        <BugNode label="Menu sans mode" />
      </div>
    </div>

    {/* Cart page orphan */}
    <div className="mt-3 p-3 rounded-2xl border-2 border-red-200 bg-red-50">
      <div className="text-[9px] font-black uppercase tracking-widest text-red-500 mb-2">⚠️ CartPage — Rôle Ambigu</div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-[9px] text-gray-500 font-semibold mb-1">État vide → 3 choix</div>
          <div className="space-y-1">
            <div className="px-2 py-1 bg-white border border-orange-200 text-orange-600 rounded-lg text-[9px]">→ DineInFlow (repart de 0)</div>
            <div className="px-2 py-1 bg-white border border-green-200 text-green-600 rounded-lg text-[9px]">→ TakeAwayFlow (repart de 0)</div>
            <div className="px-2 py-1 bg-white border border-blue-200 text-blue-600 rounded-lg text-[9px]">→ MenuPage (sans checkout)</div>
          </div>
        </div>
        <div>
          <div className="text-[9px] text-gray-500 font-semibold mb-1">Avec articles → 2 boutons</div>
          <div className="space-y-1">
            <div className="px-2 py-1 bg-orange-100 border border-orange-200 text-orange-600 rounded-lg text-[9px]">→ DineInFlow (ignore le panier?)</div>
            <div className="px-2 py-1 bg-green-100 border border-green-200 text-green-600 rounded-lg text-[9px]">→ TakeAwayFlow (nouveau panier)</div>
          </div>
          <BugNode label="Les articles sont perdus!" />
        </div>
      </div>
    </div>

    {/* Summary of bugs */}
    <div className="p-3 rounded-xl bg-red-50 border border-red-200 space-y-1">
      <div className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-2">🐛 Problèmes Résumés</div>
      {[
        ["B1", "2 paniers en parallèle (global + TakeAway interne) — désynchronisés"],
        ["B2", "\"En ligne via notre site\" n'a aucune caisse — le client est bloqué"],
        ["B3", "CartPage n'est pas connectée aux flows de checkout"],
        ["B4", "DineInFlow a son propre menu browser — doublon avec MenuPage"],
        ["B5", "Le mode de commande n'est pas mémorisé lors de la navigation"],
      ].map(([id, desc]) => (
        <div key={id} className="flex space-x-2 text-[9px]">
          <span className="font-black text-red-500 flex-shrink-0 w-5">{id}</span>
          <span className="text-red-700">{desc}</span>
        </div>
      ))}
    </div>
  </div>
);

// ── PROPOSED FLOW ─────────────────────────────────────────────────────────────
const ProposedFlow = () => (
  <div className="space-y-3">
    <SectionTitle accent="border-green-400 text-green-700">🚀 Flux Proposé — Architecture Unifiée</SectionTitle>

    {/* Entry */}
    <FlowGroup title="Tous les points d'entrée → même chemin" color={C.green}>
      <div className="grid grid-cols-4 gap-1.5">
        {[["🏠","Hero\n\"Commander\""],["🔽","Navbar\nDropdown"],["☰","Mobile\nMenu"],["🛒","Cart\nIcon"]].map(([icon, label]) => (
          <div key={label} className="flex flex-col items-center px-2 py-2 bg-white border border-green-200 rounded-xl text-center">
            <span className="text-base">{icon}</span>
            <span className="text-[8px] font-bold text-green-700 leading-tight whitespace-pre-line">{label}</span>
          </div>
        ))}
      </div>
    </FlowGroup>

    <ArrowDown color="#22c55e" />

    {/* Step 1: Mode */}
    <div className="relative p-3 rounded-2xl border-2 border-purple-200 bg-purple-50">
      <div className="text-[9px] font-black uppercase tracking-widest text-purple-600 mb-2">Étape 1 — Choisir le Mode (mémorisé en contexte)</div>
      <div className="grid grid-cols-4 gap-2">
        <Node icon="🍽️" label="Sur Place" sub="Dîner" color={C.orange} pill="A" />
        <Node icon="🥡" label="À Emporter" sub="Click & Collect" color={C.green} pill="B" />
        <Node icon="🌐" label="En Ligne" sub="Livraison" color={C.blue} pill="C" />
        <Node icon="🛵" label="Glovo" sub="Lien externe ↗" color={C.gray} pill="D" />
      </div>
      <div className="mt-2 flex items-center space-x-1 px-2 py-1 bg-purple-100 border border-purple-200 rounded-lg">
        <span className="text-purple-500 text-xs">💾</span>
        <span className="text-[9px] text-purple-600 font-semibold">orderMode stocké dans le contexte (state FrontApp) — persiste pendant toute la navigation</span>
      </div>
    </div>

    <div className="grid grid-cols-4 gap-2 text-center">
      {/* A, B, C arrows down */}
      {["#f97316","#22c55e","#3b82f6","#9ca3af"].map((color, i) => (
        <ArrowDown key={i} color={color} dashed={i === 3} />
      ))}
    </div>

    {/* Step 2: Browse / external */}
    <div className="grid grid-cols-4 gap-2">
      <div className="col-span-3">
        <FlowGroup title="Étape 2 — Parcourir le Menu (MenuPage unifié)" color={C.purple}>
          <div className="text-[9px] text-purple-600 mb-2">Modes A, B, C → même MenuPage avec badge de mode affiché</div>
          <div className="flex items-center space-x-2">
            <div className="flex-1 px-2 py-2 bg-white border border-purple-200 rounded-xl text-[9px] text-center font-semibold text-purple-700">
              🔍 Recherche + Filtres
            </div>
            <ArrowRight2 color="#a855f7" />
            <div className="flex-1 px-2 py-2 bg-white border border-purple-200 rounded-xl text-[9px] text-center font-semibold text-purple-700">
              ➕ Ajouter au panier
            </div>
            <ArrowRight2 color="#a855f7" />
            <div className="px-2 py-2 bg-purple-100 border border-purple-300 rounded-xl text-[9px] text-center font-bold text-purple-800">
              🛒 Panier Unifié
            </div>
          </div>
          <div className="mt-2 flex items-center space-x-1 px-2 py-1 bg-green-50 border border-green-200 rounded-lg">
            <span className="text-green-500 text-xs">✅</span>
            <span className="text-[9px] text-green-600 font-semibold">Un seul cart global — synchronisé partout</span>
          </div>
        </FlowGroup>
      </div>
      <div>
        <FlowGroup title="Mode D" color={C.gray}>
          <div className="flex flex-col items-center space-y-1">
            <div className="text-2xl">🛵</div>
            <div className="px-2 py-2 bg-white border border-gray-200 rounded-xl text-[9px] text-center text-gray-600 font-semibold">Ouvre Glovo.com dans un nouvel onglet</div>
            <div className="w-full px-2 py-1 bg-gray-100 border border-gray-200 rounded-lg text-[9px] text-center text-gray-500">↗ Sortie du tunnel</div>
          </div>
        </FlowGroup>
      </div>
    </div>

    <div className="grid grid-cols-4 gap-2">
      <div className="col-span-3">
        <ArrowDown color="#a855f7" />
      </div>
      <div />
    </div>

    {/* Step 3: Cart */}
    <div className="col-span-3">
      <FlowGroup title="Étape 3 — CartPage (Hub Central)" color={C.purple}>
        <div className="text-[9px] text-purple-600 mb-2">Résumé commande + mode affiché + possibilité de changer de mode</div>
        <div className="flex items-center space-x-2 overflow-x-auto">
          <div className="flex-shrink-0 px-3 py-2 bg-white border border-gray-200 rounded-xl text-[9px] text-center font-semibold text-gray-700">📋 Articles + total</div>
          <ArrowRight2 color="#9ca3af" />
          <div className="flex-shrink-0 px-3 py-2 bg-purple-100 border border-purple-200 rounded-xl text-[9px] text-center font-bold text-purple-700">🏷️ Mode: {"{A/B/C}"}</div>
          <ArrowRight2 color="#a855f7" />
          <div className="flex-shrink-0 px-3 py-2 bg-orange-500 text-white rounded-xl text-[9px] text-center font-bold">→ Caisse</div>
        </div>
      </FlowGroup>
    </div>

    <ArrowDown color="#f97316" />

    {/* Step 4: Mode-specific checkout */}
    <div className="p-3 rounded-2xl border-2 border-orange-200 bg-orange-50">
      <div className="text-[9px] font-black uppercase tracking-widest text-orange-600 mb-2">Étape 4 — Caisse Intelligente (mode-aware checkout)</div>
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col space-y-1">
          <div className="px-2 py-1.5 bg-orange-100 border-2 border-orange-300 rounded-xl text-center">
            <div className="text-base">🍽️</div>
            <div className="text-[9px] font-black text-orange-700">Mode A — Sur Place</div>
          </div>
          <div className="px-2 py-1 bg-white border border-orange-200 rounded-lg text-[9px] text-orange-700">Numéro de table</div>
          <div className="px-2 py-1 bg-white border border-orange-200 rounded-lg text-[9px] text-orange-700">Paiement (cash/carte)</div>
          <div className="px-2 py-1 bg-white border border-orange-200 rounded-lg text-[9px] text-orange-700">Pourboire opt.</div>
        </div>
        <div className="flex flex-col space-y-1">
          <div className="px-2 py-1.5 bg-green-100 border-2 border-green-300 rounded-xl text-center">
            <div className="text-base">🥡</div>
            <div className="text-[9px] font-black text-green-700">Mode B — À Emporter</div>
          </div>
          <div className="px-2 py-1 bg-white border border-green-200 rounded-lg text-[9px] text-green-700">Nom + Téléphone</div>
          <div className="px-2 py-1 bg-white border border-green-200 rounded-lg text-[9px] text-green-700">Heure de retrait</div>
          <div className="px-2 py-1 bg-white border border-green-200 rounded-lg text-[9px] text-green-700">Paiement</div>
        </div>
        <div className="flex flex-col space-y-1">
          <div className="px-2 py-1.5 bg-blue-100 border-2 border-blue-300 rounded-xl text-center">
            <div className="text-base">🌐</div>
            <div className="text-[9px] font-black text-blue-700">Mode C — En Ligne</div>
          </div>
          <div className="px-2 py-1 bg-white border border-blue-200 rounded-lg text-[9px] text-blue-700">Nom + Téléphone</div>
          <div className="px-2 py-1 bg-white border border-blue-200 rounded-lg text-[9px] text-blue-700">Adresse livraison</div>
          <div className="px-2 py-1 bg-white border border-blue-200 rounded-lg text-[9px] text-blue-700">Délai estimé</div>
        </div>
      </div>
    </div>

    <ArrowDown color="#22c55e" />

    {/* Step 5: Confirmation */}
    <FlowGroup title="Étape 5 — Confirmation Unifiée" color={C.green}>
      <div className="flex items-center justify-center space-x-4">
        <div className="text-2xl">✅</div>
        <div className="space-y-1 flex-1">
          <div className="px-2 py-1 bg-white border border-green-200 rounded-lg text-[9px] font-semibold text-green-700">Order ID généré — affiché client</div>
          <div className="px-2 py-1 bg-white border border-green-200 rounded-lg text-[9px] font-semibold text-amber-600">⭐ Points fidélité crédités</div>
          <div className="px-2 py-1 bg-white border border-green-200 rounded-lg text-[9px] font-semibold text-purple-600">📊 Commande → Backoffice (avec tag de mode)</div>
        </div>
      </div>
    </FlowGroup>

    {/* Summary of improvements */}
    <div className="p-3 rounded-xl bg-green-50 border border-green-200 space-y-1">
      <div className="text-[10px] font-black text-green-700 uppercase tracking-widest mb-2">💡 Améliorations Clés</div>
      {[
        ["I1", "Un seul panier global — partagé entre tous les modes"],
        ["I2", "Mode mémorisé en contexte dès la sélection"],
        ["I3", "MenuPage unique — plus de doublon avec DineInFlow browser"],
        ["I4", "Caisse unifiée et mode-aware — 1 composant, 3 comportements"],
        ["I5", "\"En ligne via notre site\" a un vrai flow livraison complet"],
        ["I6", "CartPage = hub central — toujours connectée à la caisse"],
      ].map(([id, desc]) => (
        <div key={id} className="flex space-x-2 text-[9px]">
          <span className="font-black text-green-600 flex-shrink-0 w-5">{id}</span>
          <span className="text-green-800">{desc}</span>
        </div>
      ))}
    </div>
  </div>
);

// ── Main App ──────────────────────────────────────────────────────────────────
export default function OrderFlowChart() {
  const [view, setView] = useState("both");

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6 text-center">
        <h1 className="text-2xl font-black text-gray-900 mb-1">🍣 Salmon Sushi — Flux de Commande</h1>
        <p className="text-sm text-gray-500">Architecture actuelle vs. proposition améliorée</p>

        {/* Toggle */}
        <div className="flex items-center justify-center space-x-2 mt-4">
          {[["both","Vue Complète"],["current","Actuel seulement"],["proposed","Proposition seulement"]].map(([v, label]) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${view === v ? "bg-gray-900 text-white shadow-md" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className={`max-w-7xl mx-auto ${view === "both" ? "grid grid-cols-2 gap-6" : "max-w-2xl"}`}>
        {(view === "both" || view === "current") && (
          <div className="bg-white rounded-3xl shadow-lg p-5 border-2 border-red-100">
            <CurrentFlow />
          </div>
        )}
        {(view === "both" || view === "proposed") && (
          <div className="bg-white rounded-3xl shadow-lg p-5 border-2 border-green-100">
            <ProposedFlow />
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="max-w-7xl mx-auto mt-6 p-4 bg-white rounded-2xl shadow border border-gray-200">
        <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">Légende</div>
        <div className="flex flex-wrap gap-4 text-[10px]">
          {[
            ["bg-orange-400","Manger sur Place"],
            ["bg-green-400","À Emporter"],
            ["bg-blue-400","Commander en Ligne"],
            ["bg-gray-400","Glovo / Externe"],
            ["bg-purple-400","Composant Partagé"],
            ["bg-red-400","⚠️ Problème identifié"],
            ["bg-green-500","✅ Amélioration"],
          ].map(([bg, label]) => (
            <div key={label} className="flex items-center space-x-1.5">
              <div className={`w-3 h-3 rounded ${bg}`} />
              <span className="text-gray-600">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
