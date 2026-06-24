const catalog = [
  // Cola
  { id: 1,  name: "Coca-Cola",          emoji: "🥤", desc: "Der Klassiker – unverwechselbar prickelnd.",    price: 1.99, cat: "cola", vol: "0,5 l" },
  { id: 2,  name: "Coca-Cola Zero",     emoji: "⬛", desc: "Voller Cola-Geschmack, ohne Kalorien.",         price: 1.99, cat: "cola", vol: "0,5 l" },
  { id: 3,  name: "Pepsi",              emoji: "🫙", desc: "Süß, spritzig und erfrischend.",                price: 1.89, cat: "cola", vol: "0,5 l" },
  { id: 4,  name: "Pepsi Max",          emoji: "🖤", desc: "Null Kalorien, maximaler Geschmack.",           price: 1.89, cat: "cola", vol: "0,5 l" },
  // Limo
  { id: 5,  name: "Fanta Orange",       emoji: "🍊", desc: "Fruchtig-süße Orangenlimonade.",               price: 1.79, cat: "limo", vol: "0,5 l", tag: "Beliebt" },
  { id: 6,  name: "Sprite",             emoji: "🌿", desc: "Zitrone-Limette, kristallklar und kalt.",       price: 1.79, cat: "limo", vol: "0,5 l" },
  { id: 7,  name: "Mirinda Lemon",      emoji: "🍋", desc: "Frisch-saure Zitronenlimonade.",               price: 1.69, cat: "limo", vol: "0,5 l" },
  { id: 8,  name: "Schwip Schwap",      emoji: "🩷", desc: "Die Cola-Orange-Kombi – einzigartig.",         price: 1.79, cat: "limo", vol: "0,5 l" },
  { id: 9,  name: "Almdudler",          emoji: "🌼", desc: "Österreichischer Kräuterlimonade-Genuss.",     price: 1.99, cat: "limo", vol: "0,5 l" },
  // Energy
  { id: 10, name: "Red Bull",           emoji: "⚡", desc: "Verleiht Flügel. Original Energy Drink.",      price: 2.49, cat: "energy", vol: "0,25 l", tag: "Top-Seller" },
  { id: 11, name: "Monster Energy",     emoji: "🐉", desc: "Unleash the Beast – intensiver Boost.",        price: 2.29, cat: "energy", vol: "0,5 l" },
  { id: 12, name: "Rockstar",           emoji: "🎸", desc: "Live Life Full Throttle.",                     price: 2.19, cat: "energy", vol: "0,5 l" },
  { id: 13, name: "Reign Storm",        emoji: "🌪️", desc: "Zero Zucker, voll auf Energie.",              price: 2.39, cat: "energy", vol: "0,5 l" },
  // Wasser
  { id: 14, name: "Evian Still",        emoji: "💧", desc: "Natürliches Mineralwasser, still.",            price: 1.49, cat: "wasser", vol: "0,5 l" },
  { id: 15, name: "Gerolsteiner Sprudel",emoji: "💦", desc: "Natürliche Mineralquelle mit Kohlensäure.",  price: 1.29, cat: "wasser", vol: "0,5 l" },
  { id: 16, name: "Volvic",             emoji: "🏔️", desc: "Vulkanisches Mineralwasser aus Frankreich.", price: 1.39, cat: "wasser", vol: "0,5 l" },
  // Saft
  { id: 17, name: "Hohes C Orange",     emoji: "🍊", desc: "100 % Fruchtsaft, frisch gepresst.",           price: 2.29, cat: "saft", vol: "0,5 l", tag: "Frisch" },
  { id: 18, name: "Rauch Apfel",        emoji: "🍎", desc: "Naturtrüber Apfelsaft aus dem Alpenraum.",     price: 2.19, cat: "saft", vol: "0,5 l" },
  { id: 19, name: "Innocent Mango",     emoji: "🥭", desc: "Pure Mango – nur Frucht, nichts sonst.",       price: 2.79, cat: "saft", vol: "0,25 l" },
  { id: 20, name: "Multivitamin",       emoji: "🍇", desc: "7 Früchte, voller Vitaminkick.",               price: 2.49, cat: "saft", vol: "0,5 l" },
];

const fmt = n => n.toFixed(2).replace(".", ",") + " €";
let cart = {};   // { id: qty }

// ── Product Grid ───────────────────────────────────
function renderProducts(cat = "all") {
  const list = cat === "all" ? catalog : catalog.filter(d => d.cat === cat);
  document.getElementById("products").innerHTML = list.map(d => `
    <article class="product-card">
      <div class="pc-thumb">
        ${d.emoji}
        ${d.tag ? `<span class="pc-tag">${d.tag}</span>` : ""}
      </div>
      <div class="pc-body">
        <div class="pc-name">${d.name}</div>
        <div class="pc-desc">${d.desc}</div>
        <div class="pc-vol">${d.vol}</div>
      </div>
      <div class="pc-foot">
        <span class="pc-price">${fmt(d.price)}</span>
        <button class="pc-add" onclick="addItem(${d.id})">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          In den Korb
        </button>
      </div>
    </article>
  `).join("");
}

// ── Cart ───────────────────────────────────────────
function addItem(id) {
  cart[id] = (cart[id] || 0) + 1;
  refreshCart();
  openCart();
}

function changeQty(id, delta) {
  const next = (cart[id] || 0) + delta;
  if (next <= 0) delete cart[id]; else cart[id] = next;
  refreshCart();
}

function refreshCart() {
  const totalQty = Object.values(cart).reduce((s, v) => s + v, 0);
  const totalPrice = Object.entries(cart).reduce((s, [id, qty]) => {
    const d = catalog.find(x => x.id === +id);
    return s + (d ? d.price * qty : 0);
  }, 0);

  const badge = document.getElementById("badge");
  badge.textContent = totalQty;
  badge.hidden = totalQty === 0;

  document.getElementById("cpTotal").textContent = fmt(totalPrice);
  document.getElementById("checkoutBtn").disabled = totalQty === 0;

  const body = document.getElementById("cpBody");
  if (totalQty === 0) {
    body.innerHTML = `<div class="cp-empty"><span>🛒</span><p>Noch nichts im Warenkorb</p></div>`;
    return;
  }

  body.innerHTML = Object.entries(cart).map(([id, qty]) => {
    const d = catalog.find(x => x.id === +id);
    if (!d) return "";
    return `
      <div class="cart-row">
        <span class="cr-icon">${d.emoji}</span>
        <div class="cr-info">
          <div class="cr-name">${d.name}</div>
          <div class="cr-price">${fmt(d.price)} / Stk. · ${d.vol}</div>
        </div>
        <div class="cr-controls">
          <button class="qty-btn" onclick="changeQty(${id},-1)" aria-label="Weniger">−</button>
          <span class="cr-qty">${qty}</span>
          <button class="qty-btn" onclick="changeQty(${id},1)" aria-label="Mehr">+</button>
        </div>
      </div>`;
  }).join("");
}

// ── Cart Panel ─────────────────────────────────────
function openCart() {
  document.getElementById("cartPanel").classList.add("open");
  document.getElementById("cartPanel").removeAttribute("aria-hidden");
  document.getElementById("cartBackdrop").classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeCart() {
  document.getElementById("cartPanel").classList.remove("open");
  document.getElementById("cartPanel").setAttribute("aria-hidden", "true");
  document.getElementById("cartBackdrop").classList.remove("open");
  document.body.style.overflow = "";
}

// ── Order Flow ─────────────────────────────────────
function openOrderDialog() {
  closeCart();
  const summary = Object.entries(cart).map(([id, qty]) => {
    const d = catalog.find(x => x.id === +id);
    return d ? `${qty}× ${d.name}` : "";
  }).filter(Boolean).join(" · ");
  document.getElementById("dlgSummary").textContent = summary;
  document.getElementById("orderOverlay").classList.add("open");
}
function closeOrderDialog() {
  document.getElementById("orderOverlay").classList.remove("open");
}

function submitOrder(e) {
  e.preventDefault();
  const name    = document.getElementById("fName").value.trim();
  const street  = document.getElementById("fStreet").value.trim();
  const zip     = document.getElementById("fZip").value.trim();
  const city    = document.getElementById("fCity").value.trim();

  closeOrderDialog();
  document.getElementById("successDetail").textContent =
    `Hallo ${name}! Deine Bestellung wird an ${street}, ${zip} ${city} geliefert. Du erhältst in Kürze eine Bestätigung.`;
  document.getElementById("successOverlay").classList.add("open");

  cart = {};
  refreshCart();
  document.getElementById("orderForm").reset();
}

// ── Event Listeners ────────────────────────────────
document.getElementById("cartTrigger").addEventListener("click", openCart);
document.getElementById("cartClose").addEventListener("click", closeCart);
document.getElementById("cartBackdrop").addEventListener("click", closeCart);
document.getElementById("checkoutBtn").addEventListener("click", openOrderDialog);
document.getElementById("dlgClose").addEventListener("click", closeOrderDialog);
document.getElementById("dlgCancel").addEventListener("click", closeOrderDialog);
document.getElementById("orderForm").addEventListener("submit", submitOrder);
document.getElementById("successOk").addEventListener("click", () => {
  document.getElementById("successOverlay").classList.remove("open");
});
document.getElementById("heroCta").addEventListener("click", () => {
  document.querySelector(".products").scrollIntoView({ behavior: "smooth" });
});

document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderProducts(btn.dataset.cat);
  });
});

// Escape closes dialogs
document.addEventListener("keydown", e => {
  if (e.key !== "Escape") return;
  if (document.getElementById("successOverlay").classList.contains("open")) {
    document.getElementById("successOverlay").classList.remove("open");
  } else if (document.getElementById("orderOverlay").classList.contains("open")) {
    closeOrderDialog();
  } else {
    closeCart();
  }
});

// ── Init ───────────────────────────────────────────
renderProducts();
