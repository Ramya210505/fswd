const STORAGE_KEY = 'swaply-listings-v1';
const FAV_KEY = 'swaply-favs-v1';

let listings = load();
let favs = new Set(JSON.parse(localStorage.getItem(FAV_KEY) || '[]'));
let state = { cat: 'all', search: '', sort: 'new', price: 'all' };

const listingGrid = document.getElementById('listingGrid');
const emptyMsg = document.getElementById('emptyMsg');
const toast = document.getElementById('toast');

function uid() { return Math.random().toString(36).slice(2, 10); }
function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : seed();
  } catch { return seed(); }
}
function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(listings)); }
function saveFavs() { localStorage.setItem(FAV_KEY, JSON.stringify([...favs])); }

function seed() {
  const now = Date.now();
  return [
    { id: uid(), title: 'MacBook Air M1, 8/256GB', price: 42000, category: 'Electronics', condition: 'Like New', location: 'Trichy', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=60', desc: 'Barely used, comes with charger and original box. AppleCare active till Dec.', ts: now - 90000000 },
    { id: uid(), title: 'Study Table with Chair', price: 2800, category: 'Furniture', condition: 'Used', location: 'Pudukkottai', image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&q=60', desc: 'Sturdy wooden table, minor scratches. Great for a hostel room.', ts: now - 40000000 },
    { id: uid(), title: 'Data Structures & Algorithms (Set of 3)', price: 650, category: 'Books', condition: 'Used', location: 'Trichy', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=60', desc: 'Well-kept textbooks, minimal highlighting.', ts: now - 20000000 },
    { id: uid(), title: 'Denim Jacket, Size M', price: 900, category: 'Fashion', condition: 'New', location: 'Karaikudi', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=60', desc: 'Never worn, tag still attached.', ts: now - 5000000 },
    { id: uid(), title: 'Activa 5G, 2021', price: 58000, category: 'Vehicles', condition: 'Used', location: 'Pudukkottai', image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&q=60', desc: 'Single owner, all papers up to date, recently serviced.', ts: now - 300000000 }
  ];
}

// Sell form
const sellOverlay = document.getElementById('sellOverlay');
document.getElementById('openSell').addEventListener('click', () => sellOverlay.classList.add('is-open'));
document.getElementById('closeSell').addEventListener('click', () => sellOverlay.classList.remove('is-open'));
sellOverlay.addEventListener('click', (e) => { if (e.target === sellOverlay) sellOverlay.classList.remove('is-open'); });

document.getElementById('sellForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('itemTitle').value.trim();
  const price = Number(document.getElementById('itemPrice').value);
  if (!title || !price) return;

  listings.unshift({
    id: uid(),
    title,
    price,
    category: document.getElementById('itemCategory').value,
    condition: document.getElementById('itemCondition').value,
    location: document.getElementById('itemLocation').value.trim() || 'Not specified',
    image: document.getElementById('itemImage').value.trim() || 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=60',
    desc: document.getElementById('itemDesc').value.trim() || 'No description provided.',
    ts: Date.now()
  });

  save();
  e.target.reset();
  sellOverlay.classList.remove('is-open');
  render();
  showToast('Listing published!');
});

// Filters
document.getElementById('categoryBar').addEventListener('click', (e) => {
  const btn = e.target.closest('.cat-chip');
  if (!btn) return;
  state.cat = btn.dataset.cat;
  document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('is-active'));
  btn.classList.add('is-active');
  render();
});
document.getElementById('searchInput').addEventListener('input', (e) => { state.search = e.target.value.toLowerCase(); render(); });
document.getElementById('sortSelect').addEventListener('change', (e) => { state.sort = e.target.value; render(); });
document.getElementById('priceFilter').addEventListener('change', (e) => { state.price = e.target.value; render(); });

function getFiltered() {
  let list = [...listings];
  if (state.cat !== 'all') list = list.filter(l => l.category === state.cat);
  if (state.search) list = list.filter(l => l.title.toLowerCase().includes(state.search));
  if (state.price !== 'all') list = list.filter(l => l.price <= Number(state.price));

  if (state.sort === 'low') list.sort((a, b) => a.price - b.price);
  else if (state.sort === 'high') list.sort((a, b) => b.price - a.price);
  else list.sort((a, b) => b.ts - a.ts);

  return list;
}

function timeAgo(ts) {
  const d = Math.floor((Date.now() - ts) / 86400000);
  if (d < 1) return 'Today';
  if (d === 1) return '1 day ago';
  return `${d} days ago`;
}

function render() {
  const filtered = getFiltered();
  listingGrid.innerHTML = filtered.map(l => `
    <article class="listing-card" data-id="${l.id}">
      <div class="listing-img" style="background-image:url('${l.image}')">
        <span class="condition-badge">${l.condition}</span>
        <button class="fav-btn ${favs.has(l.id) ? 'is-fav' : ''}" data-fav="${l.id}" aria-label="Save">${favs.has(l.id) ? '♥' : '♡'}</button>
      </div>
      <div class="listing-body">
        <span class="listing-price">₹${l.price.toLocaleString('en-IN')}</span>
        <span class="listing-title">${l.title}</span>
        <div class="listing-meta"><span>${l.location}</span><span>${timeAgo(l.ts)}</span></div>
      </div>
    </article>
  `).join('');

  emptyMsg.classList.toggle('is-visible', filtered.length === 0);

  listingGrid.querySelectorAll('.fav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.fav;
      favs.has(id) ? favs.delete(id) : favs.add(id);
      saveFavs();
      btn.classList.toggle('is-fav');
      btn.textContent = favs.has(id) ? '♥' : '♡';
      btn.classList.add('bump');
      setTimeout(() => btn.classList.remove('bump'), 350);
    });
  });

  listingGrid.querySelectorAll('.listing-card').forEach(card => {
    card.addEventListener('click', () => openDetail(card.dataset.id));
  });
}

// Detail modal
const detailOverlay = document.getElementById('detailOverlay');
const detailModal = document.getElementById('detailModal');
function openDetail(id) {
  const l = listings.find(x => x.id === id);
  if (!l) return;
  detailModal.innerHTML = `
    <img src="${l.image}" alt="${l.title}">
    <div class="modal-detail-body">
      <button class="close-btn" id="closeDetail" style="float:right; margin-top:-6px;">✕</button>
      <h2>${l.title}</h2>
      <div class="modal-detail-price">₹${l.price.toLocaleString('en-IN')}</div>
      <div class="modal-detail-tags">
        <span>${l.category}</span><span>${l.condition}</span><span>${l.location}</span>
      </div>
      <p class="modal-detail-desc">${l.desc}</p>
      <button class="contact-seller-btn" id="contactSeller">Contact seller</button>
    </div>
  `;
  detailOverlay.classList.add('is-open');
  document.getElementById('closeDetail').addEventListener('click', () => detailOverlay.classList.remove('is-open'));
  document.getElementById('contactSeller').addEventListener('click', () => showToast('Message sent to seller!'));
}
detailOverlay.addEventListener('click', (e) => { if (e.target === detailOverlay) detailOverlay.classList.remove('is-open'); });

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('is-visible');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('is-visible'), 2200);
}

render();
