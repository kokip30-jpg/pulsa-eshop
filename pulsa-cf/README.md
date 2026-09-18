# PULSA e-shop — nasazení na Cloudflare Pages s reálnou platbou kartou

Tento balíček obsahuje celý web (`index.html`, `produkty.html`, `o-pristrojich.html`,
`kontakt.html`) plus funkční platbu kartou přes Stripe Checkout.

Platba běží přes `functions/create-checkout.js` — soubor ve složce `functions`
se na Cloudflare Pages automaticky stane serverovým endpointem na stejné
cestě (`/create-checkout`). Nepotřebuje žádnou instalaci knihoven ani build
krok — volá se přímo Stripe API přes `fetch`.

---

## 1. Založ si Stripe účet (pokud ještě nemáš)

Postup je stejný jako předtím: dashboard.stripe.com/register, v
**Developers → API keys** najdeš **Secret key**. Klíč nikam nepiš (ani sem
do žádného chatu) — jen ho zkopíruj, za chvíli ho vložíš přímo do
Cloudflare.

## 2. Založ si účet na Cloudflare (zdarma, bez karty)

1. Jdi na https://dash.cloudflare.com/sign-up a zaregistruj se e-mailem.
2. V levém menu vyber **Workers & Pages**.
3. Klikni na **Create application → Pages → Upload assets**.

## 3. Nahraj web

1. Zadej název projektu (např. `pulsa-eshop`).
2. Přetáhni do nahrávacího pole **celý obsah této složky** — soubory
   `index.html`, `produkty.html` atd. i podsložky `assets` a `functions`.
3. Klikni na **Deploy site**.
4. Cloudflare přidělí adresu typu `pulsa-eshop.pages.dev`.

## 4. Nastav tajný klíč jako proměnnou prostředí

1. V projektu jdi na **Settings → Environment variables**.
2. Přidej proměnnou:
   - **Variable name:** `STRIPE_SECRET_KEY`
   - **Value:** tvůj Stripe Secret key (`sk_test_...` nebo `sk_live_...`)
   - Ulož pro prostředí **Production** (a případně i **Preview**).
3. Jdi na **Deployments** a klikni **Retry deployment** (nebo nahraj web
   znovu) — proměnná se načte až při novém nasazení.

## 5. Vyzkoušej platbu

1. Otevři nasazený web, přidej přístroj do košíku, vyplň formulář a klikni
   na "Pokračovat k platbě kartou".
2. Pokud používáš `sk_test_...` klíč, zaplať testovací kartou
   `4242 4242 4242 4242` (libovolné budoucí datum, libovolné CVC).
3. Pokud používáš rovnou `sk_live_...` klíč, půjde o **skutečnou platbu**
   skutečnou kartou — buď malou částku rovnou vrať (refund) ve Stripe
   dashboardu, nebo si nejdřív pořiď testovací klíč (Stripe → přepínač
   Test mode → Developers → API keys).
4. Po zaplacení tě Stripe přesměruje na `objednavka-uspech.html`.

Přehled plateb uvidíš ve Stripe dashboardu pod **Payments**.

---

## Poznámky

- Ceny produktů se počítají v `functions/create-checkout.js` (objekt
  `PRODUCTS`) — pokud změníš ceny v `assets/store.js`, uprav je stejně i
  tady.
- Žádné `node_modules` ani `package.json` tu není potřeba — funkce
  nepoužívá žádnou knihovnu, jen vestavěné `fetch`.
- Tenhle balíček funguje i na Netlify (stačí přejmenovat/přesunout
  `functions/create-checkout.js` do `netlify/functions/create-checkout.js`
  a upravit export z `onRequestPost` na `exports.handler` — pokud budeš
  chtít later přepnout, dej vědět).
- Kontaktní formulář na `kontakt.html` zatím nikam neodesílá — to je
  nezávislé od plateb.


<!-- redeploy trigger -->
