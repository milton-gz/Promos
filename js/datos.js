/* ============================================================
   TODO el contenido editable vive aquí. Nada de esto es real:
   son datos de plantilla para reemplazar con la info del centro.
   ============================================================ */

/* Lista de nombres de prueba. Reemplaza por: ["Ana Pérez", "Luis Gómez", ...] */
const nombres = n => Array.from({length:n}, (_, i) => `Estudiante ${String(i+1).padStart(2,"0")} Apellido`);

/* Fotos de prueba. Con imagen real: {src:"img/contable/01.jpg", pie:"Excursión"} */
const fotos = n => Array.from({length:n}, (_, i) => ({src:"", pie: i ? `Momento ${i+1}` : "Foto de grupo"}));

/* Hitos y dedicatorias de ejemplo, se pueden definir distintos por grupo */
const hitos = [
  {f:"Febrero", t:"Inicio del año", d:"Primer día juntos y metas por cumplir."},
  {f:"Mayo",    t:"Actividad especial", d:"Una jornada que nadie va a olvidar."},
  {f:"Agosto",  t:"Proyecto final", d:"Meses de trabajo reunidos en una presentación."},
  {f:"Noviembre", t:"Despedida", d:"Cerrando una etapa y abriendo otra."}
];
const dedicatorias = [
  {de:"Nombre Apellido", txt:"Gracias por tanto. Los voy a extrañar en cada pasillo."},
  {de:"Nombre Apellido", txt:"Lo logramos juntos, y eso vale más que cualquier nota."},
  {de:"Nombre Apellido", txt:"Que el camino que viene sea tan bonito como este año."}
];

/* ---------- datos del centro (página principal) ---------- */
const CENTRO = {
  nombre: "Centro Escolar",
  anio: 2026,
  lema: "Despedida de año",
  ceremonia: {fecha:"2026-12-18T09:00:00", lugar:"Auditorio · Centro Escolar"},
  cinta: ["Promoción 2026", "Hasta pronto", "Gracias por todo", "Nos vemos en el camino"],
  galeria: fotos(8),
  premios: [
    {t:"Mejor promedio", n:"Nombre Apellido", g:"Contabilidad"},
    {t:"Espíritu de equipo", n:"Nombre Apellido", g:"Salud"},
    {t:"Mejor asistencia", n:"Nombre Apellido", g:"Informática"},
    {t:"Creatividad", n:"Nombre Apellido", g:"Hostelería"}
  ],
  cierre: {texto:"Gracias por llenar estos pasillos de risas. Lo que sembraron aquí los va a acompañar siempre.", firma:"Con cariño, la comunidad educativa"},
  titulo: "Hasta pronto,",
  destacado: "promoción 2026",
  texto: "Un año de esfuerzo, risas y aprendizajes llega a su fin. Este espacio es un recuerdo de todo lo que vivimos juntos antes de que cada quien siga su camino.",
  datos: [
    {n:120, t:"Graduados"},
    {n:4,   t:"Promociones"},
    {n:18,  t:"Docentes"},
    {n:40,  t:"Años de historia"}
  ],
  director: {
    nombre:"Nombre Apellido", cargo:"Director/a",
    mensaje:"Queridos graduados: hoy cierran un capítulo importante. Lleven consigo lo aprendido y recuerden que esta casa siempre será suya."
  },
  subdirector: {
    nombre:"Nombre Apellido", cargo:"Subdirector/a",
    mensaje:"Estamos orgullosos de ustedes. Sigan con la misma constancia que mostraron aquí; el futuro les pertenece."
  },
  profesores: [
    {nombre:"Nombre Apellido", cargo:"Docente de Matemática", mensaje:"Gracias por dejarme ser parte de su historia."},
    {nombre:"Nombre Apellido", cargo:"Docente de Lenguaje", mensaje:"Nunca dejen de leer, de preguntar y de soñar."},
    {nombre:"Nombre Apellido", cargo:"Docente de Ciencias", mensaje:"La curiosidad es su mejor herramienta."}
  ]
};

/* ---------- grupos de promoción ----------
   id → se usa en la URL: grupo.html?g=contable
   tema → paleta definida en css/temas.css */
const GRUPOS = [
  { id:"contable", tema:"contable", sigla:"TAC",
    nombre:"Técnico Administrativo Contable",
    resumen:"Números claros, decisiones firmes y un futuro bien balanceado.",
    mensaje:"Aprendieron que cada cifra cuenta una historia. Que lleven esa honestidad y precisión a donde vayan.",
    firma:"Nombre Apellido, docente guía",
    estudiantes:nombres(24), fotos:fotos(6), hitos, dedicatorias },

  { id:"salud", tema:"salud", sigla:"TAPS",
    nombre:"Técnico Atención Primaria en Salud",
    resumen:"Vocación de cuidar, escuchar y estar cerca de la gente.",
    mensaje:"Cuidar es un acto de valentía y de ternura. Gracias por elegir una profesión que sirve a los demás.",
    firma:"Nombre Apellido, docente guía",
    estudiantes:nombres(22), fotos:fotos(6), hitos, dedicatorias },

  { id:"informatica", tema:"informatica", sigla:"BGD",
    nombre:"General con Diplomado en Informática",
    resumen:"Bachillerato con código, lógica y muchas ideas por compilar.",
    mensaje:"Ya saben depurar errores; ahora toca depurar sueños y ponerlos en producción. Mucho éxito.",
    firma:"Nombre Apellido, docente guía",
    estudiantes:nombres(30), fotos:fotos(6), hitos, dedicatorias },

  { id:"hosteleria", tema:"hosteleria", sigla:"HT",
    nombre:"Hostelería y Turismo",
    resumen:"Atención con sonrisa, sabor local y el mundo como destino.",
    mensaje:"Recibir a otros es un arte. Sigan haciendo que cada persona se sienta como en casa.",
    firma:"Nombre Apellido, docente guía",
    estudiantes:nombres(20), fotos:fotos(6), hitos, dedicatorias }
];

/* Carta del docente y cierre de cada grupo. Por defecto son iguales para todos;
   para uno propio, agrega dentro del grupo:  docente:{...}  o  cierre:"..." */
const DOCENTE = {
  nombre:"Nombre Apellido", cargo:"Docente guía",
  parrafos:[
    "Cuando los conocí, apenas empezaban a descubrir de qué eran capaces. Hoy los veo distintos: más seguros, más unidos y con las ideas mucho más claras.",
    "Hubo días difíciles y también tardes que no voy a olvidar. De todos ellos me llevo lo mismo: ustedes siempre encontraron la manera de salir adelante juntos.",
    "Les pido que no se subestimen. Lo que viene será un reto, pero ya demostraron que saben enfrentarlo. Esta aula siempre tendrá la puerta abierta para ustedes."
  ],
  consejos:["Sigan aprendiendo, aunque nadie los evalúe.", "Rodéense de gente que los haga crecer.", "Pidan ayuda a tiempo y ofrézcanla también."]
};
const CIERRE = "Este no es un adiós, es un hasta luego. Gracias por cada risa, cada reto y cada recuerdo. Vayan y háganlo brillar.";
GRUPOS.forEach(g => { g.docente = g.docente || DOCENTE; g.cierre = g.cierre || CIERRE; });

/* Créditos (tarjetita del pie). Cada página arranca en un grupo distinto y rota sola.
   Con img → logo real desde Devicon (necesita internet; si falla muestra la sigla).
   Con bg/fg → ficha con los colores de la marca.
   Con raw → SVG propio (ej. SQL).
   Con of → icono de Office dibujado: [color claro, color oscuro, trazos de la hoja]. */
const AUTOR = {
  nombre:"Milton Alexis", rol:"Diseño y desarrollo web",
  cdn:"https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/",
  grupos:[
    {t:"Adobe", items:[
      {n:"Illustrator", s:"Ai", bg:"#330000", fg:"#ff9a00"},
      {n:"Photoshop", s:"Ps", bg:"#001e36", fg:"#31a8ff"},
      {n:"Premiere Pro", s:"Pr", bg:"#00005b", fg:"#9999ff"},
      {n:"Audition", s:"Au", bg:"#00192e", fg:"#00e4bb"},
      {n:"Animate", s:"An", bg:"#2b0a1f", fg:"#ff6a9a"}]},
    {t:"Lenguajes", items:[
      {n:"Python", s:"Py", img:"python/python-original"},
      {n:"HTML", s:"Ht", img:"html5/html5-original"},
      {n:"JavaScript", s:"JS", img:"javascript/javascript-original"},
      {n:"CSS", s:"Cs", img:"css3/css3-original"},
      {n:"PHP", s:"Ph", img:"php/php-original"}]},
    {t:"Oficina y datos", items:[
      {n:"Word", s:"W", of:["#41a5ee","#2b579a","M21 10h5M21 14h5M21 18h5M21 22h5"]},
      {n:"Excel", s:"X", of:["#21a366","#107c41","M21 10h5M21 15h5M21 20h5M23.5 8v14"]},
      {n:"PowerPoint", s:"P", of:["#ed6c47","#c43e1c","M23 9a4 4 0 1 0 4 4h-4z"]},
      {n:"Access", s:"A", of:["#c9585a","#a4373a","M21 10h5M21 14h5M21 18h5M21 22h5"]}]},
    {t:"Entorno", items:[
      {n:"VS Code", s:"VS", img:"vscode/vscode-original"},
      {n:"Linux", s:"Lx", img:"linux/linux-original"},
      {n:"GitHub", s:"Gh", img:"github/github-original"},
      {n:"SQL (bases de datos)", s:"SQL", raw:`<svg viewBox="0 0 32 32"><path d="M4 8v16c0 2.8 5.4 5 12 5s12-2.2 12-5V8z" fill="#0b6e99"/><ellipse cx="16" cy="8" rx="12" ry="5" fill="#35a7d8"/><text x="16" y="21" text-anchor="middle" font-family="system-ui,sans-serif" font-weight="800" font-size="8.5" fill="#fff">SQL</text></svg>`}]}
  ]
};
