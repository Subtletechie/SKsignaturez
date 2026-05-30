let cartItems = [], cartCount = 0;

window.addEventListener('scroll', () => {
  document.getElementById('header').classList.toggle('scrolled', window.scrollY > 40);
});

document.getElementById('searchToggle').addEventListener('click', () => {
  document.getElementById('searchBar').classList.toggle('open');
});

document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('mobileNav').classList.toggle('open');
});

function toggleCart() {
  document.getElementById('cartDrawer').classList.toggle('open');
  document.getElementById('cartOverlay').classList.toggle('open');
}
document.getElementById('cartToggle').addEventListener('click', toggleCart);
document.getElementById('closeCart').addEventListener('click', toggleCart);
document.getElementById('cartOverlay').addEventListener('click', toggleCart);

function addToCart(btn, name, price) {
  cartItems.push({ name, price, img: btn.closest('.product-img-wrap, .bestseller-item')?.querySelector('img')?.src || '' });
  cartCount++;
  document.querySelector('.cart-count').textContent = cartCount;
  document.getElementById('cartItemCount').textContent = '(' + cartCount + ')';
  renderCart();
  showToast(name + ' added to cart');
}

function renderCart() {
  const container = document.getElementById('cartItems');
  const footer = document.getElementById('cartFooter');
  if (!cartItems.length) {
    container.innerHTML = '<div class="cart-empty"><p>Your cart is empty</p><a href="#featured" class="btn btn-primary" onclick="toggleCart()">Continue Shopping</a></div>';
    footer.style.display = 'none';
    return;
  }
  let total = 0;
  container.innerHTML = cartItems.map((item, i) => {
    total += item.price;
    return '<div class="cart-line"><img src="' + (item.img || 'https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=200&q=80') + '" alt="' + item.name + '" /><div><div class="cart-line-name">' + item.name + '</div><div class="cart-line-price">$' + item.price.toFixed(2) + '</div></div><button class="cart-line-remove" onclick="removeFromCart(' + i + ')">×</button></div>';
  }).join('');
  document.getElementById('cartTotal').textContent = '$' + total.toFixed(2);
  footer.style.display = 'flex';
}

function removeFromCart(index) {
  cartItems.splice(index, 1);
  cartCount--;
  document.querySelector('.cart-count').textContent = cartCount;
  document.getElementById('cartItemCount').textContent = '(' + cartCount + ')';
  renderCart();
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.dot');
let current = 0, autoplay;

function goToSlide(n) {
  slides[current].classList.remove('active');
  dots[current].classList.remove('active');
  current = (n + slides.length) % slides.length;
  slides[current].classList.add('active');
  dots[current].classList.add('active');
}

function startAutoplay() { autoplay = setInterval(() => goToSlide(current + 1), 5000); }

document.getElementById('heroNext').addEventListener('click', () => { clearInterval(autoplay); goToSlide(current + 1); startAutoplay(); });
document.getElementById('heroPrev').addEventListener('click', () => { clearInterval(autoplay); goToSlide(current - 1); startAutoplay(); });
dots.forEach((d, i) => d.addEventListener('click', () => { clearInterval(autoplay); goToSlide(i); startAutoplay(); }));
startAutoplay();

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;
    document.querySelectorAll('.product-card').forEach(card => {
      card.style.display = (filter === 'all' || card.dataset.category === filter) ? '' : 'none';
    });
  });
});

function handleNewsletter(e) {
  e.preventDefault();
  showToast('Thanks for subscribing!');
  e.target.reset();
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.1 });

const styleEl = document.createElement('style');
styleEl.textContent = '.visible { opacity: 1 !important; transform: translateY(0) !important; }';
document.head.appendChild(styleEl);

document.querySelectorAll('.product-card, .cat-tile, .bestseller-item, .feature, .insta-tile').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity .5s ease ' + ((i % 4) * 60) + 'ms, transform .5s ease ' + ((i % 4) * 60) + 'ms';
  observer.observe(el);
});