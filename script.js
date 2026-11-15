// ====== EDIT HERE ======
const WHATSAPP = "2347038039888";   // 07038039888 in international format
const CURRENCY = "₦";
// To use a real photo on a product, add:  img: "images/my-photo.jpg"
const PRODUCTS = {
  bags: [
    { id: "b1", name: "Crescent Hobo Bag",    price: 45000, emoji: "👜", tint: "#ffd3e3", img: "images/bag1.png" },
    { id: "b2", name: "Knot Handle Satchel",  price: 38000, emoji: "👜", tint: "#f9e7b8", img: "images/bag2.png" },
    { id: "b3", name: "Straw Charm Tote",     price: 28000, emoji: "👜", tint: "#ffe3ee", img: "images/bag3.png" },
    { id: "b4", name: "Gold Capsule Evening", price: 62000, emoji: "👛", tint: "#f7b6d0", img: "images/bag4.png" },
    { id: "b5", name: "Knot Handle Satchel II", price: 33000, emoji: "👜", tint: "#ffd8e6", img: "images/bag5.png" },
    { id: "b6", name: "Woven Knot Clutch",    price: 52000, emoji: "👜", tint: "#f9e7b8", img: "images/bag6.png" },
    { id: "b7", name: "Diamond Check Tote",   price: 40000, emoji: "👜", tint: "#ffe3ee", img: "images/bag7.png" },
    { id: "b8", name: "Black Dome Satchel",   price: 48000, emoji: "👜", tint: "#ffd3e3", img: "images/bag8.png" },
    { id: "b9", name: "Black Flap Satchel",   price: 55000, emoji: "👜", tint: "#f7b6d0", img: "images/bag9.png" }
  ],
  slippers: [
    { id: "s1", name: "Pearl Pillow Slides",  price: 12000, emoji: "🩴", tint: "#ffe3ee" },
    { id: "s2", name: "Satin Bow Slippers",   price: 15000, emoji: "🩴", tint: "#ffd3e3" },
    { id: "s3", name: "Gold Strap Flats",     price: 18500, emoji: "🩴", tint: "#f9e7b8" },
    { id: "s4", name: "Fluffy House Mules",   price: 10000, emoji: "🥿", tint: "#f7b6d0" },
    { id: "s5", name: "Crystal Slides",       price: 20000, emoji: "🩴", tint: "#ffd8e6" },
    { id: "s6", name: "Blush Leather Slides", price: 16500, emoji: "🥿", tint: "#ffe3ee" }
  ],
  heels: [
    { id: "h1", name: "Rose Stilettos",      price: 35000, emoji: "👠", tint: "#ffd3e3" },
    { id: "h2", name: "Gold Block Heels",    price: 32000, emoji: "👠", tint: "#f9e7b8" },
    { id: "h3", name: "Ankle Strap Sandals", price: 28000, emoji: "👡", tint: "#ffe3ee" },
    { id: "h4", name: "Pearl Kitten Heels",  price: 25000, emoji: "👠", tint: "#f7b6d0" },
    { id: "h5", name: "Platform Pumps",      price: 40000, emoji: "👠", tint: "#ffd8e6" },
    { id: "h6", name: "Crystal Party Heels", price: 48000, emoji: "👠", tint: "#f9e7b8" }
  ]
};
// ========================

const fmt = n => CURRENCY + n.toLocaleString("en-NG");
const page = document.body.dataset.page;
const ALL = Object.values(PRODUCTS).flat();
let cart = {};
try { cart = JSON.parse(localStorage.getItem("hm-cart")) || {}; } catch (e) {}
const save = () => { try { localStorage.setItem("hm-cart", JSON.stringify(cart)); } catch (e) {} };

/* ---- shared nav, cart drawer, footer ---- */
const links = [["index.html","home","Home"],["bags.html","bags","Bags"],["slippers.html","slippers","Slippers"],["heels.html","heels","Heels"]];
document.body.insertAdjacentHTML("afterbegin", `
<nav class="nav">
  <a class="brand" href="index.html"><img src="logo-marie.jpeg" alt="">Honeymarie</a>
  <div class="links">${links.map(l => `<a class="link ${l[1]===page?"active":""}" href="${l[0]}">${l[2]}</a>`).join("")}</div>
  <button class="cart-btn" id="open-cart">Cart<b id="cart-count">0</b></button>
</nav>
<div class="overlay" id="overlay"></div>
<aside class="drawer" id="drawer" aria-label="Your cart">
  <header><h2>Your cart</h2><button id="close-cart" aria-label="Close cart">×</button></header>
  <ul class="cart-items" id="cart-items"></ul>
  <footer>
    <div class="total"><span>Total</span><span id="cart-total">${fmt(0)}</span></div>
    <button class="btn" id="checkout">Order on WhatsApp</button>
  </footer>
</aside>`);
document.body.insertAdjacentHTML("beforeend",
  `<footer class="site-foot">Honeymarie is open for business. WhatsApp <a href="https://wa.me/${WHATSAPP}">07038039888</a></footer>`);

const $ = id => document.getElementById(id);
const toggleCart = open => { $("drawer").classList.toggle("open", open); $("overlay").classList.toggle("open", open); };
$("open-cart").onclick = () => toggleCart(true);
$("close-cart").onclick = $("overlay").onclick = () => toggleCart(false);
document.addEventListener("keydown", e => { if (e.key === "Escape") toggleCart(false); });

/* ---- cart ---- */
function renderCart() {
  const ids = Object.keys(cart).filter(id => cart[id] > 0 && ALL.some(x => x.id === id));
  let total = 0, count = 0;
  $("cart-items").innerHTML = ids.length ? ids.map(id => {
    const p = ALL.find(x => x.id === id), q = cart[id];
    total += p.price * q; count += q;
    return `<li><div><strong>${p.name}</strong><br>${fmt(p.price)} each</div><strong>${fmt(p.price*q)}</strong>
      <div class="qty"><button data-act="dec" data-id="${id}" aria-label="Decrease">−</button><output>${q}</output><button data-act="inc" data-id="${id}" aria-label="Increase">+</button></div>
      <button class="remove" data-act="rm" data-id="${id}">Remove</button></li>`;
  }).join("") : `<li class="empty">Your cart is empty. Add something lovely.</li>`;
  $("cart-total").textContent = fmt(total);
  $("cart-count").textContent = count;
  $("checkout").disabled = !ids.length;
  $("checkout").style.opacity = ids.length ? 1 : .5;
  save();
}
$("cart-items").onclick = e => {
  const { act, id } = e.target.dataset; if (!act) return;
  if (act === "inc") cart[id]++;
  if (act === "dec") cart[id] = Math.max(0, cart[id] - 1);
  if (act === "rm") delete cart[id];
  renderCart();
};
$("checkout").onclick = () => {
  let total = 0;
  const lines = Object.keys(cart).filter(id => cart[id] > 0).map(id => {
    const p = ALL.find(x => x.id === id); total += p.price * cart[id];
    return `- ${p.name} x${cart[id]} = ${fmt(p.price * cart[id])}`;
  });
  if (!lines.length) return;
  const msg = `Hello Honeymarie, I'd like to order:\n${lines.join("\n")}\nTotal: ${fmt(total)}`;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");
};

/* ---- product grid (shop pages only) ---- */
const grid = $("products");
if (grid && PRODUCTS[page]) {
  grid.innerHTML = PRODUCTS[page].map(p => `
    <article class="card">
      <div class="card-img" style="background:${p.tint}">${p.img ? `<img src="${p.img}" alt="${p.name}">` : p.emoji}</div>
      <div class="card-body">
        <h3>${p.name}</h3>
        <span class="price">${fmt(p.price)}</span>
        <div class="qty"><button data-act="dec" aria-label="Decrease quantity">−</button><output>1</output><button data-act="inc" aria-label="Increase quantity">+</button></div>
        <button class="btn" data-act="add" data-id="${p.id}">Add to cart</button>
      </div>
    </article>`).join("");
  grid.onclick = e => {
    const act = e.target.dataset.act; if (!act) return;
    const card = e.target.closest(".card"), out = card.querySelector("output");
    if (act === "inc") out.textContent = +out.textContent + 1;
    if (act === "dec") out.textContent = Math.max(1, +out.textContent - 1);
    if (act === "add") {
      const id = e.target.dataset.id;
      cart[id] = (cart[id] || 0) + +out.textContent;
      out.textContent = 1; renderCart();
      e.target.textContent = "Added ✓";
      setTimeout(() => e.target.textContent = "Add to cart", 1200);
    }
  };
}
renderCart();