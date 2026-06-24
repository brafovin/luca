const drinks = [
  { id: 1,  name: "Cola Classic",       emoji: "🥤", desc: "Der Klassiker – eisgekühlt und sprudelnd.",     price: 2.50, cat: "soft" },
  { id: 2,  name: "Limonade Zitrone",   emoji: "🍋", desc: "Erfrischend süß-saure Zitronenlimonade.",      price: 2.20, cat: "soft" },
  { id: 3,  name: "Mineralwasser",      emoji: "💧", desc: "Still oder mit Kohlensäure, 0,5 l.",            price: 1.80, cat: "soft" },
  { id: 4,  name: "Eistee Pfirsich",    emoji: "🍑", desc: "Süßer Eistee mit Pfirsichgeschmack.",          price: 2.30, cat: "soft" },
  { id: 5,  name: "Orangensaft",        emoji: "🍊", desc: "Frisch gepresster Orangensaft, 0,3 l.",        price: 3.20, cat: "juice" },
  { id: 6,  name: "Apfelsaft",          emoji: "🍎", desc: "Naturtrüber Apfelsaft aus der Region.",        price: 2.80, cat: "juice" },
  { id: 7,  name: "Mangosaft",          emoji: "🥭", desc: "Exotischer Mangosaft, 100 % Frucht.",           price: 3.50, cat: "juice" },
  { id: 8,  name: "Multivitaminsaft",   emoji: "🍇", desc: "Vitamingemixt aus 7 Früchten.",                price: 3.00, cat: "juice" },
  { id: 9,  name: "Mojito",             emoji: "🍃", desc: "Frische Minze, Limette und Zuckersirup.",      price: 5.90, cat: "cocktail" },
  { id: 10, name: "Piña Colada",        emoji: "🍍", desc: "Ananas, Kokosnuss – tropisches Feeling.",      price: 6.50, cat: "cocktail" },
  { id: 11, name: "Strawberry Daiquiri",emoji: "🍓", desc: "Süßer Erdbeer-Cocktail mit Zitronensäure.",   price: 6.20, cat: "cocktail" },
  { id: 12, name: "Hugo",               emoji: "🌸", desc: "Holunderblüte, Minze, Prosecco – leicht.",    price: 5.50, cat: "cocktail" },
  { id: 13, name: "Espresso",           emoji: "☕", desc: "Kräftiger Espresso, doppelt.",                 price: 2.50, cat: "hot" },
  { id: 14, name: "Cappuccino",         emoji: "🫧", desc: "Espresso mit samtigem Milchschaum.",           price: 3.20, cat: "hot" },
  { id: 15, name: "Heiße Schokolade",   emoji: "🍫", desc: "Cremig-süße Kakao-Köstlichkeit.",             price: 3.50, cat: "hot" },
  { id: 16, name: "Ingwer-Tee",         emoji: "🫖", desc: "Wärmender Tee mit frischem Ingwer & Honig.",  price: 3.00, cat: "hot" },
];

let cart = {};
let activeCategory = "all";

// --- Render Menu ---
function renderMenu() {
  const menu = document.getElementById("menu");
  const filtered = activeCategory === "all"
    ? drinks
    : drinks.filter(d => d.cat === activeCategory);

  menu.innerHTML = filtered.map(d => `
    <div class="card">
      <div class="card-img">${d.emoji}</div>
      <div class="card-body">
        <div class="card-name">${d.name}</div>
        <div class="card-desc">${d.desc}</div>
        <div class="card-footer">
          <span class="card-price">${formatPrice(d.price)}</span>
          <button class="add-btn" onclick="addToCart(${d.id})">+ Hinzufügen</button>
        </div>
      </div>
    </div>
  `).join("");
}

// --- Cart Logic ---
function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  updateCart();
  openCart();
}

function changeQty(id, delta) {
  cart[id] = (cart[id] || 0) + delta;
  if (cart[id] <= 0) delete cart[id];
  updateCart();
}

function updateCart() {
  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalPrice = Object.entries(cart).reduce((sum, [id, qty]) => {
    const drink = drinks.find(d => d.id === +id);
    return sum + (drink ? drink.price * qty : 0);
  }, 0);

  document.getElementById("cartCount").textContent = totalItems;
  document.getElementById("cartTotal").textContent = formatPrice(totalPrice);
  document.getElementById("orderBtn").disabled = totalItems === 0;

  const cartItems = document.getElementById("cartItems");
  if (totalItems === 0) {
    cartItems.innerHTML = '<p class="cart-empty">Dein Warenkorb ist leer.</p>';
    return;
  }

  cartItems.innerHTML = Object.entries(cart).map(([id, qty]) => {
    const drink = drinks.find(d => d.id === +id);
    if (!drink) return "";
    return `
      <div class="cart-item">
        <span class="ci-icon">${drink.emoji}</span>
        <div class="ci-info">
          <div class="ci-name">${drink.name}</div>
          <div class="ci-price">${formatPrice(drink.price)} / Stk.</div>
        </div>
        <div class="ci-controls">
          <button class="qty-btn" onclick="changeQty(${id}, -1)">−</button>
          <span class="ci-qty">${qty}</span>
          <button class="qty-btn" onclick="changeQty(${id}, 1)">+</button>
        </div>
      </div>
    `;
  }).join("");
}

// --- Cart UI ---
function openCart() {
  document.getElementById("cart").classList.add("open");
  document.getElementById("cartOverlay").classList.add("open");
}
function closeCart() {
  document.getElementById("cart").classList.remove("open");
  document.getElementById("cartOverlay").classList.remove("open");
}

// --- Order Flow ---
function openOrderModal() {
  closeCart();
  document.getElementById("modalOverlay").classList.add("open");
}
function closeOrderModal() {
  document.getElementById("modalOverlay").classList.remove("open");
}

function placeOrder(e) {
  e.preventDefault();
  const name = document.getElementById("nameInput").value.trim();
  const address = document.getElementById("addressInput").value.trim();

  const itemList = Object.entries(cart).map(([id, qty]) => {
    const d = drinks.find(d => d.id === +id);
    return d ? `${qty}× ${d.name}` : "";
  }).filter(Boolean).join(", ");

  closeOrderModal();
  document.getElementById("successMsg").textContent =
    `Hallo ${name}! Deine Bestellung (${itemList}) wird an ${address} geliefert.`;
  document.getElementById("successOverlay").classList.add("open");

  cart = {};
  updateCart();
  document.getElementById("orderForm").reset();
}

// --- Helpers ---
function formatPrice(val) {
  return val.toFixed(2).replace(".", ",") + " €";
}

// --- Event Listeners ---
document.getElementById("cartToggle").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
document.getElementById("cartOverlay").addEventListener("click", closeCart);
document.getElementById("orderBtn").addEventListener("click", openOrderModal);
document.getElementById("cancelOrder").addEventListener("click", closeOrderModal);
document.getElementById("orderForm").addEventListener("submit", placeOrder);
document.getElementById("successClose").addEventListener("click", () => {
  document.getElementById("successOverlay").classList.remove("open");
});

document.querySelectorAll(".cat-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeCategory = btn.dataset.cat;
    renderMenu();
  });
});

// --- Init ---
renderMenu();
