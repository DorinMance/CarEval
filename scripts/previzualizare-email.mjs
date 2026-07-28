/**
 * Randează emailul de confirmare într-un fișier HTML, ca să poată fi verificat
 * în browser fără bază de date, fără SMTP și fără să plece nimic către clienți.
 *
 *   node --experimental-strip-types --import ./scripts/inreg-rezolvator.mjs scripts/previzualizare-email.mjs
 */
import { writeFileSync } from "node:fs";
import { htmlPlata, textPlata, subiectPlata } from "../lib/email-plata-template.ts";

const exemplu = {
  orderID: "CE-1785227150057-J48XSH",
  contact: {
    nume: "Andrei Munteanu", telefon: "0741 222 333",
    email: "andrei.m@email.ro", localitate: "Timișoara", judet: "Timiș",
  },
  items: [{
    productSlug: "evaluare-despagubiri-cuvenite",
    productName: "Evaluare tehnică a prejudiciului",
    code: "EV4", price: 650, data: {}, images: {},
  }],
  total: 650,
};

writeFileSync("previzualizare-email.html", htmlPlata(exemplu), "utf8");
console.log("Subiect:", subiectPlata(exemplu.orderID));
console.log("\n--- varianta text ---\n" + textPlata(exemplu));
