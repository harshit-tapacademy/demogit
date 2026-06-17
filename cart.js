// Shop E-Commerce Cart Logic (Shared across all pages)
// Synchronizes state via localStorage and handles hot updates across tabs

(function() {
  // 1. Inject Cart Drawer elements into body on load
  document.addEventListener('DOMContentLoaded', () => {
    injectCartDrawer();
    setupCartListeners();
    updateCartBadge();
    renderCart();
  });

  // Listen to cross-tab storage changes to keep tabs synchronized
  window.addEventListener('storage', (e) => {
    if (e.key === 'shop_cart') {
      updateCartBadge();
      renderCart();
    }
  });

  function injectCartDrawer() {
    // Check if already injected
    if (document.getElementById('cart-drawer')) return;

    // Create container
    const container = document.createElement('div');
    container.innerHTML = `
      <div class="cart-overlay" id="cart-overlay"></div>
      <div class="cart-drawer" id="cart-drawer">
        <div class="cart-drawer-header">
          <span class="cart-drawer-title">Bag</span>
          <button class="cart-drawer-close" id="cart-close-btn" aria-label="Close Bag">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        
        <div class="cart-drawer-items" id="cart-drawer-items-list">
          <!-- Cart items generated dynamically -->
        </div>
        
        <div class="cart-drawer-footer">
          <div class="cart-subtotal-row">
            <span class="subtotal-label">Total</span>
            <span class="subtotal-amount" id="cart-total-amount">₹0</span>
          </div>
          <p class="cart-tax-notice">Shipping and taxes calculated at checkout.</p>
          <button class="cart-checkout-btn" id="cart-checkout-btn">Checkout</button>
        </div>
      </div>
    `;

    // Append to body
    document.body.appendChild(container);
  }

  function setupCartListeners() {
    const overlay = document.getElementById('cart-overlay');
    const drawer = document.getElementById('cart-drawer');
    const closeBtn = document.getElementById('cart-close-btn');
    const checkoutBtn = document.getElementById('cart-checkout-btn');

    // Find cart trigger button in the navigation rail
    // We look for a link whose href is "#" or has aria-label="Shopping Cart"
    const cartTrigger = document.querySelector('a[aria-label="Shopping Cart"]') || document.querySelector('.left-nav-rail .nav-links-stack a:nth-child(5)');

    if (cartTrigger) {
      cartTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        openCart();
      });
      
      // Inject badge structure to nav item if missing
      if (!cartTrigger.querySelector('.cart-badge')) {
        const badge = document.createElement('span');
        badge.className = 'cart-badge';
        badge.style.display = 'none'; // Hidden by default
        cartTrigger.appendChild(badge);
      }
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', closeCart);
    }

    if (overlay) {
      overlay.addEventListener('click', closeCart);
    }

    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        const cart = getCart();
        if (cart.length === 0) {
          alert('Your bag is empty.');
          return;
        }
        alert('Proceeding to checkout with mock payment gateway. Total Amount: ' + document.getElementById('cart-total-amount').innerText);
        localStorage.removeItem('shop_cart');
        closeCart();
        updateCartBadge();
        renderCart();
      });
    }
  }

  // Global functions exposed to window
  window.getCart = function() {
    try {
      return JSON.parse(localStorage.getItem('shop_cart')) || [];
    } catch (e) {
      return [];
    }
  };

  window.openCart = function() {
    const overlay = document.getElementById('cart-overlay');
    const drawer = document.getElementById('cart-drawer');
    if (overlay && drawer) {
      overlay.classList.add('active');
      drawer.classList.add('active');
      renderCart();
    }
  };

  window.closeCart = function() {
    const overlay = document.getElementById('cart-overlay');
    const drawer = document.getElementById('cart-drawer');
    if (overlay && drawer) {
      overlay.classList.remove('active');
      drawer.classList.remove('active');
    }
  };

  window.addToCart = function(productId, quantity = 1) {
    const cart = getCart();
    const existing = cart.find(item => item.id === productId);
    
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ id: productId, quantity });
    }
    
    localStorage.setItem('shop_cart', JSON.stringify(cart));
    updateCartBadge();
    renderCart();
    openCart();
  };

  window.updateQuantity = function(productId, delta) {
    let cart = getCart();
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      cart = cart.filter(item => item.id !== productId);
    }

    localStorage.setItem('shop_cart', JSON.stringify(cart));
    updateCartBadge();
    renderCart();
  };

  window.removeFromCart = function(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('shop_cart', JSON.stringify(cart));
    updateCartBadge();
    renderCart();
  };

  function updateCartBadge() {
    const cart = getCart();
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const badges = document.querySelectorAll('.left-nav-rail .cart-badge');
    
    badges.forEach(badge => {
      if (count > 0) {
        badge.innerText = count;
        badge.style.display = 'flex';
      } else {
        badge.style.display = 'none';
      }
    });
  }

  function renderCart() {
    const itemsList = document.getElementById('cart-drawer-items-list');
    const totalAmount = document.getElementById('cart-total-amount');
    if (!itemsList) return;

    const cart = getCart();
    
    if (cart.length === 0) {
      itemsList.innerHTML = `
        <div class="cart-empty-state">
          <p>Your bag is empty.</p>
          <button class="outlined-pill-button" onclick="closeCart()" style="margin-top: 16px;">Continue Shopping</button>
        </div>
      `;
      if (totalAmount) totalAmount.innerText = '₹0';
      return;
    }

    let html = '';
    let total = 0;

    cart.forEach(item => {
      // Find product in DB
      // We check window.productsDb which should be loaded
      const product = window.getProductById ? window.getProductById(item.id) : null;
      if (!product) return;

      const itemTotal = product.price * item.quantity;
      total += itemTotal;

      html += `
        <div class="cart-item-card" id="cart-item-${product.id}">
          <div class="cart-item-img-wrap">
            <img src="${product.images[0]}" alt="${product.title}">
          </div>
          <div class="cart-item-details">
            <div class="cart-item-header">
              <span class="cart-item-title">${product.title}</span>
              <button class="cart-item-remove" onclick="removeFromCart('${product.id}')" aria-label="Remove item">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            </div>
            <div class="cart-item-meta">
              <span class="cart-item-price">₹${product.price.toLocaleString('en-IN')}</span>
            </div>
            <div class="cart-item-qty-row">
              <div class="qty-counter">
                <button class="qty-btn" onclick="updateQuantity('${product.id}', -1)" aria-label="Decrease quantity">-</button>
                <span class="qty-val">${item.quantity}</span>
                <button class="qty-btn" onclick="updateQuantity('${product.id}', 1)" aria-label="Increase quantity">+</button>
              </div>
              <span class="cart-item-subtotal">₹${itemTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      `;
    });

    itemsList.innerHTML = html;
    if (totalAmount) {
      totalAmount.innerText = '₹' + total.toLocaleString('en-IN');
    }
  }
})();
