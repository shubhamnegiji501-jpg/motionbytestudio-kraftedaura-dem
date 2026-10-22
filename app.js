/* Store integration boundary: populate KRAFTED_AURA_PRODUCTS from the real store API.
   Expected fields: id, name, price, image, scent, moodTags, category. */
window.KRAFTED_AURA_PRODUCTS = window.KRAFTED_AURA_PRODUCTS || [];
window.KRAFTED_AURA_SETTINGS = window.KRAFTED_AURA_SETTINGS || {};
const products = window.KRAFTED_AURA_PRODUCTS;
const settings = window.KRAFTED_AURA_SETTINGS;
if (settings.announcementBar) { const announcementText=document.querySelector('.announcement span'); if(announcementText) announcementText.textContent=settings.announcementBar; }
const nav = document.querySelector('.main-nav');
const toggle = document.querySelector('.menu-toggle');
const panel = document.querySelector('.side-panel');
const backdrop = document.querySelector('.panel-backdrop');
const panelContent = document.querySelector('.panel-content');
let activePanel = '';
const read = key => { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; } };
const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const lookup = id => products.find(product => String(product.id) === String(id));
const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const priceHTML = value => window.KraftCurrency ? window.KraftCurrency.markup(value) : '₹'+Number(value||0).toLocaleString('en-IN');
function showPanel(type, extra = '') {
  activePanel = type;
  backdrop.hidden = false;
  panel.classList.add('open');
  if (type === 'search') panelContent.innerHTML = `<h2>Find your glow.</h2><p>Search the Krafted Aura collection.</p><input id="search-input" type="search" placeholder="Search candles, scents…" autocomplete="off"><div id="search-results"></div>`;
  if (type === 'cart') {
    const cart = read('ca-cart');
    const entries = cart.map(row => ({...row, product:lookup(row.id)})).filter(row => row.product);
    panelContent.innerHTML = `<h2>Your bag <small>(${entries.reduce((sum,row)=>sum+row.quantity,0)})</small></h2>${entries.length ? entries.map(row=>`<div class="cart-row"><b>${esc(row.product.name)}</b><span>${priceHTML(row.product.price)} × ${row.quantity}</span><button data-remove="${esc(row.id)}">Remove</button></div>`).join('')+`<p>Checkout is available after the store backend is connected.</p><button class="button dark" disabled>Continue to checkout</button>` : '<p>Your bag is waiting for something lovely.</p><p>Live cart and checkout require the store connection.</p>'}`;
  }
  if (type === 'wishlist') {
    const list = read('ca-wishlist').map(lookup).filter(Boolean);
    panelContent.innerHTML = `<h2>Your saved pieces</h2>${list.length?list.map(p=>`<div class="cart-row"><b>${esc(p.name)}</b><span>${priceHTML(p.price)}</span><button class="wish-remove" data-wish-remove="${esc(p.id)}">Remove</button></div>`).join(''):'<p>Your wishlist is waiting for your first favourite.</p><p>Save products once the live catalog is connected.</p>'}`;
  }
  if (type === 'account') panelContent.innerHTML = '<h2>Your account</h2><p>Sign in and order history will be available when the store authentication service is connected.</p><a class="text-link" href="#footer">Contact the studio ↗</a>';
  panelContent.querySelector('#search-input')?.addEventListener('input', e=>renderSearch(e.target.value));
  panelContent.querySelectorAll('[data-remove]').forEach(button=>button.addEventListener('click',()=>{save('ca-cart',read('ca-cart').filter(row=>String(row.id)!==button.dataset.remove));showPanel('cart');updateCounts()}));
  panelContent.querySelectorAll('[data-wish-remove]').forEach(button=>button.addEventListener('click',()=>{save('ca-wishlist',read('ca-wishlist').filter(id=>String(id)!==button.dataset.wishRemove));updateCounts();showPanel('wishlist')}));
  panelContent.querySelector('[data-add]')?.addEventListener('click',e=>addToCart(e.currentTarget.dataset.add));
}
function closePanel(){ panel.classList.remove('open');backdrop.hidden=true;activePanel=''; }
function updateCounts(){document.querySelector('#cart-count').textContent=read('ca-cart').reduce((n,row)=>n+row.quantity,0);document.querySelector('#wish-count').textContent=read('ca-wishlist').length;}
function addToCart(id){const cart=read('ca-cart'),row=cart.find(item=>String(item.id)===String(id));row?row.quantity++:cart.push({id,quantity:1});save('ca-cart',cart);updateCounts();showPanel('cart');}
function searchText(p){return [p.name,p.scent,p.category,p.description,p.moodTags,p.keywords].flat().filter(Boolean).join(' ').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();}
function renderSearch(query){const holder=panelContent.querySelector('#search-results');if(!holder)return;const q=query.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');if(!q){holder.innerHTML='<p>Type a product, scent, occasion, or keyword to search.</p>';return;}const terms=q.split(/\s+/),matches=products.filter(p=>{const text=searchText(p);return terms.every(term=>text.includes(term));});holder.innerHTML=matches.length?matches.map(p=>`<a class="search-result" href="product.html?id=${encodeURIComponent(p.id)}">${esc(p.name)} <span>${priceHTML(p.price)}</span></a>`).join(''):'<p>No matching candles found. Try a scent, occasion, or keyword such as “diya”, “flower”, or “gift”.</p>';}
function renderCatalog(list=products){
  const area=document.querySelector('#product-area');
  if(!list.length){area.innerHTML='<p class="catalog-empty">The collection is taking shape. <a href="shop.html">Explore the shop ↗</a></p>';return;}
  const cards=list.map(p=>{const saved=read('ca-wishlist').some(x=>String(x)===String(p.id));return `<article class="product-card"><a class="product-card-image" href="product.html?id=${encodeURIComponent(p.id)}" style="background-image:url('${esc(p.image||'')}')" aria-label="View ${esc(p.name)}"><span class="product-card-tag">${esc(p.category||'KRAFTED AURA')}</span></a><button class="wish-button ${saved?'selected':''}" aria-label="Save ${esc(p.name)}" data-wish="${esc(p.id)}">${saved?'♥':'♡'}</button><div class="product-card-meta"><a href="product.html?id=${encodeURIComponent(p.id)}">${esc(p.name)}</a><b>${priceHTML(p.price)}</b></div><p class="product-card-scent">${esc(p.scent||'')}</p><button class="add-button" data-add="${esc(p.id)}">Add to Cart</button></article>`}).join('');
  area.innerHTML=`<div class="product-rail">${cards}</div>`;
  area.querySelectorAll('[data-wish]').forEach(b=>b.addEventListener('click',()=>{const id=b.dataset.wish,list=read('ca-wishlist');if(!list.some(x=>String(x)===String(id)))list.push(id);else list.splice(list.findIndex(x=>String(x)===String(id)),1);save('ca-wishlist',list);updateCounts();const selected=list.some(x=>String(x)===String(id));b.classList.toggle('selected',selected);b.textContent=selected?'♥':'♡'}));
  area.querySelectorAll('[data-add]').forEach(b=>b.addEventListener('click',()=>addToCart(b.dataset.add)));
}
function filterMood(mood){const matches=products.filter(p=>(p.moodTags||[]).some(tag=>tag.toLowerCase()===mood.toLowerCase()));document.querySelector('#products')?.scrollIntoView({behavior:'smooth'});if(matches.length)renderCatalog(matches);else if(products.length){const area=document.querySelector('#product-area');area.innerHTML='<div class="catalog-empty"><h3>No pieces tagged for this mood yet.</h3><p>Choose another atmosphere or explore all pieces.</p><button class="text-link" id="show-all">Show all products ↗</button></div>';area.querySelector('#show-all').addEventListener('click',()=>renderCatalog());}}
document.querySelectorAll('[data-panel]').forEach(button=>button.addEventListener('click',()=>showPanel(button.dataset.panel)));
document.querySelector('.panel-close').addEventListener('click',closePanel);backdrop.addEventListener('click',closePanel);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closePanel()});
toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close menu':'Open menu')});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false')}));
function newsletter(form, message){if(!form||!message)return;form.addEventListener('submit',async e=>{e.preventDefault();if(!form.reportValidity())return;const button=form.querySelector('button[type="submit"],button:not([type])');if(!settings.newsletterSubscribe){message.textContent='Newsletter signup will be enabled when the store email service is connected.';return;}if(button){button.disabled=true;button.dataset.label=button.textContent;button.textContent='…';}message.textContent='Adding you to the list…';try{await settings.newsletterSubscribe(new FormData(form).get('email')||form.querySelector('input[type="email"]').value);message.textContent='You’re on the list. Thank you.';form.reset();}catch{message.textContent='We couldn’t complete your signup. Please try again.';}finally{if(button){button.disabled=false;button.textContent=button.dataset.label;}}});}
newsletter(document.querySelector('#newsletter-form'),document.querySelector('.form-message'));
newsletter(document.querySelector('#footer-newsletter'),document.querySelector('.footer-message'));
document.querySelectorAll('.mood-card').forEach(card=>card.addEventListener('click',e=>{e.preventDefault();filterMood(card.querySelector('b').childNodes[0].textContent.trim())}));
renderCatalog();updateCounts();
