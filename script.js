let balicek = [];
let vybranaKarta = null;
let tazenaKarta = null;

let uroven = 1; // ✅ 1 = + -, 2 = vše

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function minus(n) {
  return n < 0 ? "−" + Math.abs(n) : n;
}

function zapis(n) {
  if (n < 0) return "(" + minus(n) + ")";
  return n;
}

// ✅ cíle
function generujCile() {
  let cile = [];
  while (cile.length < 5) {
    let n = rand(-100, 100);
    if (!cile.includes(n)) cile.push(n);
  }
  return cile;
}

// ✅ příklady podle úrovně
function vytvorPriklad(vysledek) {

  let maxTyp = uroven === 1 ? 1 : 3;
  let typ = rand(0, maxTyp);

  // ✅ SČÍTÁNÍ
  if (typ === 0) {
    let a = rand(-50, 50);
    let b = vysledek - a;

    if (b < 0) {
      if (Math.random() < 0.5) {
        return `${minus(a)} + (${minus(b)})`;
      } else {
        return `${minus(a)} − ${Math.abs(b)}`;
      }
    } else {
      return `${minus(a)} + ${b}`;
    }
  }

  // ✅ ODČÍTÁNÍ
  if (typ === 1) {
    let b = rand(-50, 50);
    let a = vysledek + b;

    if (b < 0) {
      if (Math.random() < 0.5) {
        return `${minus(a)} + ${Math.abs(b)}`;
      } else {
        return `${minus(a)} − (${minus(b)})`;
      }
    } else {
      return `${minus(a)} − ${b}`;
    }
  }

  // ✅ NÁSOBENÍ
  if (typ === 2) {
    let a, b;
    do {
      a = rand(-10, 10);
      if (a === 0) a = 1;

      if (vysledek % a === 0) {
        b = vysledek / a;
      } else {
        b = null;
      }

    } while (b === null);

    return `${zapis(a)} × ${zapis(b)}`;
  }

  // ✅ DĚLENÍ
  if (typ === 3) {
    let b = rand(-10, 10);
    if (b === 0) b = 1;

    let a = vysledek * b;

    return `${zapis(a)} ÷ ${zapis(b)}`;
  }
}

// ✅ balíček
function generuj() {
  balicek = [];

  let cile = generujCile();

  cile.forEach(v => {
    let pouzite = [];

    while (pouzite.length < 4) {
      let p = vytvorPriklad(v);

      if (!pouzite.includes(p)) {
        pouzite.push(p);
        balicek.push({ text: p, vysledek: v });
      }
    }
  });

  balicek.sort(() => Math.random() - 0.5);
}

// ✅ karta
function vytvorKartu(text, vysledek) {
  let karta = document.createElement("div");
  karta.className = "karta";
  karta.innerText = text;
  karta.dataset.v = vysledek;
  karta.draggable = true;

  karta.addEventListener("click", (e) => {
    e.stopPropagation();

    document.querySelectorAll(".karta").forEach(k => k.style.border = "none");
    karta.style.border = "2px solid red";

    vybranaKarta = karta;
  });

  karta.addEventListener("dragstart", () => {
    tazenaKarta = karta;
  });

  return karta;
}

// ✅ lízni
function lizniKartu() {
  let zona = document.getElementById("aktualni-karta");

  if (balicek.length === 0) {
    zona.innerHTML = "<b>Konec hry ✅</b>";
    return;
  }

  let k = balicek.pop();

  zona.innerHTML = "";
  zona.appendChild(vytvorKartu(k.text, k.vysledek));
}

// ✅ přesun
function presun(sloupec, karta) {

  let puvodni = karta.parentElement;

  if (puvodni && puvodni.classList.contains("sloupec")) {
    karta.remove();

    if (puvodni.querySelectorAll(".karta").length === 0) {
      puvodni.innerHTML = "";
    }
  }

  if (sloupec.querySelectorAll(".karta").length === 0) {
    let nadpis = document.createElement("div");
    nadpis.innerText = minus(Number(karta.dataset.v));
    nadpis.style.fontWeight = "bold";
    sloupec.appendChild(nadpis);
  }

  sloupec.appendChild(karta);

  vybranaKarta = null;
  tazenaKarta = null;

  document.getElementById("aktualni-karta").innerHTML = "";
}

// ✅ init
document.addEventListener("DOMContentLoaded", () => {

  document.querySelectorAll(".sloupec").forEach(sloupec => {

    sloupec.addEventListener("click", (e) => {
      e.preventDefault();
      if (!vybranaKarta) return;
      presun(sloupec, vybranaKarta);
    });

    sloupec.addEventListener("touchstart", (e) => {
      e.preventDefault();
      if (!vybranaKarta) return;
      presun(sloupec, vybranaKarta);
    });

    sloupec.addEventListener("dragover", e => e.preventDefault());

    sloupec.addEventListener("drop", e => {
      e.preventDefault();
      if (!tazenaKarta) return;
      presun(sloupec, tazenaKarta);
    });
  });

  generuj();
});

// ✅ kontrola
function zkontroluj() {
  document.querySelectorAll(".sloupec").forEach(sloupec => {

    let karty = sloupec.querySelectorAll(".karta");

    if (karty.length === 0) {
      sloupec.style.background = "#ffcdd2";
      return;
    }

    let v = karty[0].dataset.v;
    let ok = true;

    karty.forEach(k => {
      if (k.dataset.v != v) ok = false;
    });

    sloupec.style.background =
      ok && karty.length === 4 ? "#66bb6a" :
      ok ? "#ffe082" : "#ffcdd2";
  });
}

// ✅ nová hra
function novaHra() {
  document.querySelectorAll(".sloupec").forEach(s => {
    s.innerHTML = "";
    s.style.background = "#c8e6c9";
  });

  document.getElementById("aktualni-karta").innerHTML = "";
  generuj();
}

// ✅ změna úrovně
function nastavUroven(u) {
  uroven = u;
  novaHra();
}
