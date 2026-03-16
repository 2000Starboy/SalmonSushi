import React, { useState } from 'react';

/* ─── Design tokens ─────────────────────────────────────────────────────────── */
const NAVY  = '#0a1628';
const BLUE  = '#1565c0';
const ICE   = '#4fc3f7';
const GREEN = '#22c55e';
const AMBER = '#f59e0b';
const CORAL = '#e74c3c';
const PURP  = '#a855f7';
const WHITE = '#f0f8ff';

/* ─── Reusable atoms ────────────────────────────────────────────────────────── */
const Tag = ({ color, children }) => (
  <span style={{ background: color + '22', border: `1px solid ${color}55`, color, borderRadius: 999, padding: '2px 10px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>
    {children}
  </span>
);

const Card = ({ title, icon, color = ICE, children, badge }) => (
  <div style={{ background: '#0d1b2a', border: `1px solid ${color}30`, borderRadius: 16, padding: '16px 18px', marginBottom: 12 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
      <span style={{ fontSize: 20 }}>{icon}</span>
      <span style={{ color: WHITE, fontWeight: 800, fontSize: 14, flex: 1 }}>{title}</span>
      {badge && <Tag color={badge === 'NEW' ? GREEN : badge === 'CHANGED' ? ICE : badge === 'VALIDATED' ? GREEN : AMBER}>{badge}</Tag>}
    </div>
    {children}
  </div>
);

const Row = ({ children, gap = 10 }) => (
  <div style={{ display: 'flex', gap, flexWrap: 'wrap', marginBottom: 8 }}>{children}</div>
);

const Pill = ({ emoji, label, sub, color = ICE }) => (
  <div style={{ background: color + '15', border: `1px solid ${color}40`, borderRadius: 12, padding: '10px 14px', flex: 1, minWidth: 120 }}>
    <div style={{ fontSize: 18, marginBottom: 4 }}>{emoji}</div>
    <div style={{ color: WHITE, fontWeight: 700, fontSize: 12 }}>{label}</div>
    {sub && <div style={{ color: '#94a3b8', fontSize: 11, marginTop: 2 }}>{sub}</div>}
  </div>
);

const Step = ({ n, label, sub, color = ICE, extra }) => (
  <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
    <div style={{ width: 28, height: 28, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: NAVY, flexShrink: 0, marginTop: 1 }}>{n}</div>
    <div style={{ flex: 1 }}>
      <div style={{ color: WHITE, fontWeight: 700, fontSize: 13 }}>{label}</div>
      {sub && <div style={{ color: '#94a3b8', fontSize: 12, marginTop: 2 }}>{sub}</div>}
      {extra}
    </div>
  </div>
);

const SubOption = ({ emoji, label, sub, color }) => (
  <div style={{ background: color + '10', border: `1px solid ${color}30`, borderRadius: 10, padding: '8px 12px', marginTop: 6 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 16 }}>{emoji}</span>
      <div>
        <div style={{ color: WHITE, fontWeight: 700, fontSize: 12 }}>{label}</div>
        {sub && <div style={{ color: '#94a3b8', fontSize: 11 }}>{sub}</div>}
      </div>
    </div>
  </div>
);

const Idea = ({ emoji, text, type = 'idea' }) => (
  <div style={{
    display: 'flex', gap: 8, alignItems: 'flex-start',
    background: type === 'add' ? GREEN + '10' : type === 'warn' ? AMBER + '10' : PURP + '10',
    border: `1px solid ${type === 'add' ? GREEN : type === 'warn' ? AMBER : PURP}30`,
    borderRadius: 10, padding: '8px 12px', marginBottom: 8
  }}>
    <span style={{ fontSize: 15, flexShrink: 0 }}>{emoji}</span>
    <span style={{ color: '#cbd5e1', fontSize: 12, lineHeight: 1.5 }}>{text}</span>
  </div>
);

const Divider = ({ label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '16px 0 10px' }}>
    <div style={{ flex: 1, height: 1, background: '#1e3a5f' }} />
    <span style={{ color: '#4fc3f7', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</span>
    <div style={{ flex: 1, height: 1, background: '#1e3a5f' }} />
  </div>
);

/* ─── Main component ────────────────────────────────────────────────────────── */
export default function AsakaSchema() {
  const [tab, setTab] = useState('order');

  const tabs = [
    { id: 'order',    label: '🛒 Flux Commande', validated: true },
    { id: 'overview', label: '🗺 Vue Globale' },
    { id: 'design',   label: '🎨 Design' },
    { id: 'pending',  label: '📋 À Valider' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: NAVY, fontFamily: 'Inter, system-ui, sans-serif', color: WHITE, paddingBottom: 60 }}>

      {/* ── Header ── */}
      <div style={{ background: '#060d18', borderBottom: '1px solid #1e3a5f', padding: '18px 20px 14px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 42, height: 42, borderRadius: '50%', background: `linear-gradient(135deg, ${BLUE}, ${ICE})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🍱</div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 18 }}>
                <span style={{ color: ICE }}>Asaka</span><span style={{ color: WHITE }}> Sushi</span>
                <span style={{ color: '#475569', fontWeight: 400, fontSize: 13 }}> — Plan de refonte</span>
              </div>
              <div style={{ color: '#475569', fontSize: 11 }}>Validez section par section avant implémentation</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                background: tab === t.id ? BLUE : 'transparent',
                border: `1px solid ${tab === t.id ? BLUE : '#1e3a5f'}`,
                color: tab === t.id ? WHITE : '#64748b',
                borderRadius: 999, padding: '5px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 5,
              }}>
                {t.label}
                {t.validated && <span style={{ background: GREEN, color: '#052e16', borderRadius: 999, fontSize: 9, fontWeight: 900, padding: '1px 6px' }}>✓ VALIDÉ</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '20px 14px 0' }}>

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* ORDER FLOW TAB — VALIDATED BY CLIENT                              */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {tab === 'order' && (
          <div>
            {/* Validation banner */}
            <div style={{ background: GREEN + '15', border: `1px solid ${GREEN}40`, borderRadius: 14, padding: '12px 16px', marginBottom: 20, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 20 }}>✅</span>
              <div>
                <div style={{ color: GREEN, fontWeight: 800, fontSize: 13 }}>Flux validé par le client</div>
                <div style={{ color: '#86efac', fontSize: 12, marginTop: 2 }}>
                  Le schéma ci-dessous intègre votre description exacte + mes suggestions d'amélioration (en violet).
                </div>
              </div>
            </div>

            {/* ── ENTRY POINT ── */}
            <Card title="Étape 0 — Entrée sur le site" icon="🏠" color={ICE}>
              <div style={{ color: '#94a3b8', fontSize: 12, marginBottom: 10 }}>
                Le client arrive et voit <strong style={{ color: WHITE }}>immédiatement</strong> les 2 options de commande en hero — avant même de scroller.
              </div>
              <Row>
                <Pill emoji="🥡" label="À Emporter" sub="Click & Collect" color={GREEN} />
                <Pill emoji="🛵" label="Livraison" sub="À domicile" color={ICE} />
              </Row>
              <Idea emoji="💡" text="Idée : Afficher sous ces 2 boutons → 'Ouvert jusqu'à 23h · ~20 min de préparation' pour rassurer le client dès l'entrée." />
            </Card>

            {/* ── BROWSE ── */}
            <Card title="Étape 1 — Découvrir le restaurant & le menu" icon="🍣" color={ICE}>
              <Step n="A" label="Section 'Qui sommes-nous ?' (courte)" sub="Photo, nom, tagline — pas de longue histoire. 3 lignes max." color={ICE} />
              <Step n="B" label="Menu par catégories" sub="Rolls · Sashimi · Chirashi · Spécialités · Boissons — tabs scrollables" color={ICE} />
              <Step n="C" label="Ajouter au panier" sub="Bouton + direct sur la carte, pas besoin de changer de page" color={ICE} />
              <Idea emoji="💡" text="Idée : Un compteur flottant (bottom-right) affiche le nombre d'articles + total au fur et à mesure que le client ajoute — visible sans aller dans le panier." />
              <Idea emoji="💡" text="Idée : Tap sur une carte article → bottom sheet (panneau qui glisse du bas) avec photo/emoji, description, quantité — sans quitter le menu." />
            </Card>

            {/* ── CART ── */}
            <Card title="Étape 2 — Panier" icon="🛒" color={AMBER}>
              <Step n="1" label="Liste des articles" sub="Avec +/- pour modifier les quantités, et supprimer" color={AMBER} />
              <Step n="2" label="Sous-total + Tip" sub="Le pourboire est proposé ici : 0 / 10% / 15% / 20% / Personnalisé" color={AMBER} />
              <Step n="3" label="Total final affiché clairement" color={AMBER} />
              <Step n="4" label="Choix du mode de livraison" sub="À Emporter OU Livraison — le client choisit ici" color={AMBER} />
            </Card>

            {/* ── CHECKOUT ── */}
            <Card title="Étape 3 — Checkout (formulaire selon le mode)" icon="📝" color={PURP}>
              <div style={{ marginBottom: 14 }}>
                <div style={{ color: ICE, fontWeight: 800, fontSize: 13, marginBottom: 8 }}>🥡 Si À Emporter :</div>
                {['Nom complet', 'Numéro de téléphone', 'Heure de récupération souhaitée (créneau)', 'Récapitulatif : articles + total + tip'].map((f, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: GREEN + '30', border: `1px solid ${GREEN}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: GREEN, flexShrink: 0 }}>✓</div>
                    <span style={{ color: '#cbd5e1', fontSize: 12 }}>{f}</span>
                  </div>
                ))}
              </div>

              <div>
                <div style={{ color: ICE, fontWeight: 800, fontSize: 13, marginBottom: 8 }}>🛵 Si Livraison :</div>
                {[
                  'Nom complet',
                  'Numéro de téléphone',
                  'Adresse complète (saisie manuelle)',
                  'OU Localisation GPS → lien Google Maps généré automatiquement',
                  'Créneau de livraison souhaité',
                  'Récapitulatif : articles + total + tip + frais de livraison',
                ].map((f, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: ICE + '30', border: `1px solid ${ICE}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: ICE, flexShrink: 0 }}>✓</div>
                    <span style={{ color: '#cbd5e1', fontSize: 12 }}>{f}</span>
                  </div>
                ))}
                <Idea emoji="📍" text="GPS : le bouton 'Utiliser ma position' demande la permission au navigateur → récupère lat/lng → génère un lien Google Maps format https://maps.google.com/?q=LAT,LNG que le livreur peut ouvrir directement sur son téléphone." type="add" />
                <Idea emoji="👤" text="Si le client est connecté → ses infos (nom, tel, adresse) sont pré-remplies. Il ne tape rien." type="add" />
              </div>
            </Card>

            {/* ── CONFIRMATION CHOICE ── */}
            <Card title="Étape 4 — Choix de confirmation" icon="✅" color={GREEN}>
              <div style={{ color: '#94a3b8', fontSize: 12, marginBottom: 12 }}>
                Après avoir rempli le formulaire, le client choisit comment confirmer sa commande :
              </div>

              <Step n="A" label="Confirmer via WhatsApp" color="#25d366"
                sub="Un popup s'ouvre avec un aperçu du message pré-rempli. Bouton 'Ouvrir WhatsApp' → l'app WA s'ouvre avec tout rempli. Le client envoie et la commande est confirmée."
                extra={
                  <div style={{ background: '#0a2010', border: '1px solid #25d36633', borderRadius: 10, padding: 10, marginTop: 8, fontFamily: 'monospace', fontSize: 11, color: '#a7f3d0', lineHeight: 1.8 }}>
                    🍱 *Commande Asaka Sushi*{'\n'}
                    👤 Ahmed Benali · 📞 0612345678{'\n'}
                    🥡 À Emporter · ⏰ 14h30{'\n'}
                    ─────────────────{'\n'}
                    • 2× Salmon Roll — 80 Dh{'\n'}
                    • 1× Chirashi — 95 Dh{'\n'}
                    ─────────────────{'\n'}
                    💰 Total : 175 Dh · Tip : 20 Dh{'\n'}
                    ✅ En attente de confirmation
                  </div>
                }
              />

              <Step n="B" label="Confirmer via le site" color={ICE}
                sub="Le client appuie sur 'Passer la commande' directement. La commande est enregistrée en base. Le restaurant la voit en backoffice et rappelle / SMS pour confirmer."
              />

              <Idea emoji="💡" text="Idée : Après confirmation via le site, afficher un compte à rebours estimé ('Votre commande sera prête dans ~25 min') pour rassurer le client sans qu'il ait besoin d'appeler." type="add" />
              <Idea emoji="📞" text="Idée : Bouton 'Appeler le restaurant' en bas de la page confirmation — pour les clients qui préfèrent parler à quelqu'un." type="add" />
            </Card>

            {/* ── POST ORDER ── */}
            <Card title="Étape 5 — Après la commande" icon="🎉" color={AMBER}>
              <Step n="1" label="Page de confirmation animée" sub="Animation succès (checkmark) + Numéro de commande + Récapitulatif" color={AMBER} />
              <Step n="2" label="Statut de la commande (timeline)" color={AMBER}
                extra={
                  <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                    {['Reçue', 'Confirmée', 'En préparation', 'Prête / En route', 'Livrée ✓'].map((s, i) => (
                      <div key={i} style={{ background: i === 0 ? AMBER + '30' : '#1e3a5f', border: `1px solid ${i === 0 ? AMBER : '#2d4a6a'}`, borderRadius: 999, padding: '3px 10px', fontSize: 11, color: i === 0 ? AMBER : '#64748b' }}>{s}</div>
                    ))}
                  </div>
                }
              />
              <Step n="3" label="Formulaire d'avis (selon votre demande)" color={AMBER}
                sub="Affiché directement sous la confirmation — étoiles 1-5 + commentaire libre + option d'envoyer l'avis sur Google aussi."
              />
              <Step n="4" label="Bouton 'Commander à nouveau'" sub="Remet les mêmes articles dans le panier en 1 tap" color={AMBER} />
              <Idea emoji="⭐" text="Le formulaire d'avis ne s'affiche QUE pour les commandes livrées/récupérées — pas immédiatement après confirmation. Une notification discrète apparaît après ~30 min ('Comment s'est passée votre commande ?')." type="add" />
              <Idea emoji="📬" text="Idée : Bouton 'Contact restaurant' en bas — ouvre un petit formulaire (ou WhatsApp) pour questions/réclamations." type="add" />
            </Card>

            {/* ── SUMMARY ── */}
            <div style={{ background: `linear-gradient(135deg, ${BLUE}22, ${ICE}11)`, border: `1px solid ${ICE}30`, borderRadius: 16, padding: 18, marginTop: 4 }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: ICE, marginBottom: 14 }}>📊 Résumé du flux en 5 étapes</div>
              {[
                { n: '0', label: 'Entrée', detail: 'Hero : 2 boutons (Emporter / Livraison)', color: ICE },
                { n: '1', label: 'Browse', detail: 'Restaurant info → Menu → Add to cart', color: ICE },
                { n: '2', label: 'Panier', detail: 'Articles + Tip + Choix du mode', color: AMBER },
                { n: '3', label: 'Checkout', detail: 'Formulaire adapté au mode choisi + GPS si livraison', color: PURP },
                { n: '4', label: 'Confirmation', detail: 'WhatsApp popup OU site direct', color: GREEN },
                { n: '5', label: 'Post-commande', detail: 'Animation + statut + avis + recommander', color: AMBER },
              ].map(s => (
                <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <div style={{ width: 26, height: 26, borderRadius: '50%', background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, color: NAVY, flexShrink: 0 }}>{s.n}</div>
                  <div style={{ flex: 1 }}>
                    <span style={{ color: WHITE, fontWeight: 700, fontSize: 13 }}>{s.label} </span>
                    <span style={{ color: '#64748b', fontSize: 12 }}>— {s.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* OVERVIEW TAB                                                      */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {tab === 'overview' && (
          <div>
            <Card title="Sections du site (dans l'ordre de scroll)" icon="📜" color={ICE}>
              {[
                { n: 1, name: 'Hero / Accueil', desc: '2 gros boutons Emporter + Livraison · Statut ouvert/fermé · Temps estimé', status: '⏳ À valider' },
                { n: 2, name: 'Qui sommes-nous', desc: 'Court : logo Asaka + 2-3 lignes + bouton Google Maps compact', status: '⏳ À valider' },
                { n: 3, name: 'Menu', desc: 'Tabs catégories · Cartes produits · Bottom sheet détail · FAB panier', status: '⏳ À valider' },
                { n: 4, name: 'Comment ça marche', desc: '3 steps : Choisir → Confirmer → Recevoir (illustration simple)', status: '⏳ À valider' },
                { n: 5, name: 'Avis clients', desc: 'Mini-carrousel de témoignages + note Google + lien laisser un avis', status: '⏳ À valider' },
                { n: 6, name: 'Contact / Footer', desc: 'Téléphone + WhatsApp + Réseaux sociaux + Horaires · Compact', status: '⏳ À valider' },
              ].map(s => (
                <div key={s.n} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid #1e3a5f' }}>
                  <div style={{ width: 26, height: 26, borderRadius: 8, background: ICE + '20', border: `1px solid ${ICE}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: ICE, flexShrink: 0 }}>{s.n}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: WHITE, fontWeight: 700, fontSize: 13 }}>{s.name}</div>
                    <div style={{ color: '#94a3b8', fontSize: 12 }}>{s.desc}</div>
                  </div>
                  <Tag color={AMBER}>{s.status}</Tag>
                </div>
              ))}
            </Card>

            <Card title="Ce qu'on supprime définitivement" icon="🗑️" color={CORAL}>
              {['Dine-In / Sur Place (supprimé du flow)', 'Carte Google Maps en iframe plein écran', 'Timeline "Notre Histoire" longue', 'Footer lourd multi-colonnes', 'Couleurs oranges (remplacées par bleu)'].map((x, i) => (
                <div key={i} style={{ color: '#fca5a5', fontSize: 12, marginBottom: 6, display: 'flex', gap: 8 }}>
                  <span>❌</span><span>{x}</span>
                </div>
              ))}
            </Card>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* DESIGN TAB                                                        */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {tab === 'design' && (
          <div>
            <Card title="Palette — inspirée du logo Asaka" icon="🎨" color={ICE}>
              {[
                { name: 'Fond principal',   hex: '#060d18', role: 'Background global' },
                { name: 'Fond carte',       hex: '#0d1b2a', role: 'Cards, sections' },
                { name: 'Séparateurs',      hex: '#1e3a5f', role: 'Borders, dividers' },
                { name: 'Bouton primaire',  hex: '#1565c0', role: 'CTA principal' },
                { name: 'Ice Blue',         hex: '#4fc3f7', role: 'Accents, highlights' },
                { name: 'Texte principal',  hex: '#f0f8ff', role: 'Titres, labels' },
                { name: 'Texte secondaire', hex: '#94a3b8', role: 'Descriptions' },
                { name: 'Succès / Emporter', hex: '#22c55e', role: 'Take Away mode' },
                { name: 'Coral (badge hot)', hex: '#e74c3c', role: 'Promos, urgent' },
              ].map(c => (
                <div key={c.hex} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: c.hex, border: '1px solid #1e3a5f', flexShrink: 0 }} />
                  <div>
                    <div style={{ color: WHITE, fontWeight: 700, fontSize: 12 }}>{c.name}</div>
                    <div style={{ color: '#64748b', fontSize: 11 }}>{c.hex} · {c.role}</div>
                  </div>
                </div>
              ))}
            </Card>

            <Card title="Navigation mobile (Bottom Bar)" icon="📱" color={PURP}>
              <Row gap={8}>
                <Pill emoji="🏠" label="Accueil" color={ICE} />
                <Pill emoji="🍱" label="Menu" color={ICE} />
                <Pill emoji="🛒" label="Panier" sub="Badge count" color={GREEN} />
                <Pill emoji="👤" label="Profil" color={PURP} />
              </Row>
              <div style={{ color: '#94a3b8', fontSize: 12 }}>Barre fixe en bas — navigation au pouce, naturelle sur mobile.</div>
            </Card>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* PENDING TAB — what remains to validate                           */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {tab === 'pending' && (
          <div>
            <div style={{ background: AMBER + '15', border: `1px solid ${AMBER}40`, borderRadius: 14, padding: '12px 16px', marginBottom: 20 }}>
              <div style={{ color: AMBER, fontWeight: 800, fontSize: 13 }}>⏳ Sections encore à valider avec vous</div>
              <div style={{ color: '#fde68a', fontSize: 12, marginTop: 4 }}>Expliquez chaque section comme vous avez fait pour la commande — je mets à jour le plan et on continue.</div>
            </div>

            {[
              {
                id: '01', icon: '🏠', title: 'Page d\'accueil (Hero + sections)',
                questions: [
                  'Que voulez-vous que le client voie en PREMIER au-dessus de la ligne de flottaison ?',
                  'Voulez-vous une photo du restaurant ou rester sur fond sombre + animations ?',
                  'Section "Qui sommes-nous" : courte biographie + horaires ou juste le nom + localisation ?',
                  'Voulez-vous une section "Comment commander" avec 3 étapes illustrées ?',
                ],
              },
              {
                id: '02', icon: '🍱', title: 'Page Menu',
                questions: [
                  'Comment voulez-vous afficher les articles : grille 2 colonnes, liste 1 colonne, ou cards horizontales ?',
                  'Voulez-vous des photos réelles pour les articles, ou garder les emojis/illustrations ?',
                  'Tap sur un article : nouvelle page, popup (bottom sheet), ou rien (juste add to cart) ?',
                  'Voulez-vous un moteur de recherche dans le menu ?',
                ],
              },
              {
                id: '03', icon: '👤', title: 'Compte client & Fidélité',
                questions: [
                  'Voulez-vous que le client SOIT OBLIGÉ de créer un compte pour commander, ou c\'est optionnel ?',
                  'Le système de points/badges est-il une priorité ou peut-on l\'ajouter plus tard ?',
                  'Quels avantages concrets par niveau ? (ex: Bronze: rien · Argent: -5% · Or: livraison gratuite)',
                ],
              },
              {
                id: '04', icon: '⭐', title: 'Section Avis clients',
                questions: [
                  'Voulez-vous afficher des vrais avis Google, ou des témoignages saisis manuellement dans le backoffice ?',
                  'Préférez-vous un carrousel (défilement automatique) ou une grille statique ?',
                ],
              },
              {
                id: '05', icon: '📍', title: 'Localisation & Contact',
                questions: [
                  'Confirmez-vous : juste un bouton "Voir sur Google Maps" (compact, pas d\'iframe) ?',
                  'Les horaires doivent-ils apparaître sur la page d\'accueil ou seulement en footer ?',
                  'Un formulaire de contact textuel ou seulement le bouton WhatsApp direct ?',
                ],
              },
              {
                id: '06', icon: '🔧', title: 'Back-office (après le front)',
                questions: [
                  'À traiter séparément une fois le front validé et implémenté.',
                ],
              },
            ].map(section => (
              <Card key={section.id} title={`${section.icon} ${section.title}`} icon="" color={AMBER} badge="À VALIDER">
                {section.questions.map((q, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <span style={{ color: AMBER, fontWeight: 800, fontSize: 12, flexShrink: 0 }}>Q{i + 1}.</span>
                    <span style={{ color: '#cbd5e1', fontSize: 12 }}>{q}</span>
                  </div>
                ))}
              </Card>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
