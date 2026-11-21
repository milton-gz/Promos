/* app.js: arma las páginas a partir de datos.js */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const sigla = n => n.split(" ").filter(Boolean).slice(0, 2).map(p => p[0]).join("");
const esperar = ms => new Promise(r => setTimeout(r, ms));
const app = $("#app");
const quieto = matchMedia("(prefers-reduced-motion:reduce)").matches;

/* ---------- modo oscuro, compartir, aviso, confeti ---------- */
const raiz = document.documentElement;
const aviso = t => {
  const el = $("#toast") || document.body.appendChild(Object.assign(document.createElement("div"), {id: "toast"}));
  el.textContent = t; el.classList.add("ver");
  setTimeout(() => el.classList.remove("ver"), 2200);
};
const pintarModo = () => $("#modo").textContent = raiz.dataset.modo === "dark" ? "☀" : "☾";
pintarModo();
$("#modo").onclick = () => {
  raiz.dataset.modo = raiz.dataset.modo === "dark" ? "light" : "dark";
  try { localStorage.setItem("modo", raiz.dataset.modo); } catch (e) {}
  pintarModo();
};
$("#comp").onclick = async () => {
  const d = {title: document.title, url: location.href};
  try {
    if (navigator.share) return await navigator.share(d);
    await navigator.clipboard.writeText(d.url);
    aviso("Enlace copiado");
  } catch (e) { /* cancelado */ }
};
function confeti(n = 70) {
  if (quieto) return;
  const c = document.body.appendChild(Object.assign(document.createElement("div"), {className: "cf"}));
  const col = ["var(--acc)", "var(--acc2)", "var(--acc3)"];
  for (let i = 0; i < n; i++) {
    const p = document.createElement("i");
    p.style.cssText = `left:${Math.random() * 100}%;--c:${col[i % 3]};--x:${Math.random() * 160 - 80}px;--t:${2.2 + Math.random() * 1.4}s;--d:${Math.random() * .5}s`;
    c.appendChild(p);
  }
  setTimeout(() => c.remove(), 4400);
}

$$("[data-centro]").forEach(e => e.textContent = CENTRO.nombre);
$$("[data-anio]").forEach(e => e.textContent = CENTRO.anio);

/* ---------- carga ---------- */
app.innerHTML = `<div class="wrap" style="padding-top:64px">
  <div class="sk" style="height:30px;width:150px"></div>
  <div class="sk" style="height:96px;width:min(560px,92%);margin:24px 0"></div>
  <div class="sk" style="height:18px;width:min(420px,80%)"></div>
  <div class="grid" style="margin-top:56px">${'<div class="sk" style="height:170px"></div>'.repeat(3)}</div></div>`;

async function montar(html, despues) {
  await Promise.all([document.fonts && document.fonts.ready, esperar(quieto ? 0 : 700)]);
  app.innerHTML = html;
  app.classList.add("listo");
  revelar();
  despues && despues();
}

/* aparición al hacer scroll + contadores */
function revelar() {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    io.unobserve(e.target);
    $$("[data-n]", e.target).forEach(contar);
  }), {threshold: .15});
  $$(".rv").forEach(el => io.observe(el));
}

function contar(el) {
  const n = +el.dataset.n;
  if (quieto) return el.textContent = n;
  let t0;
  const paso = t => {
    t0 = t0 || t;
    const p = Math.min((t - t0) / 1200, 1);
    el.textContent = Math.round(n * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(paso);
  };
  requestAnimationFrame(paso);
}

/* ---------- página principal ---------- */
function inicio() {
  const c = CENTRO, rep = Array(6).fill(c.cinta).flat();
  const persona = (p, i, chico) => `<article class="card msg ${chico ? "chico " : ""}rv" style="--d:${i * .1}s">
    <div class="av">${sigla(p.nombre)}</div>
    <div><blockquote>${p.mensaje}</blockquote><p class="quien">${p.nombre}<small>${p.cargo}</small></p></div></article>`;

  return `
  <section class="hero wrap">
    <div class="formas"><i></i><i></i><i></i></div>
    <span class="chip rv">${c.lema}</span>
    <h1 class="rv" style="--d:.1s">${c.titulo} <em>${c.destacado}</em></h1>
    <p class="rv" style="--d:.2s">${c.texto}</p>
    <div class="stats">${c.datos.map((d, i) => `<div class="card stat rv" style="--d:${i * .08}s"><b data-n="${d.n}">0</b><span>${d.t}</span></div>`).join("")}</div>
  </section>

  <div class="cinta"><div>${rep.map(t => `<span>${t}</span><span>✦</span>`).join("")}</div></div>

  <section class="wrap" id="ceremonia">
    <div class="sec-h rv"><small>Cuenta regresiva</small><h2>La ceremonia se acerca</h2></div>
    <div class="cuenta">${[["d", "Días"], ["h", "Horas"], ["m", "Minutos"], ["s", "Segundos"]].map(([k, t], i) =>
      `<div class="card caja rv" style="--d:${i * .08}s"><b id="c-${k}">00</b><span>${t}</span></div>`).join("")}</div>
    <p class="lugar rv">${new Date(c.ceremonia.fecha).toLocaleDateString("es", {weekday: "long", day: "numeric", month: "long", hour: "numeric", minute: "2-digit"})} · ${c.ceremonia.lugar}</p>
  </section>

  <section class="wrap" id="galeria">
    <div class="sec-h rv"><small>Un año en imágenes</small><h2>Galería del centro</h2></div>
    <div class="mosaico">${c.galeria.map((f, i) => `<button class="tile rv" style="--d:${i * .05}s" aria-label="Ver foto ${i + 1}">${f.src ? `<img src="${f.src}" alt="${f.pie}" loading="lazy">` : `<div class="ph">Foto ${i + 1}</div>`}</button>`).join("")}</div>
  </section>

  <section class="wrap" id="mensajes">
    <div class="sec-h rv"><small>Palabras para ustedes</small><h2>Mensajes de despedida</h2></div>
    ${persona(c.director, 0)}${persona(c.subdirector, 1)}
    <div class="grid" style="margin-top:6px">${c.profesores.map((p, i) => persona(p, i, true)).join("")}</div>
  </section>

  <section class="wrap" id="premios">
    <div class="sec-h rv"><small>Quienes dejaron huella</small><h2>Premios y reconocimientos</h2></div>
    <div class="grid">${c.premios.map((p, i) => `<article class="card premio rv" style="--d:${i * .08}s"><div class="medalla">★</div><small>${p.g}</small><h3>${p.t}</h3><p class="quien">${p.n}</p></article>`).join("")}</div>
  </section>

  <section class="wrap" id="grupos">
    <div class="sec-h rv"><small>Cuatro caminos, una misma despedida</small><h2>Promociones ${c.anio}</h2></div>
    <div class="grid">${GRUPOS.map((g, i) => `
      <a class="card gc rv" data-tema="${g.tema}" style="--d:${i * .08}s" href="grupo.html?g=${g.id}">
        <span class="sg">${g.sigla}</span><h3>${g.nombre}</h3><p>${g.resumen}</p><span class="go">Entrar →</span></a>`).join("")}
    </div>
  </section>

  <section class="wrap"><div class="cierre rv"><h2>Gracias</h2><p>${c.cierre.texto}</p><small>${c.cierre.firma}</small></div></section>`;
}

/* cuenta regresiva a la ceremonia */
function cuenta() {
  const meta = new Date(CENTRO.ceremonia.fecha).getTime();
  const poner = () => {
    const s = Math.max(0, Math.floor((meta - Date.now()) / 1000));
    const v = {d: Math.floor(s / 86400), h: Math.floor(s % 86400 / 3600), m: Math.floor(s % 3600 / 60), s: s % 60};
    for (const k in v) { const e = $("#c-" + k); if (e) e.textContent = String(v[k]).padStart(2, "0"); }
    return s;
  };
  if (poner() > 0) { const t = setInterval(() => { if (!poner()) clearInterval(t); }, 1000); }
  visor(CENTRO.galeria, ".tile");
}

/* pantalla de bienvenida (una vez por sesión) */
function bienvenida() {
  try { if (sessionStorage.getItem("vista")) return; sessionStorage.setItem("vista", 1); } catch (e) {}
  const b = document.body.appendChild(Object.assign(document.createElement("div"), {id: "bienv"}));
  b.innerHTML = `<div><div class="logo-g"></div><h1>${CENTRO.nombre}</h1><p>${CENTRO.lema} · Promoción ${CENTRO.anio}</p><button class="btn">Entrar</button></div>`;
  document.body.style.overflow = "hidden";
  $("button", b).onclick = () => {
    b.classList.add("fuera"); document.body.style.overflow = ""; confeti(90);
    setTimeout(() => b.remove(), 1000);
  };
}

/* ---------- página de grupo ---------- */
const giros = [-3, 2, -1.5, 3, -2, 1.5];

function grupo(g) {
  const E = g.estudiantes, D = g.docente, L = GRUPOS.length, ix = GRUPOS.indexOf(g);
  const vec = (v, txt) => `<a class="card gc rv" data-tema="${v.tema}" href="grupo.html?g=${v.id}"><span class="sg">${v.sigla}</span><h3>${v.nombre}</h3><span class="go">${txt}</span></a>`;
  return `
  <section class="ghero wrap">
    <div class="formas"><i></i><i></i><i></i></div>
    <a class="back rv" href="index.html#grupos">← Promociones</a><br>
    <span class="chip rv">${CENTRO.anio} · ${E.length} graduados</span>
    <h1 class="rv" style="--d:.1s">${g.nombre}</h1>
    <p class="rv" style="--d:.2s">${g.mensaje}</p>
    <p class="quien rv" style="--d:.25s;margin-top:12px">${g.firma}</p>
  </section>

  <section class="wrap" id="diploma">
    <div class="sec-h rv"><small>Diploma</small><h2>Elige un nombre</h2></div>
    <div class="dip rv"><div>
      <small>${CENTRO.nombre}</small><h3>Diploma de graduación</h3><small>Se otorga a</small>
      <div class="dn" id="dn">${E[0]}</div>
      <p>por concluir satisfactoriamente sus estudios de ${g.nombre}, promoción ${CENTRO.anio}.</p>
      <div class="sello">${CENTRO.anio}</div>
      <div class="firmas"><span>Director/a</span><span>Subdirector/a</span></div>
    </div></div>
    <div class="ctrl">
      <button class="btn" id="prev" aria-label="Anterior">←</button>
      <select id="sel" aria-label="Estudiante">${E.map((n, i) => `<option value="${i}">${n}</option>`).join("")}</select>
      <button class="btn" id="next" aria-label="Siguiente">→</button>
      <button class="btn" id="fest">Celebrar</button>
      <button class="btn" id="img">Guardar como imagen</button>
    </div>
  </section>

  <section class="wrap">
    <div class="sec-h rv"><small>Recuerdos</small><h2>La pizarra</h2></div>
    <div class="board rv">${g.fotos.map((f, i) => `
      <button class="foto" style="--rot:${giros[i % 6]}deg" aria-label="Ver foto ${i + 1}">
        ${f.src ? `<img src="${f.src}" alt="${f.pie}" loading="lazy">` : `<div class="ph">Foto ${i + 1}</div>`}
        <span>${f.pie}</span></button>`).join("")}
    </div>
  </section>

  <section class="wrap">
    <div class="sec-h rv"><small>El año en breve</small><h2>Nuestra línea de tiempo</h2></div>
    <ol class="tl">${g.hitos.map((h, i) => `<li class="rv" style="--d:${i * .08}s"><b>${h.f} · ${h.t}</b><p>${h.d}</p></li>`).join("")}</ol>
  </section>

  <section class="wrap">
    <div class="sec-h rv"><small>Libro de firmas</small><h2>Dedicatorias</h2></div>
    <div class="notas">${g.dedicatorias.map((d, i) => `
      <blockquote class="nota rv" style="--rot:${[-2, 1.5, -1][i % 3]}deg;--d:${i * .1}s">${d.txt}<footer>— ${d.de}</footer></blockquote>`).join("")}
    </div>
  </section>

  <section class="wrap">
    <div class="sec-h rv"><small>Carta del docente</small><h2>Antes de que se vayan</h2></div>
    <article class="card carta rv">
      <div><div class="av">${sigla(D.nombre)}</div><p class="quien" style="margin-top:12px">${D.nombre}<small>${D.cargo}</small></p></div>
      <div class="txt">${D.parrafos.map(t => `<p>${t}</p>`).join("")}
        <h3 style="margin:22px 0 12px">Tres consejos para el camino</h3>
        <ul class="consejos">${D.consejos.map(t => `<li>${t}</li>`).join("")}</ul></div>
    </article>
  </section>

  <section class="wrap"><div class="cierre rv"><h2>Para ustedes</h2><p>${g.cierre}</p><small>— ${CENTRO.nombre}, ${CENTRO.anio}</small></div></section>

  <section class="wrap"><div class="grid">${vec(GRUPOS[(ix + L - 1) % L], "← Anterior")}${vec(GRUPOS[(ix + 1) % L], "Siguiente →")}</div></section>`;
}

function activarGrupo(g) {
  const E = g.estudiantes, sel = $("#sel");
  let i = 0, k = 0;

  /* diploma: cambia el nombre con un pequeño fundido */
  const ir = n => {
    i = (n + E.length) % E.length;
    sel.value = i;
    const d = $("#dn");
    d.classList.add("out");
    confeti(40);
    setTimeout(() => { d.textContent = E[i]; d.classList.remove("out"); }, quieto ? 0 : 220);
  };
  sel.onchange = () => ir(+sel.value);
  $("#prev").onclick = () => ir(i - 1);
  $("#next").onclick = () => ir(i + 1);
  $("#fest").onclick = () => confeti(120);
  $("#img").onclick = () => guardarDiploma(g, E[i]);

  visor(g.fotos, ".foto");
}

/* diploma → PNG dibujado en canvas (sin librerías, siempre en modo claro) */
async function guardarDiploma(g, nombre) {
  await Promise.all(["800 40px Fraunces", "italic 600 40px Fraunces", "600 20px 'Instrument Sans'"].map(f => document.fonts.load(f)));
  const m = raiz.dataset.modo; raiz.dataset.modo = "light";
  const cs = getComputedStyle(document.body), v = k => cs.getPropertyValue(k).trim();
  const C = {bg: v("--surf"), ink: v("--ink"), mut: v("--mut"), acc: v("--acc"), acc2: v("--acc2"), edge: v("--edge")};
  raiz.dataset.modo = m;

  const W = 1800, H = 1273, c = Object.assign(document.createElement("canvas"), {width: W, height: H}), x = c.getContext("2d");
  const t = (txt, y, font, col, sp = "0px") => { x.font = font; x.fillStyle = col; x.letterSpacing = sp; x.fillText(txt, W / 2, y); };
  x.textAlign = "center"; x.textBaseline = "middle";
  x.fillStyle = C.bg; x.fillRect(0, 0, W, H);
  x.strokeStyle = C.edge; x.lineWidth = 6; x.strokeRect(40, 40, W - 80, H - 80);
  x.strokeStyle = C.acc; x.lineWidth = 4; x.strokeRect(80, 80, W - 160, H - 160);
  x.lineWidth = 2; x.strokeRect(96, 96, W - 192, H - 192);

  t(CENTRO.nombre.toUpperCase(), 230, "600 30px 'Instrument Sans'", C.mut, "8px");
  t("Diploma de graduación", 330, "800 84px Fraunces", C.ink);
  t("SE OTORGA A", 450, "600 28px 'Instrument Sans'", C.mut, "8px");
  let fs = 150;
  do { x.font = `italic 600 ${fs}px Fraunces`; fs -= 4; } while (x.measureText(nombre).width > W - 400 && fs > 40);
  t(nombre, 600, x.font, C.acc);
  t("por concluir satisfactoriamente sus estudios de", 740, "400 36px 'Instrument Sans'", C.mut);
  t(`${g.nombre}, promoción ${CENTRO.anio}.`, 795, "400 36px 'Instrument Sans'", C.mut);

  x.beginPath(); x.arc(W / 2, 925, 72, 0, Math.PI * 2);
  x.fillStyle = C.acc2; x.fill(); x.strokeStyle = C.edge; x.lineWidth = 4; x.stroke();
  t(String(CENTRO.anio), 925, "800 34px 'Instrument Sans'", "#1b1b1b");

  [[500, "Director/a"], [1300, "Subdirector/a"]].forEach(([cx, txt]) => {
    x.strokeStyle = C.mut; x.lineWidth = 2; x.beginPath(); x.moveTo(cx - 180, 1075); x.lineTo(cx + 180, 1075); x.stroke();
    x.font = "400 26px 'Instrument Sans'"; x.fillStyle = C.mut; x.fillText(txt, cx, 1108);
  });

  c.toBlob(b => {
    const a = Object.assign(document.createElement("a"), {href: URL.createObjectURL(b), download: `diploma-${nombre.replace(/\s+/g, "-")}.png`});
    a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }, "image/png");
  confeti(60); aviso("Diploma guardado");
}

/* visor de fotos: lista = [{src,pie}], sel = botones que lo abren */
function visor(lista, sel) {
  const lb = $("#lb"); let k = 0;
  const ver = n => {
    k = (n + lista.length) % lista.length;
    const f = lista[k];
    $("#lbc").innerHTML = (f.src ? `<img src="${f.src}" alt="${f.pie}">` : `<div class="ph">Foto ${k + 1}</div>`) +
      `<p>${f.pie}</p><div class="ctrl"><button class="btn" data-m="-1">←</button><button class="btn" data-m="1">→</button><button class="btn" data-m="0">Cerrar</button></div>`;
  };
  $$(sel).forEach((b, n) => b.onclick = () => { ver(n); lb.showModal(); });
  lb.onclick = e => {
    const m = e.target.dataset.m;
    if (m === "0" || e.target === lb) lb.close();
    else if (m) ver(k + Number(m));
  };
  lb.onkeydown = e => {
    if (e.key === "ArrowRight") ver(k + 1);
    if (e.key === "ArrowLeft") ver(k - 1);
  };
}

/* ---------- arranque ---------- */
if (document.body.dataset.pagina === "grupo") {
  const g = GRUPOS.find(x => x.id === new URLSearchParams(location.search).get("g"));
  if (!g) location.replace("index.html");
  else {
    document.body.dataset.tema = g.tema;
    document.title = `${g.nombre} · ${CENTRO.nombre}`;
    montar(grupo(g), () => activarGrupo(g));
  }
} else { bienvenida(); montar(inicio(), cuenta); }

/* ---------- créditos: tarjetita con grupos de tecnologías que rotan ---------- */
(function creditos() {
  const A = AUTOR, G = A.grupos;
  const ficha = (it, i) => it.raw
    ? `<span class="ins of" title="${it.n}" style="--i:${i}">${it.raw}</span>`
    : it.of
    ? `<span class="ins of" title="${it.n}" style="--i:${i}"><svg viewBox="0 0 32 32" role="img" aria-label="${it.n}"><rect x="1" y="1" width="30" height="30" rx="5" fill="${it.of[0]}"/><rect x="11" y="5" width="16" height="22" rx="2" fill="#fff"/><path d="${it.of[2]}" fill="${it.of[0]}" stroke="${it.of[0]}" stroke-width="1.6" stroke-linecap="round"/><rect x="2" y="9" width="16" height="16" rx="3" fill="${it.of[1]}"/><text x="10" y="21" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="800" font-size="12" fill="#fff">${it.s}</text></svg></span>`
    : it.img
    ? `<span class="ins" title="${it.n}" style="--i:${i}"><img src="${A.cdn}${it.img}.svg" alt="${it.n}" loading="lazy" onerror="this.parentNode.textContent='${it.s}'"></span>`
    : `<span class="ins" title="${it.n}" style="--i:${i};background:${it.bg};color:${it.fg};border-color:transparent">${it.s}</span>`;
  $(".foot").insertAdjacentHTML("beforeend", `<div class="card cred">
    <div class="cred-h"><span class="mono">${sigla(A.nombre)}</span><div><b>${A.nombre}</b><small>${A.rol}</small></div></div>
    <div class="cred-m"><small id="tl"></small><div class="pts">${G.map((g, i) => `<button aria-label="${g.t}" data-g="${i}"></button>`).join("")}</div></div>
    <div class="tec" id="tec"></div></div>`);
  const tl = $("#tl"), tec = $("#tec"), pts = $$(".pts button");

  /* cada página arranca en un grupo distinto */
  const pos = document.body.dataset.pagina === "grupo" ? 1 + GRUPOS.findIndex(x => x.tema === document.body.dataset.tema) : 0;
  let n = pos % G.length, t;

  const poner = k => {
    n = k;
    tl.textContent = G[k].t;
    tec.innerHTML = G[k].items.map(ficha).join("");
    pts.forEach((b, i) => b.classList.toggle("on", i === k));
  };
  const cambiar = k => {
    tec.classList.add("out"); tl.classList.add("out");
    setTimeout(() => { poner(k); tec.classList.remove("out"); tl.classList.remove("out"); }, 300);
  };
  poner(n);
  if (quieto) { $(".pts").remove(); return; }
  pts.forEach((b, i) => b.onclick = () => { cambiar(i); clearInterval(t); t = setInterval(sig, 4000); });
  const sig = () => cambiar((n + 1) % G.length);
  t = setInterval(sig, 4000);
})();
