// =============================================
// SKsignaturez – Sanity product fetch & render
// Runs client-side at runtime. New/edited products
// in Sanity Studio appear on next page load with no
// rebuild or redeploy.
// =============================================

const BADGE_LABELS = {
  new: 'New',
  sale: 'Sale',
  bestseller: 'Best Seller',
  limited: 'Limited Edition',
};

function sanityQueryUrl(query) {
  const { projectId, dataset, apiVersion } = window.SANITY_CONFIG;
  const base = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`;
  return `${base}?query=${encodeURIComponent(query)}`;
}

async function fetchProducts() {
  const query = `*[_type == "product" && isActive == true] | order(_createdAt desc) {
    _id,
    name,
    price,
    originalPrice,
    shortDescription,
    category,
    badge,
    "imageUrl": image.asset->url
  }`;

  const res = await fetch(sanityQueryUrl(query));
  if (!res.ok) throw new Error(`Sanity request failed: ${res.status}`);
  const { result } = await res.json();
  return result || [];
}

function formatPrice(n) {
  return `$${Number(n).toFixed(2)}`;
}

function buildProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.dataset.category = product.category || '';

  const imgWrap = document.createElement('div');
  imgWrap.className = 'product-img-wrap';

  const img = document.createElement('img');
  img.src = product.imageUrl || '';
  img.alt = product.name || '';
  img.loading = 'lazy';
  imgWrap.appendChild(img);

  const badges = document.createElement('div');
  badges.className = 'product-badges';
  if (product.badge && BADGE_LABELS[product.badge]) {
    const badge = document.createElement('span');
    badge.className = `badge ${product.badge}`;
    badge.textContent = BADGE_LABELS[product.badge];
    badges.appendChild(badge);
  }
  imgWrap.appendChild(badges);

  const actions = document.createElement('div');
  actions.className = 'product-actions';

  const addBtn = document.createElement('button');
  addBtn.className = 'quick-add';
  addBtn.textContent = 'Add to Cart';
  addBtn.addEventListener('click', () => addToCart(addBtn, product.name, product.price));
  actions.appendChild(addBtn);

  const wishlistBtn = document.createElement('button');
  wishlistBtn.className = 'wishlist-btn';
  wishlistBtn.setAttribute('aria-label', 'Wishlist');
  wishlistBtn.innerHTML =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
  actions.appendChild(wishlistBtn);

  imgWrap.appendChild(actions);
  card.appendChild(imgWrap);

  const info = document.createElement('div');
  info.className = 'product-info';

  const brand = document.createElement('p');
  brand.className = 'product-brand';
  brand.textContent = '@sksignaturez';
  info.appendChild(brand);

  const name = document.createElement('h3');
  name.className = 'product-name';
  name.textContent = product.name || '';
  info.appendChild(name);

  const price = document.createElement('div');
  price.className = 'product-price';
  const priceSpan = document.createElement('span');
  priceSpan.textContent = formatPrice(product.price);
  price.appendChild(priceSpan);
  if (product.originalPrice) {
    const originalSpan = document.createElement('span');
    originalSpan.className = 'original';
    originalSpan.textContent = formatPrice(product.originalPrice);
    price.appendChild(originalSpan);
  }
  info.appendChild(price);

  if (product.shortDescription) {
    const desc = document.createElement('p');
    desc.className = 'product-desc';
    desc.textContent = product.shortDescription;
    info.appendChild(desc);
  }

  card.appendChild(info);
  return card;
}

function renderProductGrid(products) {
  const grid = document.getElementById('productGrid');
  grid.innerHTML = '';

  if (!products.length) {
    grid.innerHTML = '<p class="product-grid-empty">No products available right now — check back soon.</p>';
    return;
  }

  products.forEach((product) => {
    const card = buildProductCard(product);
    grid.appendChild(card);

    // Match the existing fade-in treatment from script.js
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity .5s ease, transform .5s ease';
    if (typeof observer !== 'undefined') observer.observe(card);
  });

  // Re-apply the currently active filter tab to the freshly rendered cards
  const activeTab = document.querySelector('.tab.active');
  const filter = activeTab ? activeTab.dataset.filter : 'all';
  grid.querySelectorAll('.product-card').forEach((card) => {
    const show = filter === 'all' || card.dataset.category === filter;
    card.style.display = show ? '' : 'none';
  });
}

function showProductGridLoading() {
  const grid = document.getElementById('productGrid');
  grid.innerHTML = '<p class="product-grid-loading">Loading products…</p>';
}

function showProductGridError() {
  const grid = document.getElementById('productGrid');
  grid.innerHTML = '<p class="product-grid-empty">Could not load products. Please refresh the page.</p>';
}

async function initProductGrid() {
  showProductGridLoading();
  try {
    const products = await fetchProducts();
    renderProductGrid(products);
  } catch (err) {
    console.error(err);
    showProductGridError();
  }
}

initProductGrid();
