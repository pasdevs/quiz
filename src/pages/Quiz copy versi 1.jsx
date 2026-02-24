import { useState, useEffect, useRef } from 'react';
import axios from "axios";
import Swal from "sweetalert2";

const API_URL = import.meta.env.VITE_API_LEAD_URL;

// ============================================================
// GLOBAL STYLES — mirrors original CSS 1:1, no Tailwind dependency
// ============================================================
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'Plus Jakarta Sans', sans-serif !important;
    background: #fafbfe;
    color: #334155;
    line-height: 1.6;
    min-height: 100vh;
  }

  #root { font-family: 'Plus Jakarta Sans', sans-serif; }

  @keyframes quiz-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.5; transform: scale(1.3); }
  }
  @keyframes quiz-spin { to { transform: rotate(360deg); } }
  @keyframes quiz-confettiFall {
    0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
  }

  .qz-pulse  { animation: quiz-pulse 2s infinite; }
  .qz-spin   { animation: quiz-spin 0.8s linear infinite; }
  .qz-confetti { position: absolute; top: -10px; animation: quiz-confettiFall 3s ease-in forwards; }

  /* ── Option card ── */
  .qz-option {
    display: flex; align-items: center; gap: 14px;
    padding: 16px 20px; border-radius: 14px; border: 2px solid #e8ecf1;
    background: #ffffff; cursor: pointer; transition: all 0.2s; text-align: left;
    width: 100%; font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .qz-option:hover    { border-color: #2563eb; background: #dbeafe; }
  .qz-option.selected { border-color: #2563eb; background: #dbeafe; }

  /* ── Nav buttons ── */
  .qz-btn-back {
    padding: 12px 24px; border-radius: 12px; border: 2px solid #e8ecf1;
    background: transparent; color: #64748b;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.2s;
  }
  .qz-btn-back:hover { border-color: #64748b; color: #0f172a; }

  .qz-btn-next {
    padding: 12px 32px; border-radius: 12px; border: none;
    background: #2563eb; color: #ffffff;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.9rem; font-weight: 700; cursor: pointer; transition: all 0.2s;
  }
  .qz-btn-next:disabled          { opacity: 0.4; cursor: not-allowed; }
  .qz-btn-next:not(:disabled):hover { background: #1d4ed8; }

  /* ── Form input ── */
  .qz-input {
    width: 100%; padding: 12px 16px; border-radius: 10px; border: 2px solid #e8ecf1;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.9rem; color: #0f172a; background: #fafbfe;
    transition: border-color 0.2s; outline: none;
  }
  .qz-input:focus       { border-color: #2563eb; }
  .qz-input::placeholder { color: #94a3b8; }

  /* ── Submit button ── */
  .qz-btn-submit {
    width: 100%; padding: 14px; border-radius: 12px; border: none;
    background: linear-gradient(135deg, #2563eb, #06b6d4);
    color: #ffffff; font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 1rem; font-weight: 700;
    cursor: pointer; margin-top: 0.5rem; transition: all 0.3s;
    box-shadow: 0 4px 16px rgba(37,99,235,0.3);
  }
  .qz-btn-submit:hover { transform: translateY(-1px); }

  /* ── Landing CTA ── */
  .qz-btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 16px 40px; border-radius: 14px; border: none;
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    color: #ffffff; font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 1.05rem; font-weight: 700;
    cursor: pointer; transition: all 0.3s;
    box-shadow: 0 4px 16px rgba(37,99,235,0.35);
  }
  .qz-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(37,99,235,0.4); }

  /* ── Result CTA ── */
  .qz-btn-cta-primary {
    width: 100%; padding: 14px; border-radius: 12px; border: none;
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    color: #ffffff; font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.95rem; font-weight: 700; cursor: pointer;
    box-shadow: 0 4px 16px rgba(37,99,235,0.3); transition: all 0.3s;
  }
  .qz-btn-cta-primary:hover { transform: translateY(-1px); }

  .qz-btn-cta-secondary {
    width: 100%; padding: 14px; border-radius: 12px; border: 2px solid #2563eb;
    background: transparent; color: #2563eb;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.95rem; font-weight: 700; cursor: pointer; transition: all 0.2s;
  }
  .qz-btn-cta-secondary:hover { background: #dbeafe; }

  .qz-btn-share {
    width: 100%; padding: 12px; border-radius: 10px; border: 2px solid #e8ecf1;
    background: transparent; color: #64748b;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.85rem; font-weight: 600; cursor: pointer; margin-top: 0.5rem; transition: all 0.2s;
  }
  .qz-btn-share:hover { border-color: #64748b; color: #0f172a; }

  /* ── Score bars ── */
  .qz-bar { height: 100%; border-radius: 9999px; transition: width 1s ease; }
  .qz-bar.tech     { background: linear-gradient(90deg, #3b82f6, #06b6d4); }
  .qz-bar.human    { background: linear-gradient(90deg, #8b5cf6, #6366f1); }
  .qz-bar.biz      { background: linear-gradient(90deg, #f59e0b, #ef4444); }
  .qz-bar.creative { background: linear-gradient(90deg, #ec4899, #8b5cf6); }

  /* ── Result card top stripe ── */
  .qz-result-card { position: relative; overflow: hidden; }
  .qz-result-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; }
  .qz-result-card.tech::before     { background: linear-gradient(90deg, #3b82f6, #06b6d4); }
  .qz-result-card.human::before    { background: linear-gradient(90deg, #8b5cf6, #6366f1); }
  .qz-result-card.biz::before      { background: linear-gradient(90deg, #f59e0b, #ef4444); }
  .qz-result-card.creative::before { background: linear-gradient(90deg, #ec4899, #8b5cf6); }

  /* ── Cluster label color per type ── */
  .qz-result-card.tech     .qz-cluster { color: #3b82f6; }
  .qz-result-card.human    .qz-cluster { color: #8b5cf6; }
  .qz-result-card.biz      .qz-cluster { color: #f59e0b; }
  .qz-result-card.creative .qz-cluster { color: #ec4899; }

  /* ── Prodi tag color per type ── */
  .qz-result-card.tech     .qz-prodi-tag { background: rgba(59,130,246,0.1);  color: #3b82f6; }
  .qz-result-card.human    .qz-prodi-tag { background: rgba(139,92,246,0.1);  color: #8b5cf6; }
  .qz-result-card.biz      .qz-prodi-tag { background: rgba(245,158,11,0.1);  color: #f59e0b; }
  .qz-result-card.creative .qz-prodi-tag { background: rgba(236,72,153,0.1);  color: #ec4899; }

  /* ── Secondary CTA color per type ── */
  .qz-result-card.tech     .qz-btn-cta-secondary { border-color: #3b82f6; color: #3b82f6; }
  .qz-result-card.human    .qz-btn-cta-secondary { border-color: #8b5cf6; color: #8b5cf6; }
  .qz-result-card.biz      .qz-btn-cta-secondary { border-color: #f59e0b; color: #f59e0b; }
  .qz-result-card.creative .qz-btn-cta-secondary { border-color: #ec4899; color: #ec4899; }
  .qz-result-card.tech     .qz-btn-cta-secondary:hover { background: rgba(59,130,246,0.08); }
  .qz-result-card.human    .qz-btn-cta-secondary:hover { background: rgba(139,92,246,0.08); }
  .qz-result-card.biz      .qz-btn-cta-secondary:hover { background: rgba(245,158,11,0.08); }
  .qz-result-card.creative .qz-btn-cta-secondary:hover { background: rgba(236,72,153,0.08); }

  /* ── Feature icon ── */
  .qz-feature-icon {
    width: 24px; height: 24px; border-radius: 6px; background: #f1f5f9;
    display: flex; align-items: center; justify-content: center; font-size: 0.7rem;
  }

  /* ── Responsive ── */
  @media (max-width: 480px) {
    .qz-h1           { font-size: 1.5rem !important; }
    .qz-question-text { font-size: 1.1rem !important; }
    .qz-capture-card, .qz-result-card { padding: 1.5rem !important; }
  }
`;

// ============================================================
// DATA
// ============================================================
const questions = [
  {
    text: "Kalau lagi weekend, kamu paling sering ngapain?", options: [
      { emoji: "🖥️", text: "Utak-atik gadget, coding, atau explore teknologi baru", type: "A" },
      { emoji: "📖", text: "Baca buku, nulis, atau journaling", type: "B" },
      { emoji: "💼", text: "Ngerjain side project atau cari peluang bisnis", type: "C" },
      { emoji: "🎨", text: "Bikin konten, desain, atau eksplor hal kreatif", type: "D" }
    ]
  },
  {
    text: "Proyek kelompok yang paling bikin kamu excited?", options: [
      { emoji: "💻", text: "Bikin aplikasi, website, atau sistem otomatis", type: "A" },
      { emoji: "🔬", text: "Riset mendalam dan presentasi temuan", type: "B" },
      { emoji: "📊", text: "Bikin business plan atau strategi kampanye", type: "C" },
      { emoji: "🎬", text: "Produksi video, desain poster, atau creative content", type: "D" }
    ]
  },
  {
    text: "Video YouTube/TikTok yang paling sering kamu tonton?", options: [
      { emoji: "⚙️", text: "Tutorial tech, review gadget, atau coding tips", type: "A" },
      { emoji: "🧠", text: "Dokumenter, penjelasan sains, atau analisis sosial", type: "B" },
      { emoji: "🚀", text: "Business tips, success story, atau motivasi", type: "C" },
      { emoji: "🎵", text: "Art, musik, film review, atau behind-the-scenes", type: "D" }
    ]
  },
  {
    text: "Kalau jadi superhero, power apa yang kamu pilih?", options: [
      { emoji: "🤖", text: "Bisa hack dan kontrol semua sistem teknologi", type: "A" },
      { emoji: "🧠", text: "Bisa memahami pikiran dan perasaan semua orang", type: "B" },
      { emoji: "🎤", text: "Bisa meyakinkan siapapun dan memimpin jutaan orang", type: "C" },
      { emoji: "✨", text: "Bisa mewujudkan apapun dari imajinasi", type: "D" }
    ]
  },
  {
    text: "Pelajaran sekolah yang paling kamu suka?", options: [
      { emoji: "📐", text: "Matematika, Fisika, atau Informatika", type: "A" },
      { emoji: "📚", text: "Bahasa, Sejarah, Sosiologi, atau PKn", type: "B" },
      { emoji: "💰", text: "Ekonomi, Akuntansi, atau Kewirausahaan", type: "C" },
      { emoji: "🖌️", text: "Seni Budaya, Prakarya, atau Multimedia", type: "D" }
    ]
  },
  {
    text: "10 tahun lagi, kamu lihat diri kamu di mana?", options: [
      { emoji: "🏢", text: "Di kantor tech company atau startup digital", type: "A" },
      { emoji: "🔬", text: "Di ruang kelas, lab riset, atau lembaga think tank", type: "B" },
      { emoji: "👔", text: "Punya bisnis sendiri atau jadi top executive", type: "C" },
      { emoji: "🎬", text: "Di studio kreatif, agency, atau production house", type: "D" }
    ]
  },
  {
    text: "Cara belajar yang paling efektif buat kamu?", options: [
      { emoji: "🛠️", text: "Langsung praktek — trial and error", type: "A" },
      { emoji: "📖", text: "Baca teori mendalam dulu, baru praktek", type: "B" },
      { emoji: "🗣️", text: "Diskusi bareng teman atau kelompok", type: "C" },
      { emoji: "🗺️", text: "Visualisasi — mind map, diagram, gambar", type: "D" }
    ]
  },
  {
    text: "Kalau dikasih uang 100 juta, kamu pakai untuk apa?", options: [
      { emoji: "💻", text: "Bangun tech startup atau beli equipment canggih", type: "A" },
      { emoji: "🌍", text: "Travel belajar ke luar negeri atau biayai riset", type: "B" },
      { emoji: "📈", text: "Investasi atau buka usaha yang menguntungkan", type: "C" },
      { emoji: "🎨", text: "Bikin studio, galeri, atau produksi karya impian", type: "D" }
    ]
  },
  {
    text: "Quote yang paling relate sama kamu?", options: [
      { emoji: "⚡", text: '"The best way to predict the future is to create it"', type: "A" },
      { emoji: "📘", text: '"Knowledge is the most powerful weapon"', type: "B" },
      { emoji: "🤝", text: '"Your network is your net worth"', type: "C" },
      { emoji: "🌈", text: '"Creativity takes courage"', type: "D" }
    ]
  },
  {
    text: "Di grup teman, kamu biasanya jadi sosok yang...", options: [
      { emoji: "🔧", text: "Problem solver — kalau ada masalah teknis, cari kamu", type: "A" },
      { emoji: "📋", text: "Advisor — teman curhat dan minta saran bijak", type: "B" },
      { emoji: "👑", text: "Leader — ngatur, motivasi, dan bikin semuanya jalan", type: "C" },
      { emoji: "💡", text: "Ideator — selalu punya ide kreatif dan out of the box", type: "D" }
    ]
  },
];

const results = {
  A: {
    cls: "tech", emoji: "🚀", cluster: "Teknik & Teknologi",
    tagline: "Kamu cocok jadi Problem Solver di dunia teknologi!",
    desc: "Kamu punya pola pikir sistematis dan suka memecahkan masalah kompleks. Dunia teknologi butuh orang seperti kamu — yang bisa mengubah ide menjadi solusi nyata melalui kode, sistem, dan inovasi digital.",
    prodi: ["Teknik Informatika", "Teknik Industri", "Teknik Mesin", "Teknologi Pangan", "Teknik Lingkungan"]
  },
  B: {
    cls: "human", emoji: "🎓", cluster: "Sains & Humaniora",
    tagline: "Kamu punya potensi jadi Pemikir dan Educator!",
    desc: "Kamu tertarik memahami dunia secara mendalam — baik manusia, masyarakat, maupun bahasa. Dengan kemampuan analisis dan empati kamu, kamu bisa jadi pemimpin pemikiran di berbagai bidang.",
    prodi: ["Ilmu Hukum", "Sastra Inggris", "Ilmu Hubungan Internasional", "Pendidikan Guru Sekolah Dasar", "Pendidikan Bahasa dan Sastra Indonesia"]
  },
  C: {
    cls: "biz", emoji: "📊", cluster: "Bisnis & Sosial",
    tagline: "Kamu born to lead dan build sesuatu!",
    desc: "Kamu punya jiwa entrepreneur dan kemampuan networking yang kuat. Kamu melihat peluang di mana orang lain melihat masalah. Dunia bisnis dan organisasi butuh energi dan visi kamu.",
    prodi: ["Manajemen", "Akuntansi", "Ilmu Administrasi Bisnis", "Bisnis Digital", "Ilmu Komunikasi"]
  },
  D: {
    cls: "creative", emoji: "🎨", cluster: "Kreatif & Desain",
    tagline: "Kamu punya jiwa kreatif yang perlu disalurkan!",
    desc: "Kamu melihat dunia dengan mata yang berbeda — penuh warna, bentuk, dan cerita. Dengan kreativitas kamu, kamu bisa menciptakan karya yang menggerakkan emosi dan mengubah perspektif orang.",
    prodi: ["Desain Komunikasi Visual", "Fotografi", "Seni Musik", "Ilmu Komunikasi", "Perencanaan Wilayah dan Kota"]
  },
};

const clusterNames = { A: "Teknik & Teknologi", B: "Sains & Humaniora", C: "Bisnis & Sosial", D: "Kreatif & Desain" };
const clusterCls = { A: "tech", B: "human", C: "biz", D: "creative" };

// ============================================================
// PIXEL HELPERS
// ============================================================
const pixelReady = () => typeof window.fbq === 'function';

// EVENT 2: Quiz Started
// Panggil fungsi ini ketika user klik "Mulai Tes"
function trackQuizStart() {
  if (!pixelReady()) { console.warn('⚠️ E2: fbq not ready'); return; }
  window.fbq('track', 'Lead', {
    content_name: 'quiz_start',
    content_category: 'quiz_kecocokan_prodi'
  });
  console.log('✅ Pixel: quiz_start fired');
}

// EVENT 3: Quiz Progress — Halfway (Pertanyaan 5)
// Panggil ketika user sampai di pertanyaan ke-5
function trackQuizProgress(questionNumber) {
  if (questionNumber === 5) {
    if (!pixelReady()) { console.warn('⚠️ E3: fbq not ready'); return; }
    window.fbq('track', 'ViewContent', {
      content_name: 'quiz_progress',
      content_category: 'q5_halfway'
    });
    console.log('✅ Pixel: quiz_progress Q5 fired');
  }
}

// EVENT 4: Data Submitted
// Panggil ketika user submit nama + HP + sekolah
function trackDataSubmit() {
  if (!pixelReady()) { console.warn('⚠️ E4: fbq not ready'); return; }
  window.fbq('track', 'CompleteRegistration', {
    content_name: 'quiz_data_submit',
    status: 'lead_captured'
  });
  console.log('✅ Pixel: data_submit fired');
}

// EVENT 5: Result Viewed
// Panggil ketika halaman hasil quiz ditampilkan
// Parameter 'cluster' = tech / human / biz / creative
function trackResultView(cluster) {
  if (!pixelReady()) { console.warn('⚠️ E5: fbq not ready'); return; }
  window.fbq('track', 'ViewContent', {
    content_name: 'quiz_result',
    content_category: cluster // 'tech', 'human', 'biz', 'creative'
  });
  console.log('✅ Pixel: result_view fired — cluster:', cluster);
}

// EVENT 6: CTA Clicked
// Panggil ketika user klik "Daftar Sekarang" atau "Chat Admisi"
function trackCTAClick(ctaType) {
  if (!pixelReady()) { console.warn('⚠️ E6: fbq not ready'); return; }
  window.fbq('track', 'InitiateCheckout', {
    content_name: 'quiz_cta_click',
    content_category: ctaType // 'daftar' atau 'chat_admisi'
  });
  console.log('✅ Pixel: cta_click fired — type:', ctaType);
}

// ============================================================
// CONFETTI
// ============================================================
function Confetti({ active }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!active || !ref.current) return;
    const el = ref.current;
    const colors = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];
    const timers = [];
    for (let i = 0; i < 50; i++) {
      const t = setTimeout(() => {
        const c = document.createElement('div');
        c.className = 'qz-confetti';
        Object.assign(c.style, {
          left: Math.random() * 100 + '%',
          backgroundColor: colors[Math.floor(Math.random() * colors.length)],
          borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          width: (Math.random() * 8 + 6) + 'px',
          height: (Math.random() * 8 + 6) + 'px',
          animationDuration: (Math.random() * 2 + 2) + 's',
          animationDelay: Math.random() * 0.5 + 's',
        });
        el.appendChild(c);
        setTimeout(() => c.remove(), 4000);
      }, i * 50);
      timers.push(t);
    }
    return () => timers.forEach(clearTimeout);
  }, [active]);
  return <div ref={ref} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1000, overflow: 'hidden' }} />;
}

// ============================================================
// MAIN QUIZ COMPONENT
// ============================================================
export default function Quiz() {
  const [screen, setScreen] = useState('landing');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(undefined));
  const [form, setForm] = useState({ name: '', phone: '', school: '' });
  const [resultData, setResultData] = useState(null);
  const [barsAnimate, setBarsAnimate] = useState(false);
  const [confetti, setConfetti] = useState(false);

  // Inject CSS once
  useEffect(() => {
    const id = 'qz-global-css';
    if (!document.getElementById(id)) {
      const s = document.createElement('style');
      s.id = id;
      s.textContent = GLOBAL_CSS;
      document.head.appendChild(s);
    }
  }, []);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [screen]);

  useEffect(() => {
    if (screen === 'result') { const t = setTimeout(() => setBarsAnimate(true), 300); return () => clearTimeout(t); }
    else setBarsAnimate(false);
  }, [screen]);

  // ── Handlers ─────────────────────────────────────────────
  const startQuiz = () => { trackQuizStart(); setCurrentQ(0); setAnswers(Array(questions.length).fill(undefined)); setScreen('quiz'); };
  const selectOpt = (type) => { const a = [...answers]; a[currentQ] = type; setAnswers(a); };
  const prevQ = () => { if (currentQ > 0) setCurrentQ(currentQ - 1); };

  const nextQ = () => {
    if (answers[currentQ] === undefined) return;
    if (currentQ < questions.length - 1) {
      const nq = currentQ + 1;
      trackQuizProgress(nq + 1); // nq+1 = displayed question number
      setCurrentQ(nq);
    } else {
      setScreen('capture');
    }
  };

  const validatePhone = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    const regex = /^08\d{8,11}$/;
    return regex.test(cleaned) ? cleaned : null;
  };

  // const submitData = () => {
  //   if (!form.name.trim() || !form.phone.trim() || !form.school.trim()) {
  //     alert('Mohon isi Nama Lengkap, Nomor WhatsApp, dan Asal Sekolah ya 😊');
  //     return;
  //   }

  //   const validPhone = validatePhone(form.phone);

  //   if (!validPhone) {
  //     alert('Nomor WhatsApp harus diawali 08 dan terdiri dari 10–13 digit');
  //     return;
  //   }

  //   const cleanForm = { ...form, phone: validPhone };

  //   trackDataSubmit();
  //   console.log('Lead captured:', { ...cleanForm, answers });
  //   setScreen('loading');
  //   setTimeout(() => {
  //     const counts = { A: 0, B: 0, C: 0, D: 0 };
  //     answers.forEach(a => { if (a) counts[a]++; });
  //     const total = answers.filter(Boolean).length;
  //     const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  //     const dom = sorted[0][0];
  //     const result = results[dom];
  //     setResultData({ result, sorted, total });
  //     setScreen('result');
  //     setConfetti(true);
  //     setTimeout(() => setConfetti(false), 4500);
  //     trackResultView(result.cls);
  //   }, 2000);
  // };

  const submitData = async () => {
    if (!form.name.trim() || !form.phone.trim() || !form.school.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Data belum lengkap",
        text: "Mohon isi Nama Lengkap, Nomor WhatsApp, dan Asal Sekolah ya 😊",
        confirmButtonText: "OK"
      });
      return;
    }

    const validPhone = validatePhone(form.phone);

    if (!validPhone) {
      Swal.fire({
        icon: "error",
        title: "Nomor tidak valid",
        text: "Nomor WhatsApp harus diawali 08 dan terdiri dari 10–13 digit",
        confirmButtonText: "Mengerti"
      });
      return;
    }

    const cleanForm = { ...form, phone: validPhone };

    // ==============================
    // 1️⃣ HITUNG HASIL QUIZ
    // ==============================
    const counts = { A: 0, B: 0, C: 0, D: 0 };
    answers.forEach(a => { if (a) counts[a]++; });

    const total = answers.filter(Boolean).length;
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const dom = sorted[0][0];
    const result = results[dom];
    const resultLabel = result.cluster;

    // ==============================
    // 2️⃣ LOADING
    // ==============================
    setScreen('loading');

    try {
      // ==============================
      // 3️⃣ KIRIM KE BACKEND
      // ==============================
      await axios.post(API_URL, {
        name: cleanForm.name,
        phone: cleanForm.phone,
        school: cleanForm.school,
        answers,
        result: resultLabel
      });

      await Swal.fire({
        icon: "success",
        title: "Berhasil 🎉",
        text: "Data kamu sudah tersimpan!",
        confirmButtonText: "Lihat hasil"
      });

    } catch (err) {
      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Terjadi kesalahan saat mengirim data",
        confirmButtonText: "Coba lagi"
      });
    }

    // ==============================
    // 4️⃣ TAMPILKAN RESULT
    // ==============================
    setResultData({ result, sorted, total });
    setScreen('result');
    setConfetti(true);
    setTimeout(() => setConfetti(false), 4500);

    trackDataSubmit();
    trackResultView(result.cls);
  };

  const handleDaftar = () => { trackCTAClick('daftar'); window.open('https://pmb.unpas.ac.id', '_blank'); };
  const handleChat = () => {
    trackCTAClick('chat_admisi');
    const msg = encodeURIComponent(`Halo, saya ${form.name}. Saya baru selesai tes kecocokan prodi dan hasilnya ${resultData.result.cluster}. Saya tertarik dengan prodi ${resultData.result.prodi[0]}. Bisa info lebih lanjut?`);
    window.open(`https://wa.me/62811960193?text=${msg}`, '_blank');
  };
  const handleShare = () => {
    const text = "Aku baru coba Tes Kecocokan Prodi dari UNPAS dan hasilnya seru! Coba juga yuk 👉 https://pmb.unpas.ac.id/quiz/";
    if (navigator.share) navigator.share({ title: 'Tes Kecocokan Prodi UNPAS', text });
    else navigator.clipboard.writeText(text).then(() => alert('Link sudah dicopy! Share ke teman kamu ya 😊'));
  };

  const progressPct = ((currentQ + 1) / questions.length) * 100;
  const hasAnswer = answers[currentQ] !== undefined;
  const isLastQ = currentQ === questions.length - 1;

  // ── Render ───────────────────────────────────────────────
  return (
    <>
      <Confetti active={confetti} />

      {/* ── WRAPPER: same as .container in original ── */}
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '1rem', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

        {/* ════════════ LANDING ════════════ */}
        {screen === 'landing' && (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, textAlign: 'center', justifyContent: 'center', alignItems: 'center', padding: '2rem 1rem' }}>
            <div>
              <img src="/quiz/logo_unpas.png" alt="Logo UNPAS" style={{ width: '80px', height: 'auto' }} />
            </div>

            {/* Counter badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '100px', background: '#dbeafe', color: '#2563eb', fontSize: '0.8rem', fontWeight: 600, marginBottom: '2rem', marginTop: '1.5rem' }}>
              <div className="qz-pulse" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563eb' }} />
              <span>2.847</span> orang sudah coba!
            </div>

            <h1 className="qz-h1" style={{ fontSize: 'clamp(1.5rem,5vw,1.8rem)', fontWeight: 800, color: '#0f172a', lineHeight: 1.2, marginBottom: '0.8rem' }}>
              Cocok di{' '}
              <span style={{ background: 'linear-gradient(135deg,#2563eb,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Prodi Apa
              </span>{' '}
              Kamu?
            </h1>

            <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
              Temukan program studi yang sesuai dengan minat, karakter, dan impian karir kamu — cuma 2 menit!
            </p>

            <button className="qz-btn-primary" onClick={startQuiz}>Mulai Tes →</button>

            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
              {[['✅', 'Gratis'], ['⏱️', '2 menit'], ['🎯', 'Personal']].map(([icon, label]) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#64748b' }}>
                  <div className="qz-feature-icon">{icon}</div>
                  {label}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════════════ QUIZ ════════════ */}
        {screen === 'quiz' && (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '1rem 0' }}>
            {/* Progress bar */}
            <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '100px', marginBottom: '2rem', overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: '100px', background: 'linear-gradient(90deg,#2563eb,#06b6d4)', width: `${progressPct}%`, transition: 'width 0.4s ease' }} />
            </div>

            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.8rem' }}>
              Pertanyaan {currentQ + 1} dari {questions.length}
            </div>

            <div className="qz-question-text" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.4, marginBottom: '1.5rem' }}>
              {questions[currentQ].text}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {questions[currentQ].options.map(opt => (
                <button key={opt.type} className={`qz-option${answers[currentQ] === opt.type ? ' selected' : ''}`} onClick={() => selectOpt(opt.type)}>
                  <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>{opt.emoji}</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 500, color: '#0f172a' }}>{opt.text}</div>
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1rem' }}>
              <button className="qz-btn-back" onClick={prevQ} style={{ visibility: currentQ === 0 ? 'hidden' : 'visible' }}>
                ← Kembali
              </button>
              <button className="qz-btn-next" onClick={nextQ} disabled={!hasAnswer}>
                {isLastQ ? 'Lihat Hasil →' : 'Lanjut →'}
              </button>
            </div>
          </div>
        )}

        {/* ════════════ CAPTURE ════════════ */}
        {screen === 'capture' && (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', padding: '2rem 1rem' }}>
            <div className="qz-capture-card" style={{ background: '#ffffff', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>Satu langkah lagi! 🎉</h2>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Isi data singkat untuk melihat hasil tes dan rekomendasi prodi kamu.
              </p>

              {[
                { label: 'Nama Lengkap', key: 'name', type: 'text', ph: 'Masukkan nama kamu' },
                { label: 'Nomor WhatsApp', key: 'phone', type: 'number', ph: '08xxxxxxxxxx' },
                { label: 'Asal Sekolah', key: 'school', type: 'text', ph: 'Nama SMA/SMK kamu' },
              ].map(({ label, key, type, ph }) => (
                <div key={key} style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>{label}</label>
                  <input className="qz-input" type={type} placeholder={ph} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
                </div>
              ))}

              <button className="qz-btn-submit" onClick={submitData}>Lihat Hasil Tes Saya →</button>
              <p style={{ fontSize: '0.7rem', color: '#94a3b8', textAlign: 'center', marginTop: '1rem' }}>
                🔒 Data kamu aman. Hanya digunakan untuk rekomendasi dan info PMB UNPAS.
              </p>
            </div>
          </div>
        )}

        {/* ════════════ LOADING ════════════ */}
        {screen === 'loading' && (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '2rem' }}>
            <div className="qz-spin" style={{ width: '48px', height: '48px', border: '4px solid #e8ecf1', borderTopColor: '#2563eb', borderRadius: '50%', margin: '0 auto 1.5rem' }} />
            <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>Menganalisis jawaban kamu...</div>
          </div>
        )}

        {/* ════════════ RESULT ════════════ */}
        {screen === 'result' && resultData && (() => {
          const { result, sorted, total } = resultData;
          return (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'center', padding: '1.5rem 0' }}>
              <div className={`qz-result-card ${result.cls}`} style={{ background: '#ffffff', borderRadius: '16px', padding: '2rem', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', textAlign: 'center', width: '100%' }}>

                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{result.emoji}</div>
                <div className="qz-cluster" style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>{result.cluster}</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.3, marginBottom: '1rem' }}>{result.tagline}</div>
                <div style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.7 }}>{result.desc}</div>

                {/* Score bars */}
                <div style={{ margin: '1.5rem 0', textAlign: 'left' }}>
                  <h4 style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, marginBottom: '0.8rem' }}>Profil Minat Kamu</h4>
                  {sorted.map(([key, val]) => {
                    const pct = Math.round((val / total) * 100);
                    return (
                      <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.6rem' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155', width: '100px', textAlign: 'right' }}>{clusterNames[key]}</div>
                        <div style={{ flex: 1, height: '10px', background: '#f1f5f9', borderRadius: '100px', overflow: 'hidden' }}>
                          <div className={`qz-bar ${clusterCls[key]}`} style={{ width: barsAnimate ? `${pct}%` : '0%' }} />
                        </div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', width: '36px' }}>{pct}%</div>
                      </div>
                    );
                  })}
                </div>

                {/* Prodi tags */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  {result.prodi.map(p => (
                    <div key={p} className="qz-prodi-tag" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '10px 18px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600 }}>
                      🎓 {p}
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
                  <button className="qz-btn-cta-primary" onClick={handleDaftar}>Daftar Sekarang di PMB UNPAS →</button>
                  <button className="qz-btn-cta-secondary" onClick={handleChat}>💬 Chat Tim Admisi</button>
                  <button className="qz-btn-share" onClick={handleShare}>📤 Share Hasil ke Teman</button>
                </div>

              </div>
            </div>
          );
        })()}

      </div>
    </>
  );
}
