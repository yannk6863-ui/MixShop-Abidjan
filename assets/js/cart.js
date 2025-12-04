// Gestion du panier avec localStorage

function getCart() {
  try {
    const raw = localStorage.getItem("mixshop_cart");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem("mixshop_cart", JSON.stringify(cart));
  updateCartCount();
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find((p) => p.id === product.id);
  if (existing) {
    existing.qty += product.qty;
  } else {
    cart.push(product);
  }
  saveCart(cart);
}

function clearCart() {
  localStorage.removeItem("mixshop_cart");
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, p) => sum + p.qty, 0);
  const badge = document.getElementById("cart-count");
  if (badge) {
    badge.textContent = count;
  }
}

function formatPrice(value) {
  const v = typeof value === "number" ? value : parseInt(value, 10) || 0;
  return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " FCFA";
}

function renderCartPage() {
  const cart = getCart();
  const emptyEl = document.getElementById("cart-empty");
  const contentEl = document.getElementById("cart-content");
  const bodyEl = document.getElementById("cart-items");
  const subtotalEl = document.getElementById("cart-subtotal");
  const shippingEl = document.getElementById("cart-shipping");
  const totalEl = document.getElementById("cart-total");
  const clearBtn = document.getElementById("cart-clear");

  if (!emptyEl || !contentEl || !bodyEl) return;

  if (!cart.length) {
    emptyEl.style.display = "block";
    contentEl.classList.add("hidden");
    return;
  }

  emptyEl.style.display = "none";
  contentEl.classList.remove("hidden");

  bodyEl.innerHTML = "";
  let subtotal = 0;

  cart.forEach((item, index) => {
    const row = document.createElement("tr");

    const itemTotal = item.price * item.qty;
    subtotal += itemTotal;

    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.category || ""}</td>
      <td>${formatPrice(item.price)}</td>
      <td>
        <input type="number" min="1" value="${item.qty}" data-index="${index}" class="cart-qty" style="width:60px" />
      </td>
      <td>${formatPrice(itemTotal)}</td>
      <td><button data-index="${index}" class="btn secondary cart-remove">X</button></td>
    `;

    bodyEl.appendChild(row);
  });

  const shipping = cart.length ? 2000 : 0;
  if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
  if (shippingEl) shippingEl.textContent = formatPrice(shipping);
  if (totalEl) totalEl.textContent = formatPrice(subtotal + shipping);

  // Events qty & remove
  bodyEl.querySelectorAll(".cart-qty").forEach((input) => {
    input.addEventListener("change", (e) => {
      const idx = parseInt(e.target.dataset.index, 10);
      const value = Math.max(1, parseInt(e.target.value, 10) || 1);
      const cart = getCart();
      if (cart[idx]) {
        cart[idx].qty = value;
        saveCart(cart);
        renderCartPage();
      }
    });
  });

  bodyEl.querySelectorAll(".cart-remove").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const idx = parseInt(e.target.dataset.index, 10);
      const cart = getCart();
      cart.splice(idx, 1);
      saveCart(cart);
      renderCartPage();
    });
  });

  if (clearBtn) {
    clearBtn.onclick = () => {
      if (confirm("Voulez-vous vider le panier ?")) {
        clearCart();
        renderCartPage();
      }
    };
  }
}

function renderCheckoutSummary() {
  const container = document.getElementById("checkout-summary");
  if (!container) return;
  const cart = getCart();
  if (!cart.length) {
    container.innerHTML = "<p>Votre panier est vide.</p>";
    return;
  }
  let subtotal = 0;
  const ul = document.createElement("ul");
  ul.style.listStyle = "none";
  ul.style.paddingLeft = "0";

  cart.forEach((item) => {
    const li = document.createElement("li");
    li.style.marginBottom = "0.25rem";
    const total = item.price * item.qty;
    subtotal += total;
    li.textContent = `${item.qty} x ${item.name} (${formatPrice(total)})`;
    ul.appendChild(li);
  });

  const shipping = 2000;
  const total = subtotal + shipping;

  container.innerHTML = "";
  container.appendChild(ul);

  const pSubtotal = document.createElement("p");
  pSubtotal.textContent = "Sous-total : " + formatPrice(subtotal);
  const pShipping = document.createElement("p");
  pShipping.textContent = "Livraison : " + formatPrice(shipping);
  const pTotal = document.createElement("p");
  pTotal.style.fontWeight = "700";
  pTotal.textContent = "Total : " + formatPrice(total);

  container.appendChild(pSubtotal);
  container.appendChild(pShipping);
  container.appendChild(pTotal);
}

// Initialiser compteur au chargement
document.addEventListener("DOMContentLoaded", updateCartCount);
