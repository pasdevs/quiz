import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_URL = import.meta.env.VITE_API_LEAD_URL;

// ============================================================
// GLOBAL CSS — v5 Gold Theme
// ============================================================
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --bg:#0D0F1A; --bg2:#13162A; --bg3:#1C2038; --card:#1E2240;
    --border:rgba(255,255,255,.08); --border2:rgba(255,255,255,.14);
    --text:#F0EDE8; --muted:rgba(240,237,232,.5); --muted2:rgba(240,237,232,.28);
    --gold:#F5C842; --gold2:rgba(245,200,66,.15); --gold3:rgba(245,200,66,.08);
    --accent:#7C6EF5; --accent2:rgba(124,110,245,.18);
    --green:#34D399; --green2:rgba(52,211,153,.15);
    --coral:#F87171;
  }

  body {
    font-family: 'Plus Jakarta Sans', sans-serif !important;
    background: var(--bg) !important;
    color: var(--text);
    min-height: 100vh;
    overflow-x: hidden;
  }
  #root { font-family: 'Plus Jakarta Sans', sans-serif; }

  @keyframes qv5-float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes qv5-fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes qv5-shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes qv5-spin    { to{transform:rotate(360deg)} }
  @keyframes qv5-popIn   { 0%{transform:scale(.85);opacity:0} 70%{transform:scale(1.05)} 100%{transform:scale(1);opacity:1} }
  @keyframes qv5-pulse   { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }
  @keyframes qv5-fall    { 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(100vh) rotate(720deg);opacity:0} }

  .qv5-float   { animation: qv5-float 3s ease-in-out infinite; }
  .qv5-fadeUp  { animation: qv5-fadeUp .45s ease both; }
  .qv5-popin   { animation: qv5-popIn .5s ease both; }
  .qv5-pulse   { animation: qv5-pulse 1.5s ease infinite; }
  .qv5-spinner { animation: qv5-spin 2s linear infinite; }
  .qv5-confetti-piece { position:absolute; top:-10px; animation:qv5-fall 3s ease-in forwards; }

  /* Option buttons */
  .qv5-opt {
    all: unset;
    box-sizing: border-box !important;
    display: flex !important;
    align-items: center !important;
    gap: 16px !important;
    background: var(--card) !important;
    border: 2px solid var(--border) !important;
    border-radius: 18px !important;
    padding: 16px 20px !important;
    cursor: pointer !important;
    transition: .22s !important;
    text-align: left !important;
    font-family: 'Plus Jakarta Sans', sans-serif !important;
    width: 100% !important;
  }
  .qv5-opt:hover { border-color:var(--border2) !important; background:var(--bg3) !important; transform:translateX(4px) !important; }
  .qv5-opt.chosen { border-color:var(--gold) !important; background:var(--gold3) !important; }
  .qv5-opt.chosen .qv5-opt-icon { background:var(--gold) !important; color:#0D0F1A !important; }
  .qv5-opt-icon { width:44px; height:44px; border-radius:14px; background:var(--bg3); display:flex; align-items:center; justify-content:center; font-size:20px; flex-shrink:0; transition:.2s; }
  .qv5-opt-check { width:22px; height:22px; border-radius:50%; border:2px solid var(--border2); flex-shrink:0; display:flex; align-items:center; justify-content:center; transition:.2s; font-size:12px; }
  .qv5-opt.chosen .qv5-opt-check { background:var(--gold) !important; border-color:var(--gold) !important; color:#0D0F1A !important; }

  /* Capture inputs */
  .qv5-input {
    all: unset;
    box-sizing: border-box !important;
    display: block !important;
    width: 100% !important;
    background: var(--card) !important;
    border: 1.5px solid var(--border2) !important;
    border-radius: 14px !important;
    padding: 14px 18px !important;
    font-size: 15px !important;
    font-family: 'Plus Jakarta Sans', sans-serif !important;
    color: var(--text) !important;
    transition: .2s !important;
  }
  .qv5-input::placeholder { color: var(--muted2) !important; }
  .qv5-input:focus { border-color:var(--gold) !important; background:var(--bg3) !important; outline:none !important; }

  /* Select */
  .qv5-select {
    all: unset;
    box-sizing: border-box !important;
    display: block !important;
    width: 100% !important;
    background: var(--card) !important;
    border: 1.5px solid var(--border2) !important;
    border-radius: 14px !important;
    padding: 14px 44px 14px 18px !important;
    font-size: 15px !important;
    font-family: 'Plus Jakarta Sans', sans-serif !important;
    color: var(--text) !important;
    transition: .2s !important;
    appearance: none !important;
    -webkit-appearance: none !important;
    cursor: pointer !important;
  }
  .qv5-select:focus { border-color:var(--gold) !important; background:var(--bg3) !important; outline:none !important; }
  .qv5-select.empty { color: var(--muted2) !important; }

  /* Karier tag */
  .qv5-karier-tag { font-size:12px; font-weight:500; padding:5px 12px; border-radius:20px; background:rgba(245,200,66,.1); color:var(--gold); border:1px solid rgba(245,200,66,.2); }

  /* Progress fill */
  .qv5-prog-fill { height:100%; border-radius:4px; background:linear-gradient(90deg,var(--accent),var(--gold)); transition:width .5s cubic-bezier(.4,0,.2,1); }

  /* Other card */
  .qv5-other-card { background:var(--card); border:1.5px solid var(--border); border-radius:18px; padding:18px; transition:.2s; cursor:pointer; }
  .qv5-other-card:hover { border-color:var(--border2); transform:translateY(-2px); }

  @media (max-width:380px) {
    .qv5-opt { padding:12px 14px !important; }
  }
`;

// ============================================================
// FAC
// ============================================================
const FAC = {
  feb:   { name:'Fak. Ekonomi & Bisnis',             color:'#38BDF8', short:'FEB' },
  fisip: { name:'Fak. Ilmu Sosial & Ilmu Politik',   color:'#A78BFA', short:'FISIP' },
  ft:    { name:'Fak. Teknik',                       color:'#34D399', short:'F.Teknik' },
  fkip:  { name:'Fak. Keguruan & Ilmu Pendidikan',  color:'#FB923C', short:'FKIP' },
  fiss:  { name:'Fak. Ilmu Seni & Sastra',           color:'#F472B6', short:'FISS' },
  hukum: { name:'Fak. Hukum',                       color:'#60A5FA', short:'F.Hukum' },
  fk:    { name:'Fak. Kedokteran',                  color:'#F87171', short:'F.Kedokteran' },
};

// ============================================================
// BIAYA & SOCIAL PROOF
// ============================================================
const BIAYA = {
  manajemen:'Rp 7,54 jt', admbisnis:'Rp 6,38 jt', akuntansi:'Rp 7,54 jt',
  ekopem:'Rp 7,54 jt', bisdig:'Rp 5,15 jt', admpublik:'Rp 6,95 jt',
  kessos:'Rp 6,39 jt', ilkom:'Rp 7,22 jt', hi:'Rp 6,84 jt',
  tekind:'Rp 7,68 jt', tekinfo:'Rp 7,70 jt', tekmesin:'Rp 7,92 jt',
  tekpangan:'Rp 8,06 jt', teklngk:'Rp 7,48 jt', pwk:'Rp 7,59 jt',
  pendmat:'Rp 3,82 jt', pendbio:'Rp 3,90 jt', pendeko:'Rp 3,85 jt',
  pendbindo:'Rp 3,98 jt', pendppkn:'Rp 3,82 jt', pgsd:'Rp 3,88 jt',
  dkv:'Rp 6,90 jt', fotografi:'Rp 6,78 jt', senimus:'Rp 6,35 jt',
  sasinggris:'Rp 6,35 jt', hukum:'Rp 9,10 jt', kedokteran:'Rp 165 jt',
};

const SOCIAL = {
  manajemen:  '👥 1.200+ mahasiswa aktif · ⭐ Prodi terpopuler di FEB',
  admbisnis:  '👥 480+ mahasiswa aktif · ⭐ Akreditasi Unggul',
  akuntansi:  '👥 890+ mahasiswa aktif · 🏆 #1 pilihan karier finance',
  ekopem:     '👥 320+ mahasiswa aktif · 🌐 Buka karier di BAPPEDA & lembaga internasional',
  bisdig:     '⚡ Prodi terbaru FEB · 📈 Kurikulum paling relevan 2025',
  admpublik:  '👥 550+ mahasiswa aktif · 🏛️ Akreditasi Unggul FISIP',
  kessos:     '💛 Satu-satunya prodi Kessos di Bandung barat · Akreditasi Unggul',
  ilkom:      '👥 720+ mahasiswa aktif · 📱 Alumni di media nasional',
  hi:         '🌐 Pintu menuju karier internasional · Akreditasi Unggul',
  tekind:     '⚙️ Prodi teknik dengan prospek manajemen · Akreditasi Unggul',
  tekinfo:    '💻 Demand tertinggi di industri · Alumni di startup unicorn',
  tekmesin:   '🔧 Fondasi industri manufaktur · Akreditasi Unggul',
  tekpangan:  '🌱 Industri F&B Indonesia tumbuh 12%/tahun · Akreditasi Unggul',
  teklngk:    '🌿 Makin relevan di era ESG · Akreditasi Unggul',
  pwk:        '🏙️ Prodi lintas teknik-sosial yang unik · Akreditasi Unggul',
  pendmat:    '📚 PPPK guru terus dibuka · Akreditasi Unggul',
  pendbio:    '🧬 Karier ganda: guru + industri kesehatan',
  pendeko:    '📊 Trainer korporat makin dicari · Akreditasi Unggul',
  pendbindo:  '✍️ Era content economy butuh penulis berkualitas',
  pendppkn:   '🇮🇩 Karier di sekolah + lembaga pemerintahan',
  pgsd:       '📚 Formasi PPPK guru SD selalu besar tiap tahun',
  dkv:        '🎨 UI/UX designer — gaji tertinggi fresh grad kreatif',
  fotografi:  '📸 Industri konten visual tumbuh 40%/tahun',
  senimus:    '🎵 Lebih dari 5 jalur monetisasi di era streaming',
  sasinggris: '🌍 English proficiency = pembuka semua pintu karier',
  hukum:      '⚖️ Pengacara & notaris — profesi bergengsi dan berkelanjutan',
  kedokteran: '🩺 Dokter selalu dibutuhkan — investasi karier terkuat',
};

// ============================================================
// PRODI (27 prodi, v5 structure, 5 titles corrected)
// ============================================================
const PRODI = [
  { id:'manajemen',  fac:'feb',   title:'Manajemen',                              emoji:'📊', desc:'Belajar cara ngelola bisnis dari A-Z — SDM, keuangan, strategi, sampai marketing. Prodi paling fleksibel buat yang mau jadi bos.',                                              karier:['Manajer Bisnis','Entrepreneur','Brand Manager','Konsultan'],                   irisan:['admbisnis','akuntansi','bisdig','tekind'],   tags:['bisnis','leadership','strategi'],  why:{ galau:'Manajemen kasih kamu fondasi luas — kamu nggak perlu tau spesifik dulu, prodi ini justru bantu kamu explore.', excited:'Kalau kamu excited soal bisnis dan ngelola orang, ini tempatnya.', pressure:'Ini pilihan "aman" yang orang tua biasanya setuju, tapi juga beneran menarik.', ready:'Konfirmasi yang tepat — prospeknya luas dan relevan banget.' },                          scores:{ bisnis:5,sosial:2,sains:1,seni:0,publik:1,teknik:1 } },
  { id:'admbisnis',  fac:'fisip', title:'Ilmu Administrasi Bisnis',               emoji:'🗂️', desc:'Ngerti cara kerja sistem dan organisasi bisnis dari dalam. Cocok buat yang suka "behind the scenes"-nya sebuah perusahaan.',                                                    karier:['HRD Manager','Corporate Affairs','Ops Manager','Konsultan Org.'],             irisan:['manajemen','admpublik','bisdig'],            tags:['organisasi','sistem','HRD'],       why:{ galau:'Adm. Bisnis itu luas tapi terarah — fokus ke sistem, bukan angka doang.', excited:'Kalau kamu excited soal "gimana sih perusahaan bisa jalan?", ini jawabannya.', pressure:'Prodi sosial yang tetap bisnis-oriented — jembatan yang oke antara dua dunia.', ready:'Solid choice kalau kamu udah tau mau kerja di sektor korporat.' },                     scores:{ bisnis:4,sosial:3,sains:0,seni:0,publik:2,teknik:0 } },
  { id:'akuntansi',  fac:'feb',   title:'Akuntansi',                              emoji:'💰', desc:'Nguasain bahasa keuangan bisnis. Dari laporan rugi-laba sampai audit — semua bisnis butuh orang akuntansi.',                                                                    karier:['Akuntan Publik','Auditor','Financial Controller','Tax Consultant'],            irisan:['manajemen','ekopem'],               tags:['keuangan','angka','audit'],        why:{ galau:'Akuntansi itu punya jalur karier yang jelas banget — kalau kamu butuh kepastian, ini bisa tenangkan.', excited:'Kalau angka bikin kamu excited, ini tempat kamu.', pressure:'Profesi akuntan itu bergengsi dan bikin orang tua proud.', ready:'Kalau udah yakin mau di bidang keuangan, ini pilihan terkuat.' },                                                scores:{ bisnis:4,sosial:0,sains:3,seni:0,publik:1,teknik:1 } },
  { id:'ekopem',     fac:'feb',   title:'Ekonomi Pembangunan',                    emoji:'📈', desc:'Analisis ekonomi di level makro — kebijakan negara, investasi wilayah, dan pembangunan. Cocok buat yang suka mikir skala besar.',                                              karier:['Peneliti Ekonomi','Analis Kebijakan','Perencana Pembangunan','Staf BAPPEDA'], irisan:['admpublik','akuntansi'],            tags:['makro','kebijakan','riset'],       why:{ galau:'Kalau kamu sering nanya "kenapa ekonomi Indonesia kayak gini?", kamu udah di track yang bener.', excited:'Prodi yang cocok buat pemikir besar dengan curiosity tinggi.', pressure:'Karier di pemerintahan dan lembaga internasional — prestisius dan stabil.', ready:'Pilihan untuk yang mau dampak luas di skala kebijakan.' },                               scores:{ bisnis:2,sosial:3,sains:3,seni:0,publik:4,teknik:0 } },
  { id:'bisdig',     fac:'feb',   title:'Bisnis Digital',                         emoji:'⚡', desc:'Jalanin bisnis di era digital — e-commerce, digital marketing, growth hacking. Prodi paling relevan buat Gen Z yang mau jadi game changer.',                                  karier:['Digital Strategist','Product Manager','Growth Hacker','E-commerce Mgr'],      irisan:['manajemen','admbisnis','ilkom'],     tags:['digital','tech','marketing'],     why:{ galau:'Bisnis Digital itu exciting dan fresh — buat kamu yang ngerasa prodi lain terlalu "jadul".', excited:'Kalau kamu excited soal dunia digital dan bisnis, ini literally dibuat buat kamu.', pressure:'Prodi modern yang bisa jadi solusi kompromi antara passion digital dan ekspektasi orang tua.', ready:'For the ones who just know they wanna be in the digital space.' },   scores:{ bisnis:5,sosial:1,sains:2,seni:1,publik:0,teknik:2 } },
  { id:'admpublik',  fac:'fisip', title:'Ilmu Administrasi Publik',               emoji:'🏛️', desc:'Ngerti cara kerja pemerintahan dan lembaga publik. Karier di ASN, BUMN, atau NGO — buat kamu yang mau memberi dampak untuk negeri.',                                          karier:['PNS/ASN','Analis Kebijakan','Manajer BUMN','Staf NGO'],                       irisan:['admbisnis','ekopem','hi'],          tags:['pemerintahan','kebijakan','publik'], why:{ galau:'Kalau kamu bingung tapi ngerasa "mau yang berguna buat orang banyak", ini sangat cocok.', excited:'Buat yang excited soal politik, governance, dan perubahan sosial.', pressure:'Karier PNS = stabilitas jangka panjang yang biasanya diidamkan keluarga.', ready:'Kalau udah tau mau di sektor publik, ini fondasinya.' },                                   scores:{ bisnis:1,sosial:4,sains:0,seni:0,publik:5,teknik:0 } },
  { id:'kessos',     fac:'fisip', title:'Ilmu Kesejahteraan Sosial',              emoji:'🤝', desc:'Jadi pekerja sosial profesional yang bantu individu dan komunitas. Karier di pemerintahan, NGO, dan lembaga sosial internasional.',                                            karier:['Pekerja Sosial','Konselor Sosial','Staf NGO','Community Dev.'],               irisan:['admpublik','ilkom'],                tags:['sosial','komunitas','empati'],     why:{ galau:'Kalau kamu ngerasa "gue cuma mau bantu orang", Kessos legitimizes dan professionalize itu.', excited:'Prodi buat yang genuinely peduli sama isu sosial dan mau jadi agen perubahan.', pressure:'Karier di KEMENSOS dan lembaga internasional sangat nyata.', ready:'Bold choice yang meaningful banget.' },                                                        scores:{ bisnis:0,sosial:5,sains:0,seni:0,publik:5,teknik:0 } },
  { id:'ilkom',      fac:'fisip', title:'Ilmu Komunikasi',                        emoji:'🗣️', desc:'Strategi komunikasi, PR, content creation, dan media. Di era sekarang, skill komunikasi = superpower yang dibutuhkan semua industri.',                                         karier:['Public Relations','Brand Strategist','Jurnalis','Content Creator'],           irisan:['bisdig','manajemen','sasinggris'],  tags:['media','PR','storytelling'],      why:{ galau:'Komunikasi itu foundational — semua karier butuh skill ini. Kalau masih bingung, ini safety net yang keren.', excited:'Buat yang suka nulis, ngomong, bikin konten — ini rumahmu.', pressure:'Industri kreatif + komunikasi makin dibutuhkan, banyak yang belum ngerti potensinya.', ready:'Kalau udah tau mau di media atau brand — gas.' },                         scores:{ bisnis:3,sosial:4,sains:0,seni:3,publik:2,teknik:0 } },
  { id:'hi',         fac:'fisip', title:'Ilmu Hubungan Internasional',            emoji:'🌏', desc:'Diplomasi, politik global, dan kerjasama internasional. Buat yang punya mimpi besar dan mau main di panggung dunia.',                                                          karier:['Diplomat','Staf Kemlu','Analis Geopolitik','Staf UN/ASEAN'],                  irisan:['admpublik','ilkom','hukum'],         tags:['global','diplomasi','politik'],   why:{ galau:'HI kasih kamu perspektif global yang bikin masalah lokal jadi lebih makes sense.', excited:'Kalau berita internasional itu exciting buat kamu, kamu udah terpanggil.', pressure:'Karier diplomatik = prestisius banget. Ini bisa jadi argumen ke orang tua.', ready:'The dream for the globally-minded.' },                                                    scores:{ bisnis:1,sosial:5,sains:0,seni:0,publik:5,teknik:0 } },
  { id:'tekind',     fac:'ft',    title:'Teknik Industri',                        emoji:'⚙️', desc:'Optimasi sistem produksi dan operasional. Jembatan antara teknik dan manajemen — lulusan yang paling diincar industri manufaktur.',                                            karier:['Industrial Engineer','Supply Chain Mgr','Ops Manager','Quality Engineer'],    irisan:['manajemen','tekinfo'],              tags:['optimasi','produksi','sistem'],   why:{ galau:'Kalau suka problem solving tapi belum tau mau ke bisnis atau teknik — TI adalah jawabannya.', excited:'Prodi buat yang excited soal efisiensi dan bikin sistem jalan mulus.', pressure:'Gelar teknik dengan skill manajemen = paling aman di pasar kerja.', ready:'Solid choice untuk industrialis.' },                                                           scores:{ bisnis:3,sosial:0,sains:4,seni:0,publik:0,teknik:5 } },
  { id:'tekinfo',    fac:'ft',    title:'Teknik Informatika',                     emoji:'💻', desc:'Coding, AI, software engineering. Prodi dengan demand karier tertinggi di era digital — skill-nya relevan di seluruh industri.',                                               karier:['Software Engineer','Data Scientist','IT Consultant','CTO Startup'],           irisan:['bisdig','tekind'],                  tags:['coding','AI','software'],         why:{ galau:'Teknik Informatika = skill yang selalu dicari. Kalau bingung, ini yang paling "future-proof".', excited:'Kalau suka problem solving via coding, ini surga kamu.', pressure:'Gaji engineer tertinggi di Indonesia — argumen terkuat ke orang tua.', ready:'The ultimate move kalau mau jadi tech person.' },                                                  scores:{ bisnis:2,sosial:0,sains:5,seni:0,publik:0,teknik:5 } },
  { id:'tekmesin',   fac:'ft',    title:'Teknik Mesin',                           emoji:'🔧', desc:'Perancangan dan manufaktur sistem mekanikal. Karier di industri otomotif, energi, dan manufaktur yang terus tumbuh.',                                                          karier:['Design Engineer','Maintenance Mgr','Prod. Engineer','R&D Engineer'],          irisan:['tekind','tekpangan'],               tags:['manufaktur','mesin','energi'],    why:{ galau:'Teknik Mesin = jalur karier yang sangat jelas dan konkret.', excited:'Buat yang suka bongkar-pasang dan ngerti cara kerja benda.', pressure:'Insinyur mesin = profesi yang dihormati dan bergaji tinggi.', ready:'Engineering track yang teruji waktu.' },                                                                                                     scores:{ bisnis:1,sosial:0,sains:5,seni:0,publik:0,teknik:5 } },
  { id:'tekpangan',  fac:'ft',    title:'Teknologi Pangan',                       emoji:'🌱', desc:'Inovasi produk makanan-minuman dan keamanan pangan. Di balik setiap produk yang kamu makan, ada food technologist.',                                                           karier:['Food Scientist','QC Manager','R&D Pangan','Wirausaha Kuliner'],               irisan:['tekmesin','tekind'],                tags:['pangan','inovasi','industri'],    why:{ galau:'Unik dan niche — kalau suka kuliner tapi juga sains, ini rare combo yang worth it.', excited:'Industri F&B Indonesia tumbuh pesat — timing-nya perfect.', pressure:'Prospek industri makanan = stabil dan terus berkembang.', ready:'Solid untuk yang passionate di pangan.' },                                                                            scores:{ bisnis:2,sosial:0,sains:5,seni:0,publik:1,teknik:4 } },
  { id:'teklngk',    fac:'ft',    title:'Teknik Lingkungan',                      emoji:'🌿', desc:'Teknologi untuk menyelamatkan planet — sanitasi, pengelolaan limbah, dan infrastruktur hijau. Makin relevan di era ESG.',                                                     karier:['Environmental Engineer','AMDAL Consultant','Green Infra','Staf KLHK'],        irisan:['tekmesin','pwk'],                   tags:['lingkungan','ESG','hijau'],       why:{ galau:'Kalau kamu peduli sama bumi tapi juga suka sains — ini rare dan powerful combo.', excited:'Prodi masa depan yang jawab isu climate change secara konkret.', pressure:'Regulasi ESG bikin demand engineer lingkungan meledak.', ready:'Impactful choice untuk era sustainability.' },                                                                         scores:{ bisnis:1,sosial:1,sains:5,seni:0,publik:3,teknik:4 } },
  { id:'pwk',        fac:'ft',    title:'Perencanaan Wilayah dan Kota',           emoji:'🏙️', desc:'Mendesain masa depan kota — tata ruang, infrastruktur, dan pembangunan wilayah. Prodi lintas teknik-sosial yang paling unik.',                                                karier:['Urban Planner','Konsultan Tata Ruang','BAPPEDA','GIS Analyst'],               irisan:['teklngk','admpublik','ekopem'],      tags:['kota','tata ruang','GIS'],        why:{ galau:'PWK = prodi buat yang suka banyak hal dan nggak mau terjebak satu kotak.', excited:'Kalau kamu suka kota dan desain ruang, ini passion yang ternyata bisa jadi karier.', pressure:'Konsultan tata ruang pemerintah = karier strategis dan bergengsi.', ready:'Unique positioning yang jarang ada saingannya.' },                                             scores:{ bisnis:1,sosial:2,sains:3,seni:1,publik:4,teknik:3 } },
  { id:'pendmat',    fac:'fkip',  title:'Pendidikan Matematika',                  emoji:'📐', desc:'Matematika sebagai ilmu dan seni mengajar. Karier guru + terbuka ke data analytics di era digital.',                                                                           karier:['Guru Matematika','Data Analyst','Peneliti','Math Tutor'],                     irisan:['pendeko','pgsd'],                   tags:['matematika','mengajar','data'],   why:{ galau:'Guru = salah satu karier paling stabil dan punya purpose jelas.', excited:'Kalau matematika itu fun buat kamu, kamu punya gift yang langka.', pressure:'Profesi guru = dihormati dan ada jaminan PPPK/ASN.', ready:'Teaching + analytical skills = combo yang kuat.' },                                                                                   scores:{ bisnis:1,sosial:1,sains:4,seni:0,publik:3,teknik:2 } },
  { id:'pendbio',    fac:'fkip',  title:'Pendidikan Biologi',                     emoji:'🧬', desc:'Biologi dan pedagogi. Karier di sekolah, lab riset, atau industri kesehatan dan farmasi.',                                                                                     karier:['Guru Biologi','Lab Analyst','Peneliti','Penyuluh Kesehatan'],                 irisan:['pendmat','kedokteran'],             tags:['biologi','sains','mengajar'],     why:{ galau:'Jalur karier yang jelas dan impactful.', excited:'Buat yang fascinated sama kehidupan di level sel.', pressure:'Profesi guru + pembuka jalan ke kesehatan.', ready:'Strong choice untuk biology enthusiast.' },                                                                                                                                                scores:{ bisnis:0,sosial:1,sains:5,seni:0,publik:2,teknik:1 } },
  { id:'pendeko',    fac:'fkip',  title:'Pendidikan Ekonomi',                     emoji:'📊', desc:'Konsep ekonomi-bisnis untuk dunia pendidikan. Guru ekonomi yang juga bisa jadi trainer korporat.',                                                                             karier:['Guru Ekonomi','Trainer Korporat','Edukator Keuangan','HRD Training'],         irisan:['ekopem','manajemen'],               tags:['ekonomi','pendidikan','bisnis'],  why:{ galau:'Kombinasi ekonomi dan pendidikan = jalur yang aman dan meaningful.', excited:'Kalau suka jelasin konsep ke orang lain, kamu natural teacher.', pressure:'Guru + trainer = karier yang dipandang positif.', ready:'Jembatan antara dunia bisnis dan pendidikan.' },                                                                                           scores:{ bisnis:2,sosial:3,sains:1,seni:0,publik:3,teknik:0 } },
  { id:'pendbindo',  fac:'fkip',  title:'Pendidikan Bahasa dan Sastra Indonesia', emoji:'✍️', desc:'Linguistik, sastra, dan mengajar. Di era content economy, kemampuan menulis = aset berharga.',                                                                                karier:['Guru Bahasa Indonesia','Editor','Jurnalis','Content Writer'],                 irisan:['ilkom','sasinggris'],               tags:['bahasa','sastra','menulis'],      why:{ galau:'Kemampuan nulis yang bagus terbuka semua pintu karier.', excited:'Kalau suka menulis dan bercerita, ini rumahmu.', pressure:'Editor dan content writer sekarang banyak dicari industri digital.', ready:"The writer's path." },                                                                                                                              scores:{ bisnis:1,sosial:3,sains:0,seni:4,publik:2,teknik:0 } },
  { id:'pendppkn',   fac:'fkip',  title:'Pendidikan Pancasila dan Kewarganegaraan', emoji:'🇮🇩', desc:'Pendidikan kewarganegaraan, HAM, dan demokrasi. Karier di sekolah dan lembaga pemerintahan.',                                                                              karier:['Guru PPKn','Staf Pemerintahan','Aktivis HAM','Peneliti Sosial'],              irisan:['kessos','admpublik'],               tags:['demokrasi','hukum','kewarganegaraan'], why:{ galau:'Kalau passionate soal keadilan dan hak asasi, ini jalur yang genuine.', excited:'Buat yang mau jadi suara perubahan dalam sistem.', pressure:'Karier di pemerintahan dan pendidikan = stabil.', ready:'Purpose-driven choice.' },                                                                                                                           scores:{ bisnis:0,sosial:5,sains:0,seni:0,publik:5,teknik:0 } },
  { id:'pgsd',       fac:'fkip',  title:'Pendidikan Guru Sekolah Dasar',          emoji:'🎒', desc:'Guru SD yang siap mengajar semua mata pelajaran. Demand guru SD terus tumbuh seiring program pemerintah.',                                                                     karier:['Guru SD','Kepala Sekolah','Trainer Pendidikan','Peneliti Edukasi'],           irisan:['pendmat','pendbio'],                tags:['anak','guru SD','pendidikan dasar'], why:{ galau:'Karier guru SD = paling jelas dan stabil. Kalau bingung, ini bisa jadi anchor.', excited:'Kalau kamu suka sama anak-anak dan ngajar, ini pure passion.', pressure:'Formasi PPPK guru SD selalu besar tiap tahun.', ready:'Calling yang clear.' },                                                                                                              scores:{ bisnis:0,sosial:5,sains:1,seni:2,publik:4,teknik:0 } },
  { id:'dkv',        fac:'fiss',  title:'Desain Komunikasi Visual',               emoji:'🎨', desc:'Desain grafis, branding, UI/UX, dan motion. Prodi seni paling dekat ke industri — portfolio-nya langsung jual.',                                                             karier:['Graphic Designer','UI/UX Designer','Brand Designer','Creative Director'],     irisan:['ilkom','bisdig','fotografi'],       tags:['desain','visual','branding'],     why:{ galau:'DKV itu tangible — karya kamu bisa langsung dilihat dan dijual.', excited:'Kalau visual language itu bahasa aslimu, ini tempat berkembang.', pressure:'Designer UI/UX sekarang gajinya bisa 2x gaji fresh grad jurusan lain.', ready:'Creative powerhouse track.' },                                                                                       scores:{ bisnis:3,sosial:1,sains:0,seni:5,publik:0,teknik:2 } },
  { id:'fotografi',  fac:'fiss',  title:'Fotografi',                              emoji:'📸', desc:'Fotografi komersial, dokumenter, dan fine art. Di era konten, kemampuan visual storytelling makin bernilai.',                                                                  karier:['Fotografer Komersial','Photo Editor','Videografer','Content Creator'],        irisan:['dkv','ilkom'],                      tags:['visual','media','kreatif'],       why:{ galau:'Fotografi kasih kamu cara pandang baru — seringkali itu yang bikin galau-mu hilang.', excited:'Kalau kamu lihat dunia lewat lensa dan selalu mau capture momen, ini passion yang bisa jadi profesi.', pressure:'Fotografer komersial dan content creator bisa dapat income lebih dari karier konvensional.', ready:'Visual artist path.' },                     scores:{ bisnis:2,sosial:2,sains:0,seni:5,publik:1,teknik:1 } },
  { id:'senimus',    fac:'fiss',  title:'Seni Musik',                             emoji:'🎵', desc:'Komposisi, pertunjukan, dan produksi musik. Di era streaming dan konten, musisi punya lebih banyak channel monetisasi.',                                                      karier:['Musisi','Komposer','Guru Musik','Music Producer'],                            irisan:['fotografi','dkv'],                  tags:['musik','seni','kreatif'],         why:{ galau:'Kalau musik itu satu-satunya hal yang bikin kamu hidup — dengerin instink itu.', excited:'Passion is real, career in music is more viable than ever.', pressure:'Music producer, music teacher, konten musik — banyak jalur yang sustainable.', ready:'Follow the music.' },                                                                                 scores:{ bisnis:1,sosial:3,sains:0,seni:5,publik:1,teknik:0 } },
  { id:'sasinggris', fac:'fiss',  title:'Sastra Inggris',                         emoji:'🌍', desc:'Bahasa, sastra, dan linguistik Inggris. Kemampuan bahasa Inggris tinggi + pemahaman lintas budaya = aset berharga.',                                                          karier:['Penerjemah','Guru Bahasa Inggris','Content Writer','Tour Guide'],             irisan:['ilkom','hi','pendbindo'],           tags:['bahasa','internasional','sastra'], why:{ galau:'English proficiency membuka banyak pintu — kalau masih bingung, skill bahasa selalu berguna.', excited:'Buat yang genuinely suka literatur dan budaya Inggris.', pressure:'Translator dan interpreter dibutuhkan di banyak perusahaan multinasional.', ready:'Language is power.' },                                                                         scores:{ bisnis:2,sosial:4,sains:0,seni:3,publik:2,teknik:0 } },
  { id:'hukum',      fac:'hukum', title:'Ilmu Hukum',                             emoji:'⚖️', desc:'Hukum perdata, pidana, bisnis, dan tata negara. Advokat, notaris, jaksa, atau legal officer — pilihan karier yang luas dan prestisius.',                                      karier:['Pengacara','Notaris','Jaksa/Hakim','Legal Officer'],                          irisan:['admpublik','hi','manajemen'],       tags:['hukum','regulasi','profesi'],     why:{ galau:'Hukum = profesi dengan jalur yang jelas. Kalau suka argumen dan debat, kamu natural lawyer.', excited:'Kalau baca berita hukum itu bikin kamu penasaran, instink itu bener.', pressure:'Pengacara, notaris, jaksa = profesi bergengsi yang orang tua pasti bangga.', ready:'The case rests.' },                                                                  scores:{ bisnis:2,sosial:3,sains:0,seni:0,publik:4,teknik:0 } },
  { id:'kedokteran', fac:'fk',    title:'Kedokteran',                             emoji:'🩺', desc:'Ilmu kedokteran dan profesi dokter. Investasi besar, tapi karier paling mulia dan dibutuhkan sepanjang masa.',                                                                karier:['Dokter Umum','Dokter Spesialis','Peneliti Medis','Manajemen RS'],             irisan:['pendbio','teklngk'],                tags:['kesehatan','sains','profesi'],    why:{ galau:'Kalau dari kecil mau jadi dokter tapi ragu, galau-mu valid tapi instinknya jangan dikubur.', excited:'Medicine is a calling — kalau kamu excited soal tubuh manusia dan healing, ini jalan.', pressure:'Dokter = karier yang selalu diimpikan banyak keluarga.', ready:'The noblest path.' },                                                                    scores:{ bisnis:1,sosial:2,sains:5,seni:0,publik:3,teknik:4 } },
];

const PRODI_MAP = Object.fromEntries(PRODI.map(p => [p.id, p]));

// ============================================================
// QUESTIONS (6, dimension-based)
// ============================================================
const QS = [
  { context:'Tentang dirimu', q:'Kalau lagi free time, kamu paling sering ngapain?', hint:'Nggak ada jawaban salah — ini soal apa yang genuinely kamu nikmatin.', opts:[
    { icon:'📱', main:'Scrolling konten, bikin video, atau nulis',  sub:'Content creation, storytelling, atau sekadar explore ide', scores:{ seni:3,sosial:2,bisnis:1 } },
    { icon:'📢', main:'Ngitung, nge-data, atau problem solving',    sub:'Spreadsheet, puzzle, atau mikirin solusi dari masalah',    scores:{ sains:3,bisnis:2,teknik:1 } },
    { icon:'🤗', main:'Nongkrong, ngobrol, atau bantu orang',       sub:'Seru-seruan bareng orang, dengerin cerita, atau jadi "pendengar yang baik"', scores:{ sosial:4,publik:2 } },
    { icon:'🛠️', main:'Bikin atau oprek sesuatu',                   sub:'Ngerakit, desain, coding, masak, atau proyek DIY',        scores:{ teknik:4,sains:2,seni:2 } },
  ]},
  { context:'Cara kamu berpikir', q:'Waktu ada masalah besar, kamu lebih suka...', hint:'Ini ngecek cara kerja otak kamu — keduanya valid.', opts:[
    { icon:'🗺️', main:'Mikir strategi & big picture',              sub:'Ngeliat masalah dari sudut pandang luas dan planning ke depan', scores:{ bisnis:3,sosial:2,publik:2 } },
    { icon:'🔎', main:'Bedah detail sampai nemu root cause-nya',   sub:'Deep dive, riset, dan nggak puas sebelum ngerti sepenuhnya', scores:{ sains:3,teknik:3 } },
    { icon:'💬', main:'Ngomong ke orang dan cari perspektif',      sub:'Brainstorm bareng, minta pendapat, dan cari konsensus',    scores:{ sosial:4,publik:2,seni:1 } },
    { icon:'✏️', main:'Nulis, gambarin, atau visualisasiin',       sub:'Ide jadi lebih jelas kalau di-sketch atau ditulis',        scores:{ seni:4,sosial:1,bisnis:1 } },
  ]},
  { context:'Dunia kerja impian', q:'Gambaran karier yang bikin kamu semangat banget?', hint:'Pilih yang bikin kamu ngebayanginnya excited, bukan cuma "aman".', opts:[
    { icon:'🏗️', main:'Bangun bisnis atau jadi pemimpin',          sub:'Entrepreneur, manajer, atau punya impact ke banyak orang lewat bisnis', scores:{ bisnis:5 } },
    { icon:'🌏', main:'Kerja untuk masyarakat atau negara',        sub:'Pemerintahan, NGO, kebijakan publik, atau dampak sosial luas', scores:{ publik:4,sosial:3 } },
    { icon:'🔬', main:'Jadi ahli teknis atau ilmuwan',             sub:'Engineer, researcher, dokter, atau spesialis yang diakui keahliannya', scores:{ sains:4,teknik:4 } },
    { icon:'🎭', main:'Ekspresi diri & industri kreatif',          sub:'Desainer, seniman, komunikator, atau creator yang karyanya dikenal', scores:{ seni:5,bisnis:1 } },
  ]},
  { context:'Nilai yang kamu pegang', q:'Yang paling penting buat kamu dalam kerja?', hint:'Jawab yang paling authentic ke diri kamu.', opts:[
    { icon:'💰', main:'Penghasilan & financial freedom',           sub:'Mau bisa hidup mandiri dan punya stability',                scores:{ bisnis:3,teknik:2,sains:2 } },
    { icon:'❤️', main:'Dampak & meaningful work',                 sub:'Pekerjaan yang beneran bantu orang atau society',           scores:{ publik:4,sosial:3 } },
    { icon:'🏆', main:'Prestise & diakui keahliannya',            sub:'Jadi expert yang dihormati di bidangnya',                   scores:{ sains:3,bisnis:2,publik:2 } },
    { icon:'🎨', main:'Kebebasan & ekspresi',                     sub:'Bisa kreatif, punya otonomi, dan nggak stuck di rutinitas', scores:{ seni:4,bisnis:2 } },
  ]},
  { context:'Mata pelajaran', q:'Di SMA, mata pelajaran apa yang paling nggak berasa berat?', hint:'Bukan yang nilainya paling tinggi — tapi yang paling nggak kerasa kayak beban.', opts:[
    { icon:'📊', main:'Matematika & Ekonomi',                      sub:'Angka, grafik, dan logika — it just clicks',               scores:{ sains:3,bisnis:3,teknik:2 } },
    { icon:'📖', main:'IPS, Sejarah & Sosiologi',                  sub:'Ngerti kenapa dunia dan manusia berjalan kayak gini',      scores:{ sosial:4,publik:3 } },
    { icon:'🧪', main:'Biologi, Kimia & Fisika',                   sub:'Science lab itu exciting, bukan scary',                   scores:{ sains:5,teknik:3 } },
    { icon:'🎭', main:'Bahasa, Seni & Sastra',                     sub:'Ekspresiin diri lewat tulisan, visual, atau pertunjukan',  scores:{ seni:4,sosial:2 } },
  ]},
  { context:'Final check', q:'Jujur, apa kekhawatiran terbesar kamu soal kuliah?', hint:'Ini buat bantu kita kasih konteks yang tepat di hasil nanti.', opts:[
    { icon:'😰', main:'Salah pilih dan nyesel',                    sub:'Takut buang waktu dan uang di jalur yang salah',           scores:{ bisnis:1,publik:1 } },
    { icon:'💸', main:'Biaya dan prospek kerja',                   sub:'Mau yang ROI-nya jelas dan cepat kerja setelah lulus',     scores:{ bisnis:2,teknik:1,sains:1 } },
    { icon:'😥', main:'Tekanan orang tua / lingkungan',            sub:'Pilihan gue vs ekspektasi mereka',                        scores:{ sosial:1,publik:1 } },
    { icon:'🌟', main:'Nggak mau jadi biasa-biasa aja',            sub:'Mau menonjol dan beda dari yang lain',                    scores:{ seni:2,bisnis:2,teknik:1 } },
  ]},
];

// ============================================================
// PERSONAS & FEELING
// ============================================================
const PERSONAS = {
  bisnis: { emoji:'📊', label:'The Business Builder', desc:'Kamu punya instink bisnis yang kuat' },
  sosial: { emoji:'🌱', label:'The Change Maker',     desc:'Kamu mau dampak nyata untuk orang banyak' },
  sains:  { emoji:'🔬', label:'The Deep Thinker',     desc:'Kamu suka ngupas masalah sampai ke akarnya' },
  seni:   { emoji:'🎨', label:'The Creative Soul',    desc:'Kamu ekspresi diri lewat karya' },
  publik: { emoji:'🏛️', label:'The Public Servant',   desc:'Kamu tertarik jadi agen perubahan di sistem' },
  teknik: { emoji:'⚙️', label:'The Problem Solver',   desc:'Kamu suka bikin sesuatu yang benar-benar kerja' },
};

const FEELING_RESPONSES = {
  galau:    "Btw kita notice kamu lagi galau banget. It's okay — <b>galau soal prodi itu tanda kamu serius mikirin masa depan</b>. Kita bakal bantu kamu temukan titik terang dari jawaban-jawabanmu tadi.",
  excited:  "Excited itu energi yang berharga! <b>Kita bakal bantu kamu channeling excitement itu ke prodi yang beneran match</b> sama siapa kamu sebenarnya.",
  pressure: "Kita ngerti ada pressure dari luar. Tapi ingat: <b>prodi yang tepat itu yang cocok buat KAMU</b>, bukan buat siapa pun yang menekan.",
  ready:    "Mantap kamu udah siap! <b>Kita tinggal konfirmasiin aja</b> apakah feeling kamu itu udah align sama karaktermu yang sebenarnya.",
};

const FEELING_MSGS = {
  galau:    { confetti:'😵‍💫✨', greeting:'Galau-mu terjawab!',         title: t => `Berkenalan sama ${t}`,    sub:'Dari semua yang kamu jawab, ini prodi yang paling nyambung sama kamu sebenarnya.' },
  excited:  { confetti:'🔥',    greeting:'Feeling-mu bener!',           title: t => `${t} — match!`,           sub:'Excitement kamu terarah. Ini prodi yang paling align sama energimu.' },
  pressure: { confetti:'💪',    greeting:'Ini pilihanmu, bukan mereka.', title: t => `Kamu cocok di ${t}`,     sub:'Berdasarkan siapa kamu benerannya — bukan ekspektasi orang lain.' },
  ready:    { confetti:'✅',    greeting:'Konfirmasi masuk!',            title: t => `${t} — cocok banget`,    sub:'Analisis kita align sama feeling kamu. Good instinct!' },
  skip:     { confetti:'🎯',    greeting:'Ketemu nih!',                  title: () => 'Prodi terbaik buat kamu', sub:'Berdasarkan jawabanmu, ini yang paling cocok.' },
};

// ============================================================
// SCORE CALCULATION
// ============================================================
function calcScores(dimScores) {
  return PRODI.map(p => {
    let s = 0;
    Object.entries(dimScores).forEach(([k, v]) => { s += (p.scores[k] || 0) * v; });
    const maxP = Object.values(p.scores).reduce((a, b) => a + b, 0) * 20;
    const pct = Math.min(98, Math.max(30, Math.round((s / (maxP || 1)) * 100)));
    return { ...p, pct };
  }).sort((a, b) => b.pct - a.pct);
}

// ============================================================
// PIXEL HELPERS
// ============================================================
const pixelReady = () => typeof window.fbq === 'function';
function trackQuizStart()           { if (pixelReady()) window.fbq('trackCustom','QuizStarted'); }
function trackQuizCompleted()       { if (pixelReady()) window.fbq('trackCustom','QuizCompleted'); }
function trackLead()                { if (pixelReady()) window.fbq('track','Lead',{ content_name:'Quiz Kecocokan Prodi', content_category:'PMB UNPAS', currency:'IDR' }); }
function trackViewContent(top)      { if (pixelReady()) window.fbq('track','ViewContent',{ content_name:top.title, content_category:FAC[top.fac]?.name||'', content_ids:[top.id], value:1, currency:'IDR' }); }
function trackInitiateCheckout(n)   { if (pixelReady()) window.fbq('track','InitiateCheckout',{ content_name: n || 'Daftar PMB UNPAS' }); }
function trackContact(n)            { if (pixelReady()) window.fbq('track','Contact',{ content_name: n }); }

// ============================================================
// CONFETTI
// ============================================================
function Confetti({ active }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!active || !ref.current) return;
    const el = ref.current;
    const colors = ['#F5C842','#7C6EF5','#34D399','#F87171','#FB923C','#F472B6'];
    const timers = [];
    for (let i = 0; i < 50; i++) {
      const t = setTimeout(() => {
        const c = document.createElement('div');
        c.className = 'qv5-confetti-piece';
        Object.assign(c.style, {
          left: Math.random() * 100 + '%',
          backgroundColor: colors[Math.floor(Math.random() * colors.length)],
          borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          width: (Math.random() * 8 + 5) + 'px',
          height: (Math.random() * 8 + 5) + 'px',
          animationDuration: (Math.random() * 2 + 2) + 's',
          animationDelay: Math.random() * 0.5 + 's',
        });
        el.appendChild(c);
        setTimeout(() => c.remove(), 4500);
      }, i * 60);
      timers.push(t);
    }
    return () => timers.forEach(clearTimeout);
  }, [active]);
  return <div ref={ref} style={{ position:'fixed',inset:0,pointerEvents:'none',zIndex:1000,overflow:'hidden' }} />;
}

// Animated match bar
function MatchBar({ pct }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(pct), 150); return () => clearTimeout(t); }, [pct]);
  return <div style={{ height:'100%',borderRadius:4,background:'linear-gradient(90deg,#F5C842,#FF9F45)',transition:'width 1s ease',width:`${w}%` }} />;
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function Quiz() {
  const [screen,      setScreen]      = useState('landing');
  const [curQ,        setCurQ]        = useState(0);
  const [answers,     setAnswers]     = useState(Array(QS.length).fill(null));
  const [feeling,     setFeeling]     = useState(null);
  const [form,        setForm]        = useState({ name:'', phone:'', school:'', kelas:'', prodiMinat:'' });
  const [dimScores,   setDimScores]   = useState({ bisnis:0,sosial:0,sains:0,seni:0,publik:0,teknik:0 });
  const [resultData,  setResultData]  = useState(null);
  const [confetti,    setConfetti]    = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [vibes,       setVibes]       = useState([]);
  const topProdiRef = useRef(null);

  const VIBE_PILLS = [
    '😰 Takut salah pilih',
    '🤷 Nggak tau minat gue apa',
    '💸 Mikirin biaya',
    '👨‍👩‍👧 Orang tua expect beda',
    '🎯 Udah tau, mau konfirmasi',
    '🙈 Ikut temen aja deh',
  ];
  const toggleVibe = (v) => setVibes(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);

  // Inject CSS once
  useEffect(() => {
    const id = 'qv5-global-css';
    if (!document.getElementById(id)) {
      const s = document.createElement('style');
      s.id = id; s.textContent = GLOBAL_CSS;
      document.head.appendChild(s);
    }
  }, []);

  useEffect(() => { window.scrollTo({ top:0, behavior:'smooth' }); }, [screen]);

  const validatePhone = p => { const c = p.replace(/\D/g,''); return /^08\d{8,11}$/.test(c) ? c : null; };

  const recalcDim = (ans) => {
    const ds = { bisnis:0,sosial:0,sains:0,seni:0,publik:0,teknik:0 };
    ans.forEach((ai, qi) => {
      if (ai !== null) Object.entries(QS[qi].opts[ai].scores).forEach(([k,v]) => { ds[k] = (ds[k]||0)+v; });
    });
    return ds;
  };

  // ── Landing ──────────────────────────────────────────────
  const startQuiz = () => { trackQuizStart(); setScreen('feeling'); };

  // ── Feeling ──────────────────────────────────────────────
  const chooseFeelingAndNext = (f) => {
    setFeeling(f);
    setCurQ(0);
    setAnswers(Array(QS.length).fill(null));
    setDimScores({ bisnis:0,sosial:0,sains:0,seni:0,publik:0,teknik:0 });
    setScreen('quiz');
  };

  // ── Quiz ─────────────────────────────────────────────────
  const selectOpt = (qi, oi) => {
    const newAns = [...answers]; newAns[qi] = oi;
    setAnswers(newAns);
    const newDs = recalcDim(newAns);
    setDimScores(newDs);
    setTimeout(() => {
      if (qi < QS.length - 1) { setCurQ(qi + 1); }
      else {
        trackQuizCompleted();
        topProdiRef.current = calcScores(newDs)[0];
        goToLoading(newDs);
      }
    }, 280);
  };

  const quizBack = () => { if (curQ > 0) setCurQ(curQ - 1); else setScreen('feeling'); };

  // ── Loading ──────────────────────────────────────────────
  const goToLoading = (ds) => {
    setLoadingStep(0);
    setScreen('loading');
    [0,800,1600,2400,3000].forEach((delay, i) => setTimeout(() => setLoadingStep(i+1), delay));
    setTimeout(() => {
      topProdiRef.current = calcScores(ds || dimScores)[0];
      setScreen('capture');
    }, 3600);
  };

  // ── Capture ──────────────────────────────────────────────
  const submitData = async () => {
    if (!form.name.trim() || !form.phone.trim() || !form.school.trim() || !form.kelas.trim()) {
      Swal.fire({ icon:'warning', title:'Data belum lengkap', text:'Mohon isi Nama, Nomor WhatsApp, Asal Sekolah, dan Kelas ya 😊', confirmButtonText:'OK' });
      return;
    }
    const validPhone = validatePhone(form.phone);
    if (!validPhone) {
      Swal.fire({ icon:'error', title:'Nomor tidak valid', text:'Nomor WhatsApp harus diawali 08 dan terdiri dari 10–13 digit', confirmButtonText:'Mengerti' });
      return;
    }
    const scored = calcScores(dimScores);
    const top    = scored[0];
    setScreen('loading'); setLoadingStep(5);
    try {
      await axios.post(API_URL, {
        name:       form.name.trim(),
        phone:      validPhone,
        school:     form.school.trim(),
        kelas:      form.kelas.trim(),
        prodiMinat: form.prodiMinat.trim(),
        answers,
        result:     top.title,
      });
      await Swal.fire({ icon:'success', title:'Berhasil 🎉', text:'Data kamu sudah tersimpan!', confirmButtonText:'Lihat hasil' });
    } catch {
      await Swal.fire({ icon:'error', title:'Oops...', text:'Terjadi kesalahan saat mengirim data', confirmButtonText:'Coba lagi' });
    }
    doShowResult(scored, top);
    trackLead();
    trackViewContent(top);
  };

  const skipCapture = () => {
    const scored = calcScores(dimScores);
    doShowResult(scored, scored[0]);
  };

  const doShowResult = (scored, top) => {
    const topDim = Object.entries(dimScores).sort((a,b)=>b[1]-a[1])[0]?.[0] || 'bisnis';
    setResultData({ scored, top, persona: PERSONAS[topDim] || PERSONAS.bisnis });
    setScreen('result');
    setConfetti(true);
    setTimeout(() => setConfetti(false), 4500);
  };

  // ── Result actions ────────────────────────────────────────
  const handleDaftar = () => {
    if (resultData) trackInitiateCheckout(resultData.top.title);
    window.open('https://pmb.unpas.ac.id', '_blank');
  };
  const handleChat = () => {
    if (!resultData) return;
    trackContact(resultData.top.title);
    const msg = encodeURIComponent(`Halo, saya ${form.name || 'calon mahasiswa'}. Saya baru selesai tes kecocokan prodi dan hasilnya cocok di ${resultData.top.title}. Bisa info lebih lanjut soal pendaftaran, biaya, dan potongan?`);
    window.open(`https://wa.me/62811960193?text=${msg}`, '_blank');
  };
  const handleShare = () => {
    if (!resultData) return;
    const txt = `Aku baru coba Tes Kecocokan Prodi dari UNPAS dan hasilnya ${resultData.top.emoji} ${resultData.top.title} (${resultData.top.pct}% cocok)! Coba juga yuk 🎯👉 https://pmb.unpas.ac.id/quiz/`;
    if (navigator.share) navigator.share({ title:'Hasil Prodi Finder UNPAS', text:txt });
    else navigator.clipboard.writeText(txt).then(() => alert('Link sudah dicopy!'));
  };
  const restartQuiz = () => {
    setScreen('landing'); setCurQ(0);
    setAnswers(Array(QS.length).fill(null)); setFeeling(null);
    setForm({ name:'',phone:'',school:'',kelas:'',prodiMinat:'' });
    setDimScores({ bisnis:0,sosial:0,sains:0,seni:0,publik:0,teknik:0 });
    setResultData(null); topProdiRef.current = null;
  };

  // ── Common styles ─────────────────────────────────────────
  const WRAP = { maxWidth:'540px', margin:'0 auto', padding:'1rem', minHeight:'100vh', fontFamily:"'Plus Jakarta Sans',sans-serif", background:'var(--bg)', color:'var(--text)' };
  const GOLD = '#F5C842', ACC = '#7C6EF5';

  // ════════════════════════════════════════════════
  // LANDING
  // ════════════════════════════════════════════════
  if (screen === 'landing') return (
    <div className="qv5-fadeUp" style={{ width:'100%', minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'60px 24px', fontFamily:"'Plus Jakarta Sans',sans-serif", background:`radial-gradient(ellipse 80% 60% at 50% 0%,rgba(124,110,245,.18) 0%,transparent 70%),var(--bg)`, color:'var(--text)', boxSizing:'border-box' }}>
      <div className="qv5-float" style={{ marginBottom:24 }}>
        <img src="/quiz/logo_unpas.png" alt="Logo UNPAS" style={{ width:72, height:'auto', objectFit:'contain' }} />
      </div>
      <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(245,200,66,.15)', border:'1px solid rgba(245,200,66,.3)', color:GOLD, fontSize:11, fontWeight:700, letterSpacing:2, textTransform:'uppercase', padding:'6px 16px', borderRadius:20, marginBottom:24 }}>
        <span className="qv5-pulse" style={{ width:6, height:6, borderRadius:'50%', background:GOLD, display:'inline-block' }} />
        UNPAS · Panduan Milih Prodi
      </div>
      <h1 style={{ fontSize:'clamp(28px,8vw,50px)', fontWeight:900, lineHeight:1.1, marginBottom:16 }}>
        Bingung mau<br />
        <span style={{ background:'linear-gradient(135deg,#F5C842,#FF9F45,#7C6EF5)', backgroundSize:'200% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
          kuliah jurusan apa?
        </span>
      </h1>
      <p style={{ fontSize:15, color:'var(--muted)', lineHeight:1.8, maxWidth:400, marginBottom:28 }}>
        <strong style={{ color:'var(--text)' }}>Tenang, kamu nggak sendirian.</strong><br />
        Ribuan calon mahasiswa ngerasa hal yang sama. Kita bantu kamu nemuin prodi yang beneran cocok — bukan cuma ikut-ikutan temen.
      </p>
      <div style={{ display:'flex', flexWrap:'nowrap', gap:8, overflowX:'auto', width:'100%', justifyContent:'center', marginBottom:28, padding:'4px 0', scrollbarWidth:'none', msOverflowStyle:'none', WebkitOverflowScrolling:'touch' }}>
        {VIBE_PILLS.map(v => (
          <button key={v} onClick={() => toggleVibe(v)}
            style={{ padding:'8px 16px', borderRadius:20, fontSize:13, fontWeight:500,
              whiteSpace:'nowrap', flexShrink:0,
              border:`1px solid ${vibes.includes(v) ? 'rgba(245,200,66,.35)' : 'rgba(255,255,255,.13)'}`,
              color: vibes.includes(v) ? GOLD : 'rgba(240,237,232,.5)',
              background: vibes.includes(v) ? 'rgba(245,200,66,.13)' : 'rgba(255,255,255,.04)',
              cursor:'pointer', transition:'border-color .2s, color .2s, background .2s',
              fontFamily:"'Plus Jakarta Sans',sans-serif" }}
          >{v}</button>
        ))}
      </div>
      <button onClick={startQuiz}
        style={{ display:'inline-flex', alignItems:'center', gap:10, background:`linear-gradient(135deg,${GOLD},#FF9F45)`, color:'#0D0F1A', fontSize:16, fontWeight:800, padding:'16px 36px', borderRadius:16, border:'none', cursor:'pointer', boxShadow:`0 8px 32px rgba(245,200,66,.3)`, transition:'.25s', fontFamily:"'Plus Jakarta Sans',sans-serif" }}
        onMouseOver={e => { e.currentTarget.style.transform='translateY(-2px)'; }}
        onMouseOut={e  => { e.currentTarget.style.transform=''; }}
      >
        Mulai Temukan Prodimu
        <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </button>
      <div style={{ marginTop:32, display:'flex', alignItems:'center', gap:20, justifyContent:'center', flexWrap:'wrap' }}>
        {[['✦ 27 Prodi S1'],['✦ 7 Fakultas'],['✦ Akreditasi Unggul'],['✦ ~3 menit']].map(([l]) => (
          <span key={l} style={{ fontSize:12, color:'var(--muted2)' }}>{l}</span>
        ))}
      </div>
    </div>
  );

  // ════════════════════════════════════════════════
  // FEELING
  // ════════════════════════════════════════════════
  if (screen === 'feeling') return (
    <div className="qv5-fadeUp" style={{ ...WRAP, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px 20px', background:`radial-gradient(ellipse 60% 50% at 50% 100%,rgba(248,113,113,.1) 0%,transparent 70%),var(--bg)` }}>
      <div style={{ width:'100%', maxWidth:480, textAlign:'center' }}>
        <div className="qv5-float" style={{ fontSize:44, marginBottom:20 }}>🤔</div>
        <h2 style={{ fontSize:'clamp(22px,6vw,34px)', fontWeight:900, lineHeight:1.2, marginBottom:12 }}>
          Jujur deh,<br />sekarang kamu lagi ngerasa gimana?
        </h2>
        <p style={{ fontSize:14, color:'var(--muted)', lineHeight:1.7, marginBottom:28 }}>
          Ini bukan soal benar atau salah. Kita mau mulai dari tempat yang beneran kamu rasain sekarang.
        </p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:24 }}>
          {[
            { key:'galau',    emoji:'😵‍💫', label:'Galau banget',            sub:'Banyak pilihan tapi nggak ada yang yakin' },
            { key:'excited',  emoji:'✨',    label:'Excited tapi bingung',    sub:'Ngerasa ada yang cocok tapi belum yakin' },
            { key:'pressure', emoji:'😮‍💨', label:'Ada tekanan',             sub:'Orang tua atau lingkungan punya ekspektasi' },
            { key:'ready',    emoji:'💪',    label:'Siap & mau konfirmasi',   sub:'Udah ada gambaran, tinggal mastiin' },
          ].map(({ key, emoji, label, sub }) => (
            <button key={key} onClick={() => chooseFeelingAndNext(key)}
              style={{ all:'unset', boxSizing:'border-box', background: feeling===key ? 'var(--accent2)' : 'var(--card)', border:`1.5px solid ${feeling===key ? ACC : 'rgba(255,255,255,.08)'}`, borderRadius:20, padding:'20px 16px', cursor:'pointer', textAlign:'center', transition:'.25s', display:'block', width:'100%' }}
            >
              <span style={{ fontSize:30, display:'block', marginBottom:8 }}>{emoji}</span>
              <span style={{ fontSize:14, fontWeight:700, color:'var(--text)', display:'block', marginBottom:4 }}>{label}</span>
              <span style={{ fontSize:11.5, color:'var(--muted)', lineHeight:1.4, display:'block' }}>{sub}</span>
            </button>
          ))}
        </div>
        <button onClick={() => chooseFeelingAndNext('skip')}
          style={{ background:'none', border:'none', cursor:'pointer', fontSize:12, color:'var(--muted2)', fontFamily:"'Plus Jakarta Sans',sans-serif", textDecoration:'underline', textUnderlineOffset:3 }}
        >
          Lewati pertanyaan ini →
        </button>
      </div>
    </div>
  );

  // ════════════════════════════════════════════════
  // QUIZ
  // ════════════════════════════════════════════════
  if (screen === 'quiz') {
    const q = QS[curQ];
    const pct = Math.round((curQ / QS.length) * 100);
    return (
      <div className="qv5-fadeUp" style={{ ...WRAP, padding:0 }}>
        <div style={{ padding:'20px 20px 16px', position:'sticky', top:0, background:'var(--bg)', zIndex:50, borderBottom:'1px solid var(--border)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
            <button onClick={quizBack} style={{ all:'unset', boxSizing:'border-box', width:36, height:36, borderRadius:10, background:'var(--card)', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:16, flexShrink:0 }}>←</button>
            <span style={{ fontSize:12, fontWeight:700, color:'var(--muted)', letterSpacing:1, textTransform:'uppercase' }}>Pertanyaan {curQ+1}</span>
            <span style={{ marginLeft:'auto', fontSize:12, fontWeight:700, color:GOLD }}>{curQ+1} / {QS.length}</span>
          </div>
          <div style={{ height:4, background:'var(--bg3)', borderRadius:4, overflow:'hidden' }}>
            <div className="qv5-prog-fill" style={{ width:`${pct}%` }} />
          </div>
        </div>

        <div style={{ padding:'28px 20px 60px', maxWidth:540, margin:'0 auto' }}>
          {curQ === 0 && feeling && feeling !== 'skip' && FEELING_RESPONSES[feeling] && (
            <div style={{ background:'var(--accent2)', border:'1px solid rgba(124,110,245,.3)', borderRadius:16, padding:'14px 18px', marginBottom:24, fontSize:13.5, color:'var(--text)', lineHeight:1.7 }}
              dangerouslySetInnerHTML={{ __html:`💬 ${FEELING_RESPONSES[feeling]}` }}
            />
          )}
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', color:ACC, marginBottom:10, background:'var(--accent2)', padding:'4px 12px', borderRadius:20 }}>
            {q.context}
          </div>
          <div style={{ fontSize:'clamp(18px,5vw,26px)', fontWeight:800, lineHeight:1.3, color:'var(--text)', marginBottom:8 }}>{q.q}</div>
          <div style={{ fontSize:13, color:'var(--muted)', lineHeight:1.6, marginBottom:28 }}>{q.hint}</div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {q.opts.map((opt, oi) => {
              const chosen = answers[curQ] === oi;
              return (
                <button key={oi} className={`qv5-opt${chosen ? ' chosen' : ''}`} onClick={() => selectOpt(curQ, oi)}>
                  <div className="qv5-opt-icon">{opt.icon}</div>
                  <div style={{ flex:1 }}>
                    <span style={{ fontSize:15, fontWeight:700, color:'var(--text)', display:'block', marginBottom:3 }}>{opt.main}</span>
                    <span style={{ fontSize:12, color:'var(--muted)', lineHeight:1.45, display:'block' }}>{opt.sub}</span>
                  </div>
                  <div className="qv5-opt-check">{chosen ? '✓' : ''}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════
  // LOADING
  // ════════════════════════════════════════════════
  if (screen === 'loading') {
    const msgs = [
      { txt:'Lagi nganalisis jawaban kamu...',             bold:false },
      { txt:'Mencocokkan profil ke 27 prodi UNPAS...',     bold:false },
      { txt:'Nemu beberapa yang menarik nih! 🎯',         bold:false },
      { txt:'Hampir selesai...',                          bold:false },
      { txt:'Ketemu!',                                    bold:true  },
    ];
    return (
      <div className="qv5-fadeUp" style={{ ...WRAP, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'40px 20px' }}>
        <div className="qv5-spinner" style={{ width:100, height:100, borderRadius:'50%', background:'conic-gradient(#F5C842,#7C6EF5,#34D399,#F5C842)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 28px' }}>
          <div style={{ width:80, height:80, borderRadius:'50%', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:32 }}>🔍</div>
        </div>
        <div style={{ minHeight:80, display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
          {msgs.slice(0, loadingStep).map((m, i) => (
            <div key={i} className="qv5-fadeUp" style={{ fontSize:m.bold?18:15, fontWeight:m.bold?800:400, color:m.bold?'var(--text)':'var(--muted)', lineHeight:1.6 }}>
              {m.txt}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════
  // CAPTURE
  // ════════════════════════════════════════════════
  if (screen === 'capture') {
    const peek = topProdiRef.current;
    return (
      <div className="qv5-fadeUp" style={{ ...WRAP, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px 20px', background:`radial-gradient(ellipse 70% 60% at 50% 0%,rgba(245,200,66,.1) 0%,transparent 60%),var(--bg)` }}>
        <div style={{ width:'100%', maxWidth:420, textAlign:'center' }}>
          <div className="qv5-float" style={{ fontSize:44, marginBottom:20 }}>🎯</div>
          <h2 style={{ fontSize:'clamp(20px,5vw,28px)', fontWeight:900, lineHeight:1.25, marginBottom:8 }}>Hasil kamu udah siap!</h2>
          <p style={{ fontSize:13.5, color:'var(--muted)', lineHeight:1.7, marginBottom:20 }}>
            Isi data untuk lihat rekomendasi prodi lengkap + info potongan DP yang berlaku.
          </p>
          {peek && (
            <div style={{ background:'var(--card)', border:'1.5px solid var(--border2)', borderRadius:20, padding:20, marginBottom:24, position:'relative', overflow:'hidden' }}>
              <div style={{ fontSize:18, fontWeight:800, color:GOLD, marginBottom:4 }}>{peek.emoji} {peek.title} ({peek.pct}% cocok)</div>
              <div style={{ fontSize:13, color:'var(--muted)' }}>+ 3 prodi alternatif yang juga cocok</div>
              <div style={{ position:'absolute', inset:0, backdropFilter:'blur(8px)', background:'rgba(13,15,26,.7)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, letterSpacing:4, color:'var(--muted2)' }}>🔒 🔒 🔒</div>
            </div>
          )}
          <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:16, textAlign:'left' }}>
            <input className="qv5-input" type="text"    placeholder="Nama lengkap kamu"            value={form.name}      onChange={e => setForm({...form, name:e.target.value})} />
            <input className="qv5-input" type="tel"     placeholder="Nomor WhatsApp (08xx...)"    value={form.phone}     onChange={e => setForm({...form, phone:e.target.value})} />
            <input className="qv5-input" type="text"    placeholder="Asal sekolah kamu"           value={form.school}    onChange={e => setForm({...form, school:e.target.value})} />
            <div style={{ position:'relative' }}>
              <select className={`qv5-select${!form.kelas ? ' empty' : ''}`} value={form.kelas} onChange={e => setForm({...form, kelas:e.target.value})}>
                <option value="">Kelas kamu sekarang</option>
                <optgroup label="Kelas 10">
                  <option value="Kelas 10 IPA">Kelas 10 IPA</option>
                  <option value="Kelas 10 IPS">Kelas 10 IPS</option>
                  <option value="Kelas 10 Bahasa">Kelas 10 Bahasa</option>
                  <option value="Kelas 10">Kelas 10 (lainnya)</option>
                </optgroup>
                <optgroup label="Kelas 11">
                  <option value="Kelas 11 IPA">Kelas 11 IPA</option>
                  <option value="Kelas 11 IPS">Kelas 11 IPS</option>
                  <option value="Kelas 11 Bahasa">Kelas 11 Bahasa</option>
                  <option value="Kelas 11">Kelas 11 (lainnya)</option>
                </optgroup>
                <optgroup label="Kelas 12">
                  <option value="Kelas 12 IPA">Kelas 12 IPA</option>
                  <option value="Kelas 12 IPS">Kelas 12 IPS</option>
                  <option value="Kelas 12 Bahasa">Kelas 12 Bahasa</option>
                  <option value="Kelas 12">Kelas 12 (lainnya)</option>
                </optgroup>
                <option value="Sudah Lulus SMA">Sudah Lulus SMA / Sederajat</option>
                <option value="Mahasiswa Transfer">Mahasiswa Transfer / RPL</option>
              </select>
              <span style={{ position:'absolute', right:16, top:'50%', transform:'translateY(-50%)', pointerEvents:'none', fontSize:12, color:'var(--muted)' }}>▾</span>
            </div>
            <input className="qv5-input" type="text" placeholder="Prodi yang diminati (opsional)" value={form.prodiMinat} onChange={e => setForm({...form, prodiMinat:e.target.value})} />
          </div>
          <button onClick={submitData}
            style={{ all:'unset', boxSizing:'border-box', display:'block', width:'100%', padding:15, borderRadius:14, background:`linear-gradient(135deg,${GOLD},#FF9F45)`, color:'#0D0F1A', fontSize:16, fontWeight:800, cursor:'pointer', textAlign:'center', transition:'.2s', fontFamily:"'Plus Jakarta Sans',sans-serif", marginBottom:12 }}
            onMouseOver={e => { e.currentTarget.style.opacity='.9'; e.currentTarget.style.transform='translateY(-1px)'; }}
            onMouseOut={e  => { e.currentTarget.style.opacity='1';  e.currentTarget.style.transform=''; }}
          >
            Lihat Hasil Lengkap →
          </button>
          <p style={{ fontSize:11, color:'var(--muted2)', lineHeight:1.5, marginBottom:8 }}>🔒 Data kamu aman. Hanya digunakan tim admisi UNPAS untuk follow-up.</p>
          <button onClick={skipCapture}
            style={{ background:'none', border:'none', cursor:'pointer', fontSize:12, color:'var(--muted2)', fontFamily:"'Plus Jakarta Sans',sans-serif", textDecoration:'underline', textUnderlineOffset:3, display:'block', width:'100%', textAlign:'center' }}
          >
            Lewati, lihat hasil tanpa simpan data
          </button>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════
  // RESULT
  // ════════════════════════════════════════════════
  if (screen === 'result' && resultData) {
    const { scored, top, persona } = resultData;
    const others  = scored.slice(1, 5);
    const topFac  = FAC[top.fac] || { name:'', color:GOLD, short:'' };
    const biaya   = BIAYA[top.id] || 'Hubungi CS';
    const proof   = SOCIAL[top.id] || '';
    const fm      = FEELING_MSGS[feeling || 'skip'] || FEELING_MSGS.skip;
    const whyMsg  = (top.why && (top.why[feeling] || top.why.ready)) || 'Berdasarkan jawabanmu, prodi ini paling match sama profil dan nilai-nilaimu.';

    return (
      <>
        <Confetti active={confetti} />
        <div className="qv5-fadeUp" style={{ ...WRAP, padding:0, overflowY:'auto' }}>

          {/* Urgency bar */}
          <div style={{ background:'linear-gradient(135deg,rgba(248,113,113,.15),rgba(251,146,60,.15))', border:'1px solid rgba(248,113,113,.3)', padding:'10px 20px', display:'flex', alignItems:'center', justifyContent:'center', gap:10, fontSize:13, fontWeight:600, color:'#F87171' }}>
            <span className="qv5-pulse" style={{ width:7, height:7, borderRadius:'50%', background:'#F87171', flexShrink:0, display:'inline-block' }} />
            ⏳ Potongan DP Rp 1,5 juta · berlaku sampai 30 Juni 2026 · Kuota terbatas
          </div>

          {/* Hero */}
          <div style={{ padding:'36px 20px 28px', textAlign:'center', background:`radial-gradient(ellipse 70% 50% at 50% 0%,rgba(52,211,153,.12) 0%,transparent 60%),var(--bg)`, borderBottom:'1px solid var(--border)' }}>
            <div className="qv5-float" style={{ fontSize:36, marginBottom:16 }}>{fm.confetti}</div>
            <div style={{ fontSize:13, fontWeight:700, letterSpacing:2, textTransform:'uppercase', color:'#34D399', background:'var(--green2)', padding:'4px 14px', borderRadius:20, display:'inline-block', marginBottom:16 }}>{fm.greeting}</div>
            <h2 style={{ fontSize:'clamp(20px,5vw,30px)', fontWeight:900, lineHeight:1.2, marginBottom:8 }}>
              {typeof fm.title === 'function' ? fm.title(top.title) : fm.title}
            </h2>
            <p style={{ fontSize:14, color:'var(--muted)', lineHeight:1.7, maxWidth:360, margin:'0 auto 20px' }}>{fm.sub}</p>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'var(--card)', border:'1.5px solid var(--border2)', borderRadius:12, padding:'10px 20px', fontSize:14, fontWeight:700 }}>
              <span style={{ fontSize:20 }}>{persona.emoji}</span><span>{persona.label}</span>
            </div>
          </div>

          {/* Body */}
          <div style={{ padding:'20px', maxWidth:600, margin:'0 auto' }}>

            <SectionTitle>Rekomendasi Utama</SectionTitle>

            {/* Top card */}
            <div className="qv5-popin" style={{ background:'linear-gradient(135deg,var(--bg3),var(--card))', border:`2px solid ${GOLD}`, borderRadius:24, padding:24, marginBottom:12, position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:-40, right:-40, width:160, height:160, borderRadius:'50%', background:'radial-gradient(circle,rgba(245,200,66,.12),transparent 70%)', pointerEvents:'none' }} />
              <div style={{ display:'inline-flex', alignItems:'center', gap:5, background:GOLD, color:'#0D0F1A', fontSize:10, fontWeight:700, letterSpacing:1, textTransform:'uppercase', padding:'3px 10px', borderRadius:20, marginBottom:14 }}>⭐ Paling Cocok</div>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', color:topFac.color, marginBottom:6 }}>{topFac.name}</div>
              <div style={{ fontSize:24, fontWeight:900, marginBottom:8, lineHeight:1.2 }}>{top.emoji} {top.title}</div>

              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
                <span style={{ fontSize:22, fontWeight:700, color:GOLD, flexShrink:0 }}>{top.pct}%</span>
                <div style={{ flex:1, height:8, background:'rgba(255,255,255,.08)', borderRadius:4, overflow:'hidden' }}><MatchBar pct={top.pct} /></div>
                <span style={{ fontSize:11, color:'var(--muted)' }}>kecocokan</span>
              </div>

              {proof && (
                <div style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(52,211,153,.08)', border:'1px solid rgba(52,211,153,.2)', borderRadius:10, padding:'8px 14px', marginBottom:14, fontSize:12, color:'#34D399' }}>
                  <span style={{ fontSize:14, flexShrink:0 }}>✅</span><span>{proof}</span>
                </div>
              )}

              <p style={{ fontSize:13.5, color:'var(--muted)', lineHeight:1.7, marginBottom:16 }}>{top.desc}</p>

              <div style={{ background:'rgba(255,255,255,.04)', border:'1px solid var(--border)', borderRadius:14, padding:'14px 16px', marginBottom:16 }}>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:GOLD, marginBottom:8 }}>◆ Kenapa ini cocok buat kamu</div>
                {[whyMsg, `Persona kamu sebagai <strong>${persona.label}</strong> — ${persona.desc.toLowerCase()}.`].map((txt, i) => (
                  <div key={i} style={{ display:'flex', gap:8, alignItems:'flex-start', marginBottom:6 }}>
                    <div style={{ width:6, height:6, borderRadius:'50%', background:GOLD, flexShrink:0, marginTop:5 }} />
                    <div style={{ fontSize:13, color:'var(--muted)', lineHeight:1.5 }} dangerouslySetInnerHTML={{ __html:txt }} />
                  </div>
                ))}
              </div>

              <div style={{ background:'rgba(245,200,66,.06)', border:'1px solid rgba(245,200,66,.2)', borderRadius:14, padding:'12px 16px', marginBottom:16, display:'flex', alignItems:'center', gap:12 }}>
                <span style={{ fontSize:20, flexShrink:0 }}>💳</span>
                <div>
                  <div style={{ fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:GOLD, marginBottom:3 }}>Biaya Semester 1</div>
                  <div style={{ fontSize:14, fontWeight:700, color:'var(--text)' }}>{biaya} <span style={{ fontSize:11, color:'var(--muted)', fontWeight:400 }}>/ cicilan 1</span></div>
                  <div style={{ fontSize:11, color:'var(--muted)' }}>Potongan DP Rp 1,5 jt berlaku s.d. 30 Juni 2026</div>
                </div>
              </div>

              <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:20 }}>
                {top.karier.map(k => <span key={k} className="qv5-karier-tag">{k}</span>)}
              </div>

              <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                <button onClick={handleDaftar}
                  style={{ flex:1, minWidth:140, display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:14, borderRadius:14, background:GOLD, color:'#0D0F1A', fontSize:15, fontWeight:800, border:'none', cursor:'pointer', transition:'.2s', fontFamily:"'Plus Jakarta Sans',sans-serif" }}
                  onMouseOver={e => { e.currentTarget.style.opacity='.9'; }} onMouseOut={e => { e.currentTarget.style.opacity='1'; }}
                >Daftar Sekarang →</button>
                <button onClick={handleChat}
                  style={{ flex:1, minWidth:100, display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:12, borderRadius:14, background:'var(--card)', color:'#34D399', fontSize:13, fontWeight:600, border:'1.5px solid rgba(52,211,153,.4)', cursor:'pointer', transition:'.2s', fontFamily:"'Plus Jakarta Sans',sans-serif" }}
                  onMouseOver={e => { e.currentTarget.style.background='var(--green2)'; }} onMouseOut={e => { e.currentTarget.style.background='var(--card)'; }}
                >💬 Chat WA</button>
                <button onClick={handleShare}
                  style={{ flex:1, minWidth:100, display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:12, borderRadius:14, background:'var(--card)', color:'var(--text)', fontSize:13, fontWeight:600, border:'1.5px solid var(--border2)', cursor:'pointer', transition:'.2s', fontFamily:"'Plus Jakarta Sans',sans-serif" }}
                  onMouseOver={e => { e.currentTarget.style.borderColor='var(--text)'; }} onMouseOut={e => { e.currentTarget.style.borderColor='var(--border2)'; }}
                >📤 Share</button>
              </div>
            </div>

            {/* Alternatif */}
            <SectionTitle style={{ marginTop:20 }}>Alternatif yang Juga Cocok</SectionTitle>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:12, marginBottom:28 }}>
              {others.map((p, i) => {
                const f = FAC[p.fac] || { color:GOLD, short:'' };
                return (
                  <div key={p.id} className="qv5-other-card" style={{ animationDelay:`${i*0.1}s` }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                      <div style={{ width:40, height:40, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0, background:`${f.color}22`, color:f.color }}>{p.emoji}</div>
                      <div>
                        <div style={{ fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', color:f.color, marginBottom:2 }}>{f.short}</div>
                        <div style={{ fontSize:12, fontWeight:700, color:f.color }}>{p.pct}% cocok</div>
                      </div>
                    </div>
                    <div style={{ height:3, background:'rgba(255,255,255,.08)', borderRadius:2, overflow:'hidden', marginBottom:10 }}>
                      <div style={{ height:'100%', borderRadius:2, background:f.color, width:`${p.pct}%` }} />
                    </div>
                    <div style={{ fontSize:15, fontWeight:700, marginBottom:4, color:'var(--text)' }}>{p.title}</div>
                    <div style={{ fontSize:12, color:'var(--muted)', lineHeight:1.55, marginBottom:10 }}>{p.desc.substring(0,80)}…</div>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
                      {p.tags.map(t => <span key={t} style={{ fontSize:10, fontWeight:500, padding:'2px 8px', borderRadius:10, background:'rgba(255,255,255,.06)', color:'var(--muted)' }}>{t}</span>)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Irisan */}
            {top.irisan && top.irisan.length > 0 && (
              <>
                <SectionTitle>Prodi yang Beririsan</SectionTitle>
                <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:28 }}>
                  {top.irisan.map(iid => {
                    const ip = PRODI_MAP[iid]; if (!ip) return null;
                    const ifac = FAC[ip.fac] || { color:GOLD, short:'' };
                    return (
                      <div key={iid} style={{ display:'flex', alignItems:'center', gap:12, background:'var(--card)', border:'1px solid var(--border)', borderRadius:14, padding:'14px 16px' }}>
                        <div style={{ width:10, height:10, borderRadius:'50%', background:ifac.color, flexShrink:0 }} />
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:13, fontWeight:700, color:'var(--text)', marginBottom:2 }}>{ip.emoji} {ip.title} <span style={{ fontSize:10, color:'var(--muted)', fontWeight:400 }}>· {ifac.short}</span></div>
                          <div style={{ fontSize:11.5, color:'var(--muted)', lineHeight:1.4 }}>{ip.desc.substring(0,65)}…</div>
                        </div>
                        <span style={{ color:'var(--muted2)', fontSize:14 }}>›</span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* Restart */}
            <div style={{ textAlign:'center', paddingBottom:40 }}>
              <button onClick={restartQuiz}
                style={{ background:'none', border:'1.5px solid var(--border2)', color:'var(--muted)', fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:13, fontWeight:500, padding:'10px 24px', borderRadius:12, cursor:'pointer', transition:'.2s' }}
                onMouseOver={e => { e.currentTarget.style.borderColor='var(--text)'; e.currentTarget.style.color='var(--text)'; }}
                onMouseOut={e  => { e.currentTarget.style.borderColor='var(--border2)'; e.currentTarget.style.color='var(--muted)'; }}
              >↩ Ulangi dari awal</button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return null;
}

// ── Small helpers ─────────────────────────────────────────
function SectionTitle({ children, style }) {
  return (
    <div style={{ fontSize:11, fontWeight:700, letterSpacing:2, textTransform:'uppercase', color:'var(--muted)', marginBottom:16, display:'flex', alignItems:'center', gap:8, ...style }}>
      {children}
      <span style={{ flex:1, height:1, background:'var(--border)', display:'block' }} />
    </div>
  );
}
