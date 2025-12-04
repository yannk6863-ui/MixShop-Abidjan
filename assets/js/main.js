document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.getElementById("nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("show");
    });
  }

  // Attach add-to-cart events on all pages
  const addButtons = document.querySelectorAll(".add-to-cart");
  addButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const product = {
        id: btn.dataset.id,
        name: btn.dataset.name,
        price: parseInt(btn.dataset.price, 10) || 0,
        category: btn.dataset.category || "",
        qty: 1,
      };
      addToCart(product);
      alert("Produit ajouté au panier !");
    });
  });

  // Panier page logic
  if (window.location.pathname.endsWith("panier.html")) {
    renderCartPage();
  }

  // Checkout page logic
  if (window.location.pathname.endsWith("commande.html")) {
    renderCheckoutSummary();
    const form = document.getElementById("checkout-form");
    const modal = document.getElementById("order-modal");
    if (form && modal) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        clearCart();
        modal.classList.remove("hidden");
      });
    }
  }
});
