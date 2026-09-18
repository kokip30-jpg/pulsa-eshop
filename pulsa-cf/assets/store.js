/* ============ SHARED PRODUCT DATA ============ */
const PRODUCTS = [
  {
        id: 'lite',
        category: 'ems',
        name: 'PULSA Lite',
        tag: 'Domácí / malý provoz',
        desc: '2 hlavice · pro domácí a menší provozovny',
        price: 59995,
        oldPrice: 84995,
        featured: false,
        power: '4 úrovně',
        heads: '2 hlavice',
        warranty: '1 rok',
        features: ['2 aplikační hlavice', '4 úrovně intenzity', 'Aplikace na břicho a hýždě', '1 rok záruka']
  },
  {
        id: 'pro',
        category: 'ems',
        name: 'PULSA Pro',
        tag: 'Studio · nejoblíbenější',
        desc: '4 hlavice · nejoblíbenější volba studií',
        price: 99990,
        oldPrice: 119999,
        featured: true,
        power: '6 úrovní',
        heads: '4 hlavice',
        warranty: '2 roky',
        features: ['4 aplikační hlavice', '6 úrovní intenzity', 'Aplikace na tělo i paže', 'Instalace a školení v ceně', '2 roky záruka']
  },
  {
        id: 'promax',
        category: 'ems',
        name: 'PULSA Pro Max',
        tag: 'Vysoký provoz',
        desc: '4 hlavice a sedací podložka pro tvarování hýždí',
        price: 99900,
        oldPrice: 149900,
        featured: false,
        power: '6 úrovní + boost',
        heads: '4 hlavice + sedák',
        warranty: '2 roky',
        features: ['4 aplikační hlavice', 'Sedací podložka na pánevní dno', '6 úrovní intenzity + boost mód', '2 roky záruka', 'Prioritní servis']
  },
  {
        id: 'goldmax',
        category: 'ems',
        name: 'PULSA Gold Max',
        tag: 'Vlajkový model',
        desc: '4 hlavice · nejvyšší výkon pro velké provozy',
        price: 199990,
        oldPrice: 349000,
        featured: false,
        power: 'Maximální výkon',
        heads: '4 hlavice',
        warranty: '2 roky',
        features: ['4 aplikační hlavice', 'Nejvyšší dostupný výkon pole', 'Prémiové provedení', '2 roky záruka', 'Prioritní servis']
  },
  {
        id: 'face',
        category: 'face',
        name: 'PULSA Face',
        tag: 'Obličejová anti-age terapie',
        desc: 'Kombinace EM a RF technologie pro obličej',
        price: 99990,
        oldPrice: 139990,
        featured: false,
        power: 'EM + RF',
        heads: '1 hlavice',
        warranty: '1 rok',
        features: ['Kombinace EM a RF technologie', 'Zpevnění obličejových svalů', 'Podpora tvorby kolagenu', '1 rok záruka']
  },
  {
        id: 'lift',
        category: 'hifu',
        name: 'PULSA Lift',
        tag: 'Liftingový HIFU přístroj',
        desc: 'Fokusovaný ultrazvuk pro neinvazivní lifting',
        price: 129990,
        oldPrice: 199990,
        featured: false,
        power: 'HIFU 25D',
        heads: 'více hloubek',
        warranty: '1 rok',
        features: ['Fokusovaný ultrazvuk HIFU', 'Lifting obličeje a krku', 'Nastavitelná hloubka průniku', '1 rok záruka']
  },
  {
        id: 'glow',
        category: 'laser',
        name: 'PULSA Glow',
        tag: 'IPL laserová epilace',
        desc: 'Profesionální IPL laser pro trvalou redukci ochlupení',
        price: 60500,
        oldPrice: 89990,
        featured: false,
        power: 'IPL',
        heads: '1 hlavice',
        warranty: '1 rok',
        features: ['IPL technologie', 'Vhodné pro většinu typů pleti', 'Rychlé ošetření velkých ploch', '1 rok záruka']
  },
  {
        id: 'skinai',
        category: 'ai',
        name: 'PULSA Skin AI',
        tag: 'AI diagnostika pleti',
        desc: 'AI analyzátor pleti a vlasové pokožky pro salony',
        price: 89990,
        oldPrice: 109990,
        featured: false,
        power: 'AI analýza',
        heads: '—',
        warranty: '1 rok',
        features: ['AI diagnostika pleti', 'Analýza vlasové pokožky', 'Přehledný report pro klienta', '1 rok záruka']
  },
  {
        id: 'sedak',
        category: 'accessory',
        name: 'Sedák PULSA',
        tag: 'Příslušenství',
        desc: 'Sedák pro tvarování hýždí a posílení pánevního dna',
        price: 14999,
        oldPrice: 24990,
        featured: false,
        power: '—',
        heads: '—',
        warranty: '1 rok',
        features: ['Kompatibilní s modely Pro Max a Gold Max', 'Bezkontaktní ošetření vsedě', '1 rok záruka']
  },
  {
        id: 'elektrody',
        category: 'accessory',
        name: 'Náhradní elektrody 10 ks',
        tag: 'Příslušenství',
        desc: 'Sada náhradních elektrod pro EMS rollery',
        price: 4000,
        oldPrice: null,
        featured: false,
        power: '—',
        heads: '—',
        warranty: '—',
        features: ['10 kusů v balení', 'Kompatibilní se všemi rollery PULSA']
  }
  ];

const fmtCZK = (n) => n.toLocaleString('cs-CZ') + ' Kč';

/* ============ CART (in-memory only, resets per page load) ============ */
let cart = [];

function addToCart(id){
    const existing = cart.find(i => i.id === id);
    if(existing){ existing.qty += 1; } else { cart.push({ id, qty: 1 }); }
    renderCart();
    openDrawer();
}
function setQty(id, qty){
    const item = cart.find(i => i.id === id);
    if(!item) return;
    item.qty = qty;
    if(item.qty <= 0){ cart = cart.filter(i => i.id !== id); }
    renderCart();
}
function removeFromCart(id){
    cart = cart.filter(i => i.id !== id);
    renderCart();
}
function cartTotal(){
    return cart.reduce((sum, i) => {
          const p = PRODUCTS.find(p => p.id === i.id);
          return sum + (p ? p.price * i.qty : 0);
    }, 0);
}
function cartCount(){ return cart.reduce((n, i) => n + i.qty, 0); }

function renderCart(){
    const countEl = document.getElementById('cartCount');
    if(countEl) countEl.textContent = cartCount();
    const body = document.getElementById('drawerBody');
    const foot = document.getElementById('drawerFoot');
    if(!body || !foot) return;
    if(cart.length === 0){
          body.innerHTML = '<div class="drawer-empty">Košík je zatím prázdný.<br>Přidejte si přístroj z nabídky.</div>';
          foot.style.display = 'none';
          return;
    }
    foot.style.display = 'block';
    body.innerHTML = cart.map(item => {
          const p = PRODUCTS.find(p => p.id === item.id);
          return `
                <div class="cart-item">
                        <div class="cart-item-thumb">
                                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="4" width="16" height="16" rx="4"/><path d="M9 12h6M12 9v6"/></svg>
                                          </div>
                                                  <div class="cart-item-info">
                                                            <div class="name">${p.name}</div>
                                                                      <div class="price mono">${fmtCZK(p.price)}</div>
                                                                                <div class="qty-row">
                                                                                            <button class="qty-btn" data-action="dec" data-id="${p.id}" aria-label="Snížit množství">−</button>
                                                                                                        <span class="qty-val">${item.qty}</span>
                                                                                                                    <button class="qty-btn" data-action="inc" data-id="${p.id}" aria-label="Zvýšit množství">+</button>
                                                                                                                              </div>
                                                                                                                                        <button class="remove-btn" data-action="remove" data-id="${p.id}">Odebrat</button>
                                                                                                                                                </div>
                                                                                                                                                      </div>`;
    }).join('');
    const subtotalEl = document.getElementById('subtotalAmt');
    if(subtotalEl) subtotalEl.textContent = fmtCZK(cartTotal());
}

/* ============ DRAWER / MODAL CONTROLS ============ */
function openDrawer(){
    document.getElementById('overlay')?.classList.add('active');
    document.getElementById('drawer')?.classList.add('active');
}
function closeDrawer(){
    document.getElementById('overlay')?.classList.remove('active');
    document.getElementById('drawer')?.classList.remove('active');
}
function openModal(){
    document.getElementById('checkoutModal')?.classList.add('active');
    renderCheckoutForm();
}
function closeModal(){
    document.getElementById('checkoutModal')?.classList.remove('active');
}

function renderCheckoutForm(){
    const modalBox = document.getElementById('modalBox');
    if(!modalBox) return;
    modalBox.innerHTML = `
        <button class="modal-close" id="modalCloseBtn" aria-label="Zavřít">✕</button>
            <h3>Dokončit objednávku</h3>
                <div class="sub">Po odeslání budete přesměrováni na zabezpečenou platbu kartou.</div>
                    <div class="modal-summary">
                          ${cart.map(i => {
                                    const p = PRODUCTS.find(p => p.id === i.id);
                                    return `<div class="row"><span>${p.name} × ${i.qty}</span><span class="mono">${fmtCZK(p.price * i.qty)}</span></div>`;
                          }).join('')}
                                <div class="row total"><span>Celkem</span><span>${fmtCZK(cartTotal())}</span></div>
                                    </div>
                                        <form id="checkoutForm">
                                              <div class="field-row">
                                                      <div class="field"><label>Jméno</label><input required type="text" id="ckFirstName" placeholder="Jan"></div>
                                                              <div class="field"><label>Příjmení</label><input required type="text" id="ckLastName" placeholder="Novák"></div>
                                                                    </div>
                                                                          <div class="field"><label>E-mail</label><input required type="email" id="ckEmail" placeholder="jan.novak@email.cz"></div>
                                                                                <div class="field"><label>Telefon</label><input required type="tel" id="ckPhone" placeholder="+420 777 123 456"></div>
                                                                                      <button type="submit" class="btn btn-primary btn-block" id="ckSubmitBtn">Pokračovat k platbě kartou</button>
                                                                                            <div id="ckError" style="display:none; color:var(--coral); font-size:12.5px; margin-top:10px;"></div>
                                                                                                  <div class="note-banner">Platbu zpracovává Stripe — údaje o kartě nikdy neprocházejí přes tento web ani naše servery.</div>
                                                                                                      </form>
                                                                                                        `;
    document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
    document.getElementById('checkoutForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          const submitBtn = document.getElementById('ckSubmitBtn');
          const errorBox = document.getElementById('ckError');
          errorBox.style.display = 'none';
          submitBtn.disabled = true;
          submitBtn.textContent = 'Vytvářím platbu…';

                                                                 const customer = {
                                                                         name: document.getElementById('ckFirstName').value.trim() + ' ' + document.getElementById('ckLastName').value.trim(),
                                                                         email: document.getElementById('ckEmail').value.trim(),
                                                                         phone: document.getElementById('ckPhone').value.trim()
                                                                 };

                                                                 try{
                                                                         const res = await fetch('/create-checkout', {
                                                                                   method: 'POST',
                                                                                   headers: { 'Content-Type': 'application/json' },
                                                                                   body: JSON.stringify({ items: cart, customer })
                                                                         });
                                                                         const data = await res.json();
                                                                         if(!res.ok || !data.url){
                                                                                   throw new Error(data.error || 'Platbu se nepodařilo vytvořit.');
                                                                         }
                                                                         window.location.href = data.url;
                                                                 } catch(err){
                                                                         errorBox.textContent = err.message || 'Něco se nepovedlo. Zkuste to prosím znovu.';
                                                                         errorBox.style.display = 'block';
                                                                         submitBtn.disabled = false;
                                                                         submitBtn.textContent = 'Pokračovat k platbě kartou';
                                                                 }
    });
}

function renderSuccess(){
    const modalBox = document.getElementById('modalBox');
    modalBox.innerHTML = `
        <button class="modal-close" id="modalCloseBtn2" aria-label="Zavřít">✕</button>
            <div class="success-box">
                  <div class="check"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M4 12l5 5 11-11"/></svg></div>
                        <h3>Objednávka odeslána</h3>
                              <p>Děkujeme za objednávku. Potvrzení a další kroky vám pošleme e-mailem do 24 hodin.</p>
                                    <button class="btn btn-primary btn-block" id="closeSuccessBtn">Zavřít</button>
                                        </div>
                                          `;
    const close = () => { closeModal(); closeDrawer(); };
    document.getElementById('modalCloseBtn2').addEventListener('click', close);
    document.getElementById('closeSuccessBtn').addEventListener('click', close);
}

/* ============ INIT SHARED UI (call on every page) ============ */
function initStoreUI(){
    renderCart();

  document.getElementById('cartToggle')?.addEventListener('click', openDrawer);
    document.getElementById('drawerClose')?.addEventListener('click', closeDrawer);
    document.getElementById('overlay')?.addEventListener('click', () => { closeDrawer(); closeModal(); });
    document.getElementById('modalBackdrop')?.addEventListener('click', closeModal);

  document.getElementById('drawerBody')?.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-action]');
        if(!btn) return;
        const id = btn.dataset.id;
        const item = cart.find(i => i.id === id);
        if(btn.dataset.action === 'inc') setQty(id, item.qty + 1);
        if(btn.dataset.action === 'dec') setQty(id, item.qty - 1);
        if(btn.dataset.action === 'remove') removeFromCart(id);
  });

  document.getElementById('checkoutBtn')?.addEventListener('click', () => {
        if(cart.length === 0) return;
        openModal();
  });

  const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    navToggle?.addEventListener('click', () => mobileMenu?.classList.toggle('open'));

  document.body.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-add]');
        if(!btn) return;
        addToCart(btn.dataset.add);
  });

  document.querySelectorAll('.faq-list').forEach(list => {
        list.addEventListener('click', (e) => {
                const q = e.target.closest('.faq-q');
                if(!q) return;
                const item = q.closest('.faq-item');
                const answer = item.querySelector('.faq-a');
                const isOpen = item.classList.contains('open');
                list.querySelectorAll('.faq-item').forEach(i => {
                          i.classList.remove('open');
                          i.querySelector('.faq-a').style.maxHeight = null;
                });
                if(!isOpen){
                          item.classList.add('open');
                          answer.style.maxHeight = answer.scrollHeight + 'px';
                }
        });
  });
}

document.addEventListener('DOMContentLoaded', initStoreUI);
