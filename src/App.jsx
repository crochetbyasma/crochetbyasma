import React, { useState, useMemo, useEffect } from "react";

/* =====================================================================
   Crochet by Asma — نسخة أولية (Prototype)
   - عربي بالكامل + RTL + Mobile First
   - بدون هوية بصرية: كل الألوان رموز عامة (Design Tokens) قابلة للاستبدال
   - البيانات مفصولة عن مكونات الواجهة (Data Layer في الأعلى)
   - كل المحتوى (منتجات/تصنيفات/معرض/طلبات/كوبونات) يُدار من لوحة التحكم
   ===================================================================== */

/* ============================ Design Tokens ============================
   قيم مؤقتة رمادية فقط لغرض المعاينة — استبدليها لاحقًا بألوان الهوية.
*/
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Alexandria:wght@300;400;500;600;700;800;900&family=Playpen+Sans+Arabic:wght@400;600;700&display=swap');
/* =========================================================
   COLOR SYSTEM — Crochet by Asma
   Teal = الثقة والتفاعل · Peach = الدفء والتمييز (بحذر)
   Cream/Mint/Light-Teal = إيقاع الخلفيات · Ink = النص
   ========================================================= */
:root{
  --teal:#8FB7B3;
  --teal-dark:#5C9490;
  --teal-deep:#2F6664;
  --heading:#28484A;
  --heading-soft:#355F61;
  --teal-light:#DDECE8;
  --cream:#F8F1E8;
  --cream-soft:#FBF7F1;
  --mint:#EEF7F5;
  --peach:#F6C7AD;
  --peach-dark:#E8A882;
  --peach-light:#FBE1D2;
  --ink:#3F4A49;
  --white:#FFFFFF;

  --text:#3F4A49;
  --muted:#697674;
  --faint:rgba(63,74,73,.45);
  --border:#E7DDD2;
  --border-strong:rgba(92,148,144,.38);

  --radius:18px;
  --radius-sm:12px;
  --shadow-soft:0 2px 10px rgba(92,148,144,.08);
  --shadow-card:0 8px 28px rgba(92,148,144,.14);
  --shadow-lift:0 16px 38px rgba(92,148,144,.22);
  --ease:cubic-bezier(.22,.8,.32,1);
}
*{box-sizing:border-box}
html,body,#root{margin:0;padding:0}
.app{direction:rtl;font-family:'Alexandria',system-ui,-apple-system,"Segoe UI",Tahoma,Arial,sans-serif;background:var(--cream);color:var(--text);min-height:100vh;line-height:1.75}
a{color:var(--teal-dark)}
button{font-family:inherit}
::selection{background:var(--teal-light)}
:focus-visible{outline:2px solid var(--teal-dark);outline-offset:2px;border-radius:6px}
.container{max-width:1100px;margin:0 auto;padding:0 18px}
h1,h2,h3{color:var(--heading)}
.band-ink h1,.band-ink h2,.band-ink h3,.band-grad h1,.band-grad h2,.band-grad h3{color:var(--cream-soft)}

/* ---------- Bands: إيقاع خلفيات الأقسام ---------- */
.band{padding:52px 0}
.band-cream{background:var(--cream)}
.band-white{background:var(--cream-soft)}
.band-mint{background:var(--mint)}
.band-teal{background:var(--teal-light)}
.band+.band{border-top:1px solid rgba(255,255,255,.6)}

/* ---------- عناصر التحويل: إعلان · ثقة · واتساب عائم ---------- */
.announce{background:var(--teal-deep);color:var(--cream-soft);text-align:center;font-size:12.5px;font-weight:600;padding:8px 14px;letter-spacing:.2px}
.announce b{color:var(--peach)}
.trust-strip{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-top:14px;padding-top:12px;border-top:2px dashed var(--border)}
.trust-strip span{display:flex;align-items:center;gap:7px;font-size:11.8px;color:var(--muted);line-height:1.5}
.trust-strip i{font-style:normal;font-size:15px}
.fab{position:fixed;bottom:18px;inset-inline-start:16px;z-index:55;display:inline-flex;align-items:center;gap:8px;background:var(--teal-deep);color:var(--cream-soft);border:none;border-radius:999px;padding:12px 18px;font-size:13.5px;font-weight:700;cursor:pointer;box-shadow:0 10px 26px rgba(47,102,100,.4);text-decoration:none;transition:transform .25s var(--ease)}
.fab:hover{transform:translateY(-3px)}
.slots-note{border:1.5px dashed var(--peach-dark);background:var(--peach-light);border-radius:var(--radius-sm);padding:10px 14px;font-size:13px;color:var(--heading-soft);margin-bottom:14px}
.gift-code{border:2px dashed var(--teal);background:var(--mint);border-radius:var(--radius-sm);padding:12px;margin:14px 0}
.gift-code b{font-size:18px;letter-spacing:2px;color:var(--teal-deep)}

/* ---------- Header ---------- */
.header{position:sticky;top:0;z-index:40;background:rgba(255,255,255,.82);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-bottom:1px solid var(--border);transition:transform .35s var(--ease)}
.header.hide{transform:translateY(-100%)}
.header-row{display:flex;align-items:center;gap:12px;padding:13px 0}
.logo{font-weight:800;font-size:18px;white-space:nowrap;}
.logo small{display:block;font-weight:500;color:var(--teal-dark);font-size:11px}
.nav{display:flex;gap:2px;overflow-x:auto;padding:0 0 11px;-webkit-overflow-scrolling:touch}
.nav::-webkit-scrollbar{display:none}
.nav button{border:none;background:none;padding:8px 14px;border-radius:999px;cursor:pointer;font-size:13.5px;font-weight:600;white-space:nowrap;color:var(--muted);transition:all .22s var(--ease)}
.nav button:hover{background:var(--mint);color:var(--teal-dark)}
.nav button.active{background:var(--teal-dark);color:var(--white);box-shadow:0 4px 12px rgba(92,148,144,.35)}
.spacer{flex:1}
.icon-btn{position:relative;border:1px solid var(--border);background:var(--white);border-radius:999px;width:40px;height:40px;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;font-size:15px;transition:all .22s var(--ease)}
.icon-btn:hover{background:var(--mint);border-color:var(--border-strong);transform:translateY(-1px)}
.count{position:absolute;top:-5px;inset-inline-start:-5px;background:var(--peach-dark);color:var(--ink);font-weight:700;font-size:11px;border-radius:999px;min-width:18px;height:18px;display:flex;align-items:center;justify-content:center;padding:0 4px}

/* ---------- Buttons System ---------- */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:999px;padding:12px 22px;font-size:14.5px;font-weight:700;cursor:pointer;text-decoration:none;transition:transform .22s var(--ease),box-shadow .22s var(--ease),background .22s,border-color .22s,filter .22s;
  background:var(--white);color:var(--teal-dark);border:1.5px solid var(--teal)}
.btn:hover{background:var(--teal-light);transform:translateY(-2px);box-shadow:var(--shadow-soft)}
.btn.primary{background:var(--teal-deep);color:var(--cream-soft);border-color:var(--teal-deep);box-shadow:0 6px 18px rgba(47,102,100,.3)}
.btn.primary:hover{filter:brightness(.94);transform:translateY(-2px);box-shadow:var(--shadow-lift)}
.btn.accent{background:var(--peach-dark);color:var(--ink);border-color:var(--peach-dark);box-shadow:0 6px 18px rgba(232,168,130,.38)}
.btn.accent:hover{filter:brightness(.96);transform:translateY(-2px);box-shadow:0 14px 30px rgba(232,168,130,.45)}
.btn.ghost{background:transparent;border-color:transparent;color:var(--teal-dark)}
.btn.ghost:hover{background:rgba(143,183,179,.14);transform:none;box-shadow:none}
.btn.danger{background:rgba(26,26,26,.05);color:var(--muted);border-color:rgba(26,26,26,.14)}
.btn.danger:hover{background:rgba(26,26,26,.09);transform:none;box-shadow:none}
.btn.sm{padding:8px 15px;font-size:12.5px}
.btn.block{width:100%}
.btn:disabled{opacity:.45;cursor:not-allowed;transform:none;box-shadow:none;filter:none}
.btn:active{transform:translateY(0) scale(.98)}

/* ---------- Cards System ---------- */
.card{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow-soft);transition:transform .28s var(--ease),box-shadow .28s var(--ease),border-color .28s}
.card.hoverable{cursor:pointer}
.card.hoverable:hover{transform:translateY(-5px);box-shadow:var(--shadow-lift);border-color:var(--border-strong)}
.card.soft{background:var(--mint);border-color:transparent;box-shadow:none}
.card.glass{background:rgba(255,255,255,.6);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,.75);box-shadow:var(--shadow-card)}
.card.elevated{box-shadow:var(--shadow-card);border-color:transparent}
.card.flat{box-shadow:none}
.pad{padding:18px}
.grid{display:grid;gap:16px}
.grid.cols-2{grid-template-columns:repeat(2,1fr)}
@media(min-width:720px){.grid.md-3{grid-template-columns:repeat(3,1fr)}.grid.md-4{grid-template-columns:repeat(4,1fr)}.grid.md-2{grid-template-columns:repeat(2,1fr)}}

/* ---------- Sections & Typography ---------- */
.section{margin:30px 0}
.section-head{display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin-bottom:18px}
.section-head h2{margin:0;font-size:22px;font-weight:800;}
.section-head .link{background:none;border:none;color:var(--teal-dark);cursor:pointer;font-size:13px;font-weight:700;text-decoration:none;border-bottom:2px solid var(--peach);padding-bottom:1px}
.eyebrow{display:inline-block;font-size:12px;font-weight:800;letter-spacing:1.5px;color:var(--peach-dark);margin-bottom:8px}
.muted{color:var(--muted)}
.small{font-size:12.5px}
.price{font-weight:800;color:var(--teal-deep)}

/* ---------- Placeholders ---------- */
.ph{background:linear-gradient(135deg,var(--mint),var(--teal-light));display:flex;align-items:center;justify-content:center;color:var(--teal-dark);font-size:12px;font-weight:600;border-radius:var(--radius) var(--radius) 0 0}
.ph.square{aspect-ratio:1/1}
.ph.wide{aspect-ratio:16/9}

/* ---------- Badges & Chips ---------- */
.badge{display:inline-flex;align-items:center;background:var(--teal-light);color:var(--teal-dark);border:none;border-radius:999px;padding:3px 11px;font-size:11.5px;font-weight:700;white-space:nowrap}
.badge.peach{background:var(--peach);color:var(--ink)}
.badge.solid{background:var(--teal-dark);color:var(--white)}
.chips{display:flex;gap:8px;overflow-x:auto;padding-bottom:6px}
.chips::-webkit-scrollbar{display:none}
.chip{border:1px solid var(--border);background:var(--white);border-radius:999px;padding:8px 15px;font-size:13px;font-weight:600;cursor:pointer;white-space:nowrap;color:var(--muted);transition:all .2s var(--ease)}
.chip:hover{border-color:var(--teal);color:var(--teal-dark)}
.chip.active{background:var(--teal-dark);color:var(--white);border-color:var(--teal-dark)}

/* ---------- Forms ---------- */
.field{display:flex;flex-direction:column;gap:6px;margin-bottom:14px}
.field label{font-size:13.5px;font-weight:700}
.field .hint{font-size:12px;color:var(--muted)}
.input,select.input,textarea.input{width:100%;border:1.5px solid var(--border);border-radius:var(--radius-sm);padding:11px 13px;font-size:15px;font-family:inherit;background:var(--white);color:var(--text);transition:border-color .2s,box-shadow .2s}
.input:focus{outline:none;border-color:var(--teal);box-shadow:0 0 0 3px rgba(143,183,179,.22)}
textarea.input{resize:vertical;min-height:80px}
.row{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.between{display:flex;justify-content:space-between;align-items:center;gap:10px}

/* ---------- Hero ---------- */
.hero{position:relative;overflow:hidden;background:linear-gradient(140deg,var(--cream) 0%,var(--mint) 52%,var(--teal-light) 100%);border-radius:26px;padding:64px 26px;text-align:center;box-shadow:var(--shadow-card)}
.hero::before{content:"";position:absolute;width:280px;height:280px;border-radius:50%;background:radial-gradient(circle,var(--peach) 0%,transparent 68%);top:-90px;inset-inline-start:-70px;opacity:.55;filter:blur(6px)}
.hero::after{content:"";position:absolute;width:340px;height:340px;border-radius:50%;background:radial-gradient(circle,var(--teal) 0%,transparent 66%);bottom:-140px;inset-inline-end:-100px;opacity:.35;filter:blur(10px)}
.hero>*{position:relative;z-index:1}
.hero h1{margin:10px 0 14px;font-size:clamp(26px,5vw,42px);line-height:1.35;font-weight:800;color:var(--heading)}
.hero p{margin:0 auto 26px;max-width:560px;color:var(--muted);font-size:16px}
.hl{background:linear-gradient(transparent 68%,var(--peach) 68%,var(--peach) 94%,transparent 94%);padding:0 3px}

/* ---------- Steps ---------- */
.steps{counter-reset:s;display:grid;gap:14px}
@media(min-width:720px){.steps{grid-template-columns:repeat(4,1fr)}}
.step{background:var(--white);border:1px solid var(--border);border-radius:var(--radius);padding:18px;box-shadow:var(--shadow-soft);transition:transform .25s var(--ease),box-shadow .25s var(--ease)}
.step:hover{transform:translateY(-3px);box-shadow:var(--shadow-card)}
.step b{display:block;margin-bottom:4px}
.step::before{counter-increment:s;content:counter(s);display:inline-flex;width:30px;height:30px;border-radius:999px;background:var(--peach);color:var(--ink);font-weight:800;align-items:center;justify-content:center;font-size:13px;margin-bottom:10px}

/* ---------- Progress / Timeline / Status ---------- */
.progress{display:flex;gap:6px;margin:14px 0}
.progress span{flex:1;height:6px;border-radius:99px;background:var(--teal-light);transition:background .3s}
.progress span.done{background:var(--peach-dark)}
.qty{display:inline-flex;align-items:center;border:1.5px solid var(--border);border-radius:999px;overflow:hidden;background:var(--white)}
.qty button{border:none;background:transparent;width:38px;height:38px;font-size:17px;cursor:pointer;color:var(--teal-dark);font-weight:700}
.qty button:hover{background:var(--mint)}
.qty span{min-width:36px;text-align:center;font-weight:800}
.table{width:100%;border-collapse:collapse;font-size:13.5px}
.table th,.table td{border-bottom:1px solid var(--border);padding:10px 8px;text-align:right;vertical-align:top}
.table th{color:var(--faint);font-weight:700;font-size:11.5px;letter-spacing:.4px}
.table-wrap{overflow-x:auto}
.status{display:inline-block;border-radius:999px;padding:3px 11px;font-size:11.5px;font-weight:700;background:var(--mint);color:var(--teal-dark)}
.timeline{list-style:none;margin:0;padding:0}
.timeline li{position:relative;padding:0 22px 16px 0;border-right:2px solid var(--teal-light)}
.timeline li::before{content:"";position:absolute;right:-6px;top:5px;width:10px;height:10px;border-radius:99px;background:var(--teal-light);transition:background .3s}
.timeline li.done{border-right-color:var(--teal-dark)}
.timeline li.done::before{background:var(--teal-dark);box-shadow:0 0 0 3px var(--teal-light)}

/* ---------- Modal / Lightbox / Misc ---------- */
.modal-back{position:fixed;inset:0;background:rgba(26,26,26,.42);backdrop-filter:blur(3px);z-index:60;display:flex;align-items:flex-end;justify-content:center}
@media(min-width:720px){.modal-back{align-items:center}}
.modal{background:var(--white);border-radius:22px 22px 0 0;width:100%;max-width:640px;max-height:92vh;overflow-y:auto;padding:20px;box-shadow:var(--shadow-lift)}
@media(min-width:720px){.modal{border-radius:22px}}
.gallery-lightbox{position:fixed;inset:0;background:rgba(26,26,26,.78);z-index:70;display:flex;align-items:center;justify-content:center;padding:20px}
.upload{border:2px dashed var(--teal);border-radius:var(--radius-sm);padding:18px;text-align:center;color:var(--teal-dark);cursor:pointer;font-size:13.5px;font-weight:600;background:var(--mint);transition:background .2s}
.upload:hover{background:var(--teal-light)}
.notice{border:none;border-right:3px solid var(--teal);background:var(--mint);border-radius:var(--radius-sm);padding:11px 14px;font-size:13px;color:var(--muted)}
.faq details{border:1px solid var(--border);border-radius:var(--radius-sm);padding:13px 15px;margin-bottom:10px;background:var(--white);transition:border-color .2s,box-shadow .2s}
.faq details[open]{border-color:var(--teal);box-shadow:var(--shadow-soft)}
.faq summary{cursor:pointer;font-weight:700;color:var(--teal-dark)}

/* ---------- Footer ---------- */
.footer{margin-top:0;background:linear-gradient(165deg,var(--teal-deep),var(--teal-dark));border-top:none;padding:36px 0 26px;color:rgba(255,255,255,.82);font-size:13.5px}
.footer b{color:var(--white)!important}
.footer a{color:var(--white);text-decoration:none;border-bottom:1px solid rgba(246,199,173,.6)}
.footer .badge{background:rgba(255,255,255,.14);color:var(--white)}

/* ---------- Admin ---------- */
.admin-wrap{display:grid;gap:14px}
@media(min-width:900px){.admin-wrap{grid-template-columns:220px 1fr;align-items:start}}
.admin-nav{display:flex;gap:6px;overflow-x:auto}
@media(min-width:900px){.admin-nav{flex-direction:column;position:sticky;top:96px}}
.admin-nav button{border:1px solid var(--border);background:var(--white);border-radius:var(--radius-sm);padding:10px 13px;font-size:13.5px;font-weight:600;cursor:pointer;text-align:right;white-space:nowrap;color:var(--muted);transition:all .2s var(--ease)}
.admin-nav button:hover{border-color:var(--teal);color:var(--teal-dark)}
.admin-nav button.active{background:var(--teal-dark);color:var(--white);border-color:var(--teal-dark);box-shadow:0 4px 14px rgba(92,148,144,.3)}
.stat{padding:16px;text-align:center;background:var(--mint);border-color:transparent}
.stat b{display:block;font-size:22px;color:var(--teal-deep)}
.stat span{font-size:12px;color:var(--muted)}

@media print{
  body *{visibility:hidden}
  .print-area,.print-area *{visibility:visible}
  .print-area{position:absolute;inset:0;padding:24px;background:#fff;color:#000}
}

/* =========================================================
   ARTISTIC LAYER — Bold Artistic Craft Universe
   ========================================================= */
@keyframes floaty{0%,100%{transform:translateY(0) rotate(var(--r,0deg))}50%{transform:translateY(-14px) rotate(calc(var(--r,0deg) + 4deg))}}
@keyframes floaty2{0%,100%{transform:translateY(-6px) rotate(var(--r,0deg))}50%{transform:translateY(10px) rotate(calc(var(--r,0deg) - 5deg))}}
@keyframes spinSlow{to{transform:rotate(360deg)}}
@keyframes riseWord{from{opacity:0;transform:translateY(.6em) rotate(2deg)}to{opacity:1;transform:none}}
@keyframes cueBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(8px)}}
@keyframes marqueeMove{to{transform:translateX(50%)}}
@keyframes popCount{0%{transform:scale(.4)}60%{transform:scale(1.25)}100%{transform:scale(1)}}
@keyframes confettiFall{0%{opacity:1;transform:translateY(-10px) rotate(0)}100%{opacity:0;transform:translateY(140px) rotate(320deg)}}
@keyframes lightboxIn{from{opacity:0;transform:scale(.86) translateY(24px)}to{opacity:1;transform:none}}
@keyframes drawIn{from{stroke-dashoffset:200}to{stroke-dashoffset:0}}

.reveal{opacity:0;transform:translateY(28px);transition:opacity .75s var(--ease),transform .75s var(--ease)}
.reveal.in{opacity:1;transform:none}
.float{animation:floaty 5.5s ease-in-out infinite}
.float.alt{animation:floaty2 6.5s ease-in-out infinite}
.count{animation:popCount .35s var(--ease)}

/* خط اليد Playpen — للمسات الحرفية فقط */
.hand{font-family:'Playpen Sans Arabic',cursive!important}
.eyebrow,.badge.sticker,.scroll-cue,.note-card p,.hl-doodle,.step::before{font-family:'Playpen Sans Arabic',cursive}
.note-card p{font-weight:600;font-size:15px;line-height:1.9}
.eyebrow{font-size:13px;letter-spacing:0}
.display{font-size:clamp(32px,6.4vw,58px);font-weight:900;line-height:1.28;margin:0;color:var(--heading);text-shadow:0 2px 18px rgba(232,168,130,.28)}
.band-ink .display,.band-grad .display{color:var(--cream-soft);text-shadow:0 2px 18px rgba(40,72,74,.3)}
.display .w{display:inline-block;animation:riseWord .7s var(--ease) both}
.hl-doodle{position:relative;white-space:nowrap}
.hl-doodle svg{position:absolute;inset-inline:0;bottom:-.18em;width:100%;height:.42em}
.hl-doodle svg path{stroke:var(--peach-dark);stroke-width:7;fill:none;stroke-linecap:round;stroke-dasharray:200;animation:drawIn 1.1s .5s var(--ease) both}

.hero-stage{position:relative;overflow:hidden;background:
  radial-gradient(700px 420px at 12% -10%,var(--teal-light) 0%,transparent 60%),
  radial-gradient(560px 400px at 96% 14%,rgba(246,199,173,.75) 0%,transparent 62%),
  linear-gradient(160deg,var(--cream) 30%,var(--mint) 100%);
  padding:56px 0 70px}
.hero-cluster{position:relative;min-height:300px}
.hero-card{position:relative;z-index:5;max-width:340px;margin:0 auto;transform:rotate(-2.5deg);cursor:pointer;transition:transform .25s var(--ease),box-shadow .25s var(--ease)}
.hero-card:hover{transform:rotate(-2.5deg) translateY(-4px);box-shadow:var(--shadow-lift)!important}
.hero-card b{font-size:15px}
.deco{position:absolute;z-index:1;pointer-events:none;filter:drop-shadow(0 10px 16px rgba(92,148,144,.28))}
.scroll-cue{display:inline-flex;flex-direction:column;align-items:center;gap:2px;color:var(--teal-dark);font-size:11.5px;font-weight:700;margin-top:26px;animation:cueBounce 1.8s ease-in-out infinite}

.marquee{overflow:hidden;background:var(--ink);color:var(--cream);padding:13px 0;transform:rotate(-.6deg);margin:-8px -10px;border-block:3px solid var(--peach)}
.marquee-track{display:flex;gap:34px;width:max-content;animation:marqueeMove 22s linear infinite;font-weight:700;font-size:15px;letter-spacing:.5px;white-space:nowrap;color:rgba(251,247,241,.92)}
.marquee-track span{display:inline-flex;align-items:center;gap:34px}
.marquee-track i{font-style:normal;color:var(--peach)}

.cat-art{position:relative;overflow:hidden}
.cat-art .scribble{position:absolute;top:8px;inset-inline-start:8px;width:56px;height:56px;opacity:0;transform:scale(.6) rotate(-20deg);transition:all .35s var(--ease)}
.cat-art:hover .scribble{opacity:1;transform:none}
.cat-art:nth-child(odd){transform:rotate(-.8deg)}
.cat-art:nth-child(even){transform:rotate(.8deg)}
.cat-art:hover{transform:translateY(-6px) rotate(0)}

.tilt-card:hover{transform:translateY(-8px) rotate(-1.4deg) scale(1.015)!important}
.sticker{transform:rotate(-7deg);box-shadow:0 3px 8px rgba(232,168,130,.4)}
.stitch-top{border-top:2px dashed rgba(92,148,144,.4);padding-top:10px;margin-top:10px}

.band-ink{background:var(--ink);color:var(--cream)}
.band-ink .muted{color:rgba(246,239,230,.6)}
.band-ink .eyebrow{color:var(--peach)}
.band-grad{background:linear-gradient(150deg,var(--teal-dark) 0%,var(--teal) 100%);color:var(--white)}
.band-grad .muted{color:rgba(255,255,255,.75)}

.note-card{padding:18px;border-radius:14px;box-shadow:var(--shadow-card);border:none;position:relative;transition:transform .3s var(--ease)}
.note-card:hover{transform:rotate(0) translateY(-4px)!important}
.note-card::before{content:"〰";position:absolute;top:-14px;inset-inline-start:20px;font-size:20px;color:var(--teal-dark)}

.bento{display:grid;gap:14px;grid-template-columns:repeat(2,1fr)}
@media(min-width:720px){.bento{grid-template-columns:repeat(4,1fr)}
 .bento>*:nth-child(6n+1){grid-column:span 2;grid-row:span 2}
 .bento>*:nth-child(6n+4){grid-column:span 2}}
.gallery-lightbox>div{animation:lightboxIn .45s var(--ease)}

.magnet{display:inline-block;transition:transform .18s ease-out;will-change:transform}
.confetti{position:absolute;top:0;inset-inline:0;height:0;pointer-events:none}
.confetti i{position:absolute;width:9px;height:12px;border-radius:2px;animation:confettiFall 1.6s var(--ease) forwards}

@media(max-width:719px){
  .deco{transform:scale(.85)}
  .marquee-track{animation-duration:16s}
}

/* ---------- BOLD v2: Awwwards energy ---------- */
.display.mega{font-size:clamp(42px,9.5vw,88px);line-height:1.12;}
/* ---------- لمسات الهوية: مغرز · أختام · قلوب ---------- */
.badge{border:1.2px dashed rgba(92,148,144,.45)}
.badge.peach{border-color:rgba(232,168,130,.65)}
.badge.solid{border:none}
.stitch-frame{border:2px dashed rgba(92,148,144,.45);border-radius:calc(var(--radius) + 6px);padding:7px}
.hearts-divider{display:flex;align-items:center;gap:14px;justify-content:center;color:var(--peach-dark);margin:6px 0;font-family:'Playpen Sans Arabic',cursive;font-size:15px;letter-spacing:6px;opacity:.85}
.hearts-divider::before,.hearts-divider::after{content:"";flex:1;max-width:180px;border-top:2px dashed rgba(92,148,144,.35)}
.thanks-strip{background:var(--teal-light);border-radius:999px;padding:11px 20px;text-align:center;font-size:13.5px;color:var(--teal-dark);font-family:'Playpen Sans Arabic',cursive}
.band-ink{background:var(--teal-deep) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='72'%3E%3Cpath d='M36 50 C22 40 21 30 28 26 C32 24 36 28 36 30 C36 28 40 24 44 26 C51 30 50 40 36 50Z' fill='none' stroke='rgba(255,255,255,.10)' stroke-width='2'/%3E%3C/svg%3E");color:var(--cream)}
.band-ink .muted{color:rgba(246,239,230,.75)}
.marquee{background:linear-gradient(90deg,var(--teal-dark),var(--teal),var(--teal-dark));border-block:2.5px dashed var(--peach);transform:rotate(-.6deg)}
.marquee.light{background:var(--peach-light);border-block:2.5px dashed var(--teal-dark)}
.marquee.light .marquee-track{color:var(--heading-soft)}
.marquee.light .marquee-track i{color:var(--teal-dark)}
.mark{background:var(--peach);color:var(--heading);padding:.02em .2em;border-radius:.2em;display:inline-block;transform:rotate(-1.5deg);box-decoration-break:clone;-webkit-box-decoration-break:clone}
.band-ink .mark,.band-grad .mark{box-shadow:0 6px 20px rgba(246,199,173,.35)}
.outline{color:transparent;-webkit-text-stroke:2.5px var(--ink);paint-order:stroke}
.band-ink .outline,.band-grad .outline{-webkit-text-stroke:2.5px var(--cream);color:transparent}
h2.xl{font-size:clamp(28px,6vw,52px);font-weight:900;line-height:1.15;margin:0 0 18px}

.grain{position:fixed;inset:0;pointer-events:none;z-index:90;opacity:.045;mix-blend-mode:multiply;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E")}

/* قائمة التصنيفات التحريرية العملاقة */
.cat-list{display:flex;flex-direction:column;gap:12px}
.cat-row{display:flex;align-items:center;gap:16px;padding:20px 18px;border:1.5px dashed rgba(92,148,144,.35);border-radius:18px;cursor:pointer;position:relative;overflow:hidden;isolation:isolate;transition:transform .3s var(--ease),box-shadow .3s var(--ease)}
.cat-row:hover{transform:translateY(-3px);box-shadow:var(--shadow-card)}
.cat-row::before{content:"";position:absolute;inset:0;background:var(--peach);opacity:0;transition:opacity .38s var(--ease);z-index:-1}
.cat-row:hover::before{opacity:.55}
.cat-row .idx{font-weight:800;font-size:13px;color:var(--peach-dark);transition:color .3s}
.cat-row:hover .idx{color:var(--heading)}
.cat-row b{font-size:clamp(24px,5vw,42px);font-weight:900;color:var(--heading-soft);transition:transform .35s var(--ease),color .3s}
.cat-row:hover b{transform:translateX(-10px);color:var(--heading)}
.cat-row .subs{display:none;color:var(--muted);font-size:12.5px}
@media(min-width:720px){.cat-row .subs{display:block}}
.cat-row .row-icon{opacity:0;transform:scale(.4) rotate(-25deg);transition:all .35s var(--ease)}
.cat-row:hover .row-icon{opacity:1;transform:none}
.cat-row .arrow{margin-inline-start:auto;font-size:30px;color:var(--teal-dark);transition:transform .35s var(--ease)}
.cat-row:hover .arrow{transform:translateX(-12px) rotate(-40deg);color:var(--teal-deep)}

/* شريط تمرير أفقي Snap */
.hstrip{display:flex;gap:16px;overflow-x:auto;scroll-snap-type:x mandatory;padding:8px 4px 20px;-webkit-overflow-scrolling:touch}
.hstrip>*{flex:0 0 76%;max-width:290px;scroll-snap-align:center}
@media(min-width:720px){.hstrip>*{flex-basis:280px}}
.hstrip::-webkit-scrollbar{height:6px}
.hstrip::-webkit-scrollbar-track{background:transparent}
.hstrip::-webkit-scrollbar-thumb{background:var(--teal);border-radius:99px}

.spin-badge{animation:spinSlow 11s linear infinite;filter:drop-shadow(0 8px 14px rgba(232,168,130,.45))}
.btn .arr{display:inline-block;transition:transform .25s var(--ease)}
.btn:hover .arr{transform:translateX(-6px)}
@keyframes trailFade{from{opacity:.9;transform:translate(-50%,-50%) scale(1)}to{opacity:0;transform:translate(-50%,-80%) scale(.15)}}
.trail-dot{position:fixed;z-index:85;pointer-events:none;border-radius:50%;animation:trailFade .75s ease-out forwards}
.marquee.rev .marquee-track{animation-direction:reverse}
.marquee.light{background:var(--teal-dark);border-block-color:var(--teal-light);transform:rotate(.6deg)}

/* ---------- انتقال صفحات: خيط يُسحب ---------- */
.thread-wipe{position:fixed;inset:0;z-index:100;pointer-events:none;animation:threadGone 1.2s linear both}
@keyframes threadGone{0%,92%{opacity:1}100%{opacity:0;visibility:hidden}}
.thread-wipe .panel{position:absolute;inset:0;background:linear-gradient(150deg,var(--teal-dark),var(--teal));transform:scaleY(0);transform-origin:center;animation:threadPanel 1.15s var(--ease) both}
.thread-wipe svg{position:absolute;inset:0;width:100%;height:100%}
.thread-wipe .thread{fill:none;stroke:var(--peach-dark);stroke-width:5;stroke-linecap:round;vector-effect:non-scaling-stroke;stroke-dasharray:100;stroke-dashoffset:100;animation:threadDraw 1.15s linear both;filter:drop-shadow(0 2px 6px rgba(232,168,130,.5))}
.thread-wipe .yarn-pop{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) scale(0);animation:yarnPop 1.15s var(--ease) both}
@keyframes threadDraw{0%{stroke-dashoffset:100}38%{stroke-dashoffset:0}62%{stroke-dashoffset:0}100%{stroke-dashoffset:-100}}
@keyframes threadPanel{0%,22%{transform:scaleY(0)}45%{transform:scaleY(1)}62%{transform:scaleY(1)}88%,100%{transform:scaleY(0)}}
@keyframes yarnPop{0%,40%{transform:translate(-50%,-50%) scale(0) rotate(0)}52%{transform:translate(-50%,-50%) scale(1.15) rotate(20deg)}60%{transform:translate(-50%,-50%) scale(1) rotate(30deg)}75%,100%{transform:translate(-50%,-50%) scale(0) rotate(60deg)}}
.hero-cluster{transition:transform .25s ease-out;will-change:transform;transform-style:preserve-3d}
@media(prefers-reduced-motion:reduce){.thread-wipe{display:none}}

@media(prefers-reduced-motion:reduce){.trail-dot{display:none}.spin-badge{animation:none}}

@media(prefers-reduced-motion:reduce){
  .display .w,.hl-doodle svg path{animation:none!important;opacity:1}
  .reveal{opacity:1;transform:none}
}

@media(prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
`;

/* ============================ Data Layer ============================ */

const OCCASIONS = ["زواج", "تخرج", "مولود", "رمضان", "عيد", "مناسبات مدرسية", "هدايا شخصية", "أخرى"];

const ORDER_STATUSES = [
  { key: "new", label: "جديد" },
  { key: "awaiting_payment", label: "بانتظار الدفع" },
  { key: "review", label: "تحت المراجعة" },
  { key: "in_progress", label: "قيد التنفيذ" },
  { key: "designing", label: "جاري التصميم" },
  { key: "awaiting_approval", label: "بانتظار موافقة العميلة" },
  { key: "ready_to_ship", label: "جاهز للشحن" },
  { key: "shipped", label: "تم الشحن" },
  { key: "delivered", label: "تم التسليم" },
  { key: "cancelled", label: "ملغي" },
];
const statusLabel = (k) => ORDER_STATUSES.find((s) => s.key === k)?.label || k;

const initialCategories = [
  { id: "crochet", name: "الكروشيه", order: 1, subs: ["دمى", "شنط", "زهور", "ديكور", "مستلزمات أطفال", "ميداليات", "توزيعات", "قطع مخصصة"] },
  { id: "prints", name: "المطبوعات", order: 2, subs: ["بطاقات مناسبات", "أظرف", "ستيكرات", "كروت شكر", "أذكار", "توزيعات"] },
  { id: "print3d", name: "الطباعة ثلاثية الأبعاد", order: 3, subs: ["أسماء وحروف ديكور", "مجسمات هدايا", "قطع ديكور صغيرة", "إضافات للهدايا"] },
  { id: "custom", name: "الطلبات الخاصة", order: 4, subs: ["حسب المناسبة", "حسب الاسم", "حسب العبارة", "حسب الفكرة"] },
];

const initialProducts = [
  { id: "p1", name: "دمية أرنب كروشيه", price: 95, categoryId: "crochet", sub: "دمى", type: "جاهز", availability: "متوفر", stock: 6, featured: true, customizable: { name: true, phrase: false, wrap: true }, desc: "دمية أرنب مصنوعة يدويًا بخيوط قطنية آمنة للأطفال. يمكن إضافة اسم الطفل على الدمية." },
  { id: "p2", name: "باقة زهور كروشيه", price: 140, categoryId: "crochet", sub: "زهور", type: "مخصص", availability: "حسب الطلب", stock: null, featured: true, customizable: { name: false, phrase: true, wrap: true }, desc: "باقة زهور دائمة لا تذبل، تُنسّق حسب المناسبة مع إمكانية إضافة بطاقة إهداء بعبارة خاصة." },
  { id: "p3", name: "ميدالية حرف بالكروشيه", price: 25, categoryId: "crochet", sub: "ميداليات", type: "مخصص", availability: "حسب الطلب", stock: null, featured: false, customizable: { name: true, phrase: false, wrap: true }, desc: "ميدالية بحرف من اختيارك، مناسبة للتوزيعات والهدايا الصغيرة. سعر خاص للكميات." },
  { id: "p4", name: "توزيعات مواليد كروشيه", price: 18, categoryId: "crochet", sub: "توزيعات", type: "مخصص", availability: "حسب الطلب", stock: null, featured: true, customizable: { name: true, phrase: true, wrap: true }, desc: "قطع صغيرة لتوزيعات المواليد، تُخصص بالاسم وتاريخ المولود. الحد الأدنى 12 قطعة." },
  { id: "p5", name: "بطاقات تهنئة عيد (10 قطع)", price: 45, categoryId: "prints", sub: "بطاقات مناسبات", type: "جاهز", availability: "متوفر", stock: 20, featured: true, customizable: { name: false, phrase: true, wrap: false }, desc: "مجموعة بطاقات تهنئة بتصاميم مطبوعة عالية الجودة مع أظرفها." },
  { id: "p6", name: "كروت شكر مخصصة (20 قطعة)", price: 60, categoryId: "prints", sub: "كروت شكر", type: "مخصص", availability: "حسب الطلب", stock: null, featured: false, customizable: { name: true, phrase: true, wrap: false }, desc: "كروت شكر تُطبع باسمك أو اسم مشروعك مع العبارة التي تختارينها." },
  { id: "p7", name: "ستيكرات أذكار", price: 22, categoryId: "prints", sub: "أذكار", type: "جاهز", availability: "متوفر", stock: 40, featured: false, customizable: { name: false, phrase: false, wrap: false }, desc: "ستيكرات أذكار الصباح والمساء بخامة مقاومة للماء." },
  { id: "p8", name: "اسم ديكور ثلاثي الأبعاد", price: 85, categoryId: "print3d", sub: "أسماء وحروف ديكور", type: "مخصص", availability: "حسب الطلب", stock: null, featured: true, customizable: { name: true, phrase: false, wrap: true }, desc: "اسم مطبوع بتقنية ثلاثية الأبعاد لديكور غرف الأطفال والمكاتب. يُنفذ حسب الاسم المطلوب." },
  { id: "p9", name: "مجسم هدية تخرج", price: 55, categoryId: "print3d", sub: "مجسمات هدايا", type: "مخصص", availability: "حسب الطلب", stock: null, featured: false, customizable: { name: true, phrase: true, wrap: true }, desc: "مجسم تخرج يُضاف إليه اسم الخريجة وسنة التخرج." },
  { id: "p10", name: "شنطة كروشيه يدوية", price: 180, categoryId: "crochet", sub: "شنط", type: "جاهز", availability: "متوفر", stock: 3, featured: false, customizable: { name: false, phrase: false, wrap: true }, desc: "شنطة يد مصنوعة بالكامل بالكروشيه ببطانة داخلية قوية." },
];

const initialGallery = [
  { id: "g1", title: "توزيعات مولود باسم ريان", categoryId: "crochet", occasion: "مولود", desc: "50 قطعة توزيعات كروشيه مع بطاقة اسم" },
  { id: "g2", title: "باقة زهور تخرج", categoryId: "crochet", occasion: "تخرج", desc: "باقة زهور كروشيه بألوان الجامعة" },
  { id: "g3", title: "بطاقات دعوة زواج", categoryId: "prints", occasion: "زواج", desc: "دعوات مطبوعة مع أظرف مخصصة" },
  { id: "g4", title: "اسم ديكور لغرفة طفل", categoryId: "print3d", occasion: "مولود", desc: "اسم ثلاثي الأبعاد بطول 40 سم" },
  { id: "g5", title: "توزيعات رمضان للمعلمات", categoryId: "prints", occasion: "رمضان", desc: "ستيكرات وكروت أذكار لتوزيعات المدرسة" },
  { id: "g6", title: "دمية مخصصة بشخصية مفضلة", categoryId: "crochet", occasion: "هدايا شخصية", desc: "دمية منفذة من صورة مرجعية أرسلتها العميلة" },
  { id: "g7", title: "هدايا عيد للعائلة", categoryId: "print3d", occasion: "عيد", desc: "مجسمات صغيرة بأسماء أفراد العائلة" },
  { id: "g8", title: "ميداليات حفل مدرسي", categoryId: "crochet", occasion: "مناسبات مدرسية", desc: "80 ميدالية كروشيه لحفل نهاية العام" },
];

const initialCoupons = [
  { id: "c1", code: "WELCOME10", type: "percent", value: 10, minTotal: 0, active: true, uses: 14 },
  { id: "c3", code: "SHUKRAN10", type: "percent", value: 10, minTotal: 0, active: true, uses: 0 },
  { id: "c2", code: "EID25", type: "fixed", value: 25, minTotal: 150, active: true, uses: 5 },
];

const initialOrders = [
  {
    id: "ORD-1043", createdAt: "2026-06-28", customer: { name: "نورة العتيبي", phone: "0501234567", city: "الرياض", address: "حي النرجس" },
    items: [{ productId: "p4", name: "توزيعات مواليد كروشيه", qty: 24, price: 18, custom: { name: "سلطان", occasion: "مولود", wrap: "تغليف هدية" } }],
    kind: "custom", status: "in_progress", rush: false, deliveryDate: "2026-07-10", payment: "تحويل بنكي", coupon: null,
    notes: "اللون حسب المرجع المرفق", refImages: 2, adminNotes: "تم تأكيد اللون مع العميلة",
    history: [{ status: "new", at: "2026-06-28" }, { status: "review", at: "2026-06-28" }, { status: "in_progress", at: "2026-06-30" }],
  },
  {
    id: "ORD-1042", createdAt: "2026-06-27", customer: { name: "هند القحطاني", phone: "0559876543", city: "جدة", address: "حي السلامة" },
    items: [{ productId: "p5", name: "بطاقات تهنئة عيد (10 قطع)", qty: 2, price: 45, custom: {} }, { productId: "p7", name: "ستيكرات أذكار", qty: 3, price: 22, custom: {} }],
    kind: "ready", status: "shipped", rush: false, deliveryDate: null, payment: "مدى", coupon: "WELCOME10",
    notes: "", refImages: 0, adminNotes: "", history: [{ status: "new", at: "2026-06-27" }, { status: "ready_to_ship", at: "2026-06-29" }, { status: "shipped", at: "2026-06-30" }],
  },
  {
    id: "ORD-1041", createdAt: "2026-06-25", customer: { name: "سارة الدوسري", phone: "0533334444", city: "الدمام", address: "حي الشاطئ" },
    items: [{ productId: "p8", name: "اسم ديكور ثلاثي الأبعاد", qty: 1, price: 85, custom: { name: "لمار", occasion: "مولود" } }],
    kind: "custom", status: "awaiting_approval", rush: true, deliveryDate: "2026-07-05", payment: "بانتظار الدفع", coupon: null,
    notes: "أفضّل خطًا مقروءًا وبسيطًا", refImages: 1, adminNotes: "أُرسل التصميم للموافقة عبر واتساب",
    history: [{ status: "new", at: "2026-06-25" }, { status: "designing", at: "2026-06-26" }, { status: "awaiting_approval", at: "2026-06-29" }],
  },
  {
    id: "ORD-1040", createdAt: "2026-06-20", customer: { name: "ريم الشمري", phone: "0561112222", city: "الرياض", address: "حي الياسمين" },
    items: [{ productId: "p1", name: "دمية أرنب كروشيه", qty: 1, price: 95, custom: { name: "جود", wrap: "تغليف هدية" } }],
    kind: "ready", status: "delivered", rush: false, deliveryDate: null, payment: "Apple Pay", coupon: null,
    notes: "", refImages: 0, adminNotes: "", history: [{ status: "new", at: "2026-06-20" }, { status: "shipped", at: "2026-06-22" }, { status: "delivered", at: "2026-06-24" }],
  },
];

const initialReviews = [
  { id: "r1", productId: "p1", name: "أم فيصل", rating: 5, text: "الشغل نظيف جدًا والدمية أجمل من الصور، بنتي ما تفارقها." },
  { id: "r2", productId: "p1", name: "منيرة", rating: 4, text: "جميلة والتغليف مرتب، التأخير يوم واحد فقط عن الموعد." },
  { id: "r3", productId: "p5", name: "أبرار", rating: 5, text: "البطاقات فخمة والطباعة واضحة، طلبت مرة ثانية للعيد." },
  { id: "r4", productId: "p8", name: "أم لمار", rating: 5, text: "الاسم طلع مطابق للتصميم اللي وافقت عليه، تعامل راقٍ." },
];

const initialSettings = {
  storeName: "Crochet by Asma — كروشيه أسماء",
  weeklySlots: 3,
  whatsapp: "9665XXXXXXXX",
  instagram: "crochet.by.asma",
  shippingFee: 25,
  freeShippingOver: 300,
  taxPercent: 15,
  customLeadTime: "تُنفذ الطلبات المخصصة خلال 5 إلى 14 يوم عمل حسب حجم الطلب",
  cancelPolicy: "المنتجات المخصصة لا يمكن إلغاؤها أو استبدالها بعد بدء التنفيذ، لأنها تُصنع خصيصًا لكِ. المنتجات الجاهزة يمكن استبدالها خلال 3 أيام بحالتها الأصلية. المنتج الرقمي لا يمكن استرجاعه ولا استبداله بعد الشراء.",
  payments: { mada: true, applePay: true, cards: true, stcPay: true, bank: true, tabby: false, tamara: false },
  shippingCompanies: { aramex: false, smsa: false, local: true },
};

/* نصوص الموقع — كلها قابلة للتعديل من لوحة التحكم (تبويب نصوص الموقع)
   رموز التنسيق: *كلمة* = تظليل · ~كلمة~ = خط يد بلون الخوخي · | = سطر جديد */
const initialTexts = {
  announce: "🚚 شحن مجاني للطلبات فوق {المبلغ} · توصيل لجميع مدن المملكة 🤍",
  heroBadge1: "♡ صُنع بحب — كل غرزة لأجلك",
  heroBadge2: "📍 صنع في الرياض",
  heroTitle: "هنا ~الخيوط * تتحوّل حكايات",
  heroSub: "كون صغير من الكروشيه والمطبوعات والقطع ثلاثية الأبعاد — كل قطعة تُصنع *خصيصًا لكِ* باسمك ومناسبتك.",
  heroCtaShop: "تسوقي الكون",
  heroCtaCustom: "ابدئي طلبًا مخصصًا",
  heroScrollCue: "اسحبي لتدخلي العالم",
  marquee1: "كروشيه · مطبوعات · طباعة ثلاثية الأبعاد · توزيعات · هدايا بالاسم · صنع في الرياض",
  catsEyebrow: "✳ الكون الصغير",
  catsTitle: "اختاري *عالمك*",
  featEyebrow: "♡ قطع تُقتنى",
  featTitle: "مختارات هذا الموسم",
  featLink: "عرض الكل",
  customEyebrow: "✎ الطلب المخصص",
  customTitle: "احكي لنا ~فكرتك~،|ونحن *نحيكها* واقعًا",
  customSub: "اسم مولود، عبارة تخرج، توزيعات بمئة قطعة، أو صورة من خيالك — أرسليها لنا وشاهديها تتحول قطعةً تلمسينها.",
  customCta: "ابدئي الحكاية ←",
  builderEyebrow: "☞ جربي بنفسك",
  builderTitle: "ابني هديتك في ثوانٍ",
  builderSub: "اختاري المناسبة وشاهدي كيف تتغير الفكرة — ثم أكملي التفاصيل في معالج الطلب.",
  marquee2: "من أعمالنا · ٤٠٠+ طلب منفذ · لكل مدن المملكة · قطع لا تتكرر",
  galEyebrow: "❋ من الأرشيف",
  galTitle: "معرضنا *الصغير*",
  galLink: "كل الأعمال ←",
  galHint: "اسحبي يمينًا ويسارًا ✋",
  revEyebrow: "✉ رسائل وصلتنا",
  revTitle: "يقولون عنا",
  rev1Name: "أم فيصل — الرياض",
  rev1Text: "الدمية أجمل من الصور، بنتي ما تفارقها 🥹",
  rev2Name: "أبرار — جدة",
  rev2Text: "طلبت توزيعات التخرج متأخرة وقبلوا طلبي المستعجل. أنقذوني!",
  rev3Name: "أم لمار — الدمام",
  rev3Text: "الاسم ثلاثي الأبعاد طلع مطابق للتصميم اللي وافقت عليه بالضبط.",
  finaleTitle: "مناسبتك القادمة تستحق|*قطعة لا تتكرر*",
  finaleCta: "ابدئي طلبك 🎀",
  finaleWhats: "💬 كلمينا واتساب",
  footerTagline: "قطع يدوية مخصصة لمناسباتك — صنع في الرياض 📍 جميع الأسعار تشمل الضريبة.",
  footerHand: "من خيوطٍ صُنعت… وبالحب مُلئت ♡",
  footerLinksTitle: "روابط سريعة",
  footerContactTitle: "كلمينا مباشرة ♡",
  footerThanks: "♡ شكرًا لدعمك المنتجات اليدوية — كل غرزة صُنعت خصيصًا لكِ ♡",
  aboutTitle: "عن كروشيه أسماء",
  aboutIntro: "كروشيه، مطبوعات، وقطع ثلاثية الأبعاد — تُصنع بحب في الرياض، وتصل مخصصةً باسمك ومناسبتك إلى كل مدن المملكة.",
  aboutCard1Title: "🧶 يدوي 100%",
  aboutCard1Text: "كل قطعة تُصنع وتُجهز يدويًا بعناية، وليست إنتاجًا تجاريًا بالجملة.",
  aboutCard2Title: "🎀 مخصص لكِ",
  aboutCard2Text: "الاسم، العبارة، المناسبة، الكمية — كل التفاصيل تُنفذ حسب طلبك.",
  aboutCard3Title: "✨ قطع فريدة",
  aboutCard3Text: "لأنها مصنوعة يدويًا، قد تختلف كل قطعة قليلًا عن غيرها — وهذا سر جمالها.",
  contactTitle: "تواصلي معنا",
  contactIntro: "أسرع طريقة للرد هي واتساب — عادة نرد خلال ساعات العمل من السبت إلى الخميس.",
};

const initialNotifications = [
  { id: "n1", at: "2026-07-01", text: "طلب جديد ORD-1043 بانتظار المراجعة", read: false },
  { id: "n2", at: "2026-07-01", text: "سلة متروكة: عميلة أضافت 3 منتجات ولم تُكمل الدفع", read: false },
  { id: "n3", at: "2026-06-30", text: "المخزون منخفض: شنطة كروشيه يدوية (3 قطع)", read: true },
];

/* ============================ Helpers ============================ */
const SAR = (n) => `${Number(n).toLocaleString("ar-SA")} ر.س`;
const uid = () => Math.random().toString(36).slice(2, 8);
const today = () => new Date().toISOString().slice(0, 10);
const RUSH_FEE = 30;

function calcTotals(items, coupon, settings) {
  const subtotal = items.reduce((s, it) => s + it.price * it.qty + (it.custom?.rush ? RUSH_FEE : 0), 0);
  let discount = 0;
  if (coupon) {
    if (subtotal >= (coupon.minTotal || 0)) {
      discount = coupon.type === "percent" ? (subtotal * coupon.value) / 100 : coupon.value;
    }
  }
  const afterDiscount = Math.max(0, subtotal - discount);
  const shipping = items.length === 0 ? 0 : afterDiscount >= settings.freeShippingOver ? 0 : settings.shippingFee;
  const tax = (afterDiscount * settings.taxPercent) / 100;
  const total = afterDiscount + shipping + tax;
  return { subtotal, discount, shipping, tax, total };
}

/* ============================ UI Primitives ============================ */
const Ph = ({ label = "صورة", ratio = "square", style }) => (
  <div className={`ph ${ratio}`} style={style}>{label}</div>
);

const Field = ({ label, hint, children }) => (
  <div className="field">
    {label && <label>{label}</label>}
    {children}
    {hint && <span className="hint">{hint}</span>}
  </div>
);

const Qty = ({ value, onChange, min = 1 }) => (
  <span className="qty">
    <button type="button" onClick={() => onChange(Math.max(min, value - 1))}>−</button>
    <span>{value}</span>
    <button type="button" onClick={() => onChange(value + 1)}>+</button>
  </span>
);

const Stars = ({ value, onChange }) => (
  <span style={{ fontSize: 18, cursor: onChange ? "pointer" : "default", letterSpacing: 2 }}>
    {[1, 2, 3, 4, 5].map((i) => (
      <span key={i} onClick={onChange ? () => onChange(i) : undefined} style={{ opacity: i <= value ? 1 : 0.25 }}>★</span>
    ))}
  </span>
);

const Modal = ({ open, onClose, title, children }) =>
  !open ? null : (
    <div className="modal-back" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="between" style={{ marginBottom: 12 }}>
          <b style={{ fontSize: 16 }}>{title}</b>
          <button className="icon-btn" onClick={onClose} aria-label="إغلاق">✕</button>
        </div>
        {children}
      </div>
    </div>
  );

const Upload = ({ label = "اضغطي لرفع صورة مرجعية (JPG / PNG)", count = 0, onAdd }) => (
  <div className="upload" onClick={onAdd} role="button">
    ⬆ {label}
    {count > 0 && <div style={{ marginTop: 6 }}><span className="badge solid">{count} صورة مرفوعة</span></div>}
  </div>
);


/* ============================ Craft Universe: عناصر فنية ============================ */
const C = { teal: "#8FB7B3", tealD: "#5C9490", tealDeep: "#2F6664", heading: "#28484A", tealL: "#DDECE8", cream: "#F8F1E8", peach: "#F6C7AD", peachD: "#E8A882", ink: "#3F4A49", white: "#fff" };

const Yarn = ({ size = 64, style }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" style={style} aria-hidden="true">
    <circle cx="30" cy="30" r="22" fill={C.teal} />
    <path d="M10 26 Q30 14 50 26 M9 34 Q30 22 51 34 M12 42 Q30 31 49 41" stroke={C.tealD} strokeWidth="2.6" fill="none" strokeLinecap="round" />
    <path d="M48 44 Q58 48 56 55" stroke={C.peachD} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeDasharray="4 4" />
    <path d="M56 60 C52.5 57.5 52.2 55 54.2 54 C55.3 53.5 56 54.8 56 55.3 C56 54.8 56.7 53.5 57.8 54 C59.8 55 59.5 57.5 56 60Z" fill="none" stroke={C.peachD} strokeWidth="1.8" />
  </svg>
);
const HookPin = ({ size = 58, style }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" style={style} aria-hidden="true">
    <rect x="29" y="12" width="6" height="42" rx="3" fill={C.peachD} transform="rotate(28 32 32)" />
    <path d="M18 14 q-8 4 -2 11" stroke={C.peachD} strokeWidth="6" fill="none" strokeLinecap="round" transform="rotate(28 32 32)" />
  </svg>
);
const HeartCharm = ({ size = 44, style }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" style={style} aria-hidden="true">
    <path d="M32 54 C10 38 8 22 20 16 C27 13 32 19 32 22 C32 19 37 13 44 16 C56 22 54 38 32 54Z" fill={C.peach} stroke={C.peachD} strokeWidth="2.5" strokeDasharray="5 4" />
  </svg>
);
const GiftBox = ({ size = 56, style }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" style={style} aria-hidden="true">
    <rect x="10" y="26" width="44" height="30" rx="5" fill={C.tealD} />
    <rect x="8" y="18" width="48" height="12" rx="4" fill={C.teal} />
    <rect x="28" y="18" width="8" height="38" fill={C.peach} />
    <path d="M32 16 q-10 -12 -14 -2 q-2 6 14 2 q10 -12 14 -2 q2 6 -14 2" fill={C.peachD} />
  </svg>
);
const FlowerDoodle = ({ size = 48, style }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" style={style} aria-hidden="true">
    {[0, 60, 120, 180, 240, 300].map((r) => (
      <ellipse key={r} cx="32" cy="16" rx="8" ry="13" fill={C.tealL} stroke={C.tealD} strokeWidth="2" transform={`rotate(${r} 32 32)`} />
    ))}
    <circle cx="32" cy="32" r="8" fill={C.peachD} />
  </svg>
);
const StarSpark = ({ size = 30, style, color = C.peachD }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" style={style} aria-hidden="true">
    <path d="M32 4 L38 26 L60 32 L38 38 L32 60 L26 38 L4 32 L26 26 Z" fill={color} />
  </svg>
);
const Scribble = ({ style, className }) => (
  <svg viewBox="0 0 64 64" className={className} style={style} aria-hidden="true">
    <path d="M8 40 C6 22 26 8 40 12 C58 17 60 38 46 48 C32 58 12 54 12 40 C12 28 30 22 44 28" stroke={C.peachD} strokeWidth="4" fill="none" strokeLinecap="round" />
  </svg>
);
const DoodleUnderline = () => (
  <svg viewBox="0 0 200 24" preserveAspectRatio="none"><path d="M4 16 C50 6 90 22 130 12 C160 5 185 14 196 10" /></svg>
);

const BowDoodle = ({ size = 40, style }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" style={style} aria-hidden="true">
    <path d="M32 32 C18 20 8 24 12 34 C15 42 26 38 32 32 C38 38 49 42 52 34 C56 24 46 20 32 32Z" fill="none" stroke="#E8A882" strokeWidth="2.6" strokeLinecap="round" />
    <circle cx="32" cy="32" r="3.5" fill="#F6C7AD" />
    <path d="M29 36 L24 50 M35 36 L40 50" stroke="#E8A882" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);
const StitchWave = ({ width = 90, style }) => (
  <svg width={width} height="16" viewBox="0 0 90 16" style={style} aria-hidden="true">
    <path d="M2 8 Q8 2 14 8 T26 8 T38 8 T50 8 T62 8 T74 8 T86 8" fill="none" stroke="#8FB7B3" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="5 4" />
  </svg>
);
/* حقل دودلز خفيف: رشّة رسومات يدوية شفافة حول القسم */
const DoodleField = ({ variant = 0 }) => {
  const sets = [
    [[<Art name="heart" size={46} />, { top: 8, insetInlineStart: "3%" }], [<StitchWave />, { bottom: 14, insetInlineEnd: "5%" }], [<Art name="star" size={34} />, { top: "40%", insetInlineEnd: "2%" }]],
    [[<Art name="bow" size={56} />, { top: 4, insetInlineEnd: "4%" }], [<Art name="flower" size={50} />, { bottom: 10, insetInlineStart: "3%" }], [<StitchWave width={70} />, { top: "50%", insetInlineStart: "1%" }]],
    [[<Art name="hook" size={56} />, { top: 10, insetInlineStart: "5%" }], [<Art name="swatch" size={46} />, { bottom: 18, insetInlineEnd: "8%" }], [<Art name="star" size={28} />, { top: 12, insetInlineEnd: "16%" }]],
  ];
  return (
    <span aria-hidden="true">
      {sets[variant % sets.length].map(([el, pos], i) => (
        <span key={i} className="float" style={{ position: "absolute", opacity: 0.35, pointerEvents: "none", animationDelay: `${i * 0.7}s`, ...pos }}>{el}</span>
      ))}
    </span>
  );
};

/* ظهور عند التمرير */
function Reveal({ children, delay = 0, className = "", style }) {
  const ref = React.useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("in"); io.disconnect(); } }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms`, ...style }}>{children}</div>;
}

/* زر مغناطيسي خفيف (سطح المكتب) */
function Magnetic({ children }) {
  const ref = React.useRef(null);
  const move = (e) => {
    const el = ref.current; if (!el || window.matchMedia("(pointer:coarse)").matches) return;
    const r = el.getBoundingClientRect();
    el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px, ${(e.clientY - r.top - r.height / 2) * 0.24}px)`;
  };
  const leave = () => { if (ref.current) ref.current.style.transform = ""; };
  return <span ref={ref} className="magnet" onMouseMove={move} onMouseLeave={leave}>{children}</span>;
}

const Confetti = () => (
  <div className="confetti" aria-hidden="true">
    {Array.from({ length: 14 }).map((_, i) => (
      <i key={i} style={{ insetInlineStart: `${6 + i * 6.5}%`, background: [C.teal, C.peach, C.tealD, C.peachD][i % 4], animationDelay: `${(i % 5) * 0.12}s` }} />
    ))}
  </div>
);

const KineticTitle = ({ text, className = "display" }) => (
  <h1 className={className}>
    {text.split(" ").map((w, i) =>
      w === "*" ? <br key={i} /> :
      <span key={i} className={`w ${w.startsWith("~") ? "mark" : ""}`} style={{ animationDelay: `${0.08 * i}s`, marginInlineEnd: ".26em" }}>{w.replace("~", "")}</span>
    )}
  </h1>
);

/* يعرض نصًا قابلًا للتعديل من لوحة التحكم مع رموز التنسيق:
   *كلمة* = تظليل (أو خط مرسوم عند hl="doodle") · ~كلمة~ = خط يد خوخي · | = سطر جديد */
function Rich({ text = "", hl = "mark" }) {
  return text.split("|").map((line, li, lines) => (
    <React.Fragment key={li}>
      {line.split(/(\*[^*]+\*|~[^~]+~)/g).map((part, i) => {
        if (part.startsWith("*") && part.endsWith("*")) {
          const inner = part.slice(1, -1);
          return hl === "doodle"
            ? <span key={i} className="hl-doodle"> {inner}<DoodleUnderline /></span>
            : <span key={i} className="mark">{inner}</span>;
        }
        if (part.startsWith("~") && part.endsWith("~"))
          return <span key={i} className="hand" style={{ color: "var(--peach)" }}>{part.slice(1, -1)}</span>;
        return part;
      })}
      {li < lines.length - 1 && <br />}
    </React.Fragment>
  ));
}

/* شريط متحرك: العبارات مفصولة بـ · وتُوضع بينها أيقونات بالتناوب */
const MarqueeText = ({ text = "", icons = ["✿", "★"] }) => (
  <>
    {text.split("·").map((s, i) => (
      <React.Fragment key={i}>{s.trim()} <i>{icons[i % icons.length]}</i> </React.Fragment>
    ))}
  </>
);

/* الشعار الرسمي — فيكتور أصلي من ملفات الهوية (منظف ومضغوط) */
const LOGO_ICON_BODY = `<g> <path fill="var(--lg-tealD,#688888)" d="M971.2,782c-8.4-2.5-10.2-12.2-8.1-19.7,1.7-6,8.6-11.8,16.4-10.9s14.6,10.3,13.8,17.6c-1.2,11.1-10.2,16.7-22.1,13.1Z"/> <path fill="var(--lg-teal,#b7cdca)" d="M1008.5,722.2c-6.8-3.3-7.4-14.4-3.3-20.1s13-6.7,18.7-2.7c5.3,3.7,6.5,11.2,3.2,17.7s-10.3,9.1-18.7,5.1Z"/> <g> <path fill="var(--lg-ink,#3a3934)" d="M864.8,791.7c-36.2,24.6-77.1,40.4-121.4,47.5l-38.1,30.9c11.6,6.8,23.5,8.2,35.5,10.2,66.2,11.2,137.4-25.1,186.2-71.8,3.6-3.4,10.8-1.5,12.7,1.3s3.1,8.1,0,11.2c-65.8,65.3-166.9,106.1-253,60.3-56.7,30.9-121.4,33.8-172.7-9.4-50.9,15.4-103.5,4.4-143.4-32.6l-51.1,56c-9.6,9.8-19.1,19.6-32.1,23.9-11.8,2.7-22.9,1.4-31.7-6.3-7.5-6.6-11.6-17.2-9.8-29,1.9-12.7,9.1-22.9,17.5-32.5l56.5-64.8c-80-20-123.1-85.5-120.4-163.5-70-61.8-81.7-156.7-23.7-228.8-20.6-84.2,21.2-167.8,102.2-193.9,29.8-74.9,92-126.3,173.8-112.6,42.8-39.7,94.6-62.7,152.3-55,26.9,3.6,50.2,15.1,70.3,33.4,80.8-11.7,153.7,17.2,182.1,94.2,6.2,4,11.5,7.2,18.9,7.6l60.4-66.2c4.7-5.1,9.3-9.1,11-17l-24.4,13.4c-4.9,2.7-10.6,3.8-15.2,1.2-32.5-18.7,20.9-93.8,91.4-99.3,19.2-1.5,37.2,8.4,43.2,25.8,10.7,30.8-17.8,76.2-40,101.4l-79.4,90.1c56.5,38.2,85.1,94.7,74.3,161.7,44,65.2,49.3,139.2,2.8,204.2,0,23-.6,44.7-7.8,67.2-15.7,49-50,90.2-95.5,114.1-8.4,4.4-15,6.3-20.3,15-2.5,4.2-9.7,7.5-10.8,12ZM927.9,56.8c-5.8,6.9-12.4,13-12.4,24.1l29.2-14.5c5.4-2.7,12.5-1.8,17.4,1.8,9.7,7.2,5.6,23.9-5.3,36.8l-123.5,133.3c12,4.6,21.8,10.2,27.4,22.7l119.4-134.9c19.6-22.1,47.5-60.4,46.4-86.5-.4-10.7-7-18.5-16.8-20.3-28.7-5.1-62.8,14.5-81.9,37.3ZM441.5,125.7c-22.4,26.2-38.6,56.3-51.1,90.2,14.9,2.4,28.5-1,42.4-5.3,31.3-9.7,57.5-28.1,81.5-49.9l31.8-29c30.5-27.8,64.9-47.6,106-59.6-16.1-13.3-34.1-19.2-53.1-21.4-63.3-7.2-117.1,27.9-157.5,75.1ZM594.7,118.9c-19.6,5.5-33.7,25.8-51.7,39.9,28,10.2,55.7,10.8,83.5,4.9l68.6-14.5c46.1-9.8,91.3-8.3,138.7,4.3-15.9-34.2-47.1-57.5-80.2-65.2-54.3-14.8-113.5,0-158.8,30.7ZM382.5,112.3c-43.2,16.6-71.6,53.6-88.4,96.7s-24.1,96.3-15,147.7c33.9-21.9,57.1-53.2,73.4-88.5l19-52c15-41,34.8-77.8,63.9-111.8-20.4-3.9-36.7,1.7-53,7.9ZM726.3,211.7c19.4,9.7,39.4,15.8,60.8,19.7,8.6,2.3,17.1,4,26,3.6l47.9-52.3c-58.8-26.1-122.7-27.8-184.5-10.6,14.6,18.1,31.1,30.3,49.8,39.6ZM407.4,689.8l196.1-216.9,45.6-70.3c25.6-39.3,57.1-71.5,93.5-100.7,18.6-14.9,35.3-29.9,51.8-47.8-4.6-5.2-9.8-5.1-15.3-6-46-8.2-86.6-29.4-117-64.8-3.6-4.2-8.1-6.9-14.1-5.4-40.6,9.8-81.1,9.2-121.4-3.3-39.4,36.4-82.8,59.1-135.7,60.5-5.5.1-8.6,4.4-10.1,9.2-15.9,52.3-47.3,96.8-92.2,127.9-5.1,3.6-6,8.1-4.7,14,10.6,48.7,8.2,97.2-7,144.2l45.4,51.2c19,25.4,30.6,54.4,37.7,85.2,1.2,5.1,3.9,8.4,9,10.1l38.2,12.7ZM240.5,240.7c-38.4,31.1-57.3,81.5-50.6,131,3.3,24.8,10.7,46.9,21,69.1,12.3,26.8,28.8,51.2,51.3,74.5,13.5-36.4,13.7-74.2,7.4-111.5l-10.8-64.2c-4-38.6-.5-76.4,11.1-115-11.7,2.8-20.4,8.8-29.3,16ZM980.4,359.1c4-30.9-6.4-57.2-20.7-80.4-13.2-19.8-29.1-35.8-50.4-47.7l-39.5,46.8c43.4,19.6,78.3,46.7,110.6,81.4ZM650.1,507c20.7-18.7,44.6-34,64.2-55.3,28-30.5,50.3-63.8,73.3-98,17.9-26.6,37.8-49.7,58.7-74.5,2.7-5.7-3.4-15.1-7.1-18.7-5.2-5.1-13.5-6.9-21.4-5.3-20.8,22.5-41.8,42.8-66,61.9-38.1,30.2-70.1,65.2-96,106.4l-36.3,57.8-98.1,108-245.8,274.2c-12,13.4-16.7,29.9-7,36.5,14.7,10.1,30.6-8.7,45-24.5l92.9-101.7,229.4-254.1,14.1-12.8ZM866.1,352.6c6.6,17.6,16,33,28.7,47l38.8,42.9c29.2,33,49.9,69.8,61.2,115.1,37.6-64.5,18.3-136.3-29.6-189.4-28.7-30.9-62.2-55.8-100.7-73.6-17.9-8.3-8,32.1,1.6,57.9ZM776.1,812.9c35.1-8.8,68.1-26.5,93.7-53.7,22.4-23.9,33.5-54.6,38.2-85.7v-2.3s.3-6.5.3-6.5c.9-19.8,2.7-47.6-9.1-60.8,1.2-9.1-.8-17.8-4.5-27.3-18.9-48.9-20.3-101.1-.5-151-16.2-17.7-30.5-35.5-40.8-56.9-7.7-16.1-10.5-32.1-15.7-51.4-23,27.3-42,55.4-61.8,84.8-32.9,48.9-72.6,90.3-121.6,123.5l-181.9,201.2c17.4,10.5,29.4,22.4,42.2,35.7,43.7-6.3,86.6-.8,124.6,21.1,21.6-11.1,44.4-9.9,64,3l40.3,34.6,32.5-8.2ZM166.1,445.7c-21.2,55.1-4.9,117,37.7,156.8,38.3,35.8,86.6,55.3,138.7,67.2-8.4-40.5-27.9-74.4-55.6-103.3-19.2-20-38.4-37.9-55.6-59.8-21.2-27.1-37.7-55.4-49.1-89.4-7.5,8.9-12.1,18-16.1,28.5ZM897.6,498.3c-.1,21.9,3.7,42.3,10.5,63.1l8.7,26.6c11.3,34.6,13.9,71.1,5.1,106.5l-13.2,40.1c13.2-7.5,22.3-16.8,31.2-27.2,71.5-83.7,43.3-191.5-31.9-266.5-7.7,19.7-10.3,38.1-10.4,57.3ZM226.1,682.9c13.9,38.5,42.6,67.4,81.5,80.9,9.2,3.2,18.2,6.6,28.7,5.8l57.8-64.7c-24-10.6-48.4-15.6-73.6-22.3-36.5-9.6-70.2-22.9-102.5-45.5-1.5,16.8,2.9,31.2,8.2,45.8ZM492.5,766c-9.4-11-20.3-19.6-33.8-24.7l-30.4,34.5,64.2-9.8ZM432,854.9c35.9,12.2,71.4,4.1,104.7-12.2,15.4-7.5,29.5-16.3,44.2-25.9l37.2-24.4c-31.8-14.8-65.1-18.4-98-12.6l-75.9,13.4-33.3,3.4c-11.2,7.9-19,19.7-27.8,30.2,15,13.9,31,22.1,48.8,28.1ZM593.5,886c27.7,2.3,54.3-5.9,79.5-18.3,19.5-9.7,37.3-21.6,53.2-38.5-25-23.8-45.4-44.6-77.9-30-40.4,16.5-71.7,47.3-115.1,65.3,18,14,39.2,19.8,60.3,21.5Z"/> <path fill="var(--lg-teal,#b7cdca)" d="M864.8,791.7c-.9,3.5-1.7,5.6-4.4,8.8-18.7,22.3-40.3,41.6-66,55.5-15,8.1-28.7,17.1-45.7,20.9-3.2.7-6.6.4-8,3.4-11.9-2-23.8-3.4-35.5-10.2l38.1-30.9c44.3-7.1,85.3-22.9,121.4-47.5Z"/> <path fill="var(--lg-peach,#f7d3b4)" d="M787.6,353.7c-9.6,4.7-20.7,11.4-23.8,22-13.9,11.5-24.3,25.6-35.6,39.4l-11.8,14.5-50.7,52.4c-7.3,7.5-15.4,14.7-15.6,25l-14.1,12.8-229.4,254.1-92.9,101.7c-14.4,15.7-30.3,34.6-45,24.5-9.7-6.7-5.1-23.1,7-36.5l245.8-274.2,98.1-108,36.3-57.8c25.9-41.2,57.9-76.2,96-106.4,24.2-19.2,45.2-39.4,66-61.9,7.9-1.6,16.2.2,21.4,5.3,3.7,3.6,9.8,13,7.1,18.7-20.9,24.8-40.8,48-58.7,74.5Z"/> <path fill="var(--lg-teal,#b7cdca)" d="M203.8,602.6l-5.3-12.8c-8.3-16.6-15.6-32.3-20.9-50.1-5-16.7-10-32.9-10.2-50.9l-1.3-43.1c4-10.4,8.5-19.6,16.1-28.5,11.4,34,27.8,62.3,49.1,89.4,17.2,21.9,36.4,39.8,55.6,59.8,27.7,28.9,47.2,62.8,55.6,103.3-52.1-12-100.4-31.5-138.7-67.2Z"/> <path fill="var(--lg-teal,#b7cdca)" d="M441.5,125.7c-.8,1,.6,3.1,1.1,2.7l2.6-2.7c4.4-4.6,10.1-7.2,14.6-11.5,15-14.2,30.8-25.6,49.6-33.7l43.8-18.7,14.6-3.3,31.2-7.8c19.1,2.2,37,8.1,53.1,21.4-41,12-75.4,31.8-106,59.6l-31.8,29c-24,21.9-50.3,40.2-81.5,49.9s-27.5,7.7-42.4,5.3c12.6-33.9,28.7-63.9,51.1-90.2Z"/> <path fill="var(--lg-teal,#b7cdca)" d="M894.8,399.6c1.6,0,2.3-1.9,1.6-3.3l-18.9-39.3-11.4-4.5c-9.7-25.8-19.5-66.2-1.6-57.9,38.5,17.8,72,42.6,100.7,73.6,48,53.1,67.2,124.9,29.6,189.4-11.3-45.3-32-82.1-61.2-115.1l-38.8-42.9Z"/> <path fill="var(--lg-teal,#b7cdca)" d="M294.1,209c.5.8,1.9,2.2,2.5,1.8s.9-2.1,1.4-2.8l27.1-40,11.8-12.1c12.9-16.6,27.8-29.8,45.8-40.8,1.2-.2,1.1-2.1-.2-2.8,16.3-6.3,32.6-11.8,53-7.9-29.1,33.9-48.8,70.7-63.9,111.8l-19,52c-16.3,35.2-39.6,66.6-73.4,88.5-9.2-51.4-3.2-101.2,15-147.7Z"/> <path fill="var(--lg-teal,#b7cdca)" d="M210.8,440.8c-11.4-74.2-16.5-107.6,19.1-177.5l10.5-22.6c8.9-7.2,17.6-13.2,29.3-16-11.6,38.6-15.1,76.3-11.1,115l10.8,64.2c6.3,37.3,6.2,75.1-7.4,111.5-22.5-23.4-39-47.8-51.3-74.5Z"/> <path fill="var(--lg-teal,#b7cdca)" d="M594.7,118.9l63.3-17.7c31.5-10.1,61.5-13.4,95.5-13,33.2,7.7,64.4,31,80.2,65.2-47.3-12.6-92.5-14.1-138.7-4.3l-68.6,14.5c-27.8,5.9-55.5,5.3-83.5-4.9,18-14,32.1-34.4,51.7-39.9Z"/> <path fill="var(--lg-teal,#b7cdca)" d="M939.9,707.4c-12.9-1.5-12.9-11.1-18-12.9,8.8-35.4,6.1-72-5.1-106.5,2.4.3,2.6-1.7,1.9-3.4-.9-18-5.8-34.1-8.5-51.5l-5.2-33.4c-2.9-.8-5.2-.6-7.3-1.4,0-19.3,2.7-37.7,10.4-57.3,75.2,74.9,103.4,182.7,31.9,266.5Z"/> <path fill="var(--lg-teal,#b7cdca)" d="M536.7,842.8c.4-2.4-.3-4.5-1.3-4.6-8.2-.9-35.9,11.9-67.5,14.1-12.2.8-24.2-1.2-35.9,2.7-17.8-6.1-33.8-14.3-48.8-28.1,8.8-10.5,16.6-22.3,27.8-30.2l33.3-3.4,75.9-13.4c32.9-5.8,66.2-2.2,98,12.6l-37.2,24.4c-14.7,9.6-28.8,18.4-44.2,25.9Z"/> <path fill="var(--lg-peach,#f7d3b4)" d="M927.9,56.8l15.3-4.3,17.2-9c9.5-8.8,19.4-12.9,32-17.5l17.4-6.5c9.7,1.7,16.3,9.5,16.8,20.3,1.1,26.1-26.9,64.4-46.4,86.5l-119.4,134.9c-5.6-12.5-15.4-18.1-27.4-22.7l123.5-133.3c10.9-12.9,15-29.6,5.3-36.8s-12.1-4.5-17.4-1.8l-29.2,14.5c0-11.1,6.6-17.2,12.4-24.1Z"/> <path fill="var(--lg-teal,#b7cdca)" d="M307.6,763.8c.4-3.9-2.8-8.2-7.1-10.3-9.2-4.4-15.3-11.2-23-17.4-17-13.8-31.1-29.7-43.8-47.4-2-2.8-4.4-4.9-7.5-5.8-5.3-14.6-9.7-29-8.2-45.8,32.3,22.7,65.9,35.9,102.5,45.5,25.2,6.6,49.6,11.6,73.6,22.3l-57.8,64.7c-10.5.9-19.5-2.6-28.7-5.8Z"/> <path fill="var(--lg-teal,#b7cdca)" d="M672.9,867.6l-7-6.1c-24.2,9.3-48.3,17-72.4,24.4-21.1-1.7-42.3-7.5-60.3-21.5,43.4-18,74.6-48.8,115.1-65.3,32.6-14.5,52.9,6.2,77.9,30-15.9,16.9-33.7,28.8-53.2,38.5Z"/> <path fill="var(--lg-teal,#b7cdca)" d="M787.1,231.3c.9-1.5.3-2.1-1.6-2.9-18-7.8-35.6-14.1-54.7-18.6-1.5-.4-3.4.4-4.6,1.8-18.7-9.3-35.2-21.5-49.8-39.6,61.7-17.2,125.7-15.5,184.5,10.6l-47.9,52.3c-8.9.4-17.4-1.4-26-3.6Z"/> <path fill="var(--lg-teal,#b7cdca)" d="M980.4,359.1c-32.3-34.6-67.2-61.7-110.6-81.4l39.5-46.8c21.3,11.9,37.2,27.9,50.4,47.7,14.3,23.3,24.7,49.5,20.7,80.4Z"/> <path fill="var(--lg-teal,#b7cdca)" d="M893.5,648.7c-.8,6.5.6,12.6,3.4,20.4,4.5-3.1,7.5-4.4,11.5-4.5l-.3,6.5v2.3c-4.8,31.1-15.8,61.7-38.3,85.7-25.5,27.2-58.5,44.9-93.7,53.7-.6-3.5,1.9-3.3,4.6-5.1,53.3-37.1,92-91.5,109.2-154.3.9-3.3.7-4.4,3.5-4.7Z"/> <path fill="var(--lg-cream,#fcf7f1)" d="M240.5,240.7l-10.5,22.6c-35.6,69.9-30.6,103.3-19.1,177.5-10.2-22.2-17.6-44.3-21-69.1-6.6-49.5,12.2-99.9,50.6-131Z"/> <path fill="var(--lg-cream,#fcf7f1)" d="M787.6,353.7c-23,34.2-45.3,67.5-73.3,98-19.6,21.4-43.4,36.6-64.2,55.3.3-10.3,8.4-17.5,15.6-25l50.7-52.4,11.8-14.5c11.3-13.8,21.6-27.9,35.6-39.4,3.1-10.6,14.2-17.2,23.8-22Z"/> <path fill="var(--lg-cream,#fcf7f1)" d="M203.8,602.6c-42.7-39.8-58.9-101.7-37.7-156.8l1.3,43.1c.2,18,5.2,34.2,10.2,50.9,5.3,17.8,12.6,33.5,20.9,50.1l5.3,12.8Z"/> <path fill="var(--lg-cream,#fcf7f1)" d="M753.5,88.2c-33.9-.4-64,2.9-95.5,13l-63.3,17.7c45.3-30.7,104.5-45.4,158.8-30.7Z"/> <path fill="var(--lg-cream,#fcf7f1)" d="M598.9,50.6l-31.2,7.8-14.6,3.3-43.8,18.7c-18.8,8-34.6,19.4-49.6,33.7-4.6,4.3-10.2,6.9-14.6,11.5l-2.6,2.7c-.4.4-1.9-1.6-1.1-2.7,40.4-47.2,94.2-82.3,157.5-75.1Z"/> <path fill="var(--lg-teal,#b7cdca)" d="M492.5,766l-64.2,9.8,30.4-34.5c13.5,5.1,24.4,13.7,33.8,24.7Z"/> <path fill="var(--lg-cream,#fcf7f1)" d="M307.6,763.8c-38.9-13.5-67.5-42.4-81.5-80.9,3.2.9,5.5,3,7.5,5.8,12.8,17.8,26.8,33.7,43.8,47.4,7.7,6.2,13.8,13,23,17.4,4.3,2.1,7.6,6.4,7.1,10.3Z"/> <path fill="var(--lg-cream,#fcf7f1)" d="M382.5,112.3c1.3.7,1.5,2.6.2,2.8-18,10.9-32.9,24.2-45.8,40.8l-11.8,12.1-27.1,40c-.5.8-1,2.6-1.4,2.8-.6.4-2.1-1-2.5-1.8,16.8-43.1,45.2-80.1,88.4-96.7Z"/> <path fill="var(--lg-cream,#fcf7f1)" d="M536.7,842.8c-33.3,16.3-68.8,24.4-104.7,12.2,11.8-3.9,23.8-1.8,35.9-2.7,31.5-2.2,59.2-15,67.5-14.1,1,.1,1.8,2.3,1.3,4.6Z"/> <path fill="var(--lg-teal,#b7cdca)" d="M908.4,664.7c-4,.1-7,1.3-11.5,4.5-2.7-7.8-4.2-14-3.4-20.4l5.8-44.9c11.7,13.2,10,41.1,9.1,60.8Z"/> <path fill="var(--lg-cream,#fcf7f1)" d="M916.8,587.9l-8.7-26.6c-6.8-20.8-10.6-41.2-10.5-63.1,2.1.8,4.4.6,7.3,1.4l5.2,33.4c2.7,17.5,7.7,33.6,8.5,51.5.7,1.7.5,3.7-1.9,3.4Z"/> <path fill="var(--lg-cream,#fcf7f1)" d="M1009.8,19.5l-17.4,6.5c-12.6,4.6-22.5,8.7-32,17.5l-17.2,9-15.3,4.3c19.1-22.8,53.2-42.4,81.9-37.3Z"/> <path fill="var(--lg-cream,#fcf7f1)" d="M672.9,867.6c-25.2,12.5-51.8,20.6-79.5,18.3,24.1-7.4,48.2-15.1,72.4-24.4l7,6.1Z"/> <path fill="var(--lg-teal,#b7cdca)" d="M939.9,707.4c-8.9,10.5-18,19.7-31.2,27.2l13.2-40.1c5.1,1.8,5.1,11.4,18,12.9Z"/> <path fill="var(--lg-cream,#fcf7f1)" d="M787.1,231.3c-21.4-3.8-41.4-10-60.8-19.7,1.1-1.4,3.1-2.2,4.6-1.8,19.1,4.5,36.7,10.8,54.7,18.6,1.9.8,2.5,1.4,1.6,2.9Z"/> <path fill="var(--lg-cream,#fcf7f1)" d="M894.8,399.6c-12.7-14-22.1-29.4-28.7-47l11.4,4.5,18.9,39.3c.7,1.3,0,3.3-1.6,3.3Z"/> <path fill="var(--lg-tealD,#688888)" d="M908,673.5v-2.3s0,2.3,0,2.3Z"/> <path fill="var(--lg-peach,#f7d3b4)" d="M740.2,779.7c-46.7-25.2-63.7-96.9-38-139.2,7.8-12.8,19.9-19.9,35.9-15.5,12.8,3.5,20.8,18.1,24.2,32.7,9.2-14.1,18.1-27.4,32.8-36.2,9.1-5.5,23.2-8.7,32.5-1.8,27.7,20.3,4.4,75.5-19.2,102.3l-24.5,28c-11.5,13.1-25.7,22.5-43.7,29.8ZM717.2,729.5c5.6,12.2,11.3,23.8,24.7,30.6,33.3-21.1,59.9-51.6,75.6-87.6,3.7-8.4,4.5-17.2,6.1-25.9.8-4.2-2.4-8.4-4.5-10.3-14-13-47,29.5-52.2,60.4-1,6.2-7,9.8-11.8,8.2-15.6-5.2,1.1-33.1-14.7-56.9-2.8-4.3-7.6-7.7-12-7.2-17.4,2.2-30,48-11.3,88.6Z"/> </g> <path fill="var(--lg-tealD,#688888)" d="M131.5,293.3c-1.1,5.1-8.4,5.5-11.2,4.9-4.1-.9-6.4-6.5-5.1-12.3,12.6-56.6,42.7-106.3,85.4-145.1,3.5-3.2,8.3-1.2,10.4.4s5.7,9.6,2.4,12.6c-41.2,37.2-69.9,84.4-82,139.5Z"/> <path fill="var(--lg-tealD,#688888)" d="M248.6,121.1c-8.8-3.3-10.6-13.1-7.7-20.4s12-12.5,20-8.8c8.3,3.8,10.8,13,8.5,19.9s-11.3,12.9-20.8,9.3Z"/> </g>`;
const LOGO_TEXT_BODY = `<path fill="var(--lg-ink,#3a3934)" d="M761,631.4l-13.9,24.4c-1.4,2.4-2.6,3.9-5,4s-4.3-.7-5.5-3.1l-13.6-26-3.2,33.7c-.3,3.1-2.3,5-4.7,5.1s-5.1-1.9-4.9-5l3.2-49.8c.2-3.3,1-5.2,4-6.1s4.8,0,6.2,2.7l18,34.1,18.5-33.6c1.6-3,4.5-4,7-3,3.1,1.1,3.4,4,3.6,7.4l2.9,48c.2,2.9-2.3,4.9-4.5,5.2s-4.7-1.2-5.1-4l-2.9-33.9Z"/> <path fill="var(--lg-ink,#3a3934)" d="M390.4,654.6c-2.4,16-21.9,15.5-39.2,14.2-1.6-.1-4.5-2-4.5-3.7v-51.4c0-3.9,4.2-5.5,7.6-5.5,13.3,0,28.1-1.5,32.4,11.5,2,6,.8,11.8-4.8,16.8,6.7,4.2,9.7,10.3,8.5,18.1ZM377.6,625.3c0-7.8-10-9.2-21.1-7.2v14.4c11,2,21.1.3,21.1-7.3ZM381.1,649.8c-1.5-7.9-12.4-8.2-24.4-7v16.5c13.5,2.1,26.2-.4,24.4-9.5Z"/> <path fill="var(--lg-ink,#3a3934)" d="M845.9,655.8l-25-.7c-5,7-5.9,16.8-12,13.7-2.2-1.1-3.4-3.5-2.2-6.3l20.7-50.4c1-2.4,2.9-3.5,4.9-3.8s5,.4,6.2,3.2l21.6,52.2c1,2.4-1.7,4.9-3.4,5.4-6.7,2.1-6.1-7-10.8-13.3ZM842.7,645.4l-9.5-21.8-9.2,22.1,18.7-.3Z"/> <path fill="var(--lg-ink,#3a3934)" d="M656.8,669.7c-10.3.7-19.3-1.5-25-9.4-1.5-2.1.5-5.2,2-6.1,6.4-3.6,10.7,9.7,25.1,5.2s5.4-4,5.4-7-1.9-5.9-5.2-7l-13.7-4.7c-7-2.4-11.7-7.5-12.1-14.1-.4-6.9,2.4-13.8,9.2-16.7,14.3-6.1,31.5,1.8,28.5,9.2-3,7.5-11.6-5.1-22.9-1.2s-5,3.5-5.3,6,1.8,6,5.4,7.2l14.7,5.1c8.3,2.9,12.6,10.4,11.1,18.8-1.3,7.5-7.9,14-17.4,14.7Z"/> <path fill="var(--lg-ink,#3a3934)" d="M585.7,655.1l-26.5.3-5,11.1c-1.1,2.4-3.4,3.1-5.3,2.7-2-.4-4.6-3.4-3.4-6.1l21.3-51c1.2-2.8,3.5-4.1,5.9-4.1s4.5,1.5,5.7,4.3l20.4,49.3c1.3,3.1.8,5.4-1.8,7s-5.5.6-6.8-2.5l-4.6-11.2ZM581.4,644.8l-8.8-20.9-9.4,21.5c6.8.3,12.4,1.3,18.2-.6Z"/> <path fill="var(--lg-ink,#3a3934)" d="M449.1,642.4l-.5,22.8c0,2.9-3.4,4.3-5.3,4.1-8.9-.8-1.7-20.4-5.3-25.9l-18-27.6c-1.6-2.5-1.2-5,.7-6.6s5.4-1.2,7.2,1.4l15.8,22.5,15.6-23c1.4-2.1,4.4-1.9,5.9-1.4,2.1.8,3.7,4.3,2.1,6.8l-18.1,27Z"/> <path fill="var(--lg-tealD,#688888)" d="M979.4,643l-66.7-.2c-3.3,0-4.3-3.9-4.2-6s2-5.4,5-5.4h66c3.9,0,6.3,2.5,6.5,5.4s-2.1,6.2-6.7,6.2Z"/> <path fill="var(--lg-tealD,#688888)" d="M275.9,643.1h-61.3c-4.4,0-7-1.4-7.4-5.1s2.4-6.6,7.4-6.6l64.1.2c3.6,0,4.6,4,4.3,6.2-.4,3.6-2.9,5.2-7.1,5.2Z"/> <g> <path fill="var(--lg-ink,#3a3934)" d="M925.7,432c1,25.5-38.1,52.2-66,53.2-2.7,9.5-2.1,20.4,4.8,27.9,24.4,26.7,108.5-41.4,127.8-70.1,12.1-28.2,19.6-57.3,34.7-85l-98.9,12.3c-4.5.5-7.9-1.4-9.2-5.1-1.1-3-.2-8.5,4.1-9l113-14.6,29-47.4c2.4-3.9,7.1-4.8,10.7-3.1s5.6,7.1,3.1,11.3l-22.1,36.9c37.5-3.2,72.5-6.3,108.7-4.4l14.5,2.2c4.4.7,5.9,4,6.2,7.6.2,2.6-2.1,7.9-6.1,6.9-9-2.2-17.4-3-27.1-3-35.7,0-70.3,3.1-106.2,7.2-16.3,30.2-29,61-39,93.6-8,25.9-12.9,55.7-6,81,5.8,21.3,24.7,32.6,46.5,27.9,17.8-3.8,33.5-13.4,46.3-26.6,3.3-3.4,8-3.5,10.9,0s1.7,7.3-1.6,10.6c-15,14.8-32.5,26.4-53.4,30-18.1,3.2-36.2-.8-49.1-13.9-20.5-20.9-20-54.2-15.8-84.8-29.4,25.4-65,57.2-102.7,59.6-22.3,1.4-39.5-12.9-40.4-36.9l-29.5,24.2c-6,4.9-13.3,7.4-21,8.8-14.4,2.6-26.8-6.9-28.6-21.8-2.7-22.5,5-45.8,1.4-49.3-4.4-4.4-27.5,16.4-36.1,28.1l-36.2,49.2c-3.1,4.2-6.9,6-11.9,4.1-4.3-1.7-5.5-6-4.8-11.2l5.3-34.9c.3-1.9.6-3.6-1.3-4.3-4.4-1.7-46.7,47.2-93.2,51.2-20.5,1.8-38.3-9.7-42.6-30-2.6-12.3-.5-24.4,2.9-37.3-16.8,6.7-32.8,10.7-51.1,10.9-7.1,19.7-17.2,38.7-37,46.9-14.7,6.1-29.8-.4-35.5-15.2l-3.8-20c-20.7,16.9-47.6,46.5-73.1,45.3-12.1-.6-20.5-9.7-20.7-21.8s1.9-19.4,6.2-28.3l19-39.2c1.4-2.8,1.9-6.7.5-9.5s-3.7-3.8-6.9-4.6l-16.4-3.8c-28.5,41.4-69.7,81.4-108.5,113.1-36.7,30-84.2,60.7-131.5,64.3-34.8,2.7-65.3-15.3-78.8-47.6-16.7-39.9-8.6-87.1,7.2-127.5,19-48.9,48.9-91.9,88.7-125.9,15.7-13.4,32.2-23.8,51-31.5,25.3-10.3,58.3-11.4,74.6,9.3,36.7,46.3-37.3,133.5-45.5,106.2s1.4-7.6,5.4-10.1c18.4-11.6,36.3-46,34.6-69.8s-9.3-23.5-22.1-26.2c-32.3-6.7-71.4,18.8-95.6,41.6-43.6,40.9-75.1,93.7-88.2,152.2-5.5,24.6-5,48.4,2.7,71.4,9,26.7,31.8,43.8,60.3,43.3,19.5-.3,37.7-6.2,55.3-14.6,54.4-26.1,107.4-73.6,148-118.4l27.7-35.5c-8.6-5-13-11.9-12.9-20.6.1-7.5,4.5-16,12.7-18.4,6.3-1.9,12.5-.8,17.4,3.3s6.5,9.1,5.7,15.5l-1.4,11.8,17.6,4.6c12.1,3.2,18,15.2,14.8,27.5-2.5,9.7-7.6,18.2-12.1,27.3-7,14.1-19.4,39.1-11.6,45.9s26.6-6.9,37.6-15.9c17.8-14.6,53.4-46,58.7-63.2,2.8-9,4.3-16.8,13.6-21.3s18.6-4.5,28.1.3c7.4,3.8,13.7,11.9,16.3,21.7l1.6,23.3c19.4-3.2,41.6-6,56.3-19.4s20.3-36.1,47.9-41.5,22.3.7,28.3,10.4,4.1,27.2-5.7,35.7-8.2,1.4-9.8-.8c-5.5-7.6,9.9-18.3,1.2-27.7-14.6-15.8-62,34-59.3,76.8,1,15.5,13.1,24.6,27.9,22.5,37.5-5.4,76.7-42,103.9-69.2,12.7-48.1,36-115,68.5-150.5,11.6-12.7,27.8-22.1,40.4-13.4,32.3,22.3-32.7,105-57.2,131.8l-37.3,40.8c-7.2,7.9-5.9,22.2-8.1,34.1l32.7-36.4c10.6-11.8,32.2-26.7,43.9-18.9s8.5,23.4,5.8,39.1c-1.9,11.6-1.7,27,4.2,30.7,6.9,4.4,20.2-4.2,29.7-11.6l33.8-31.7c8.4-25.2,29.7-55.3,55.6-57.6,12.1-1.1,22.7,5.8,23.2,19ZM793,312.9c.4-3.1-.9-6.5-2.6-7.3-7.7-3.8-22.1,12.2-29.7,23.5-21,31.1-35.5,65.3-46.2,102.5,28.4-28.5,73.2-81.7,78.5-118.8ZM320.5,412.9c2.3-1.2,1.3-9.4-1.3-9.2s-3.4,4.2-2.7,5.8,1.4,4.6,4,3.4ZM908.3,429.2c-9-8.4-37.8,19.2-43.6,40.6,23.2-3.6,53.1-31.7,43.6-40.6ZM483.6,468c1.6-15.9-1.1-28.6-13.5-31.8.3,9.8-11.4,11.5-12.2,15.5-1.1,6.3,13.7,16.1,25.7,16.3ZM478.9,482.7c-13.4-2-22.7-7.4-32.2-16.2-6.9,13.4-10.9,26.8-9.8,40.7.9,4.7,2.5,8.9,6.3,10.5,12.9,5.6,32.1-17.6,35.6-35.1ZM681,486.4l-.7.7.7.7.7-.7-.7-.7ZM420.4,495l-.7.7.7.7.7-.7-.7-.7ZM696.7,499.2l-.7.7.7.7.7-.7-.7-.7Z"/> <path fill="var(--lg-cream,#fcf7f1)" d="M478.9,482.7c-3.5,17.5-22.7,40.6-35.6,35.1s-5.4-5.9-6.3-10.5c-1.1-13.9,2.8-27.3,9.8-40.7,9.5,8.8,18.7,14.1,32.2,16.2Z"/> <path fill="var(--lg-cream,#fcf7f1)" d="M908.3,429.2c9.5,8.9-20.4,37-43.6,40.6,5.8-21.4,34.6-49.1,43.6-40.6Z"/> <path fill="var(--lg-cream,#fcf7f1)" d="M483.6,468c-12-.3-26.8-10-25.7-16.3s12.5-5.7,12.2-15.5c12.4,3.2,15.1,16,13.5,31.8Z"/> <path fill="var(--lg-teal,#b7cdca)" d="M320.5,412.9c-2.7,1.2-3.5-2.2-4-3.4s-.7-5.6,2.7-5.8,3.6,8.1,1.3,9.2Z"/> <rect fill="var(--lg-cream,#fdf7f1)" x="680.5" y="486.6" width="1" height="1" transform="translate(-145 624.2) rotate(-45)"/> <rect fill="var(--lg-cream,#fdf7f1)" x="419.9" y="495.2" width="1" height="1" transform="translate(-227.4 442.5) rotate(-45)"/> <rect fill="var(--lg-cream,#fdf7f1)" x="696.2" y="499.5" width="1" height="1" transform="translate(-149.5 639.1) rotate(-45)"/> <path fill="var(--lg-cream,#fcf7f1)" d="M793,312.9c-5.3,37.1-50.1,90.2-78.5,118.8,10.7-37.2,25.2-71.4,46.2-102.5,7.7-11.4,22-27.3,29.7-23.5s3.1,4.2,2.6,7.3Z"/> </g>`;
const LIGHT_VARS = { "--lg-ink": "#FCF7F1", "--lg-tealD": "#DDECE8", "--lg-cream": "transparent" };

const LogoMark = ({ size = 44, light = false, style }) => (
  <svg width={size} height={size} viewBox="112 -2 934 925" aria-hidden="true"
    style={light ? { ...LIGHT_VARS, ...style } : style}
    dangerouslySetInnerHTML={{ __html: LOGO_ICON_BODY }} />
);
const LogoScript = ({ height = 44, light = false, style }) => (
  <svg height={height} viewBox="-2 269 1190 403" aria-label="Crochet by Asma"
    style={light ? { ...LIGHT_VARS, ...style } : style}
    dangerouslySetInnerHTML={{ __html: LOGO_TEXT_BODY }} />
);
const Logo = ({ light = false, size = 46 }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
    <LogoMark size={size} light={light} />
    <span className="hand" style={{ fontSize: 20, fontWeight: 700, color: light ? "#fff" : "var(--heading)", lineHeight: 1.2 }}>كروشيه أسماء</span>
  </span>
);

/* شارة دائرية تدور */
const SpinBadge = ({ size = 104 }) => (
  <svg className="spin-badge" width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
    <defs><path id="circ" d="M50,50 m-33,0 a33,33 0 1,1 66,0 a33,33 0 1,1 -66,0" /></defs>
    <circle cx="50" cy="50" r="49" fill={C.cream} />
    <circle cx="50" cy="50" r="45" fill="none" stroke={C.tealD} strokeWidth="1.6" strokeDasharray="4 4" />
    <text fontSize="9.6" fontWeight="700" fill={C.tealD} letterSpacing="1" style={{ fontFamily: "'Playpen Sans Arabic',cursive" }}>
      <textPath href="#circ">صُنع بحب ♡ كروشيه أسماء ♡ كل غرزة لأجلك ♡</textPath>
    </text>
    <path d="M50 60 C40 53 39 45 45 42 C48 40.5 50 44 50 45.5 C50 44 52 40.5 55 42 C61 45 60 53 50 60Z" fill={C.peach} stroke={C.peachD} strokeWidth="1.5" />
  </svg>
);


/* ============================ الصور والحفظ الدائم ============================ */
/* ضغط الصورة قبل الحفظ: تصغير + JPEG لتوفير مساحة التخزين */
function compressImage(file, max = 760, q = 0.72) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => {
      const img = new Image();
      img.onload = () => {
        const s = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement("canvas");
        c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        res(c.toDataURL("image/jpeg", q));
      };
      img.onerror = rej; img.src = r.result;
    };
    r.onerror = rej; r.readAsDataURL(file);
  });
}

/* يعرض الصورة الحقيقية إن وُجدت، وإلا Placeholder */
const Pic = ({ src, srcs, label = "صورة", ratio = "square", style }) => {
  const url = src || (srcs && srcs[0]);
  if (!url) return <Ph label={label} ratio={ratio} style={style} />;
  return <img src={url} alt={label} loading="lazy" style={{ width: "100%", display: "block", objectFit: "cover", aspectRatio: ratio === "wide" ? "16/9" : ratio === "auto" ? undefined : "1/1", borderRadius: "var(--radius) var(--radius) 0 0", ...style }} />;
};

/* رافع صور حقيقي مع معاينة وحذف */
function ImgUploader({ multiple = false, images = [], onChange, label = "اضغطي لرفع الصور من جهازك" }) {
  const inp = React.useRef(null);
  const [busy, setBusy] = useState(false);
  const pick = async (e) => {
    const files = [...e.target.files];
    if (!files.length) return;
    setBusy(true);
    try {
      const out = multiple ? [...images] : [];
      for (const f of files) { out.push(await compressImage(f)); if (!multiple) break; }
      onChange(out);
    } catch { alert("تعذر قراءة الصورة، جربي صورة أخرى."); }
    setBusy(false); e.target.value = "";
  };
  return (
    <div>
      <div className="upload" onClick={() => inp.current?.click()}>{busy ? "⏳ جاري تجهيز الصورة…" : `⬆ ${label}`}</div>
      <input ref={inp} type="file" accept="image/*" multiple={multiple} style={{ display: "none" }} onChange={pick} />
      {images.length > 0 && (
        <div className="row" style={{ marginTop: 10 }}>
          {images.map((im, i) => (
            <span key={i} style={{ position: "relative" }}>
              <img src={im} alt="" style={{ width: 58, height: 58, objectFit: "cover", borderRadius: 10, border: "1px solid var(--border)" }} />
              <button type="button" onClick={() => onChange(images.filter((_, j) => j !== i))}
                style={{ position: "absolute", top: -7, insetInlineStart: -7, width: 20, height: 20, borderRadius: 99, border: "none", background: "var(--ink)", color: "#fff", fontSize: 10, cursor: "pointer" }}>✕</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* الحفظ الدائم عبر تخزين الأداة */
const DB_KEY = "cba-db-v1";
async function dbLoad() {
  try { const r = localStorage.getItem(DB_KEY); return r ? JSON.parse(r) : null; }
  catch { return null; }
}
async function dbSave(data) {
  try { localStorage.setItem(DB_KEY, JSON.stringify(data)); }
  catch (e) { console.error("تعذر الحفظ:", e); }
}
async function dbClear() { try { localStorage.removeItem(DB_KEY); } catch {} }


/* رسومات الهوية المولّدة — مضغوطة بخلفية شفافة */
const ILLUS = {
  yarn: "data:image/png;base64,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",
  hook: "data:image/png;base64,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",
  gift: "data:image/png;base64,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",
  bow: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOkAAADwCAMAAADSMLOCAAAAwFBMVEX707z62cMsbm5fkY7rsZX3+fiarqfmmHVye3tEfHqss7Pt8vJvpaWs3t6sysood3bj7exnlpVNgX6OsbGvycgA//+xy8pplZWTtbR/+/ssbGo5dHM+gYA8gH4mnZ1CfXujwL7rra0qPz9sqHme3Z5CfoA5f4AzmWYA/wBJfH9/f6pKgH6qqtSlwL//f38AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABiBUwxAAAAMHRSTlP//fz6/wz5/wT4CVsMCu8Jmp75o2EBnWBkAlmb/f8Eo+AEBAUE/v4FAVoGnQacAgAHmRogAAAPwElEQVR42u2dB3fjOA6AxQKqS26xk0yf3b1+x///745gkSlbdmxHZGzO6L2dsu+N408oBEAQzOSv8mS/SX+T/ia9/IG2AfgFSKExv/0KMq03u/oDUCOTgqzXTD3LOjpqZNJerhnFR0RHjUvawIZRJjL1yxoqSJe0knVHWUYywlCobbqkjewZ5SRTD6VbKCBV0icJKFL9MEoiW2pcOwVBhRYp4aWoZJOw7y0tqRIqe4YiXdKaltySirIDpc9pkhaSUGZBidLjdFeZYjBTTbrqkyXtPTNVLokSWaRJWjwBHUgxeEiWtJWElZl70FBTJW1g/dk4JI4BoaBM9olqr1zSFZLy3JBSSJMUvsLKLDJ5zlGyK7aIGQ9GJJULlcFkAylhbBsznYlH2iIpEmZcqa8mVTlqiqTKIamFBc2UZ1qmgi1jOt94pMoheYuMjnyjlliikUIPSzoizahYJElqKiveo8L9mC4pGmkla2Fc7/CUUQ01GmkjN8b1KoeE/+GCSj9FjJLikcKzIc1z5YBzU0uK6ZKikfby9QvVcQN3pAJJq+RIC1jT1Z5UF1ko26RHWgwVUB0f8dyQ7uIZakRSXVohjtSUt/8JCZJWzBQctNs1vzLaQbR1Jh6pdBsVJmwY6oOpkUrYUp/UFlhYmyApGceC2lop66O5pHik36dIKUkvcvCq2iYdJ84lJUc6uF4yOF801PRIJTXLKbdStZXQMrUIv5WLEl2vzWJMjUWTLuSPpEgraVzvQKr+QPSWRRerahaNVOharwHcGypT6tsnRdorh8T2saAfO9SRGjtikUrqLzJe1YwtItWS4pCa+v0EKVnRZaR2h4ikExK1LViQDukPuWXllPLqugP8Kx3SRq6PSbklfY3jfeOQ4k6Fcb1e4pbb0FfEaavL4phpbeP7fE9qakmYjbdRymbxSD05OlKd1NBIzWZRSLGqbZLT3DdU85cSc1RIhLSXr3pD0ZYER4ZqiklPaZD+wDT8DGkZpSc0Bul+m43z49gBSyypkOpW7Ww6cDBhUpsGqfI3a3qGNFLhIQKp35Q+TcoWRZuE9sp2OpEZ1JeJCI3qUUgJ9bdkRqGvKbGs4CekQKrWGF0t8yOk8TrDFpAEqWS2hpQfrTD6/xBs7WgenxTA1RuOVlOiu0JNw0NRPTxpJTvbL3ikvC7iF9gGUDw6KTSwV95DUpIbhaZ0HTxJzaIp77GZ7gvdeifq0UkbuTTFMnK8yGRWyHojNXTHQxbcSmsxHAc6/ZRUPLrvLWxr2flHby8+tvbC+ZjXT91E4GpSaJnCwkaCZ+Jek7qxuodHlikuMdmJJNxgmrVHqe86bJwUlrSVndt54vyEVM0r0EINutAEJYXWbSZOLabjiFBFD8uga2pQ0gqnNziRnrTTIXpQGc3LY5IW2KY9iJScEaopcYcNlLKQ3kitMDTL3hBpZn2Sckq0C7jSZCFBSfmXyC5/lAJU4VDDkT5p3b0CFMMHBsFQs3AiVQHvXxm5BlVoU60ejLSR4mxFcDKpQQemEtpHIoVGbtkFOUzm92EZ1OdA1YcwpFDIhUvWXLx3ntSUWYhK31gTBjUQKSz2KUyeXyBVu+Ba1OqB7FQMnVY8v8gt2feBAYRS4AARRAhS9S2X+5aynF9mrebwuEYtCcgW7p+06GHJPNBLnZKVvVZgbOWGeyctCjwmzYi/9XLVg6glq+eOgWcnrcz6sv/e14IiKlPKv4CqunPtXV8XBE6iKofGhE6H7pS0reSCle8AdbqOgSE2xMr5Fpw5SaGVqLl7UH615vJ86F7HD1oqU53LCc9IqjStXrJheXFxz42oOl+l4nm2EaLzkYKst8wDzW4B9VGJQLEqzyRn6czK5nK4uPU90tzbQP1/qB2TYtUyfXeGMwdp1aONIudKuNXzZtCDR5RUrziK82v1rg2N7P1u6A9lnw2OcC3FPkrg84Di2oqsbG1k+o4l9n2kAApT1s/dSJ5eav0uxkGHmVbiV/ROsm+ryKQAxkvA4t/sQJ6zPJwfsn5hYrmtbZEKrtbk20iNEgHUhJXmhe+jPs7nQuW+fMUKBxwzxjrX0dNfN5j8BlJoCo1ZqGUAMZU4Pc4859n8qPoHiBWa7ErBPjdWpkXRQhuEFNqix9/qZ73a4UseVcWQcy4tJocpAiH23aISkfWurp1wm/Zt8WZXGOaLibfr7ZJZTCHGqQrns1qrO5M7hhVGkdVL7thyXS/AZYsvZ3GzC/i8hGKxXX5izJim4ISQQ0c5r1syQSXag3fwWv0MLoSVrdIp9mm5XizgIEc+oj5D2sKfTe82HqqGdOrTjfKUTJifOGDyi8pitxpsfmD8xP5soddaA4xfipAe9dgytu0FpGDtUUM2PUKW5kNX1jDJwTcJCDpqxCO+JpsVSNmuI9ZC+E62TaV5C1+w2QRlY3bh63qzexUKcuVenEC7JOTQjnLOA6jtmJY4dzzRyY8PHwGjONabWvp5UDaGtH+o0R6Fc3TaKIXIxpRk368bGNP3eIMiH/5M8+Xwew4WJpYLrxjlkcKfxumQ72jmFnKlHA/PxpDu9boSbSxO+3r5mQDFfk/OtYQZ5kHtESnWHUFFsPpZleWKiZH5j60kny9CuJLVU+Q97VgS9m8oLdYfyVTJuRbC2WNGJiRFxoZCsjt50FHwKZ3GahSD6n8jUjCVEdTWQ3X0I7085zy7n4dkE/L1ReC1OVnSVi46THnFhNUNn8KNxWb39pC97mrx+mHGvnctc6CmMkKmVu29u7tDzHM1N026BI8UGlgeTSHgo98e5hnrMadsaQ9nZ9ZIx024nt6Th+AjZIJTffcVZRt7lkGT/imfmTezEyu1GSEPKkkv2RAl7nm03irTYkONIBP/8DF4MYg5XBOIjmLZDtwegNHep1ofhSXn8v57Y/YCfz6WJbFZDiu7+jDCL+QOq+/HIhytVPflezk/jtP0F+S2lijIAkuJBzGSQT0OG8jwyrxA5B6cDzEr58GqKoYMXUf3k/lpI59dKIhjt05kTK4w/2GyJb5BjTIrMqReJeuWJmODyUz8q4T/iiGDt9Xb8Wdl89f/bik/5EdiwEKaoxRdo69HOyqR7nOZXr2DiogVs3UiVppkxou19psuaCIkpnDNDxrFP/bluxILyocs7N7NxK5GNmqu0fmpysJRE77sk3B+lBWN6h1xlPZgBRjXzQRbLpyf7YvJGmF22AZXmJpDvf4mVK76eajOHGZyw0vmETg5P9LZPWW3XG61+ymKc93tU3Wk1l7cWde7164TbChG6fouOV60wxvn6H3iPo3F7Lrdprb7q3BLZRtrg8W4NkiNOdhSBPEL7DxoZEEyr947RAVUfaFuYfGaS3ZWs3M7E00/lEJfKoVbWhdX+rCe6QRKtP33Kpy3JLWhu3gf6u0aPjztmwwWi/U3S8v8Er4LHMnc9jn+q6v+DFHBNXuLl+/LtJUpdteb3bAtw33Wmb0TOcip3YaxiQqKNuz+qVJos6O464zZMnYy3Z/BD/kGoevrTBT1Jd5nnv1T45oBFlijMbvEg7+YN4L3Plbv0zKiCW/c/r9pTxwq66m2xmbFzOHD6NOIbjdT2rPRqcjNN+He2ueAfuoJQ4xlp7+H36rybhUeL57685eLD+280hvv9c64Cq9D553m6vUy6QqJMhAVHTTVB5LaxAhaLVcxVal4n8slyFkK9LPth8rUbkJi4Gg6ksg+UL0ZNR9OKGgDLVGeczSEztFNpzuTFktTn5nN5dp25q3uPrqfXlCoJGyUI17x2TpXdIPvupbVvfX3wk8JHaNUzEQq9MICd9mzrcRK2MgJv8Mt4QfNe5Rkzu50FSi2wkO98PST54y8XQY8dSvnPLY464kDtNZO+WAHmF+DSoZDRHhgBkdozjveYeZTJK1GLd1ppquad/aXApTmvJe8Z1KNylyGQ66JltzEB71lT+Y/Wjz7ySDQLpgdyukSIyUD6C7AuIP5z0CNUa/3ugj6IKcyW33KQpDbQEsEDTFqJsT501a2rLwRVTmj3QOdnq7wyrKbIghGyy7Q8KAwp6dbjJau8Up88EYdtI805QCaEeoFRQYzh0YHDIGGzAQ6EV9pB+zOxPMLY4Zg5/4DkqKp7h3wm6QuZGBduCtYws1dQa+0ushS7XwvPWDmEacGvcgtvSyA4M7vqvTl6QFJ9ajBKxJz5Xe3IcegBpx59YKzTy8eMqNS0nATgwKT4qiOi6NCdEdrCDlwMOTEtlbWlws1+DVJgafwDUI9fcSYO5Eu5ONOy4SmfnOyojdCsnrguaCtFO4m21Okw4UkXeChzIEnoFbuMlBy6uB47pQXHn36tDDRwwn1NYO2Mf/uQn+RwKSFbNyV0/ys8oa/sDjGTGbxZjE7hdnpeizUm4sppTv4+djaa6IH8UZzVRp3HDTy099W5O346PHvrWhxZNIbneY0ibtI4KubQH08i4WYm3RSuV8GR6GyExOoc3stcwl9AqRQnbqiw04M1fdAvcjHJ5V4Z5BNaA4ObXB3UXwdXnnj3MFHTkz/H6L7GK87ikxrp778cBPcmKlI5KZXwMu92FR0n2eJ3atYwOS9ipZUKW+fCmkrN2KqcsZdHpPMLdtqsVyernGzVUJ32uqTkCdJ2TO8JCJT2YK76vWoREiyzyEvNohNCr2rER4XQwXtapnMfeL6KrPV5IWDSnnXCd2cbq6nO6ybmY1wFqhV5aNIpYnyvQGwxJWQRA1VOqSyh/LAUK14hSJ9goRIC2mHgPAxqcrYlnGUNxZpJYlum/SCfBMhrcQW/pMSqYqCqDFUPkpksuBbbLFJvXTc303EQ/uh78iMTgpTQb5SaSaTI+0mtscV6fcooWBUUjLVM8kYSY20h2d7qTgft3GQSA4pGqnbXhziQVcWhFhKFY/UuaR8VAAVyZG+6I1UMhR9TQTBKEmO9KmAtamwmIgh15pM6QaeEiNVq+arSdzyfCAVwa4s+0jSBjY2ReXOWhVpB+mR6ovFDzrLGF1H2GSLHjnI+qi3g7LXWLFgTNKJoi9lG2iSI9VVs/K4LNimR1rBVi2ffg8WbrIVkB6prppZ52siJBqrLBibtAfmyg7c1RugTZBULZzfXH2Qx2le/ijSBtafTX0wN2VB+i1WZSUyKY64tqTckK7lH0mS/pDELjOmIb2MV2+IbadPYM/fEnsCE56KJEmVS/IqoeiQZETQuKR+JVQ35yRLKolXCVUBU7IylbIeYnw00zrqz45LKoerwLSZJkwK3RdnqLrekCrp0z9wJsswiqMDCanKVJe3hVVe0UZ1SHFJzU0gejY7pUtoIGE7xQbYlcAxgmwj07VTk8/YudGbiKnpR5Caa5s/M7GTLzJpUh0+7F43dcws5oNIbZtVI2X6MoXm7y3IX4H0g57fpL9JH/f5PzzKRU0NZ7tjAAAAAElFTkSuQmCC",
  flower: "data:image/png;base64,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",
  heart: "data:image/png;base64,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",
  card: "data:image/png;base64,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",
  swatch: "data:image/png;base64,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",
  star: "data:image/png;base64,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",
  tag: "data:image/png;base64,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",
};
const Art = ({ name, size = 56, style, glow = false }) => (
  <img src={ILLUS[name]} alt="" aria-hidden="true" width={size} style={{ display: "block", height: "auto", filter: glow ? "drop-shadow(0 0 8px rgba(255,255,255,.55))" : undefined, ...style }} />
);

/* شريط الثقة قرب زر الشراء */
const TrustStrip = ({ settings }) => (
  <div className="trust-strip">
    <span><i>⏱</i> تنفيذ المخصص 5–14 يوم عمل</span>
    <span><i>↩</i> استبدال الجاهز خلال 3 أيام</span>
    <span><i>🔒</i> دفع آمن: مدى · Apple Pay · STC Pay</span>
    <span><i>🚚</i> شحن {SAR(settings.shippingFee)} — مجاني فوق {SAR(settings.freeShippingOver)}</span>
  </div>
);

/* زر واتساب عائم لنقاط التردد */
const WhatsFab = ({ settings }) => (
  <a className="fab no-print" href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer">
    💬 <span>عندك سؤال؟</span>
  </a>
);

/* هدية صفحة الشكر */
const ThankGift = ({ settings }) => (
  <>
    <div className="gift-code">
      <span className="small muted" style={{ display: "block" }}>🎁 هديتك للطلب القادم — خصم 10% بكود:</span>
      <b>SHUKRAN10</b>
    </div>
    <a className="btn accent sm" href={`https://instagram.com/${settings.instagram}`} target="_blank" rel="noreferrer">
      📸 شاركي حماسك بستوري وأشيري لنا
    </a>
  </>
);

/* ============================ Store: Product Card ============================ */
function ProductCard({ p, categories, favorites, toggleFav, go, addToCart }) {
  const cat = categories.find((c) => c.id === p.categoryId);
  return (
    <div className="card hoverable tilt-card" style={{ display: "flex", flexDirection: "column", position: "relative" }}>
      <span className="deco" style={{ top: -10, insetInlineEnd: -6, animation: "spinSlow 16s linear infinite" }}><StarSpark size={22} /></span>
      <div style={{ position: "relative" }}>
        <Pic srcs={p.images} label="صورة المنتج" />
        <button
          className="icon-btn"
          style={{ position: "absolute", top: 8, insetInlineStart: 8 }}
          onClick={() => toggleFav(p.id)}
          aria-label="المفضلة"
        >
          {favorites.includes(p.id) ? "♥" : "♡"}
        </button>
        <span className={`badge sticker ${p.type === "مخصص" ? "peach" : ""}`} style={{ position: "absolute", bottom: 10, insetInlineEnd: 8 }}>
          {p.type === "جاهز" ? (p.availability === "متوفر" ? "متوفر" : "غير متوفر") : "يُنفذ حسب الطلب"}
        </span>
      </div>
      <div className="pad" style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
        <span className="small muted">{cat?.name} · {p.sub}</span>
        <b style={{ cursor: "pointer" }} onClick={() => go({ page: "product", id: p.id })}>{p.name}</b>
        <span className="price">{SAR(p.price)}</span>
        <div className="row stitch-top" style={{ marginTop: "auto" }}>
          <button className="btn primary sm" style={{ flex: 1 }} onClick={() => go({ page: "product", id: p.id })}>
            {p.type === "مخصص" ? "خصصي واطلبي" : "أضيفي للسلة"}
          </button>
          <button className="btn sm" onClick={() => go({ page: "wizard", prefill: { refProduct: p.id } })}>طلب مشابه</button>
        </div>
      </div>
    </div>
  );
}

/* ============================ Store: Home ============================ */
/* رحلة إبداعية من 9 مشاهد: Hero مسرحي → شريط متحرك → كون التصنيفات →
   منتجات → قصة الطلب المخصص (Ink) → ابنِ هديتك → معرض Bento → آراء → ختام Grad */
function Home({ products, categories, gallery, settings, texts: t, go }) {
  const featured = products.filter((p) => p.featured && !p.hidden).slice(0, 4);
  const heroProduct = featured[0] || products.find((p) => !p.hidden) || products[0];
  const [previewOcc, setPreviewOcc] = useState("مولود");
  const occIcon = { "مولود": <Art name="heart" size={84} style={{ margin: "0 auto" }} />, "تخرج": <Art name="star" size={78} style={{ margin: "0 auto" }} />, "زواج": <Art name="flower" size={84} style={{ margin: "0 auto" }} />, "رمضان": <Art name="gift" size={68} style={{ margin: "0 auto" }} />, "عيد": <Art name="tag" size={78} style={{ margin: "0 auto" }} /> };
  return (
    <div>
      {/* 1 — Hero: مسرح فني */}
      <section className="hero-stage">
        <div className="container grid md-2" style={{ alignItems: "center" }}>
          <div>
            <div className="row" style={{ gap: 8 }}>
              <span className="badge peach sticker" style={{ fontSize: 12.5 }}>{t.heroBadge1}</span>
              <span className="badge">{t.heroBadge2}</span>
            </div>
            <div style={{ height: 14 }} />
            <KineticTitle className="display mega" text={t.heroTitle} />
            <p className="muted" style={{ maxWidth: 460, margin: "16px 0 24px", fontSize: 16 }}>
              <Rich text={t.heroSub} hl="doodle" />
            </p>
            <div className="row">
              <Magnetic><button className="btn primary" onClick={() => go({ page: "shop" })}>{t.heroCtaShop} <span className="arr">←</span></button></Magnetic>
              <Magnetic><button className="btn ghost" onClick={() => go({ page: "wizard" })}>{t.heroCtaCustom} <span className="arr">←</span></button></Magnetic>
            </div>
            <div className="scroll-cue">{t.heroScrollCue}<span>⌄</span></div>
          </div>
          <div className="hero-cluster"
            onMouseMove={(e) => {
              if (window.matchMedia("(pointer:coarse)").matches) return;
              const r = e.currentTarget.getBoundingClientRect();
              const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
              e.currentTarget.style.transform = `perspective(800px) rotateY(${x * -7}deg) rotateX(${y * 7}deg)`;
            }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = ""; }}>
            {heroProduct && (
              <div className="stitch-frame hero-card" style={{ background: "var(--white)", boxShadow: "var(--shadow-card)" }}
                onClick={() => go({ page: "product", id: heroProduct.id })}
                role="button" tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go({ page: "product", id: heroProduct.id }); } }}
                aria-label={`القطعة المميزة هذا الأسبوع: ${heroProduct.name}`}>
                <span style={{ position: "absolute", top: -44, insetInlineEnd: -34, zIndex: 4 }}><SpinBadge size={96} /></span>
                <Pic src={heroProduct.image} srcs={heroProduct.images} label={heroProduct.name} />
                <div className="pad" style={{ padding: 14 }}>
                  <span className="small muted">القطعة المميزة هذا الأسبوع</span>
                  <b style={{ display: "block", marginTop: 2 }}>{heroProduct.name}</b>
                  <div className="between" style={{ marginTop: 4 }}><span className="price">{SAR(heroProduct.price)}</span><span className="badge peach">جديد</span></div>
                </div>
              </div>
            )}
            {/* الرسومات موزعة على حواف البطاقة بحيث تطل من حولها ولا تختفي خلفها */}
            <span className="deco float" style={{ top: -26, insetInlineStart: "-1%", "--r": "-10deg" }}><Art name="yarn" size={78} /></span>
            <span className="deco float" style={{ top: -30, insetInlineEnd: "10%", animationDelay: ".4s", "--r": "6deg" }}><Art name="hook" size={62} /></span>
            <span className="deco float alt" style={{ top: "26%", insetInlineEnd: "-2%", "--r": "14deg" }}><Art name="gift" size={56} /></span>
            <span className="deco" style={{ top: "52%", insetInlineStart: "-2%", animation: "spinSlow 14s linear infinite" }}><Art name="star" size={38} /></span>
            <span className="deco float" style={{ bottom: -18, insetInlineStart: "8%", "--r": "8deg", animationDelay: ".8s" }}><Art name="heart" size={58} /></span>
            <span className="deco float alt" style={{ bottom: "12%", insetInlineEnd: "-3%", "--r": "-6deg", animationDelay: "1.3s" }}><Art name="flower" size={64} /></span>
          </div>
        </div>
      </section>

      {/* 2 — شريط متحرك: عنصر انتقال */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((k) => (
            <span key={k}><MarqueeText text={t.marquee1} /></span>
          ))}
        </div>
      </div>

      {/* 3 — كون التصنيفات */}
      <div className="band band-white" style={{ position: "relative", overflow: "hidden" }}>
        <DoodleField variant={0} />
        <div className="container">
          <Reveal><span className="eyebrow">{t.catsEyebrow}</span>
            <h2 className="xl"><Rich text={t.catsTitle} /></h2></Reveal>
          <div className="cat-list">
            {categories.sort((a, b) => a.order - b.order).map((c, i) => {
              const icons = { crochet: <Art name="yarn" size={68} />, prints: <Art name="card" size={68} />, print3d: <Art name="gift" size={54} />, custom: <Art name="flower" size={64} /> };
              const tints = { crochet: "var(--mint)", prints: "var(--peach-light)", print3d: "var(--cream)", custom: "linear-gradient(90deg,var(--mint),var(--cream-soft))" };
              return (
                <Reveal key={c.id} delay={i * 80}>
                  <div className="cat-row" style={{ background: tints[c.id] || "var(--cream-soft)" }} onClick={() => go({ page: "shop", cat: c.id })}>
                    <span className="idx">0{i + 1}</span>
                    <b>{c.name}</b>
                    <span className="row-icon">{icons[c.id] || <StarSpark size={34} />}</span>
                    <span className="subs">{c.subs.slice(0, 3).join(" · ")}</span>
                    <span className="arrow">←</span>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4 — منتجات مميزة */}
      <div className="band band-mint">
        <div className="container">
          <Reveal><span className="eyebrow">{t.featEyebrow}</span>
            <div className="section-head" style={{ marginTop: 0 }}>
              <h2 style={{ fontSize: 26 }}>{t.featTitle}</h2>
              <button className="link" onClick={() => go({ page: "shop" })}>{t.featLink}</button>
            </div></Reveal>
          <div className="grid cols-2 md-4">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={i * 90}>
                <ProductCard p={p} categories={categories} favorites={[]} toggleFav={() => {}} go={go} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <div className="band-white" style={{ paddingBottom: 26 }}><div className="container"><div className="hearts-divider">♡ ♡ ♡</div></div></div>

      {/* 5 — قصة الطلب المخصص: كتلة تيل بنمط قلوب */}
      <div className="band band-ink" style={{ position: "relative", overflow: "hidden" }}>
        <span className="deco float" style={{ top: 20, insetInlineEnd: "6%", opacity: .95 }}><Art name="yarn" size={82} glow /></span>
        <span className="deco float alt" style={{ bottom: 16, insetInlineStart: "5%" }}><Art name="heart" size={64} glow /></span>
        <div className="container" style={{ textAlign: "center", position: "relative" }}>
          <Reveal>
            <span className="eyebrow">{t.customEyebrow}</span>
            <h2 className="display mega" style={{ fontSize: "clamp(30px,6.5vw,58px)" }}>
              <Rich text={t.customTitle} />
            </h2>
            <p className="muted" style={{ maxWidth: 520, margin: "14px auto 24px" }}>
              {t.customSub}
            </p>
            <Magnetic><button className="btn accent" onClick={() => go({ page: "wizard" })}>{t.customCta}</button></Magnetic>
          </Reveal>
        </div>
      </div>

      {/* 6 — ابنِ هديتك: معاينة تفاعلية */}
      <div className="band band-cream" style={{ position: "relative", overflow: "hidden" }}>
        <DoodleField variant={1} />
        <div className="container grid md-2" style={{ alignItems: "center" }}>
          <Reveal>
            <span className="eyebrow">{t.builderEyebrow}</span>
            <h2 style={{ margin: "0 0 8px", fontSize: 26 }}>{t.builderTitle}</h2>
            <p className="muted small" style={{ maxWidth: 420 }}>{t.builderSub}</p>
            <div className="chips" style={{ margin: "14px 0" }}>
              {["مولود", "تخرج", "زواج", "رمضان", "عيد"].map((o) => (
                <button key={o} className={`chip ${previewOcc === o ? "active" : ""}`} onClick={() => setPreviewOcc(o)}>{o}</button>
              ))}
            </div>
            <button className="btn primary" onClick={() => go({ page: "wizard", prefill: { occasion: previewOcc } })}>أكملي طلب {previewOcc} ←</button>
          </Reveal>
          <Reveal delay={120}>
            <div className="card glass pad" style={{ textAlign: "center", padding: 28, transform: "rotate(1.4deg)" }}>
              <div className="float" style={{ display: "inline-block" }}>{occIcon[previewOcc]}</div>
              <h3 style={{ margin: "10px 0 4px" }}>هدية {previewOcc} مخصصة</h3>
              <p className="small muted" style={{ margin: 0 }}>بالاسم · بالتغليف · بموعد تسليمك</p>
              <div className="stitch-top row" style={{ justifyContent: "center" }}>
                <span className="badge">كروشيه</span><span className="badge">مطبوعات</span><span className="badge peach">3D</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* 7 — شريط معاكس + معرض بتمرير أفقي */}
      <div className="marquee rev light" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((k) => (
            <span key={k}><MarqueeText text={t.marquee2} icons={["❋"]} /></span>
          ))}
        </div>
      </div>
      <div className="band band-teal">
        <div className="container">
          <Reveal>
            <span className="eyebrow">{t.galEyebrow}</span>
            <div className="section-head" style={{ marginTop: 0 }}>
              <h2 className="xl" style={{ margin: 0 }}><Rich text={t.galTitle} /></h2>
              <button className="link" onClick={() => go({ page: "gallery" })}>{t.galLink}</button>
            </div>
            <p className="small muted hand" style={{ marginTop: -8 }}>{t.galHint}</p>
          </Reveal>
          <div className="hstrip">
            {gallery.slice(0, 8).map((g, i) => (
              <div key={g.id} className="card hoverable elevated" style={{ transform: `rotate(${i % 2 ? 1 : -1}deg)` }} onClick={() => go({ page: "gallery" })}>
                <Pic src={g.image} label="صورة العمل" />
                <div className="pad" style={{ padding: 12 }}>
                  <b className="small">{g.title}</b>
                  <div style={{ marginTop: 5 }}><span className="badge peach">{g.occasion}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 8 — آراء بشخصية: بطاقات ملاحظات مائلة */}
      <div className="band band-white" style={{ position: "relative", overflow: "hidden" }}>
        <DoodleField variant={2} />
        <div className="container">
          <Reveal><span className="eyebrow">{t.revEyebrow}</span>
            <div className="section-head" style={{ marginTop: 0 }}><h2 style={{ fontSize: 26 }}>{t.revTitle}</h2></div></Reveal>
          <div className="grid md-3">
            {[
              { n: t.rev1Name, t: t.rev1Text, bg: "var(--mint)", r: "-1.6deg" },
              { n: t.rev2Name, t: t.rev2Text, bg: "var(--peach)", r: "1.4deg" },
              { n: t.rev3Name, t: t.rev3Text, bg: "var(--teal-light)", r: "-1deg" },
            ].map((r, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="note-card" style={{ background: r.bg, transform: `rotate(${r.r})` }}>
                  <p style={{ margin: "4px 0 10px", fontWeight: 600 }}>"{r.t}"</p>
                  <span className="small muted">— {r.n}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <div className="band-white" style={{ padding: "0 0 30px" }}><div className="container"><div className="hearts-divider">♡ ♡ ♡</div></div></div>

      {/* 9 — ختام جريء */}
      <div className="band band-grad" style={{ position: "relative", overflow: "hidden", textAlign: "center" }}>
        <span className="deco float" style={{ top: 12, insetInlineStart: "8%" }}><StarSpark color="#F6EFE6" /></span>
        <span className="deco float alt" style={{ bottom: 14, insetInlineEnd: "10%" }}><StarSpark size={20} color="#F6C7AD" /></span>
        <div className="container">
          <Reveal>
            <h2 className="display mega" style={{ fontSize: "clamp(32px,7vw,64px)" }}><Rich text={t.finaleTitle} /></h2>
            <div className="row" style={{ justifyContent: "center", marginTop: 22 }}>
              <Magnetic><button className="btn accent" onClick={() => go({ page: "wizard" })}>{t.finaleCta}</button></Magnetic>
              <a className="btn" style={{ background: "rgba(255,255,255,.15)", color: "var(--white)", borderColor: "rgba(255,255,255,.5)" }} href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer">{t.finaleWhats}</a>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

/* ============================ Store: Shop ============================ */
function Shop({ products, categories, favorites, toggleFav, go, initCat }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState(initCat || "all");
  const [sub, setSub] = useState("all");
  const [sort, setSort] = useState("latest");
  const [avail, setAvail] = useState("all");

  const activeCat = categories.find((c) => c.id === cat);
  const list = useMemo(() => {
    let l = products.filter((p) => !p.hidden);
    if (cat !== "all") l = l.filter((p) => p.categoryId === cat);
    if (sub !== "all") l = l.filter((p) => p.sub === sub);
    if (avail !== "all") l = l.filter((p) => (avail === "ready" ? p.type === "جاهز" : p.type === "مخصص"));
    if (q.trim()) l = l.filter((p) => (p.name + p.desc + p.sub).includes(q.trim()));
    if (sort === "priceAsc") l = [...l].sort((a, b) => a.price - b.price);
    if (sort === "priceDesc") l = [...l].sort((a, b) => b.price - a.price);
    return l;
  }, [products, cat, sub, avail, q, sort]);

  return (
    <div className="container">
      <div className="section">
        <div className="section-head"><h2>المتجر <StitchWave width={70} style={{ verticalAlign: "middle" }} /></h2><span className="small muted">{list.length} منتج</span></div>
        <div className="chips" style={{ marginBottom: 10 }}>
          <button className={`chip ${cat === "all" ? "active" : ""}`} onClick={() => { setCat("all"); setSub("all"); }}>الكل</button>
          {categories.sort((a, b) => a.order - b.order).map((c) => (
            <button key={c.id} className={`chip ${cat === c.id ? "active" : ""}`} onClick={() => { setCat(c.id); setSub("all"); }}>{c.name}</button>
          ))}
        </div>
        {activeCat && (
          <div className="chips" style={{ marginBottom: 10 }}>
            <button className={`chip ${sub === "all" ? "active" : ""}`} onClick={() => setSub("all")}>كل الأقسام الفرعية</button>
            {activeCat.subs.map((s) => (
              <button key={s} className={`chip ${sub === s ? "active" : ""}`} onClick={() => setSub(s)}>{s}</button>
            ))}
          </div>
        )}
        <div className="row" style={{ marginBottom: 16 }}>
          <input className="input" style={{ flex: 2, minWidth: 160 }} placeholder="ابحثي عن منتج…" value={q} onChange={(e) => setQ(e.target.value)} />
          <select className="input" style={{ flex: 1, minWidth: 130 }} value={avail} onChange={(e) => setAvail(e.target.value)}>
            <option value="all">جاهز ومخصص</option>
            <option value="ready">جاهز فقط</option>
            <option value="custom">حسب الطلب فقط</option>
          </select>
          <select className="input" style={{ flex: 1, minWidth: 130 }} value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="latest">الأحدث</option>
            <option value="priceAsc">السعر: من الأقل</option>
            <option value="priceDesc">السعر: من الأعلى</option>
          </select>
        </div>
        {list.length === 0 ? (
          <div className="card pad" style={{ textAlign: "center" }}>
            <p className="muted">لا توجد منتجات مطابقة لبحثك.</p>
            <button className="btn primary" onClick={() => go({ page: "wizard" })}>اطلبي تصميمًا مخصصًا بدلًا من ذلك</button>
          </div>
        ) : (
          <div className="grid cols-2 md-4">
            {list.map((p) => (
              <ProductCard key={p.id} p={p} categories={categories} favorites={favorites} toggleFav={toggleFav} go={go} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================ Store: Product Detail ============================ */
function ProductDetail({ product, categories, reviews, addReview, addToCart, go, settings }) {
  const [qty, setQty] = useState(1);
  const [name, setName] = useState("");
  const [phrase, setPhrase] = useState("");
  const [occasion, setOccasion] = useState("");
  const [wrap, setWrap] = useState("بدون تغليف");
  const [date, setDate] = useState("");
  const [rush, setRush] = useState(false);
  const [notes, setNotes] = useState("");
  const [refs, setRefs] = useState(0);
  const [rTxt, setRTxt] = useState(""); const [rName, setRName] = useState(""); const [rStars, setRStars] = useState(5);
  const [added, setAdded] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);

  if (!product) return <div className="container"><div className="card pad section">المنتج غير موجود.</div></div>;
  const cat = categories.find((c) => c.id === product.categoryId);
  const pReviews = reviews.filter((r) => r.productId === product.id);
  const avg = pReviews.length ? (pReviews.reduce((s, r) => s + r.rating, 0) / pReviews.length).toFixed(1) : null;
  const isCustom = product.type === "مخصص";

  const submit = () => {
    addToCart(product, qty, { name, phrase, occasion, wrap, date, rush, notes, refs });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="container">
      <div className="section grid md-2">
        <div>
          <div className="card"><Pic src={product.images?.[imgIdx]} label="الصورة الرئيسية للمنتج" /></div>
          <div className="grid" style={{ gridTemplateColumns: "repeat(4,1fr)", marginTop: 10 }}>
            {(product.images?.length ? product.images.slice(0, 4) : [null, null, null, null]).map((im, i) => (
              <div key={i} className="card" style={{ cursor: im ? "pointer" : "default", outline: im && i === imgIdx ? "2px solid var(--teal-dark)" : "none" }} onClick={() => im && setImgIdx(i)}>
                <Pic src={im} label={`صورة ${i + 1}`} />
              </div>
            ))}
          </div>
        </div>
        <div className="card pad">
          <span className="small muted">{cat?.name} · {product.sub}</span>
          <h2 style={{ margin: "4px 0 6px" }}>{product.name}</h2>
          <div className="row" style={{ marginBottom: 8 }}>
            <span className="price" style={{ fontSize: 20 }}>{SAR(product.price)}</span>
            <span className="badge">{isCustom ? "يُنفذ حسب الطلب" : product.availability}</span>
            {avg && <span className="badge">★ {avg} ({pReviews.length})</span>}
          </div>
          <p className="muted small">{product.desc}</p>
          {isCustom && <div className="notice" style={{ marginBottom: 10 }}>⏱ {settings.customLeadTime}.</div>}
          {isCustom && (settings.weeklySlots ?? 3) > 0 && (
            <div className="slots-note">⚡ أستقبل عددًا محدودًا من الطلبات المخصصة أسبوعيًا — <b>المتبقي هذا الأسبوع: {settings.weeklySlots ?? 3}</b></div>
          )}

          {product.customizable.name && (
            <Field label="الاسم المطلوب على القطعة" hint="اكتبيه تمامًا كما تريدينه أن يظهر"><input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: جود" /></Field>
          )}
          {product.customizable.phrase && (
            <Field label="عبارة أو إهداء (اختياري)"><input className="input" value={phrase} onChange={(e) => setPhrase(e.target.value)} placeholder="مثال: ألف مبروك التخرج" /></Field>
          )}
          <div className="grid cols-2">
            <Field label="المناسبة">
              <select className="input" value={occasion} onChange={(e) => setOccasion(e.target.value)}>
                <option value="">اختاري المناسبة</option>
                {OCCASIONS.map((o) => <option key={o}>{o}</option>)}
              </select>
            </Field>
            {product.customizable.wrap && (
              <Field label="التغليف">
                <select className="input" value={wrap} onChange={(e) => setWrap(e.target.value)}>
                  <option>بدون تغليف</option><option>تغليف هدية</option><option>تغليف فاخر مع بطاقة</option>
                </select>
              </Field>
            )}
          </div>
          {isCustom && (
            <>
              <Field label="صورة مرجعية (اختياري)"><Upload count={refs} onAdd={() => setRefs(refs + 1)} /></Field>
              <div className="grid cols-2">
                <Field label="تاريخ التسليم المطلوب"><input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} min={today()} /></Field>
                <Field label="طلب مستعجل">
                  <label className="row" style={{ border: "1px solid var(--border)", borderRadius: 12, padding: "10px 12px", cursor: "pointer" }}>
                    <input type="checkbox" checked={rush} onChange={(e) => setRush(e.target.checked)} />
                    <span className="small">نعم (+{SAR(RUSH_FEE)})</span>
                  </label>
                </Field>
              </div>
            </>
          )}
          <Field label="ملاحظات خاصة (اختياري)"><textarea className="input" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="أي تفاصيل إضافية تودين إخبارنا بها…" /></Field>
          <div className="row" style={{ margin: "6px 0 14px" }}>
            <span className="small">الكمية:</span>
            <Qty value={qty} onChange={setQty} />
            <span className="spacer" />
            <b>الإجمالي: {SAR(product.price * qty + (rush ? RUSH_FEE : 0))}</b>
          </div>
          <div className="row">
            <button className="btn primary" style={{ flex: 1 }} onClick={submit}>{added ? "✓ أُضيف للسلة" : "أضيفي للسلة"}</button>
            <button className="btn" onClick={() => go({ page: "wizard", prefill: { refProduct: product.id } })}>طلب مشابه</button>
          </div>
          <TrustStrip settings={settings} />
          <p className="small muted hand" style={{ marginTop: 10 }}>🧶 كل قطعة تُصنع يدويًا، لذا قد تختلف التفاصيل الدقيقة قليلًا عن الصور — وهذا ما يجعلها فريدة.</p>
        </div>
      </div>

      <div className="section">
        <div className="section-head"><h2>تقييمات العميلات</h2></div>
        <div className="grid md-2">
          <div>
            {pReviews.length === 0 && <div className="card pad muted small">لا توجد تقييمات بعد — كوني أول من يقيّم هذا المنتج.</div>}
            {pReviews.map((r) => (
              <div key={r.id} className="card pad" style={{ marginBottom: 10 }}>
                <div className="between"><b className="small">{r.name}</b><Stars value={r.rating} /></div>
                <p className="small muted" style={{ margin: "6px 0 0" }}>{r.text}</p>
              </div>
            ))}
          </div>
          <div className="card pad">
            <b>أضيفي تقييمك</b>
            <Field label="اسمك"><input className="input" value={rName} onChange={(e) => setRName(e.target.value)} /></Field>
            <Field label="التقييم"><Stars value={rStars} onChange={setRStars} /></Field>
            <Field label="رأيك بالمنتج"><textarea className="input" value={rTxt} onChange={(e) => setRTxt(e.target.value)} /></Field>
            <button className="btn primary block" disabled={!rName || !rTxt} onClick={() => { addReview({ id: uid(), productId: product.id, name: rName, rating: rStars, text: rTxt }); setRName(""); setRTxt(""); setRStars(5); }}>نشر التقييم</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================ Store: Gallery ============================ */
function Gallery({ gallery, categories, go }) {
  const [cat, setCat] = useState("all");
  const [occ, setOcc] = useState("all");
  const [zoom, setZoom] = useState(null);
  const list = gallery.filter((g) => (cat === "all" || g.categoryId === cat) && (occ === "all" || g.occasion === occ));
  return (
    <div className="container">
      <div className="section">
        <div className="section-head"><h2>معرض الأعمال <StitchWave width={70} style={{ verticalAlign: "middle" }} /></h2><span className="small muted">{list.length} عمل</span></div>
        <p className="muted small" style={{ marginTop: -8 }}>نماذج من طلبات نفذناها سابقًا. أعجبك عمل؟ اطلبي مشابهًا له بلمسة واحدة.</p>
        <div className="chips" style={{ margin: "10px 0" }}>
          <button className={`chip ${cat === "all" ? "active" : ""}`} onClick={() => setCat("all")}>كل الأنواع</button>
          {categories.map((c) => <button key={c.id} className={`chip ${cat === c.id ? "active" : ""}`} onClick={() => setCat(c.id)}>{c.name}</button>)}
        </div>
        <div className="chips" style={{ marginBottom: 14 }}>
          <button className={`chip ${occ === "all" ? "active" : ""}`} onClick={() => setOcc("all")}>كل المناسبات</button>
          {OCCASIONS.map((o) => <button key={o} className={`chip ${occ === o ? "active" : ""}`} onClick={() => setOcc(o)}>{o}</button>)}
        </div>
        <div className="bento">
          {list.map((g) => (
            <div key={g.id} className="card hoverable" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <div style={{ cursor: "zoom-in", flex: 1 }} onClick={() => setZoom(g)}><Pic src={g.image} label="صورة العمل" ratio="auto" style={{ height: "100%", minHeight: 120 }} /></div>
              <div className="pad">
                <b className="small">{g.title}</b>
                <div className="row" style={{ margin: "6px 0" }}>
                  <span className="badge">{categories.find((c) => c.id === g.categoryId)?.name}</span>
                  <span className="badge">{g.occasion}</span>
                </div>
                <button className="btn accent sm block" onClick={() => go({ page: "wizard", prefill: { refGallery: g.id, occasion: g.occasion } })}>أريد طلبًا مشابهًا</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {zoom && (
        <div className="gallery-lightbox" onClick={() => setZoom(null)}>
          <div className="card" style={{ maxWidth: 560, width: "100%" }} onClick={(e) => e.stopPropagation()}>
            <Pic src={zoom.image} label={`عرض مكبر — ${zoom.title}`} ratio="wide" />
            <div className="pad">
              <b>{zoom.title}</b>
              <p className="small muted">{zoom.desc}</p>
              <div className="row">
                <button className="btn primary" style={{ flex: 1 }} onClick={() => { setZoom(null); go({ page: "wizard", prefill: { refGallery: zoom.id, occasion: zoom.occasion } }); }}>أريد طلبًا مشابهًا</button>
                <button className="btn" onClick={() => setZoom(null)}>إغلاق</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================ Store: About ============================ */
function About({ go, settings, texts: t }) {
  return (
    <div className="container">
      <div className="section card pad">
        <h2 style={{ marginTop: 0 }}>{t.aboutTitle}</h2>
        <span className="badge">{t.heroBadge2}</span>
        <p className="muted" style={{ marginTop: 10 }}>{t.aboutIntro}</p>
        <div className="grid md-3" style={{ margin: "16px 0" }}>
          <div className="card soft pad"><b>{t.aboutCard1Title}</b><p className="small muted" style={{ margin: "6px 0 0" }}>{t.aboutCard1Text}</p></div>
          <div className="card soft pad"><b>{t.aboutCard2Title}</b><p className="small muted" style={{ margin: "6px 0 0" }}>{t.aboutCard2Text}</p></div>
          <div className="card soft pad"><b>{t.aboutCard3Title}</b><p className="small muted" style={{ margin: "6px 0 0" }}>{t.aboutCard3Text}</p></div>
        </div>
        <div className="notice" style={{ marginBottom: 8 }}>⏱ {settings.customLeadTime}.</div>
        <div className="notice">↩️ {settings.cancelPolicy}</div>
        <div className="row" style={{ marginTop: 16 }}>
          <button className="btn primary" onClick={() => go({ page: "wizard" })}>ابدئي طلبك الآن</button>
          <a className="btn" href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer">تواصلي معنا</a>
        </div>
      </div>
    </div>
  );
}

/* ============================ Store: Contact ============================ */
function Contact({ settings, texts: t }) {
  const [sent, setSent] = useState(false);
  const [topic, setTopic] = useState("طلب مخصص");
  return (
    <div className="container">
      <div className="section grid md-2">
        <div className="card pad">
          <h2 style={{ marginTop: 0 }}>{t.contactTitle}</h2>
          <p className="muted small">{t.contactIntro}</p>
          <div className="row" style={{ marginBottom: 18 }}>
            <a className="btn primary" style={{ flex: 1 }} href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer">💬 واتساب</a>
            <a className="btn" style={{ flex: 1 }} href={`https://instagram.com/${settings.instagram}`} target="_blank" rel="noreferrer">📷 إنستغرام</a>
          </div>
          {sent ? (
            <div className="notice">✓ وصلتنا رسالتك، وسنرد عليك في أقرب وقت.</div>
          ) : (
            <>
              <Field label="موضوع الرسالة">
                <select className="input" value={topic} onChange={(e) => setTopic(e.target.value)}>
                  <option>طلب مخصص</option><option>استفسار</option><option>متابعة طلب</option><option>تعاون</option><option>مشكلة في طلب</option>
                </select>
              </Field>
              <div className="grid cols-2">
                <Field label="الاسم"><input className="input" /></Field>
                <Field label="رقم الجوال"><input className="input" placeholder="05xxxxxxxx" /></Field>
              </div>
              {topic === "متابعة طلب" || topic === "مشكلة في طلب" ? (
                <Field label="رقم الطلب"><input className="input" placeholder="ORD-xxxx" /></Field>
              ) : null}
              <Field label="رسالتك"><textarea className="input" /></Field>
              <button className="btn primary block" onClick={() => setSent(true)}>إرسال الرسالة</button>
            </>
          )}
        </div>
        <div>
          <h2 style={{ marginTop: 0 }}>أسئلة شائعة</h2>
          <div className="faq">
            <details><summary>كم تستغرق الطلبات المخصصة؟</summary><p className="small muted">{settings.customLeadTime}. الطلبات المستعجلة تُنفذ أسرع برسوم إضافية بسيطة حسب توفر الجدول.</p></details>
            <details><summary>هل يمكن إلغاء أو استبدال طلب مخصص؟</summary><p className="small muted">{settings.cancelPolicy}</p></details>
            <details><summary>هل توصلون لكل مدن السعودية؟</summary><p className="small muted">نعم، الشحن متاح لجميع المدن، والشحن مجاني للطلبات فوق {SAR(settings.freeShippingOver)}.</p></details>
            <details><summary>كيف أطلب كمية كبيرة للتوزيعات؟</summary><p className="small muted">ابدئي طلبًا مخصصًا وحددي الكمية والمناسبة، وسنرسل لك عرض سعر خاصًا بالكميات.</p></details>
            <details><summary>هل يمكن استرجاع المنتجات الرقمية؟</summary><p className="small muted">المنتج الرقمي لا يمكن استرجاعه ولا استبداله بعد الشراء.</p></details>
            <details><summary>ما طرق الدفع المتاحة؟</summary><p className="small muted">مدى، Apple Pay، البطاقات الائتمانية، STC Pay، والتحويل البنكي. تابي وتمارا قريبًا.</p></details>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================ Store: Custom Order Wizard ============================ */
function Wizard({ categories, products, gallery, settings, prefill, createOrder, go }) {
  const refProduct = prefill?.refProduct ? products.find((p) => p.id === prefill.refProduct) : null;
  const refWork = prefill?.refGallery ? gallery.find((g) => g.id === prefill.refGallery) : null;

  const [path, setPath] = useState(refProduct ? "ready" : refWork ? "full" : null); // ready | full
  const [step, setStep] = useState(path ? 1 : 0);
  const [data, setData] = useState({
    categoryId: refProduct?.categoryId || refWork?.categoryId || "",
    productId: refProduct?.id || "",
    idea: refWork ? `أريد عملًا مشابهًا لـ: ${refWork.title}` : "",
    occasion: prefill?.occasion || "",
    qty: 1, name: "", phrase: "", wrap: "بدون تغليف",
    date: "", rush: false, notes: "", refs: refWork ? 1 : 0,
    customer: { name: "", phone: "", city: "" },
  });
  const [orderId, setOrderId] = useState(null);
  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));
  const TOTAL_STEPS = 4;

  const selProduct = products.find((p) => p.id === data.productId);
  const estPrice = path === "ready" && selProduct ? selProduct.price * data.qty + (data.rush ? RUSH_FEE : 0) : null;

  const submit = () => {
    const id = createOrder({
      kind: "custom",
      items: [{
        productId: data.productId || null,
        name: path === "ready" ? selProduct?.name : `طلب مخصص — ${categories.find((c) => c.id === data.categoryId)?.name || "عام"}`,
        qty: data.qty, price: selProduct?.price || 0,
        custom: { name: data.name, phrase: data.phrase, occasion: data.occasion, wrap: data.wrap, rush: data.rush },
      }],
      customer: data.customer, deliveryDate: data.date || null, rush: data.rush,
      notes: [data.idea, data.notes].filter(Boolean).join(" — "), refImages: data.refs,
      payment: "بانتظار الدفع", coupon: null,
    });
    setOrderId(id);
  };

  /* شاشة النجاح */
  if (orderId) {
    return (
      <div className="container">
        <div className="section card elevated pad" style={{ textAlign: "center", maxWidth: 520, margin: "40px auto", position: "relative", overflow: "hidden" }}>
          <Confetti />
          <div className="float" style={{ display: "inline-block" }}><Art name="gift" size={80} /></div>
          <h2>وصلنا طلبك بنجاح!</h2>
          <p className="muted small">رقم طلبك هو:</p>
          <div className="card soft pad" style={{ fontSize: 22, fontWeight: 800, letterSpacing: 1, marginBottom: 14, color: "var(--teal-dark)" }}>{orderId}</div>
          <p className="small muted">سنراجع التفاصيل ونتواصل معك عبر واتساب لتأكيد السعر النهائي وموعد التسليم قبل بدء التنفيذ.</p>
          <ThankGift settings={settings} />
          <div className="row" style={{ justifyContent: "center", marginTop: 12 }}>
            <button className="btn primary" onClick={() => go({ page: "track", orderId })}>تتبعي الطلب</button>
            <button className="btn" onClick={() => go({ page: "home" })}>العودة للرئيسية</button>
          </div>
        </div>
      </div>
    );
  }

  /* اختيار المسار */
  if (!path) {
    return (
      <div className="container">
        <div className="section" style={{ maxWidth: 640, margin: "30px auto" }}>
          <h2 style={{ textAlign: "center" }}>كيف تحبين أن نبدأ؟</h2>
          {(settings.weeklySlots ?? 3) > 0 && (
            <div className="slots-note" style={{ textAlign: "center" }}>⚡ الأماكن المتبقية للطلبات المخصصة هذا الأسبوع: <b>{settings.weeklySlots ?? 3}</b></div>
          )}
          <div className="grid md-2" style={{ marginTop: 16 }}>
            <div className="card hoverable pad" onClick={() => { setPath("ready"); setStep(1); }}>
              <div className="float" style={{ display: "inline-block" }}><Art name="gift" size={58} /></div>
              <b>منتج جاهز مع تخصيص بسيط</b>
              <p className="small muted">اختاري من منتجاتنا وأضيفي اسمًا أو عبارة أو تغليفًا خاصًا.</p>
              <span className="btn primary sm">اختيار هذا المسار</span>
            </div>
            <div className="card hoverable elevated pad" onClick={() => { setPath("full"); setStep(1); }}>
              <div className="float alt" style={{ display: "inline-block" }}><Art name="yarn" size={68} /></div>
              <b>طلب مخصص بالكامل</b>
              <p className="small muted">عندك فكرة أو صورة مرجعية؟ احكي لنا التفاصيل وسننفذها لك من الصفر.</p>
              <span className="btn primary sm">اختيار هذا المسار</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const StepNav = ({ canNext = true, last = false }) => (
    <div className="row" style={{ marginTop: 16 }}>
      <button className="btn" onClick={() => (step === 1 ? (setPath(null), setStep(0)) : setStep(step - 1))}>رجوع</button>
      <button className={`btn ${last ? "accent" : "primary"}`} style={{ flex: 1 }} disabled={!canNext} onClick={() => (last ? submit() : setStep(step + 1))}>
        {last ? "إرسال الطلب 🎀" : "التالي"}
      </button>
    </div>
  );

  return (
    <div className="container">
      <div className="section grid md-2" style={{ alignItems: "start" }}>
        <div className="card pad">
          <div className="between">
            <b>{path === "ready" ? "طلب منتج جاهز مع تخصيص" : "طلب مخصص بالكامل"}</b>
            <span className="small muted">خطوة {step} من {TOTAL_STEPS}</span>
          </div>
          <div className="progress">{Array.from({ length: TOTAL_STEPS }).map((_, i) => <span key={i} className={i < step ? "done" : ""} />)}</div>

          {step === 1 && (
            <>
              {path === "ready" ? (
                <>
                  <Field label="اختاري المنتج">
                    <select className="input" value={data.productId} onChange={(e) => { const p = products.find((x) => x.id === e.target.value); set("productId", e.target.value); if (p) set("categoryId", p.categoryId); }}>
                      <option value="">— اختاري —</option>
                      {products.filter((p) => !p.hidden).map((p) => <option key={p.id} value={p.id}>{p.name} — {SAR(p.price)}</option>)}
                    </select>
                  </Field>
                  <StepNav canNext={!!data.productId} />
                </>
              ) : (
                <>
                  <Field label="نوع الطلب">
                    <select className="input" value={data.categoryId} onChange={(e) => set("categoryId", e.target.value)}>
                      <option value="">— اختاري —</option>
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </Field>
                  <Field label="احكي لنا فكرتك" hint="كلما زادت التفاصيل، كان التنفيذ أدق">
                    <textarea className="input" value={data.idea} onChange={(e) => set("idea", e.target.value)} placeholder="مثال: أريد 30 توزيعة كروشيه لحفل تخرج بألوان محددة مع بطاقة اسم…" />
                  </Field>
                  <Field label="صور مرجعية (اختياري)"><Upload count={data.refs} onAdd={() => set("refs", data.refs + 1)} /></Field>
                  <StepNav canNext={!!data.categoryId && data.idea.trim().length > 5} />
                </>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <div className="grid cols-2">
                <Field label="المناسبة">
                  <select className="input" value={data.occasion} onChange={(e) => set("occasion", e.target.value)}>
                    <option value="">— اختاري —</option>
                    {OCCASIONS.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </Field>
                <Field label="الكمية"><Qty value={data.qty} onChange={(v) => set("qty", v)} /></Field>
              </div>
              <Field label="اسم على القطعة (اختياري)"><input className="input" value={data.name} onChange={(e) => set("name", e.target.value)} /></Field>
              <Field label="عبارة أو إهداء (اختياري)"><input className="input" value={data.phrase} onChange={(e) => set("phrase", e.target.value)} /></Field>
              <Field label="التغليف">
                <select className="input" value={data.wrap} onChange={(e) => set("wrap", e.target.value)}>
                  <option>بدون تغليف</option><option>تغليف هدية</option><option>تغليف فاخر مع بطاقة</option>
                </select>
              </Field>
              <StepNav canNext={!!data.occasion} />
            </>
          )}

          {step === 3 && (
            <>
              <Field label="تاريخ التسليم المطلوب" hint={settings.customLeadTime}>
                <input type="date" className="input" value={data.date} onChange={(e) => set("date", e.target.value)} min={today()} />
              </Field>
              <Field label="طلب مستعجل؟">
                <label className="row" style={{ border: "1px solid var(--border)", borderRadius: 12, padding: "10px 12px", cursor: "pointer" }}>
                  <input type="checkbox" checked={data.rush} onChange={(e) => set("rush", e.target.checked)} />
                  <span className="small">نعم، أحتاجه بأسرع وقت (+{SAR(RUSH_FEE)} تقريبًا)</span>
                </label>
              </Field>
              <Field label="ملاحظات إضافية"><textarea className="input" value={data.notes} onChange={(e) => set("notes", e.target.value)} /></Field>
              {path === "ready" && <Field label="صور مرجعية (اختياري)"><Upload count={data.refs} onAdd={() => set("refs", data.refs + 1)} /></Field>}
              <StepNav />
            </>
          )}

          {step === 4 && (
            <>
              <b className="small">بيانات التواصل</b>
              <div className="grid cols-2" style={{ marginTop: 8 }}>
                <Field label="الاسم"><input className="input" value={data.customer.name} onChange={(e) => set("customer", { ...data.customer, name: e.target.value })} /></Field>
                <Field label="الجوال (واتساب)"><input className="input" placeholder="05xxxxxxxx" value={data.customer.phone} onChange={(e) => set("customer", { ...data.customer, phone: e.target.value })} /></Field>
              </div>
              <Field label="المدينة"><input className="input" value={data.customer.city} onChange={(e) => set("customer", { ...data.customer, city: e.target.value })} /></Field>
              <div className="notice">بعد الإرسال سنراجع الطلب ونتواصل معك لتأكيد السعر النهائي وطريقة الدفع قبل بدء التنفيذ.</div>
              <StepNav last canNext={!!data.customer.name && data.customer.phone.length >= 9} />
            </>
          )}
        </div>

        {/* الملخص الجانبي المتجدد */}
        <div className="card glass pad" style={{ position: "sticky", top: 96 }}>
          <b>ملخص طلبك</b>
          <table className="table" style={{ marginTop: 8 }}>
            <tbody>
              <tr><td className="muted">المسار</td><td>{path === "ready" ? "منتج جاهز + تخصيص" : "مخصص بالكامل"}</td></tr>
              {selProduct && <tr><td className="muted">المنتج</td><td>{selProduct.name}</td></tr>}
              {refWork && <tr><td className="muted">مرجع من المعرض</td><td>{refWork.title}</td></tr>}
              {data.categoryId && !selProduct && <tr><td className="muted">النوع</td><td>{categories.find((c) => c.id === data.categoryId)?.name}</td></tr>}
              {data.occasion && <tr><td className="muted">المناسبة</td><td>{data.occasion}</td></tr>}
              <tr><td className="muted">الكمية</td><td>{data.qty}</td></tr>
              {data.name && <tr><td className="muted">الاسم</td><td>{data.name}</td></tr>}
              {data.phrase && <tr><td className="muted">العبارة</td><td>{data.phrase}</td></tr>}
              {data.wrap !== "بدون تغليف" && <tr><td className="muted">التغليف</td><td>{data.wrap}</td></tr>}
              {data.date && <tr><td className="muted">التسليم</td><td>{data.date}{data.rush ? " (مستعجل)" : ""}</td></tr>}
              {data.refs > 0 && <tr><td className="muted">صور مرجعية</td><td>{data.refs}</td></tr>}
            </tbody>
          </table>
          {estPrice != null ? (
            <div className="between" style={{ marginTop: 8 }}><span className="muted small">السعر التقريبي</span><b>{SAR(estPrice)}</b></div>
          ) : (
            <p className="small muted" style={{ marginBottom: 0 }}>💬 السعر النهائي للطلبات المخصصة يُحدد بعد مراجعة التفاصيل ويُرسل لك عرض سعر.</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================ Store: Cart & Checkout ============================ */
function CartPage({ cart, setCart, coupons, settings, go, createOrder }) {
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState(null);
  const [codeMsg, setCodeMsg] = useState("");
  const [checkout, setCheckout] = useState(false);
  const [customer, setCustomer] = useState({ name: "", phone: "", city: "", address: "" });
  const [payment, setPayment] = useState("مدى");
  const [orderId, setOrderId] = useState(null);

  const totals = calcTotals(cart, applied, settings);

  const applyCode = () => {
    const c = coupons.find((x) => x.active && x.code.toLowerCase() === code.trim().toLowerCase());
    if (!c) { setCodeMsg("الكود غير صحيح أو منتهي."); setApplied(null); return; }
    if (totals.subtotal < c.minTotal) { setCodeMsg(`هذا الكود يتطلب حدًا أدنى ${SAR(c.minTotal)}.`); setApplied(null); return; }
    setApplied(c); setCodeMsg(`✓ تم تطبيق الخصم (${c.type === "percent" ? c.value + "%" : SAR(c.value)}).`);
  };

  const placeOrder = () => {
    const id = createOrder({
      kind: "ready", items: cart, customer, payment, coupon: applied?.code || null,
      deliveryDate: null, rush: cart.some((i) => i.custom?.rush), notes: "", refImages: cart.reduce((s, i) => s + (i.custom?.refs || 0), 0),
    });
    setOrderId(id); setCart([]);
  };

  if (orderId) {
    return (
      <div className="container">
        <div className="section card elevated pad" style={{ textAlign: "center", maxWidth: 520, margin: "40px auto", position: "relative", overflow: "hidden" }}>
          <Confetti />
          <div className="float" style={{ display: "inline-block" }}><Art name="heart" size={80} /></div>
          <h2>تم استلام طلبك!</h2>
          <p className="muted small">رقم الطلب:</p>
          <div className="card soft pad" style={{ fontSize: 22, fontWeight: 800, marginBottom: 14, color: "var(--teal-dark)" }}>{orderId}</div>
          <p className="small muted">أرسلنا لك تفاصيل الطلب، ويمكنك متابعة حالته في أي وقت من صفحة تتبع الطلب.</p>
          <ThankGift settings={settings} />
          <div className="row" style={{ justifyContent: "center", marginTop: 12 }}>
            <button className="btn primary" onClick={() => go({ page: "track", orderId })}>تتبعي الطلب</button>
            <button className="btn" onClick={() => go({ page: "shop" })}>متابعة التسوق</button>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container">
        <div className="section card soft pad" style={{ textAlign: "center", padding: 36 }}>
          <div className="float" style={{ display: "inline-block" }}><Art name="yarn" size={95} /></div>
          <b style={{ display: "block", marginTop: 8, fontSize: 17 }}>سلتك فارغة… لكن الكون مليء بالأفكار</b>
          <p className="muted small">أضيفي منتجات من المتجر أو ابدئي طلبًا مخصصًا.</p>
          <div className="row" style={{ justifyContent: "center" }}>
            <button className="btn primary" onClick={() => go({ page: "shop" })}>تصفحي المتجر</button>
            <button className="btn" onClick={() => go({ page: "wizard" })}>طلب مخصص</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="section grid md-2" style={{ alignItems: "start" }}>
        <div>
          {!checkout ? (
            <>
              <h2 style={{ marginTop: 0 }}>سلة التسوق</h2>
              {cart.map((it, i) => (
                <div key={i} className="card pad" style={{ marginBottom: 10 }}>
                  <div className="row" style={{ alignItems: "flex-start" }}>
                    <div style={{ width: 64 }}><Pic src={it.image} label="صورة" style={{ borderRadius: 10, aspectRatio: "1/1" }} /></div>
                    <div style={{ flex: 1 }}>
                      <div className="between"><b className="small">{it.name}</b><b className="small">{SAR(it.price * it.qty + (it.custom?.rush ? RUSH_FEE : 0))}</b></div>
                      <div className="small muted">
                        {[it.custom?.name && `الاسم: ${it.custom.name}`, it.custom?.phrase && `العبارة: ${it.custom.phrase}`, it.custom?.occasion && `المناسبة: ${it.custom.occasion}`, it.custom?.wrap && it.custom.wrap !== "بدون تغليف" && it.custom.wrap, it.custom?.rush && "⚡ مستعجل"].filter(Boolean).join(" · ") || "بدون تخصيص"}
                      </div>
                      <div className="row" style={{ marginTop: 8 }}>
                        <Qty value={it.qty} onChange={(v) => setCart(cart.map((x, j) => (j === i ? { ...x, qty: v } : x)))} />
                        <button className="btn sm danger" onClick={() => setCart(cart.filter((_, j) => j !== i))}>حذف</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="row" style={{ margin: "14px 0" }}>
                <input className="input" style={{ flex: 1 }} placeholder="كود الخصم" value={code} onChange={(e) => setCode(e.target.value)} />
                <button className="btn" onClick={applyCode}>تطبيق</button>
              </div>
              {codeMsg && <p className="small muted" style={{ marginTop: -6 }}>{codeMsg}</p>}
            </>
          ) : (
            <>
              <h2 style={{ marginTop: 0 }}>إتمام الطلب</h2>
              <div className="card pad">
                <b className="small">بيانات العميلة</b>
                <div className="grid cols-2" style={{ marginTop: 8 }}>
                  <Field label="الاسم"><input className="input" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} /></Field>
                  <Field label="الجوال"><input className="input" placeholder="05xxxxxxxx" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} /></Field>
                </div>
                <div className="grid cols-2">
                  <Field label="المدينة"><input className="input" value={customer.city} onChange={(e) => setCustomer({ ...customer, city: e.target.value })} /></Field>
                  <Field label="الحي / العنوان"><input className="input" value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} /></Field>
                </div>
                <Field label="طريقة الدفع">
                  <select className="input" value={payment} onChange={(e) => setPayment(e.target.value)}>
                    {settings.payments.mada && <option>مدى</option>}
                    {settings.payments.applePay && <option>Apple Pay</option>}
                    {settings.payments.cards && <option>بطاقة ائتمانية (Visa / Mastercard)</option>}
                    {settings.payments.stcPay && <option>STC Pay</option>}
                    {settings.payments.bank && <option>تحويل بنكي</option>}
                  </select>
                </Field>
                <div className="notice small">تابي وتمارا (الدفع الآجل) — قريبًا.</div>
              </div>
            </>
          )}
        </div>

        <div className="card elevated pad" style={{ position: "sticky", top: 96 }}>
          <b>ملخص الطلب</b>
          <table className="table" style={{ marginTop: 8 }}>
            <tbody>
              <tr><td className="muted">المجموع الفرعي</td><td>{SAR(totals.subtotal)}</td></tr>
              {totals.discount > 0 && <tr><td className="muted">الخصم ({applied.code})</td><td>− {SAR(totals.discount)}</td></tr>}
              <tr><td className="muted">الشحن</td><td>{totals.shipping === 0 ? "مجاني 🎉" : SAR(totals.shipping)}</td></tr>
              <tr><td className="muted">الضريبة ({settings.taxPercent}%)</td><td>{SAR(totals.tax.toFixed(2))}</td></tr>
              <tr><td><b>الإجمالي</b></td><td><b>{SAR(totals.total.toFixed(2))}</b></td></tr>
            </tbody>
          </table>
          {totals.shipping > 0 && <p className="small muted">أضيفي {SAR(settings.freeShippingOver - (totals.subtotal - totals.discount))} لتحصلي على شحن مجاني.</p>}
          {!checkout ? (
            <button className="btn primary block" onClick={() => setCheckout(true)}>متابعة إتمام الطلب</button>
          ) : (
            <>
              <button className="btn primary block" disabled={!customer.name || customer.phone.length < 9 || !customer.city} onClick={placeOrder}>تأكيد الطلب</button>
              <button className="btn ghost block" style={{ marginTop: 8 }} onClick={() => setCheckout(false)}>العودة للسلة</button>
            </>
          )}
          <TrustStrip settings={settings} />
        </div>
      </div>
    </div>
  );
}

/* ============================ Store: Track Order ============================ */
function Track({ orders, initId }) {
  const [q, setQ] = useState(initId || "");
  const [order, setOrder] = useState(initId ? orders.find((o) => o.id === initId) : null);
  const [notFound, setNotFound] = useState(false);
  const search = () => {
    const o = orders.find((x) => x.id.toLowerCase() === q.trim().toLowerCase());
    setOrder(o || null); setNotFound(!o);
  };
  const doneIdx = order ? ORDER_STATUSES.findIndex((s) => s.key === order.status) : -1;
  return (
    <div className="container">
      <div className="section" style={{ maxWidth: 560, margin: "30px auto" }}>
        <div className="card pad">
          <h2 style={{ marginTop: 0 }}>تتبع الطلب</h2>
          <div className="row">
            <input className="input" style={{ flex: 1 }} placeholder="أدخلي رقم الطلب، مثال: ORD-1043" value={q} onChange={(e) => setQ(e.target.value)} />
            <button className="btn primary" onClick={search}>تتبع</button>
          </div>
          {notFound && <p className="small muted">لم نجد طلبًا بهذا الرقم. تأكدي من الرقم أو تواصلي معنا عبر واتساب.</p>}
        </div>
        {order && (
          <div className="card pad" style={{ marginTop: 14 }}>
            <div className="between">
              <b>{order.id}</b>
              <span className="status">{statusLabel(order.status)}</span>
            </div>
            <p className="small muted">آخر تحديث: {order.history[order.history.length - 1]?.at} · تاريخ الطلب: {order.createdAt}{order.deliveryDate ? ` · التسليم المطلوب: ${order.deliveryDate}` : ""}</p>
            <ul className="timeline" style={{ marginTop: 10 }}>
              {ORDER_STATUSES.filter((s) => s.key !== "cancelled" || order.status === "cancelled").map((s, i) => {
                const h = order.history.find((x) => x.status === s.key);
                const done = order.status === "cancelled" ? !!h : i <= doneIdx;
                return (
                  <li key={s.key} className={done ? "done" : ""}>
                    <b className="small">{s.label}</b>
                    {h && <span className="small muted"> — {h.at}</span>}
                  </li>
                );
              })}
            </ul>
            {order.adminNotes && <div className="notice">📝 ملاحظة من المتجر: {order.adminNotes}</div>}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================ Store: Account ============================ */
function Account({ user, setUser, orders, favorites, products, go }) {
  const [name, setName] = useState(""); const [phone, setPhone] = useState("");
  if (!user) {
    return (
      <div className="container">
        <div className="section card pad" style={{ maxWidth: 440, margin: "40px auto" }}>
          <h2 style={{ marginTop: 0 }}>حسابي</h2>
          <p className="small muted">تسجيل الدخول اختياري — يساعدك على متابعة طلباتك ومفضلتك وعناوينك.</p>
          <Field label="الاسم"><input className="input" value={name} onChange={(e) => setName(e.target.value)} /></Field>
          <Field label="رقم الجوال" hint="سنرسل رمز تحقق عبر الرسائل (في النسخة النهائية)"><input className="input" placeholder="05xxxxxxxx" value={phone} onChange={(e) => setPhone(e.target.value)} /></Field>
          <button className="btn primary block" disabled={!name || phone.length < 9} onClick={() => setUser({ name, phone, addresses: [{ label: "المنزل", city: "الرياض", details: "—" }] })}>تسجيل الدخول</button>
          <div className="stitch-top" style={{ textAlign: "center" }}>
            <span className="small muted">عندك طلب سابق؟</span>{" "}
            <button className="btn ghost sm" onClick={() => go({ page: "track" })}>تتبعيه برقم الطلب ←</button>
          </div>
        </div>
      </div>
    );
  }
  const myOrders = orders.filter((o) => o.customer.phone === user.phone);
  const favs = products.filter((p) => favorites.includes(p.id));
  return (
    <div className="container">
      <div className="section">
        <div className="between">
          <h2 style={{ margin: 0 }}>أهلًا، {user.name} 👋</h2>
          <button className="btn sm" onClick={() => setUser(null)}>تسجيل الخروج</button>
        </div>
        <div className="grid md-2" style={{ marginTop: 14 }}>
          <div className="card pad">
            <b>طلباتي السابقة</b>
            {myOrders.length === 0 ? <p className="small muted">لا توجد طلبات مرتبطة برقمك بعد. (جربي رقم 0501234567 لعرض بيانات تجريبية)</p> : (
              <table className="table" style={{ marginTop: 8 }}>
                <thead><tr><th>الطلب</th><th>الحالة</th><th></th></tr></thead>
                <tbody>
                  {myOrders.map((o) => (
                    <tr key={o.id}>
                      <td><b className="small">{o.id}</b><div className="small muted">{o.createdAt}</div></td>
                      <td><span className="status">{statusLabel(o.status)}</span></td>
                      <td><button className="btn sm" onClick={() => go({ page: "track", orderId: o.id })}>تتبع</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div>
            <div className="card pad" style={{ marginBottom: 14 }}>
              <b>مفضلتي ({favs.length})</b>
              {favs.length === 0 ? <p className="small muted">لم تضيفي منتجات للمفضلة بعد.</p> : favs.map((p) => (
                <div key={p.id} className="between" style={{ borderBottom: "1px solid var(--border)", padding: "8px 0" }}>
                  <span className="small">{p.name}</span>
                  <button className="btn sm" onClick={() => go({ page: "product", id: p.id })}>عرض</button>
                </div>
              ))}
            </div>
            <div className="card pad">
              <b>عناويني المحفوظة</b>
              {user.addresses.map((a, i) => (
                <div key={i} className="notice" style={{ marginTop: 8 }}>📍 {a.label} — {a.city} — {a.details}</div>
              ))}
              <button className="btn sm block" style={{ marginTop: 10 }}>+ إضافة عنوان جديد</button>
            </div>
            <div className="card pad" style={{ marginTop: 14 }}>
              <b>نقاط الولاء</b>
              <p className="small muted" style={{ margin: "6px 0 0" }}>🎁 قريبًا: اجمعي نقاطًا مع كل طلب واستبدليها بخصومات.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================ Admin ============================ */
function Admin(props) {
  const { orders, setOrders, products, setProducts, categories, setCategories, coupons, setCoupons, gallery, setGallery, notifications, setNotifications, settings, setSettings, texts, setTexts, onReset } = props;
  const [tab, setTab] = useState("dashboard");
  const [invoice, setInvoice] = useState(null);
  const unread = notifications.filter((n) => !n.read).length;

  const updateStatus = (id, status) =>
    setOrders(orders.map((o) => (o.id === id ? { ...o, status, history: [...o.history, { status, at: today() }] } : o)));

  const TABS = [
    ["dashboard", "📊 لوحة المعلومات"], ["orders", "📦 الطلبات"], ["customOrders", "✨ الطلبات الخاصة"],
    ["products", "🧶 المنتجات"], ["categories", "🗂 التصنيفات"], ["coupons", "🏷 أكواد الخصم"],
    ["gallery", "🖼 معرض الأعمال"], ["texts", "📝 نصوص الموقع"], ["notifications", `🔔 الإشعارات${unread ? ` (${unread})` : ""}`], ["settings", "⚙️ الإعدادات"],
  ];

  return (
    <div className="container">
      <div className="section admin-wrap">
        <div className="admin-nav">
          {TABS.map(([k, l]) => <button key={k} className={tab === k ? "active" : ""} onClick={() => setTab(k)}>{l}</button>)}
        </div>
        <div>
          {tab === "dashboard" && <AdminDashboard orders={orders} products={products} setTab={setTab} />}
          {tab === "orders" && <AdminOrders orders={orders} updateStatus={updateStatus} setInvoice={setInvoice} filterKind={null} />}
          {tab === "customOrders" && <AdminOrders orders={orders} updateStatus={updateStatus} setInvoice={setInvoice} filterKind="custom" />}
          {tab === "products" && <AdminProducts products={products} setProducts={setProducts} categories={categories} />}
          {tab === "categories" && <AdminCategories categories={categories} setCategories={setCategories} />}
          {tab === "coupons" && <AdminCoupons coupons={coupons} setCoupons={setCoupons} />}
          {tab === "gallery" && <AdminGallery gallery={gallery} setGallery={setGallery} categories={categories} />}
          {tab === "texts" && <AdminTexts texts={texts} setTexts={setTexts} />}
          {tab === "notifications" && (
            <div className="card pad">
              <div className="between"><b>الإشعارات</b><button className="btn sm" onClick={() => setNotifications(notifications.map((n) => ({ ...n, read: true })))}>تحديد الكل كمقروء</button></div>
              {notifications.map((n) => (
                <div key={n.id} className="notice" style={{ marginTop: 10, opacity: n.read ? 0.6 : 1 }}>
                  {!n.read && <span className="badge solid" style={{ marginInlineEnd: 6 }}>جديد</span>}
                  {n.text} <span className="small muted">— {n.at}</span>
                </div>
              ))}
            </div>
          )}
          {tab === "settings" && <AdminSettings settings={settings} setSettings={setSettings} onReset={onReset} />}
        </div>
      </div>
      <InvoiceModal order={invoice} settings={settings} onClose={() => setInvoice(null)} />
    </div>
  );
}

function AdminDashboard({ orders, products, setTab }) {
  const active = orders.filter((o) => !["delivered", "cancelled"].includes(o.status));
  const sales = orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.items.reduce((a, i) => a + i.price * i.qty, 0), 0);
  const lowStock = products.filter((p) => p.stock != null && p.stock <= 3);
  return (
    <div>
      <div className="grid cols-2 md-4">
        <div className="card stat"><b>{orders.length}</b><span>إجمالي الطلبات</span></div>
        <div className="card stat"><b>{active.length}</b><span>طلبات نشطة</span></div>
        <div className="card stat"><b>{SAR(sales)}</b><span>المبيعات</span></div>
        <div className="card stat"><b>{products.filter((p) => !p.hidden).length}</b><span>منتجات معروضة</span></div>
      </div>
      {lowStock.length > 0 && (
        <div className="notice" style={{ marginTop: 14 }}>⚠️ مخزون منخفض: {lowStock.map((p) => `${p.name} (${p.stock})`).join("، ")}</div>
      )}
      <div className="card pad" style={{ marginTop: 14 }}>
        <div className="between"><b>أحدث الطلبات</b><button className="btn sm" onClick={() => setTab("orders")}>كل الطلبات</button></div>
        <div className="table-wrap">
          <table className="table" style={{ marginTop: 8 }}>
            <thead><tr><th>الطلب</th><th>العميلة</th><th>النوع</th><th>الحالة</th></tr></thead>
            <tbody>
              {orders.slice(0, 5).map((o) => (
                <tr key={o.id}>
                  <td><b className="small">{o.id}</b><div className="small muted">{o.createdAt}</div></td>
                  <td className="small">{o.customer.name}</td>
                  <td className="small">{o.kind === "custom" ? "مخصص" : "جاهز"}{o.rush ? " ⚡" : ""}</td>
                  <td><span className="status">{statusLabel(o.status)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdminOrders({ orders, updateStatus, setInvoice, filterKind }) {
  const [q, setQ] = useState("");
  const [st, setSt] = useState("all");
  const [open, setOpen] = useState(null);
  let list = orders.filter((o) => (!filterKind || o.kind === filterKind));
  if (st !== "all") list = list.filter((o) => o.status === st);
  if (q.trim()) list = list.filter((o) => (o.id + o.customer.name + o.customer.phone).includes(q.trim()));
  const cur = orders.find((o) => o.id === open);
  return (
    <div className="card pad">
      <b>{filterKind === "custom" ? "الطلبات الخاصة (المخصصة)" : "إدارة الطلبات"}</b>
      <div className="row" style={{ margin: "10px 0" }}>
        <input className="input" style={{ flex: 2, minWidth: 160 }} placeholder="بحث برقم الطلب أو الاسم أو الجوال…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="input" style={{ flex: 1, minWidth: 140 }} value={st} onChange={(e) => setSt(e.target.value)}>
          <option value="all">كل الحالات</option>
          {ORDER_STATUSES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
        </select>
      </div>
      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>الطلب</th><th>العميلة</th><th>الحالة</th><th></th></tr></thead>
          <tbody>
            {list.map((o) => (
              <tr key={o.id}>
                <td><b className="small">{o.id}</b><div className="small muted">{o.createdAt}{o.rush ? " · ⚡ مستعجل" : ""}</div></td>
                <td className="small">{o.customer.name}<div className="muted">{o.customer.phone}</div></td>
                <td>
                  <select className="input" style={{ padding: "6px 8px", fontSize: 12 }} value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)}>
                    {ORDER_STATUSES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
                  </select>
                </td>
                <td>
                  <div className="row" style={{ flexWrap: "nowrap" }}>
                    <button className="btn sm" onClick={() => setOpen(o.id)}>تفاصيل</button>
                    <button className="btn sm" onClick={() => setInvoice(o)}>🖨</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && <p className="small muted">لا توجد طلبات مطابقة.</p>}
      </div>
      <Modal open={!!cur} onClose={() => setOpen(null)} title={`تفاصيل ${cur?.id || ""}`}>
        {cur && (
          <>
            <div className="row" style={{ marginBottom: 10 }}>
              <span className="status">{statusLabel(cur.status)}</span>
              <span className="badge">{cur.kind === "custom" ? "طلب مخصص" : "طلب جاهز"}</span>
              {cur.rush && <span className="badge solid">⚡ مستعجل</span>}
              {cur.deliveryDate && <span className="badge">التسليم: {cur.deliveryDate}</span>}
            </div>
            <table className="table">
              <thead><tr><th>المنتج</th><th>الكمية</th><th>السعر</th></tr></thead>
              <tbody>
                {cur.items.map((it, i) => (
                  <tr key={i}>
                    <td className="small">{it.name}
                      <div className="muted">{[it.custom?.name && `الاسم: ${it.custom.name}`, it.custom?.phrase && `العبارة: ${it.custom.phrase}`, it.custom?.occasion && it.custom.occasion, it.custom?.wrap].filter(Boolean).join(" · ")}</div>
                    </td>
                    <td className="small">{it.qty}</td>
                    <td className="small">{it.price ? SAR(it.price * it.qty) : "بانتظار التسعير"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="small"><b>العميلة:</b> {cur.customer.name} — {cur.customer.phone} — {cur.customer.city} {cur.customer.address || ""}</p>
            {cur.notes && <div className="notice">📝 ملاحظات العميلة: {cur.notes}</div>}
            {cur.refImages > 0 && (
              <div style={{ margin: "10px 0" }}>
                <b className="small">الصور المرجعية ({cur.refImages})</b>
                <div className="grid" style={{ gridTemplateColumns: "repeat(3,1fr)", marginTop: 6 }}>
                  {Array.from({ length: cur.refImages }).map((_, i) => <div key={i} className="card"><Ph label={`مرجع ${i + 1}`} /></div>)}
                </div>
              </div>
            )}
            {cur.adminNotes && <div className="notice">🔒 ملاحظات داخلية: {cur.adminNotes}</div>}
            <div className="row" style={{ marginTop: 12 }}>
              <button className="btn primary" style={{ flex: 1 }} onClick={() => { setOpen(null); setInvoice(cur); }}>🖨 طباعة الفاتورة</button>
              <a className="btn" href={`https://wa.me/966${cur.customer.phone.replace(/^0/, "")}`} target="_blank" rel="noreferrer">💬 مراسلة العميلة</a>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

function InvoiceModal({ order, settings, onClose }) {
  if (!order) return null;
  const totals = calcTotals(order.items, null, settings);
  return (
    <div className="modal-back" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="between no-print" style={{ marginBottom: 10 }}>
          <b>فاتورة {order.id}</b>
          <div className="row">
            <button className="btn primary sm" onClick={() => window.print()}>🖨 طباعة A4</button>
            <button className="icon-btn" onClick={onClose}>✕</button>
          </div>
        </div>
        <div className="print-area" style={{ border: "1px solid var(--border)", borderRadius: 12, padding: 18 }}>
          <div className="between" style={{ borderBottom: "2px dashed var(--border)", paddingBottom: 10, marginBottom: 10 }}>
            <div className="row"><LogoMark size={46} /><div><b>{settings.storeName}</b><div className="small muted">واتساب: {settings.whatsapp}</div></div></div>
            <div style={{ textAlign: "left" }}><b>فاتورة</b><div className="small">{order.id}</div><div className="small muted">{order.createdAt}</div></div>
          </div>
          <p className="small"><b>العميلة:</b> {order.customer.name} — {order.customer.phone}<br /><b>العنوان:</b> {order.customer.city} {order.customer.address || ""}<br /><b>طريقة الدفع:</b> {order.payment}</p>
          <table className="table">
            <thead><tr><th>الصنف</th><th>الكمية</th><th>سعر الوحدة</th><th>الإجمالي</th></tr></thead>
            <tbody>
              {order.items.map((it, i) => (
                <tr key={i}><td className="small">{it.name}</td><td className="small">{it.qty}</td><td className="small">{SAR(it.price)}</td><td className="small">{SAR(it.price * it.qty)}</td></tr>
              ))}
            </tbody>
          </table>
          <table className="table" style={{ marginTop: 8 }}>
            <tbody>
              <tr><td className="muted small">المجموع الفرعي</td><td className="small">{SAR(totals.subtotal)}</td></tr>
              <tr><td className="muted small">الشحن</td><td className="small">{totals.shipping === 0 ? "مجاني" : SAR(totals.shipping)}</td></tr>
              <tr><td className="muted small">الضريبة ({settings.taxPercent}%)</td><td className="small">{SAR(totals.tax.toFixed(2))}</td></tr>
              <tr><td><b>الإجمالي</b></td><td><b>{SAR(totals.total.toFixed(2))}</b></td></tr>
            </tbody>
          </table>
          <p className="small hand" style={{ marginTop: 14, textAlign: "center", color: "var(--teal-dark)" }}>♡ شكرًا لدعمك المنتجات اليدوية — كل غرزة صُنعت خصيصًا لكِ ♡</p>
        </div>
      </div>
    </div>
  );
}

function AdminProducts({ products, setProducts, categories }) {
  const empty = { id: "", name: "", price: 0, categoryId: categories[0]?.id, sub: "", type: "جاهز", availability: "متوفر", stock: 0, featured: false, hidden: false, desc: "", customizable: { name: false, phrase: false, wrap: true } };
  const [edit, setEdit] = useState(null);
  const save = () => {
    if (edit.id) setProducts(products.map((p) => (p.id === edit.id ? edit : p)));
    else setProducts([{ ...edit, id: "p" + uid() }, ...products]);
    setEdit(null);
  };
  const cat = edit ? categories.find((c) => c.id === edit.categoryId) : null;
  return (
    <div className="card pad">
      <div className="between"><b>إدارة المنتجات ({products.length})</b><button className="btn primary sm" onClick={() => setEdit({ ...empty })}>+ منتج جديد</button></div>
      <div className="table-wrap">
        <table className="table" style={{ marginTop: 10 }}>
          <thead><tr><th>المنتج</th><th>السعر</th><th>النوع</th><th>المخزون</th><th></th></tr></thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} style={{ opacity: p.hidden ? 0.5 : 1 }}>
                <td className="small"><b>{p.name}</b><div className="muted">{categories.find((c) => c.id === p.categoryId)?.name} · {p.sub}</div></td>
                <td className="small">{SAR(p.price)}</td>
                <td className="small">{p.type}</td>
                <td className="small">{p.stock ?? "حسب الطلب"}</td>
                <td>
                  <div className="row" style={{ flexWrap: "nowrap" }}>
                    <button className="btn sm" onClick={() => setEdit({ ...p })}>تعديل</button>
                    <button className="btn sm" onClick={() => setProducts(products.map((x) => (x.id === p.id ? { ...x, hidden: !x.hidden } : x)))}>{p.hidden ? "إظهار" : "إخفاء"}</button>
                    <button className="btn sm danger" onClick={() => window.confirm("حذف المنتج نهائيًا؟") && setProducts(products.filter((x) => x.id !== p.id))}>حذف</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal open={!!edit} onClose={() => setEdit(null)} title={edit?.id ? "تعديل منتج" : "منتج جديد"}>
        {edit && (
          <>
            <Field label="اسم المنتج"><input className="input" value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></Field>
            <Field label="صور المنتج" hint="أول صورة هي الرئيسية — تُضغط تلقائيًا لتوفير المساحة"><ImgUploader multiple images={edit.images || []} onChange={(imgs) => setEdit({ ...edit, images: imgs })} /></Field>
            <div className="grid cols-2">
              <Field label="السعر (ر.س)"><input type="number" className="input" value={edit.price} onChange={(e) => setEdit({ ...edit, price: +e.target.value })} /></Field>
              <Field label="النوع">
                <select className="input" value={edit.type} onChange={(e) => setEdit({ ...edit, type: e.target.value, availability: e.target.value === "مخصص" ? "حسب الطلب" : "متوفر", stock: e.target.value === "مخصص" ? null : edit.stock ?? 0 })}>
                  <option>جاهز</option><option>مخصص</option>
                </select>
              </Field>
            </div>
            <div className="grid cols-2">
              <Field label="التصنيف">
                <select className="input" value={edit.categoryId} onChange={(e) => setEdit({ ...edit, categoryId: e.target.value, sub: "" })}>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </Field>
              <Field label="التصنيف الفرعي">
                <select className="input" value={edit.sub} onChange={(e) => setEdit({ ...edit, sub: e.target.value })}>
                  <option value="">—</option>
                  {cat?.subs.map((s) => <option key={s}>{s}</option>)}
                </select>
              </Field>
            </div>
            {edit.type === "جاهز" && <Field label="المخزون"><input type="number" className="input" value={edit.stock ?? 0} onChange={(e) => setEdit({ ...edit, stock: +e.target.value })} /></Field>}
            <Field label="الوصف"><textarea className="input" value={edit.desc} onChange={(e) => setEdit({ ...edit, desc: e.target.value })} /></Field>
            <Field label="خيارات التخصيص المتاحة">
              <div className="row">
                {[["name", "اسم"], ["phrase", "عبارة"], ["wrap", "تغليف"]].map(([k, l]) => (
                  <label key={k} className="chip" style={{ cursor: "pointer" }}>
                    <input type="checkbox" checked={edit.customizable[k]} onChange={(e) => setEdit({ ...edit, customizable: { ...edit.customizable, [k]: e.target.checked } })} /> {l}
                  </label>
                ))}
                <label className="chip" style={{ cursor: "pointer" }}>
                  <input type="checkbox" checked={edit.featured} onChange={(e) => setEdit({ ...edit, featured: e.target.checked })} /> منتج مميز
                </label>
              </div>
            </Field>
            <button className="btn primary block" disabled={!edit.name} onClick={save}>حفظ المنتج</button>
          </>
        )}
      </Modal>
    </div>
  );
}

function AdminCategories({ categories, setCategories }) {
  const [edit, setEdit] = useState(null);
  const sorted = [...categories].sort((a, b) => a.order - b.order);
  const move = (id, dir) => {
    const idx = sorted.findIndex((c) => c.id === id);
    const other = sorted[idx + dir];
    if (!other) return;
    setCategories(categories.map((c) => (c.id === id ? { ...c, order: other.order } : c.id === other.id ? { ...c, order: sorted[idx].order } : c)));
  };
  const save = () => {
    const subs = edit.subsText.split("،").map((s) => s.trim()).filter(Boolean);
    if (edit.id) setCategories(categories.map((c) => (c.id === edit.id ? { ...c, name: edit.name, subs } : c)));
    else setCategories([...categories, { id: "cat" + uid(), name: edit.name, subs, order: categories.length + 1 }]);
    setEdit(null);
  };
  return (
    <div className="card pad">
      <div className="between"><b>إدارة التصنيفات</b><button className="btn primary sm" onClick={() => setEdit({ name: "", subsText: "" })}>+ تصنيف جديد</button></div>
      {sorted.map((c, i) => (
        <div key={c.id} className="card pad" style={{ marginTop: 10 }}>
          <div className="between">
            <div><b className="small">{c.name}</b><div className="small muted">{c.subs.join("، ")}</div></div>
            <div className="row" style={{ flexWrap: "nowrap" }}>
              <button className="btn sm" disabled={i === 0} onClick={() => move(c.id, -1)}>↑</button>
              <button className="btn sm" disabled={i === sorted.length - 1} onClick={() => move(c.id, 1)}>↓</button>
              <button className="btn sm" onClick={() => setEdit({ id: c.id, name: c.name, subsText: c.subs.join("، ") })}>تعديل</button>
              <button className="btn sm danger" onClick={() => window.confirm("حذف التصنيف؟") && setCategories(categories.filter((x) => x.id !== c.id))}>حذف</button>
            </div>
          </div>
        </div>
      ))}
      <Modal open={!!edit} onClose={() => setEdit(null)} title={edit?.id ? "تعديل تصنيف" : "تصنيف جديد"}>
        {edit && (
          <>
            <Field label="اسم التصنيف"><input className="input" value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></Field>
            <Field label="الأقسام الفرعية" hint="افصلي بينها بفاصلة (،)"><textarea className="input" value={edit.subsText} onChange={(e) => setEdit({ ...edit, subsText: e.target.value })} /></Field>
            <button className="btn primary block" disabled={!edit.name} onClick={save}>حفظ</button>
          </>
        )}
      </Modal>
    </div>
  );
}

function AdminCoupons({ coupons, setCoupons }) {
  const [edit, setEdit] = useState(null);
  const save = () => {
    if (edit.id) setCoupons(coupons.map((c) => (c.id === edit.id ? edit : c)));
    else setCoupons([...coupons, { ...edit, id: "c" + uid(), uses: 0 }]);
    setEdit(null);
  };
  return (
    <div className="card pad">
      <div className="between"><b>أكواد الخصم</b><button className="btn primary sm" onClick={() => setEdit({ code: "", type: "percent", value: 10, minTotal: 0, active: true })}>+ كود جديد</button></div>
      <div className="table-wrap">
        <table className="table" style={{ marginTop: 10 }}>
          <thead><tr><th>الكود</th><th>الخصم</th><th>الحد الأدنى</th><th>الاستخدام</th><th></th></tr></thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id} style={{ opacity: c.active ? 1 : 0.5 }}>
                <td><b className="small">{c.code}</b></td>
                <td className="small">{c.type === "percent" ? c.value + "%" : SAR(c.value)}</td>
                <td className="small">{c.minTotal ? SAR(c.minTotal) : "—"}</td>
                <td className="small">{c.uses} مرة</td>
                <td>
                  <div className="row" style={{ flexWrap: "nowrap" }}>
                    <button className="btn sm" onClick={() => setEdit({ ...c })}>تعديل</button>
                    <button className="btn sm" onClick={() => setCoupons(coupons.map((x) => (x.id === c.id ? { ...x, active: !x.active } : x)))}>{c.active ? "إيقاف" : "تفعيل"}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal open={!!edit} onClose={() => setEdit(null)} title="كود خصم">
        {edit && (
          <>
            <Field label="الكود"><input className="input" value={edit.code} onChange={(e) => setEdit({ ...edit, code: e.target.value.toUpperCase() })} /></Field>
            <div className="grid cols-2">
              <Field label="نوع الخصم">
                <select className="input" value={edit.type} onChange={(e) => setEdit({ ...edit, type: e.target.value })}>
                  <option value="percent">نسبة %</option><option value="fixed">مبلغ ثابت</option>
                </select>
              </Field>
              <Field label="القيمة"><input type="number" className="input" value={edit.value} onChange={(e) => setEdit({ ...edit, value: +e.target.value })} /></Field>
            </div>
            <Field label="الحد الأدنى للطلب (ر.س)"><input type="number" className="input" value={edit.minTotal} onChange={(e) => setEdit({ ...edit, minTotal: +e.target.value })} /></Field>
            <button className="btn primary block" disabled={!edit.code} onClick={save}>حفظ الكود</button>
          </>
        )}
      </Modal>
    </div>
  );
}

function AdminGallery({ gallery, setGallery, categories }) {
  const [edit, setEdit] = useState(null);
  const save = () => {
    if (edit.id) setGallery(gallery.map((g) => (g.id === edit.id ? edit : g)));
    else setGallery([{ ...edit, id: "g" + uid() }, ...gallery]);
    setEdit(null);
  };
  return (
    <div className="card pad">
      <div className="between"><b>إدارة معرض الأعمال ({gallery.length})</b><button className="btn primary sm" onClick={() => setEdit({ title: "", categoryId: categories[0]?.id, occasion: OCCASIONS[0], desc: "" })}>+ عمل جديد</button></div>
      <div className="grid cols-2 md-3" style={{ marginTop: 12 }}>
        {gallery.map((g) => (
          <div key={g.id} className="card">
            <Pic src={g.image} label="صورة العمل" />
            <div className="pad">
              <b className="small">{g.title}</b>
              <div className="row" style={{ margin: "6px 0" }}><span className="badge">{g.occasion}</span></div>
              <div className="row">
                <button className="btn sm" style={{ flex: 1 }} onClick={() => setEdit({ ...g })}>تعديل</button>
                <button className="btn sm danger" onClick={() => window.confirm("حذف العمل؟") && setGallery(gallery.filter((x) => x.id !== g.id))}>حذف</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Modal open={!!edit} onClose={() => setEdit(null)} title="عمل في المعرض">
        {edit && (
          <>
            <Field label="عنوان العمل"><input className="input" value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} /></Field>
            <Field label="الصورة"><ImgUploader images={edit.image ? [edit.image] : []} onChange={(a) => setEdit({ ...edit, image: a[0] || null })} /></Field>
            <div className="grid cols-2">
              <Field label="النوع">
                <select className="input" value={edit.categoryId} onChange={(e) => setEdit({ ...edit, categoryId: e.target.value })}>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </Field>
              <Field label="المناسبة">
                <select className="input" value={edit.occasion} onChange={(e) => setEdit({ ...edit, occasion: e.target.value })}>
                  {OCCASIONS.map((o) => <option key={o}>{o}</option>)}
                </select>
              </Field>
            </div>
            <Field label="وصف مختصر"><textarea className="input" value={edit.desc} onChange={(e) => setEdit({ ...edit, desc: e.target.value })} /></Field>
            <button className="btn primary block" disabled={!edit.title} onClick={save}>حفظ</button>
          </>
        )}
      </Modal>
    </div>
  );
}

/* تبويب نصوص الموقع: تعديل كل الكلام الظاهر للزائرات، مع حفظ تلقائي */
const TEXT_GROUPS = [
  {
    title: "🔔 الشريط العلوي",
    hint: "اكتبي {المبلغ} في المكان الذي تريدين أن يظهر فيه حد الشحن المجاني تلقائيًا.",
    fields: [["announce", "نص الشريط العلوي", true]],
  },
  {
    title: "🏠 الواجهة الرئيسية (أعلى الصفحة)",
    hint: "في العنوان الكبير: ضعي ~ قبل الكلمة لتظليلها، و * وحدها بين الكلمات لسطر جديد. في الوصف: ضعي الكلمة بين نجمتين *هكذا* ليظهر تحتها خط مرسوم.",
    fields: [
      ["heroBadge1", "الشارة الأولى"],
      ["heroBadge2", "الشارة الثانية (تظهر أيضًا في صفحة عن المتجر)"],
      ["heroTitle", "العنوان الكبير"],
      ["heroSub", "الوصف تحت العنوان", true],
      ["heroCtaShop", "زر التسوق"],
      ["heroCtaCustom", "زر الطلب المخصص"],
      ["heroScrollCue", "عبارة التمرير للأسفل"],
    ],
  },
  {
    title: "🎞 الشريطان المتحركان",
    hint: "افصلي بين العبارات بعلامة · وستوضع الأيقونات بينها تلقائيًا.",
    fields: [
      ["marquee1", "الشريط الأول (بعد الواجهة)", true],
      ["marquee2", "الشريط الثاني (قبل المعرض)", true],
    ],
  },
  {
    title: "🗂 قسم التصنيفات",
    fields: [["catsEyebrow", "السطر الصغير"], ["catsTitle", "العنوان"]],
  },
  {
    title: "🧶 قسم المنتجات المميزة",
    fields: [["featEyebrow", "السطر الصغير"], ["featTitle", "العنوان"], ["featLink", "رابط عرض الكل"]],
  },
  {
    title: "✨ قسم الطلب المخصص",
    fields: [
      ["customEyebrow", "السطر الصغير"],
      ["customTitle", "العنوان", true],
      ["customSub", "الوصف", true],
      ["customCta", "زر البدء"],
    ],
  },
  {
    title: "🎁 قسم ابني هديتك",
    fields: [["builderEyebrow", "السطر الصغير"], ["builderTitle", "العنوان"], ["builderSub", "الوصف", true]],
  },
  {
    title: "🖼 قسم المعرض",
    fields: [["galEyebrow", "السطر الصغير"], ["galTitle", "العنوان"], ["galLink", "رابط كل الأعمال"], ["galHint", "تلميح السحب"]],
  },
  {
    title: "💬 قسم يقولون عنا",
    fields: [
      ["revEyebrow", "السطر الصغير"], ["revTitle", "العنوان"],
      ["rev1Name", "الاسم الأول"], ["rev1Text", "الرسالة الأولى", true],
      ["rev2Name", "الاسم الثاني"], ["rev2Text", "الرسالة الثانية", true],
      ["rev3Name", "الاسم الثالث"], ["rev3Text", "الرسالة الثالثة", true],
    ],
  },
  {
    title: "🎀 الختام (أسفل الرئيسية)",
    fields: [["finaleTitle", "العنوان", true], ["finaleCta", "زر الطلب"], ["finaleWhats", "زر واتساب"]],
  },
  {
    title: "📄 صفحة عن المتجر",
    fields: [
      ["aboutTitle", "العنوان"], ["aboutIntro", "المقدمة", true],
      ["aboutCard1Title", "البطاقة 1 — العنوان"], ["aboutCard1Text", "البطاقة 1 — النص", true],
      ["aboutCard2Title", "البطاقة 2 — العنوان"], ["aboutCard2Text", "البطاقة 2 — النص", true],
      ["aboutCard3Title", "البطاقة 3 — العنوان"], ["aboutCard3Text", "البطاقة 3 — النص", true],
    ],
  },
  {
    title: "☎️ صفحة تواصلي معنا",
    fields: [["contactTitle", "العنوان"], ["contactIntro", "المقدمة", true]],
  },
  {
    title: "⬇️ الفوتر (أسفل الموقع)",
    fields: [
      ["footerTagline", "الوصف المختصر", true],
      ["footerHand", "العبارة بخط اليد"],
      ["footerLinksTitle", "عنوان عمود الروابط"],
      ["footerContactTitle", "عنوان عمود التواصل"],
      ["footerThanks", "شريط الشكر", true],
    ],
  },
];

function AdminTexts({ texts, setTexts }) {
  const set = (k, v) => setTexts({ ...texts, [k]: v });
  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div className="notice">
        📝 عدّلي أي نص وسيُحفظ تلقائيًا ويظهر مباشرة في الموقع.
        رموز التنسيق: <b>*كلمة*</b> للتظليل · <b>~كلمة~</b> لخط اليد · <b>|</b> لسطر جديد.
      </div>
      {TEXT_GROUPS.map((g) => (
        <div key={g.title} className="card pad">
          <b>{g.title}</b>
          {g.hint && <p className="small muted" style={{ margin: "6px 0 0" }}>{g.hint}</p>}
          <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
            {g.fields.map(([k, label, long]) => (
              <label key={k} className="small" style={{ display: "grid", gap: 4 }}>
                <span className="muted">{label}</span>
                {long
                  ? <textarea className="input" rows={2} value={texts[k]} onChange={(e) => set(k, e.target.value)} />
                  : <input className="input" value={texts[k]} onChange={(e) => set(k, e.target.value)} />}
              </label>
            ))}
          </div>
        </div>
      ))}
      <div className="card pad">
        <b>↩️ استرجاع النصوص الأصلية</b>
        <p className="small muted" style={{ margin: "6px 0 10px" }}>يعيد كل نصوص الموقع إلى الصياغة الافتراضية — لا يؤثر على المنتجات أو الطلبات أو الإعدادات.</p>
        <button className="btn sm" onClick={() => { if (window.confirm("متأكدة من استرجاع كل النصوص الأصلية؟")) setTexts(initialTexts); }}>استرجاع الكل</button>
      </div>
    </div>
  );
}

function AdminSettings({ settings, setSettings, onReset }) {
  const [s, setS] = useState(settings);
  const [saved, setSaved] = useState(false);
  const save = () => { setSettings(s); setSaved(true); setTimeout(() => setSaved(false), 2000); };
  return (
    <div className="card pad">
      <b>إعدادات المتجر</b>
      <div className="grid md-2" style={{ marginTop: 10 }}>
        <div>
          <Field label="اسم المتجر"><input className="input" value={s.storeName} onChange={(e) => setS({ ...s, storeName: e.target.value })} /></Field>
          <Field label="رقم واتساب"><input className="input" value={s.whatsapp} onChange={(e) => setS({ ...s, whatsapp: e.target.value })} /></Field>
          <Field label="حساب إنستغرام"><input className="input" value={s.instagram} onChange={(e) => setS({ ...s, instagram: e.target.value })} /></Field>
          <Field label="مدة تنفيذ الطلبات المخصصة"><textarea className="input" value={s.customLeadTime} onChange={(e) => setS({ ...s, customLeadTime: e.target.value })} /></Field>
          <Field label="سياسة الإلغاء والاستبدال"><textarea className="input" value={s.cancelPolicy} onChange={(e) => setS({ ...s, cancelPolicy: e.target.value })} /></Field>
        </div>
        <div>
          <div className="grid cols-2">
            <Field label="رسوم الشحن (ر.س)"><input type="number" className="input" value={s.shippingFee} onChange={(e) => setS({ ...s, shippingFee: +e.target.value })} /></Field>
            <Field label="شحن مجاني فوق"><input type="number" className="input" value={s.freeShippingOver} onChange={(e) => setS({ ...s, freeShippingOver: +e.target.value })} /></Field>
          </div>
          <Field label="نسبة الضريبة %"><input type="number" className="input" value={s.taxPercent} onChange={(e) => setS({ ...s, taxPercent: +e.target.value })} /></Field>
          <Field label="الأماكن المتبقية للطلبات المخصصة هذا الأسبوع" hint="تظهر للعميلات كاستعجال صادق — حدّثيها أسبوعيًا، وصفر يخفيها">
            <input type="number" className="input" min="0" value={s.weeklySlots ?? 3} onChange={(e) => setS({ ...s, weeklySlots: Math.max(0, +e.target.value) })} />
          </Field>
          <Field label="طرق الدفع المفعلة">
            <div className="row">
              {[["mada", "مدى"], ["applePay", "Apple Pay"], ["cards", "بطاقات"], ["stcPay", "STC Pay"], ["bank", "تحويل بنكي"], ["tabby", "تابي (قريبًا)"], ["tamara", "تمارا (قريبًا)"]].map(([k, l]) => (
                <label key={k} className="chip" style={{ cursor: "pointer" }}>
                  <input type="checkbox" checked={s.payments[k]} onChange={(e) => setS({ ...s, payments: { ...s.payments, [k]: e.target.checked } })} /> {l}
                </label>
              ))}
            </div>
          </Field>
          <Field label="شركات الشحن">
            <div className="row">
              {[["local", "مندوب محلي"], ["aramex", "Aramex (قريبًا)"], ["smsa", "SMSA (قريبًا)"]].map(([k, l]) => (
                <label key={k} className="chip" style={{ cursor: "pointer" }}>
                  <input type="checkbox" checked={s.shippingCompanies[k]} onChange={(e) => setS({ ...s, shippingCompanies: { ...s.shippingCompanies, [k]: e.target.checked } })} /> {l}
                </label>
              ))}
            </div>
          </Field>
        </div>
      </div>
      <button className="btn primary" onClick={save}>{saved ? "✓ تم الحفظ" : "حفظ الإعدادات"}</button>
      <div className="notice" style={{ marginTop: 18 }}>
        💾 كل بياناتك (المنتجات، الصور، الطلبات، الإعدادات) تُحفظ تلقائيًا على هذا الجهاز وتبقى بعد إغلاق الصفحة.
        <div style={{ marginTop: 10 }}>
          <button className="btn sm danger" onClick={() => window.confirm("متأكدة؟ سيُمسح كل شيء ويرجع الموقع لبيانات العرض التجريبي.") && onReset()}>🗑 مسح البيانات والرجوع للنسخة التجريبية</button>
        </div>
      </div>
    </div>
  );
}

/* ============================ App Shell ============================ */
export default function App() {
  const [route, setRoute] = useState({ page: "home" });
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);
  const [gallery, setGallery] = useState(initialGallery);
  const [orders, setOrders] = useState(initialOrders);
  const [coupons, setCoupons] = useState(initialCoupons);
  const [reviews, setReviews] = useState(initialReviews);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [settings, setSettings] = useState(initialSettings);
  const [texts, setTexts] = useState(initialTexts);
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);
  const [nextNum, setNextNum] = useState(1044);
  const [loaded, setLoaded] = useState(false);

  /* تحميل البيانات المحفوظة عند فتح الموقع */
  useEffect(() => {
    (async () => {
      const d = await dbLoad();
      if (d) {
        d.products && setProducts(d.products);
        d.categories && setCategories(d.categories);
        d.gallery && setGallery(d.gallery);
        d.orders && setOrders(d.orders);
        d.coupons && setCoupons(d.coupons.some((c) => c.code === "SHUKRAN10") ? d.coupons : [...d.coupons, { id: "c3", code: "SHUKRAN10", type: "percent", value: 10, minTotal: 0, active: true, uses: 0 }]);
        d.reviews && setReviews(d.reviews);
        d.notifications && setNotifications(d.notifications);
        if (d.settings) {
          const s = { ...initialSettings, ...d.settings };
          if (!s.cancelPolicy.includes("الرقمي")) s.cancelPolicy += " المنتج الرقمي لا يمكن استرجاعه ولا استبداله بعد الشراء.";
          setSettings(s);
        }
        d.texts && setTexts({ ...initialTexts, ...d.texts });
        d.nextNum && setNextNum(d.nextNum);
      }
      setLoaded(true);
    })();
  }, []);

  /* حفظ تلقائي (مع تأخير بسيط لتجميع التعديلات) */
  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(() => dbSave({ products, categories, gallery, orders, coupons, reviews, notifications, settings, texts, nextNum }), 700);
    return () => clearTimeout(t);
  }, [loaded, products, categories, gallery, orders, coupons, reviews, notifications, settings, texts, nextNum]);

  const resetAll = async () => { await dbClear(); window.location.reload(); };

  const [wipe, setWipe] = useState(0);
  const wipeTimer = React.useRef(null);
  const go = (r) => {
    const instant = window.matchMedia("(prefers-reduced-motion: reduce)").matches || r.page === route.page;
    if (instant) { setRoute(r); window.scrollTo(0, 0); return; }
    clearTimeout(wipeTimer.current);
    setWipe((w) => w + 1);
    setTimeout(() => { setRoute(r); window.scrollTo(0, 0); }, 560);
    wipeTimer.current = setTimeout(() => setWipe(0), 1300); /* إزالة الخيط نهائيًا من الصفحة */
  };

  /* إخفاء الهيدر عند النزول وإظهاره عند الصعود */
  const [hideHeader, setHideHeader] = useState(false);
  useEffect(() => {
    let lastY = window.scrollY, ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y > lastY + 8 && y > 130) setHideHeader(true);      /* نازلة → اختفِ */
        else if (y < lastY - 8 || y < 60) setHideHeader(false); /* طالعة → اظهر */
        lastY = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* أثر خيوط يتبع المؤشر — سطح المكتب فقط، يحترم تقليل الحركة */
  useEffect(() => {
    if (window.matchMedia("(pointer:coarse)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let last = 0;
    const h = (e) => {
      const now = Date.now();
      if (now - last < 70) return;
      last = now;
      const d = document.createElement("span");
      d.className = "trail-dot";
      const s = 5 + Math.random() * 8;
      d.style.width = d.style.height = s + "px";
      d.style.left = e.clientX + "px";
      d.style.top = e.clientY + "px";
      d.style.background = ["#8FB7B3", "#F6C7AD", "#5C9490", "#E8A882"][(Math.random() * 4) | 0];
      document.body.appendChild(d);
      setTimeout(() => d.remove(), 760);
    };
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);
  const toggleFav = (id) => setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  const addToCart = (p, qty, custom) => setCart((c) => [...c, { productId: p.id, name: p.name, price: p.price, image: p.images?.[0] || null, qty, custom }]);
  const addReview = (r) => setReviews((rs) => [r, ...rs]);

  const createOrder = (o) => {
    const id = `ORD-${nextNum}`;
    setNextNum(nextNum + 1);
    const order = { id, createdAt: today(), status: "new", adminNotes: "", history: [{ status: "new", at: today() }], ...o };
    setOrders((os) => [order, ...os]);
    setNotifications((ns) => [{ id: uid(), at: today(), text: `طلب جديد ${id} من ${o.customer.name}`, read: false }, ...ns]);
    return id;
  };

  const NAV = [
    ["home", "الرئيسية"], ["shop", "المتجر"], ["wizard", "طلب مخصص"], ["gallery", "معرض الأعمال"], ["admin", "لوحة التحكم"],
  ];

  if (!loaded) {
    return (
      <div className="app" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", flexDirection: "column", gap: 14 }}>
        <style>{CSS}</style>
        <span style={{ animation: "spinSlow 3s linear infinite", display: "inline-block" }}><LogoMark size={72} /></span>
        <b className="hand" style={{ color: "var(--teal-dark)" }}>جاري تجهيز الكون…</b>
      </div>
    );
  }

  return (
    <div className="app">
      <style>{CSS}</style>
      <div className="grain no-print" aria-hidden="true" />
      {wipe > 0 && (
        <div key={wipe} className="thread-wipe" aria-hidden="true">
          <div className="panel" />
          <svg viewBox="0 0 100 100" preserveAspectRatio="none">
            <path className="thread" pathLength="100" d="M 104 46 C 88 38, 76 60, 62 52 C 50 45, 42 60, 30 53 C 20 47, 10 56, -4 50" />
          </svg>
          <span className="yarn-pop"><Art name="yarn" size={100} /></span>
        </div>
      )}
      <header className={`header no-print ${hideHeader ? "hide" : ""}`}>
        <div className="announce">
          {texts.announce.split("{المبلغ}").map((part, i, arr) => (
            <React.Fragment key={i}>{part}{i < arr.length - 1 && <b>{SAR(settings.freeShippingOver)}</b>}</React.Fragment>
          ))}
        </div>
        <div className="container">
          <div className="header-row">
            <div className="logo" style={{ cursor: "pointer" }} onClick={() => go({ page: "home" })}>
              <Logo />
            </div>
            <span className="spacer" />
            <button className="icon-btn" onClick={() => go({ page: "account" })} aria-label="حسابي">👤</button>
            <button className="icon-btn" onClick={() => go({ page: "cart" })} aria-label="السلة">
              🛒{cart.length > 0 && <span key={cart.length} className="count">{cart.length}</span>}
            </button>
          </div>
          <nav className="nav">
            {NAV.map(([k, l]) => (
              <button key={k} className={route.page === k ? "active" : ""} onClick={() => go({ page: k })}>{l}</button>
            ))}
          </nav>
        </div>
      </header>

      <main style={{ paddingBottom: 30 }}>
        {route.page === "home" && <Home products={products} categories={categories} gallery={gallery} settings={settings} texts={texts} go={go} />}
        {route.page === "shop" && <Shop products={products} categories={categories} favorites={favorites} toggleFav={toggleFav} go={go} initCat={route.cat} />}
        {route.page === "product" && <ProductDetail product={products.find((p) => p.id === route.id)} categories={categories} reviews={reviews} addReview={addReview} addToCart={addToCart} go={go} settings={settings} />}
        {route.page === "wizard" && <Wizard key={JSON.stringify(route.prefill || {})} categories={categories} products={products} gallery={gallery} settings={settings} prefill={route.prefill} createOrder={createOrder} go={go} />}
        {route.page === "gallery" && <Gallery gallery={gallery} categories={categories} go={go} />}
        {route.page === "about" && <About go={go} settings={settings} texts={texts} />}
        {route.page === "contact" && <Contact settings={settings} texts={texts} />}
        {route.page === "cart" && <CartPage cart={cart} setCart={setCart} coupons={coupons} settings={settings} go={go} createOrder={createOrder} />}
        {route.page === "track" && <Track orders={orders} initId={route.orderId} />}
        {route.page === "account" && <Account user={user} setUser={setUser} orders={orders} favorites={favorites} products={products} go={go} />}
        {route.page === "admin" && (
          <Admin
            orders={orders} setOrders={setOrders}
            products={products} setProducts={setProducts}
            categories={categories} setCategories={setCategories}
            coupons={coupons} setCoupons={setCoupons}
            gallery={gallery} setGallery={setGallery}
            notifications={notifications} setNotifications={setNotifications}
            settings={settings} setSettings={setSettings}
            texts={texts} setTexts={setTexts}
            onReset={resetAll}
          />
        )}
      </main>

      {["product", "cart", "shop", "wizard"].includes(route.page) && <WhatsFab settings={settings} />}

      <footer className="footer no-print">
        <div className="container">
          <div className="grid md-3">
            <div>
              <div className="row"><LogoMark size={54} light /><LogoScript height={46} light /></div>
              <p className="small" style={{ margin: "10px 0 0" }}>{texts.footerTagline}</p>
              <p className="small hand" style={{ margin: "8px 0 0", color: "var(--peach)" }}>{texts.footerHand}</p>
            </div>
            <div>
              <b style={{ color: "var(--text)" }}>{texts.footerLinksTitle}</b>
              <div className="small" style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 4 }}>
                <a style={{ cursor: "pointer" }} onClick={() => go({ page: "track" })}>تتبع الطلب</a>
                <a style={{ cursor: "pointer" }} onClick={() => go({ page: "about" })}>عن المتجر والسياسات</a>
                <a style={{ cursor: "pointer" }} onClick={() => go({ page: "contact" })}>تواصلي معنا</a>
              </div>
            </div>
            <div>
              <b style={{ color: "var(--text)" }}>{texts.footerContactTitle}</b>
              <div className="small" style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 4 }}>
                <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer">💬 واتساب: {settings.whatsapp}</a>
                <a href={`https://instagram.com/${settings.instagram}`} target="_blank" rel="noreferrer">📷 إنستغرام: @{settings.instagram}</a>
              </div>
            </div>
          </div>
          <div className="thanks-strip" style={{ marginTop: 20, background: "rgba(255,255,255,.12)", color: "#fff" }}>
            {texts.footerThanks}
          </div>
          <p className="small" style={{ textAlign: "center", marginTop: 14 }}>© {new Date().getFullYear()} {settings.storeName} — جميع الحقوق محفوظة</p>
        </div>
      </footer>
    </div>
  );
}
