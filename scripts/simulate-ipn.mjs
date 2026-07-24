/**
 * Simulează notificarea NETOPIA (IPN) în dezvoltare.
 *
 * De ce e nevoie: NETOPIA trimite confirmarea server-la-server pe `notifyUrl`,
 * iar serverele lor nu pot ajunge la `localhost`. În producție (site public)
 * notificarea vine singură; local o trimitem noi, cu același payload.
 *
 * Utilizare:
 *   node scripts/simulate-ipn.mjs <orderID> [port] [status] [suma]
 *   status: 5 = confirmat (implicit), 3 = plătit, 12 = cont invalid
 *
 * Exemplu:
 *   node scripts/simulate-ipn.mjs CE-1784816996768-WHUKFL 3000 5
 */

const [orderID, port = "3000", status = "5", amount] = process.argv.slice(2);

if (!orderID) {
  console.error("Lipsește orderID.\n  node scripts/simulate-ipn.mjs <orderID> [port] [status]");
  process.exit(1);
}

const payload = {
  payment: {
    method: "card",
    ntpID: String(Math.floor(Math.random() * 9_000_000) + 1_000_000),
    status: Number(status),
    // Suma reală o știe serverul din inițiere; aici o trimitem doar dacă e dată
    // explicit, ca să putem testa și cazul „sumă diferită".
    amount: amount ? Number(amount) : undefined,
    currency: "RON",
    token: "",
  },
  order: { orderID },
};

const url = `http://localhost:${port}/api/netopia/ipn`;
const res = await fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});

console.log(`IPN → ${url}`);
console.log(`comanda ${orderID}, status ${status} → HTTP ${res.status}`, await res.text());
