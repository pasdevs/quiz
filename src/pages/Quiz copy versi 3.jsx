import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_URL = import.meta.env.VITE_API_LEAD_URL;

// ============================================================
// GLOBAL CSS — Dark theme, mirrors v3 HTML 1:1
// ============================================================
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'Plus Jakarta Sans', sans-serif !important;
    background: #0c0f1a !important;
    color: #f1f5f9;
    min-height: 100vh;
    overflow-x: hidden;
  }

  #root { font-family: 'Plus Jakarta Sans', sans-serif; }

  /* ── Animations ── */
  @keyframes qv3-float {
    0%, 100% { transform: translateY(0) rotate(-3deg); }
    50%       { transform: translateY(-10px) rotate(3deg); }
  }
  @keyframes qv3-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.4; transform: scale(1.4); }
  }
  @keyframes qv3-spin {
    to { transform: rotate(360deg); }
  }
  @keyframes qv3-fall {
    0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
  }
  @keyframes qv3-slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes qv3-blinker {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.3; }
  }

  .qv3-float   { animation: qv3-float 3s ease-in-out infinite; }
  .qv3-pulse   { animation: qv3-pulse 2s infinite; }
  .qv3-spinner { animation: qv3-spin 0.7s linear infinite; }
  .qv3-confetti-piece {
    position: absolute; top: -10px;
    animation: qv3-fall 3s ease-in forwards;
  }
  .qv3-anim-up { animation: qv3-slideUp 0.4s ease both; }
  .qv3-d1 { animation-delay: 0.1s; }
  .qv3-d2 { animation-delay: 0.2s; }
  .qv3-d3 { animation-delay: 0.3s; }
  .qv3-d4 { animation-delay: 0.4s; }
  .qv3-d5 { animation-delay: 0.5s; }
  .qv3-d6 { animation-delay: 0.6s; }
  .qv3-blink { animation: qv3-blinker 1s ease-in-out infinite; }

  /* ── Quiz option ── */
  .qv3-option {
    all: unset;
    box-sizing: border-box !important;
    display: flex !important;
    align-items: center !important;
    gap: 12px !important;
    padding: 14px 16px !important;
    border-radius: 12px !important;
    border: 2px solid #2a3055 !important;
    background: #1a1f35 !important;
    cursor: pointer !important;
    transition: all 0.2s !important;
    text-align: left !important;
    width: 100% !important;
    font-family: 'Plus Jakarta Sans', sans-serif !important;
    line-height: 1.35 !important;
  }
  .qv3-option:hover    { border-color: #818cf8 !important; background: #222845 !important; }
  .qv3-option.qv3-sel  {
    border-color: #818cf8 !important;
    background: rgba(99,102,241,0.12) !important;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.1) !important;
  }

  /* ── Btn back ── */
  .qv3-btn-back {
    all: unset;
    box-sizing: border-box !important;
    padding: 10px 20px !important;
    border-radius: 8px !important;
    border: 2px solid #2a3055 !important;
    background: transparent !important;
    color: #64748b !important;
    font-family: 'Plus Jakarta Sans', sans-serif !important;
    font-size: 0.85rem !important;
    font-weight: 600 !important;
    cursor: pointer !important;
    transition: all 0.2s !important;
    display: inline-block !important;
  }
  .qv3-btn-back:hover { border-color: #64748b !important; color: #cbd5e1 !important; }

  /* ── Btn next ── */
  .qv3-btn-next {
    all: unset;
    box-sizing: border-box !important;
    padding: 10px 28px !important;
    border-radius: 8px !important;
    background: #4f46e5 !important;
    color: #fff !important;
    font-family: 'Plus Jakarta Sans', sans-serif !important;
    font-size: 0.85rem !important;
    font-weight: 700 !important;
    cursor: pointer !important;
    transition: all 0.2s !important;
    display: inline-block !important;
    text-align: center !important;
  }
  .qv3-btn-next:hover   { background: #6366f1 !important; }
  .qv3-btn-next.qv3-dim {
    opacity: 0.3 !important;
    pointer-events: none !important;
    cursor: not-allowed !important;
  }

  /* ── Form input ── */
  .qv3-input {
    all: unset;
    box-sizing: border-box !important;
    display: block !important;
    width: 100% !important;
    padding: 11px 14px !important;
    border-radius: 8px !important;
    border: 2px solid #2a3055 !important;
    background: #131729 !important;
    font-family: 'Plus Jakarta Sans', sans-serif !important;
    font-size: 0.88rem !important;
    color: #f1f5f9 !important;
    transition: border-color 0.2s !important;
    line-height: 1.5 !important;
  }
  .qv3-input:focus       { border-color: #818cf8 !important; }
  .qv3-input::placeholder { color: #64748b !important; }

  /* ── Submit button ── */
  .qv3-btn-submit {
    all: unset;
    box-sizing: border-box !important;
    display: block !important;
    width: 100% !important;
    padding: 14px !important;
    border-radius: 12px !important;
    background: linear-gradient(135deg, #4f46e5, #6366f1) !important;
    color: #fff !important;
    font-family: 'Plus Jakarta Sans', sans-serif !important;
    font-size: 0.95rem !important;
    font-weight: 800 !important;
    cursor: pointer !important;
    margin-top: 0.5rem !important;
    transition: all 0.3s !important;
    box-shadow: 0 4px 16px rgba(99,102,241,0.3) !important;
    text-align: center !important;
    line-height: 1.5 !important;
  }
  .qv3-btn-submit:hover { transform: translateY(-1px) !important; }

  /* ── Landing start button ── */
  .qv3-btn-start {
    all: unset;
    box-sizing: border-box !important;
    padding: 16px 48px !important;
    border-radius: 12px !important;
    background: linear-gradient(135deg, #4f46e5, #6366f1) !important;
    color: #fff !important;
    font-family: 'Plus Jakarta Sans', sans-serif !important;
    font-size: 1.05rem !important;
    font-weight: 800 !important;
    cursor: pointer !important;
    transition: all 0.3s !important;
    box-shadow: 0 4px 20px rgba(99,102,241,0.4) !important;
    display: inline-block !important;
    text-align: center !important;
    line-height: 1.5 !important;
  }
  .qv3-btn-start:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 8px 30px rgba(99,102,241,0.5) !important;
  }

  /* ── Result card ── */
  .qv3-res-card {
    background: #1a1f35;
    border: 1.5px solid #2a3055;
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.3s;
  }
  .qv3-res-card.qv3-top {
    border-color: #818cf8;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
  }
  .qv3-res-body {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.5s ease;
  }
  .qv3-res-card.qv3-open .qv3-res-body { max-height: 1200px; }
  .qv3-chevron { transition: transform 0.25s; color: #64748b; font-size: 0.7rem; }
  .qv3-res-card.qv3-open .qv3-chevron { transform: rotate(180deg); }

  /* ── Match ring ── */
  .qv3-ring-fg {
    fill: none;
    stroke: #818cf8;
    stroke-width: 3;
    stroke-linecap: round;
    transition: stroke-dashoffset 1s ease;
  }
  .qv3-ring-bg { fill: none; stroke: #2a3055; stroke-width: 3; }

  /* ── Trait tag ── */
  .qv3-trait {
    padding: 3px 10px;
    border-radius: 100px;
    font-size: 0.62rem;
    font-weight: 700;
    background: rgba(99,102,241,0.1);
    color: #818cf8;
    border: 1px solid rgba(99,102,241,0.2);
  }

  /* ── CTA buttons result ── */
  .qv3-btn-cta-primary {
    all: unset;
    box-sizing: border-box !important;
    display: block !important;
    width: 100% !important;
    padding: 14px !important;
    border-radius: 12px !important;
    background: linear-gradient(135deg, #10b981, #059669) !important;
    color: #fff !important;
    font-family: 'Plus Jakarta Sans', sans-serif !important;
    font-size: 0.92rem !important;
    font-weight: 800 !important;
    cursor: pointer !important;
    transition: all 0.2s !important;
    text-align: center !important;
    box-shadow: 0 4px 16px rgba(16,185,129,0.3) !important;
    line-height: 1.5 !important;
  }
  .qv3-btn-cta-primary:hover { transform: translateY(-1px) !important; }

  .qv3-btn-cta-secondary {
    all: unset;
    box-sizing: border-box !important;
    display: block !important;
    width: 100% !important;
    padding: 14px !important;
    border-radius: 12px !important;
    border: 2px solid #818cf8 !important;
    background: transparent !important;
    color: #818cf8 !important;
    font-family: 'Plus Jakarta Sans', sans-serif !important;
    font-size: 0.92rem !important;
    font-weight: 800 !important;
    cursor: pointer !important;
    transition: all 0.2s !important;
    text-align: center !important;
    line-height: 1.5 !important;
  }
  .qv3-btn-cta-secondary:hover { background: rgba(99,102,241,0.08) !important; }

  .qv3-btn-share {
    all: unset;
    box-sizing: border-box !important;
    display: block !important;
    width: 100% !important;
    padding: 11px !important;
    border-radius: 8px !important;
    border: 2px solid #2a3055 !important;
    background: transparent !important;
    color: #64748b !important;
    font-family: 'Plus Jakarta Sans', sans-serif !important;
    font-size: 0.8rem !important;
    font-weight: 600 !important;
    cursor: pointer !important;
    margin-top: 0.3rem !important;
    transition: all 0.2s !important;
    text-align: center !important;
    line-height: 1.5 !important;
  }
  .qv3-btn-share:hover { border-color: #64748b !important; color: #cbd5e1 !important; }

  /* ── Momentum timeline ── */
  .qv3-mt-row { display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 8px; background: #131729; border: 1px solid transparent; transition: all 0.2s; }
  .qv3-mt-row.active   { border-color: rgba(16,185,129,0.2); background: rgba(16,185,129,0.05); }
  .qv3-mt-row.upcoming { opacity: 0.7; }
  .qv3-mt-row.ended    { opacity: 0.4; }
  .qv3-mt-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .qv3-mt-dot.active   { background: #34d399; box-shadow: 0 0 6px rgba(16,185,129,0.5); }
  .qv3-mt-dot.upcoming { background: #818cf8; }
  .qv3-mt-dot.ended    { background: #64748b; }

  /* ── Quota fill ── */
  .qv3-quota-fill      { height: 100%; border-radius: 100px; transition: width 1.5s ease; background: linear-gradient(90deg, #fbbf24, #fb923c); }
  .qv3-quota-fill.low  { background: linear-gradient(90deg, #fb7185, #f43f5e); }

  /* ── feat icon ── */
  .qv3-feat-ic {
    width: 22px; height: 22px; border-radius: 6px; background: #222845;
    display: flex; align-items: center; justify-content: center; font-size: 0.6rem; flex-shrink: 0;
  }

  @media (max-width: 380px) {
    .qv3-q-text   { font-size: 1rem !important; }
    .qv3-opt-txt  { font-size: 0.82rem !important; }
  }
`;

// ============================================================
// FORMATTER
// ============================================================
const fmt  = n => (!n && n !== 0) ? '-' : 'Rp ' + Number(n).toLocaleString('id-ID');
const fmtJt = n => n >= 1e6 ? (n / 1e6).toFixed(n % 1e6 ? 1 : 0) + ' jt' : fmt(n);

// ============================================================
// PRODI DATA
// ============================================================
const PD = {
  teknik_lingkungan:   { name:"Teknik Lingkungan",                  fak:"Fakultas Teknik",             desc:"Pelajari solusi permasalahan lingkungan, pengelolaan limbah, air bersih, dan pembangunan berkelanjutan.",         traits:["Peduli Lingkungan","Problem Solver","Saintifik"], c1:7481250,  total:87400000,  dp:937500,  dpp:4625000, rincian:[{k:"DP",v:937500},{k:"DPP",v:4625000},{k:"DPPS",v:568750},{k:"PKKMB",v:1350000}] },
  teknik_mesin:        { name:"Teknik Mesin",                        fak:"Fakultas Teknik",             desc:"Dalami perancangan, manufaktur, dan teknologi mesin dari otomotif hingga robotika.",                             traits:["Teknis","Inovatif","Hands-on"],                   c1:7915625,  total:92875000,  dp:937500,  dpp:4875000, rincian:[{k:"DP",v:937500},{k:"DPP",v:4875000},{k:"DPPS",v:753125},{k:"PKKMB",v:1350000}] },
  teknik_industri:     { name:"Teknik Industri",                     fak:"Fakultas Teknik",             desc:"Optimalkan sistem produksi, manajemen operasi, dan efisiensi industri.",                                         traits:["Analitis","Sistematis","Multidisiplin"],           c1:7681250,  total:91000000,  dp:937500,  dpp:4875000, rincian:[{k:"DP",v:937500},{k:"DPP",v:4875000},{k:"DPPS",v:518750},{k:"PKKMB",v:1350000}] },
  pwk:                 { name:"Perencanaan Wilayah dan Kota",         fak:"Fakultas Teknik",             desc:"Rancang tata ruang kota, perencanaan urban, dan pembangunan wilayah berkelanjutan.",                             traits:["Visioner","Spasial","Kreatif"],                   c1:7593750,  total:88300000,  dp:937500,  dpp:4625000, rincian:[{k:"DP",v:937500},{k:"DPP",v:4625000},{k:"DPPS",v:681250},{k:"PKKMB",v:1350000}] },
  teknologi_pangan:    { name:"Teknologi Pangan",                    fak:"Fakultas Teknik",             desc:"Eksplorasi inovasi pengolahan makanan, keamanan pangan, dan industri kuliner modern.",                           traits:["Scientist","Inovatif","Detail"],                  c1:8056250,  total:96000000,  dp:937500,  dpp:5125000, rincian:[{k:"DP",v:937500},{k:"DPP",v:5125000},{k:"DPPS",v:643750},{k:"PKKMB",v:1350000}] },
  teknik_informatika:  { name:"Teknik Informatika",                  fak:"Fakultas Teknik",             desc:"Kuasai pemrograman, AI, dan teknologi digital untuk membangun solusi masa depan.",                               traits:["Logis","Tech-Savvy","Problem Solver"],            c1:7700000,  total:89150000,  dp:937500,  dpp:4625000, rincian:[{k:"DP",v:937500},{k:"DPP",v:4625000},{k:"DPPS",v:787500},{k:"PKKMB",v:1350000}] },
  kedokteran:          { name:"Kedokteran",                           fak:"Fakultas Kedokteran",         desc:"Jadi dokter profesional yang siap melayani masyarakat dengan ilmu kedokteran terkini.",                          traits:["Empati","Dedikasi","Saintifik"],                  c1:165150000,total:522150000, dp:0,       dpp:27600000,isKedokteran:true, rincian:[{k:"DP (50%)",v:100000000},{k:"Infak Wajib (50%)",v:50000000},{k:"DPP Sem 1 (50%)",v:13800000},{k:"PKKMB",v:1350000}] },
  akuntansi:           { name:"Akuntansi",                            fak:"Fakultas Ekonomi dan Bisnis", desc:"Kuasai akuntansi, audit, dan keuangan — karier yang selalu dibutuhkan.",                                         traits:["Teliti","Analitis","Terstruktur"],                c1:7537500,  total:88350000,  dp:1000000, dpp:4687500, rincian:[{k:"DP",v:1000000},{k:"DPP",v:4687500},{k:"DPPS",v:500000},{k:"PKKMB",v:1350000}] },
  ekonomi_pembangunan: { name:"Ekonomi Pembangunan",                  fak:"Fakultas Ekonomi dan Bisnis", desc:"Analisis ekonomi makro, kebijakan publik, dan strategi pembangunan nasional.",                                   traits:["Analitis","Visioner","Kritis"],                   c1:7537500,  total:88350000,  dp:1000000, dpp:4687500, rincian:[{k:"DP",v:1000000},{k:"DPP",v:4687500},{k:"DPPS",v:500000},{k:"PKKMB",v:1350000}] },
  manajemen:           { name:"Manajemen",                            fak:"Fakultas Ekonomi dan Bisnis", desc:"Pelajari kepemimpinan, strategi bisnis, dan manajemen organisasi modern.",                                       traits:["Leader","Strategis","Komunikatif"],               c1:7537500,  total:88350000,  dp:1000000, dpp:4687500, rincian:[{k:"DP",v:1000000},{k:"DPP",v:4687500},{k:"DPPS",v:500000},{k:"PKKMB",v:1350000}] },
  bisnis_digital:      { name:"Bisnis Digital",                       fak:"Fakultas Ekonomi dan Bisnis", desc:"Gabungkan bisnis dan teknologi — e-commerce, digital marketing, dan startup.",                                   traits:["Entrepreneur","Digital","Adaptif"],               c1:5150000,  total:53350000,  dp:800000,  dpp:2500000, rincian:[{k:"DP",v:800000},{k:"DPP",v:2500000},{k:"DPPS",v:500000},{k:"PKKMB",v:1350000}] },
  hub_internasional:   { name:"Ilmu Hubungan Internasional",          fak:"FISIP",                       desc:"Pelajari diplomasi, politik global, dan hubungan antar negara.",                                                 traits:["Global","Diplomatis","Analitis"],                 c1:6838000,  total:77255000,  dp:875000,  dpp:4000000, rincian:[{k:"DP",v:875000},{k:"DPP",v:4000000},{k:"DPPS",v:613000},{k:"PKKMB",v:1350000}] },
  kesejahteraan_sosial:{ name:"Ilmu Kesejahteraan Sosial",            fak:"FISIP",                       desc:"Bantu masyarakat mengatasi masalah sosial melalui pendekatan profesional.",                                      traits:["Empati","Sosial","Advokasi"],                     c1:6391000,  total:69685000,  dp:875000,  dpp:3500000, rincian:[{k:"DP",v:875000},{k:"DPP",v:3500000},{k:"DPPS",v:666000},{k:"PKKMB",v:1350000}] },
  administrasi_publik: { name:"Ilmu Administrasi Publik",             fak:"FISIP",                       desc:"Pelajari tata kelola pemerintahan, kebijakan publik, dan pelayanan masyarakat.",                                 traits:["Analitis","Publik","Terstruktur"],                c1:6950000,  total:78150000,  dp:875000,  dpp:4000000, rincian:[{k:"DP",v:875000},{k:"DPP",v:4000000},{k:"DPPS",v:725000},{k:"PKKMB",v:1350000}] },
  ilmu_komunikasi:     { name:"Ilmu Komunikasi",                      fak:"FISIP",                       desc:"Kuasai media, public relations, broadcasting, dan komunikasi digital.",                                           traits:["Komunikatif","Kreatif","Dinamis"],                c1:7218000,  total:80300000,  dp:875000,  dpp:4000000, rincian:[{k:"DP",v:875000},{k:"DPP",v:4000000},{k:"DPPS",v:993000},{k:"PKKMB",v:1350000}] },
  administrasi_bisnis: { name:"Ilmu Administrasi Bisnis",             fak:"FISIP",                       desc:"Kelola organisasi bisnis, SDM, dan operasional perusahaan secara profesional.",                                  traits:["Organizer","Strategis","Praktis"],                c1:6376000,  total:69560000,  dp:875000,  dpp:3500000, rincian:[{k:"DP",v:875000},{k:"DPP",v:3500000},{k:"DPPS",v:651000},{k:"PKKMB",v:1350000}] },
  ilmu_hukum:          { name:"Ilmu Hukum",                           fak:"Fakultas Hukum",              desc:"Dalami hukum pidana, perdata, bisnis, dan HAM untuk menjadi penegak keadilan.",                                  traits:["Kritis","Analitis","Argumentatif"],               c1:9100000,  total:86350000,  dp:750000,  dpp:4250000, rincian:[{k:"DP",v:750000},{k:"DPP",v:4250000},{k:"DPPS",v:2750000},{k:"PKKMB",v:1350000}] },
  pend_matematika:     { name:"Pendidikan Matematika",                fak:"FKIP",                        desc:"Jadi guru matematika profesional yang menginspirasi generasi penerus.",                                           traits:["Logis","Sabar","Educator"],                       c1:3840500,  total:52704000,  dp:668000,  dpp:1793000, isFKIP:true, rincian:[{k:"DP",v:668000},{k:"DPP",v:1793000},{k:"DPPS",v:29500},{k:"PKKMB",v:1350000}] },
  pend_biologi:        { name:"Pendidikan Biologi",                   fak:"FKIP",                        desc:"Kuasai biologi dan pedagogi untuk menjadi guru biologi yang inovatif.",                                           traits:["Saintifik","Educator","Teliti"],                  c1:3983500,  total:54400000,  dp:668000,  dpp:1793000, isFKIP:true, rincian:[{k:"DP",v:668000},{k:"DPP",v:1793000},{k:"DPPS",v:172500},{k:"PKKMB",v:1350000}] },
  pend_bahasa_indonesia:{ name:"Pend. Bahasa & Sastra Indonesia",     fak:"FKIP",                        desc:"Jadi guru bahasa Indonesia yang membentuk kemampuan literasi bangsa.",                                            traits:["Literat","Komunikatif","Educator"],               c1:3861000,  total:52950000,  dp:668000,  dpp:1793000, isFKIP:true, rincian:[{k:"DP",v:668000},{k:"DPP",v:1793000},{k:"DPPS",v:50000},{k:"PKKMB",v:1350000}] },
  pgsd:                { name:"Pend. Guru Sekolah Dasar",             fak:"FKIP",                        desc:"Bentuk fondasi pendidikan anak-anak Indonesia sebagai guru SD profesional.",                                      traits:["Sabar","Kreatif","Educator"],                     c1:3817250,  total:52415000,  dp:668000,  dpp:1793000, isFKIP:true, rincian:[{k:"DP",v:668000},{k:"DPP",v:1793000},{k:"DPPS",v:6250},{k:"PKKMB",v:1350000}] },
  ppkn:                { name:"Pend. Pancasila & Kewarganegaraan",    fak:"FKIP",                        desc:"Tanamkan nilai Pancasila dan kewarganegaraan pada generasi muda.",                                                traits:["Nasionalis","Educator","Kritis"],                 c1:3824500,  total:52502000,  dp:668000,  dpp:1793000, isFKIP:true, rincian:[{k:"DP",v:668000},{k:"DPP",v:1793000},{k:"DPPS",v:13500},{k:"PKKMB",v:1350000}] },
  pend_ekonomi:        { name:"Pendidikan Ekonomi",                   fak:"FKIP",                        desc:"Jadi guru ekonomi yang mampu menumbuhkan literasi finansial siswa.",                                              traits:["Analitis","Educator","Praktis"],                  c1:3881750,  total:53185000,  dp:668000,  dpp:1793000, isFKIP:true, rincian:[{k:"DP",v:668000},{k:"DPP",v:1793000},{k:"DPPS",v:70750},{k:"PKKMB",v:1350000}] },
  seni_musik:          { name:"Seni Musik",                           fak:"FISS",                        desc:"Kembangkan bakat musik — performance, komposisi, dan industri musik.",                                            traits:["Musikal","Ekspresif","Kreatif"],                  c1:6350000,  total:69250000,  dp:0,       dpp:3450000, rincian:[{k:"DPP",v:3450000},{k:"DPPS",v:1550000},{k:"PKKMB",v:1350000}] },
  dkv:                 { name:"Desain Komunikasi Visual",             fak:"FISS",                        desc:"Ciptakan desain grafis, branding, dan komunikasi visual yang memukau.",                                           traits:["Visual Thinker","Kreatif","Tech-Savvy"],          c1:6900000,  total:78050000,  dp:0,       dpp:4000000, rincian:[{k:"DPP",v:4000000},{k:"DPPS",v:1550000},{k:"PKKMB",v:1350000}] },
  sastra_inggris:      { name:"Sastra Inggris",                       fak:"FISS",                        desc:"Kuasai bahasa Inggris, sastra, linguistik, dan buka peluang karier global.",                                     traits:["Literat","Global","Komunikatif"],                 c1:6350000,  total:69850000,  dp:0,       dpp:3500000, rincian:[{k:"DPP",v:3500000},{k:"DPPS",v:1500000},{k:"PKKMB",v:1350000}] },
  fotografi:           { name:"Fotografi",                            fak:"FISS",                        desc:"Abadikan momen dan ceritakan kisah melalui seni fotografi profesional.",                                          traits:["Visual","Kreatif","Storyteller"],                 c1:6775000,  total:76050000,  dp:0,       dpp:3875000, rincian:[{k:"DPP",v:3875000},{k:"DPPS",v:1550000},{k:"PKKMB",v:1350000}] },
};

const KOMP_HELP = {
  'DP':'Biaya pengembangan sarana & prasarana kampus',
  'DPP':'Biaya pokok perkuliahan — nominal per cicilan',
  'DPPS':'Biaya lab, peralatan & fasilitas belajar',
  'PKKMB':'Orientasi mahasiswa baru (satu kali bayar)',
  'DP (50%)':'Biaya pengembangan kampus (tahap 1)',
  'DPP Sem 1 (50%)':'Biaya pokok perkuliahan semester 1 (tahap 1)',
  'Infak Wajib (50%)':'Sumbangan wajib masuk Fakultas Kedokteran',
};

// ============================================================
// MOMENTUM CONFIG
// ============================================================
const MOMENTUM = [
  { id:"pra-snbp",   name:"Pra-SNBP",   period:"5 Jan – 25 Mar 2026",  start:"2026-01-05", end:"2026-03-25", dpCut:2000000, quota:200, voucher:300, jalur:"PMDK" },
  { id:"pasca-snbp", name:"Pasca-SNBP", period:"31 Mar – 30 Apr 2026", start:"2026-03-31", end:"2026-04-30", dpCut:1500000, quota:100, voucher:300, jalur:"PMDK" },
  { id:"pasca-snbt", name:"Pasca-SNBT", period:"25 Mei – 4 Jun 2026",  start:"2026-05-25", end:"2026-06-04", dpCut:1000000, quota:100, voucher:200, jalur:"PMDK / USM" },
];
const DPP_INCENTIVE = 1000000;

function getMomentumStatus() {
  const now = new Date();
  return MOMENTUM.map(m => {
    const s = new Date(m.start), e = new Date(m.end);
    e.setHours(23, 59, 59);
    let status = 'upcoming';
    if (now >= s && now <= e) status = 'active';
    else if (now > e) status = 'ended';
    return { ...m, status };
  });
}

function getActiveMomentum() {
  return getMomentumStatus().find(m => m.status === 'active') || null;
}

// ============================================================
// QUESTIONS
// ============================================================
const QS = [
  { text:"Kalau weekend, aktivitas mana yang paling kamu nikmati?", hint:"Pilih yang paling menggambarkan dirimu", icon:"🌟", options:[
    { text:"Ngulik coding, main game, atau explore gadget baru",           icon:"💻", scores:{teknik_informatika:3,bisnis_digital:2,dkv:1,teknik_industri:1} },
    { text:"Nonton dokumenter, baca buku, atau diskusi isu sosial",         icon:"📚", scores:{ilmu_hukum:2,hub_internasional:3,administrasi_publik:2,ekonomi_pembangunan:2,ppkn:1} },
    { text:"Bikin konten, foto-foto, desain, atau main musik",              icon:"🎨", scores:{dkv:3,fotografi:3,seni_musik:3,ilmu_komunikasi:2,pend_bahasa_indonesia:1} },
    { text:"Olahraga, jalan-jalan alam, atau kegiatan sosial bareng komunitas", icon:"🌿", scores:{teknik_lingkungan:2,kesejahteraan_sosial:3,pgsd:2,pend_biologi:2,kedokteran:1} },
  ]},
  { text:"Di kelompok belajar, kamu biasanya berperan sebagai apa?", hint:"Peranmu menunjukkan kekuatan alami kamu", icon:"👥", options:[
    { text:"Ketua yang ngatur strategi dan bagi tugas",              icon:"👑", scores:{manajemen:3,administrasi_bisnis:2,administrasi_publik:2,teknik_industri:2} },
    { text:"Yang paling jago riset dan analisis data",               icon:"🔍", scores:{akuntansi:3,ekonomi_pembangunan:2,teknik_industri:2,ilmu_hukum:2,pend_matematika:2} },
    { text:"Yang bikin presentasinya jadi keren dan menarik",        icon:"✨", scores:{dkv:3,ilmu_komunikasi:3,fotografi:2,bisnis_digital:1} },
    { text:"Yang sabar ngajarin teman yang belum paham",             icon:"🤝", scores:{pgsd:3,pend_matematika:2,pend_biologi:2,pend_bahasa_indonesia:2,pend_ekonomi:2,ppkn:2,kesejahteraan_sosial:2} },
  ]},
  { text:"Mata pelajaran apa yang paling kamu suka di sekolah?", hint:"Nggak harus yang nilainya paling tinggi ya", icon:"📖", options:[
    { text:"Matematika, Fisika, atau Kimia",                         icon:"🧮", scores:{teknik_mesin:3,teknik_industri:2,teknik_informatika:2,teknik_lingkungan:2,pend_matematika:2,kedokteran:2} },
    { text:"Bahasa Indonesia, Bahasa Inggris, atau Sejarah",         icon:"📝", scores:{sastra_inggris:3,pend_bahasa_indonesia:3,ilmu_hukum:2,hub_internasional:2,ilmu_komunikasi:1} },
    { text:"Ekonomi, Sosiologi, atau PKN",                          icon:"📊", scores:{manajemen:2,ekonomi_pembangunan:3,akuntansi:2,administrasi_publik:2,pend_ekonomi:2,ppkn:2,kesejahteraan_sosial:1} },
    { text:"Seni Budaya, Prakarya, atau Biologi",                   icon:"🎭", scores:{seni_musik:3,dkv:2,fotografi:2,pend_biologi:3,teknologi_pangan:2,pwk:1} },
  ]},
  { text:"Kamu lebih tertarik dengan karier yang kayak gimana?", hint:"Bayangkan 5-10 tahun ke depan", icon:"🚀", options:[
    { text:"Jadi profesional di perusahaan besar atau bikin startup sendiri",     icon:"🏢", scores:{manajemen:3,bisnis_digital:3,teknik_informatika:2,administrasi_bisnis:2,akuntansi:2,teknik_industri:2} },
    { text:"Berkontribusi untuk masyarakat — dokter, guru, pekerja sosial",       icon:"❤️", scores:{kedokteran:3,pgsd:3,pend_matematika:2,pend_biologi:2,kesejahteraan_sosial:3,pend_bahasa_indonesia:2,ppkn:2,pend_ekonomi:2} },
    { text:"Berkarya di industri kreatif — media, desain, musik, fotografi",      icon:"🎬", scores:{dkv:3,fotografi:3,seni_musik:3,ilmu_komunikasi:3,sastra_inggris:1} },
    { text:"Bekerja di bidang hukum, pemerintahan, atau organisasi internasional", icon:"⚖️", scores:{ilmu_hukum:3,hub_internasional:3,administrasi_publik:3,ekonomi_pembangunan:2,ppkn:1} },
  ]},
  { text:"Kalau dikasih project bebas di sekolah, kamu bakal bikin apa?", hint:"Pilih yang bikin kamu paling excited", icon:"💡", options:[
    { text:"Aplikasi atau website yang bisa bantu orang",               icon:"📱", scores:{teknik_informatika:3,bisnis_digital:2,dkv:2,teknik_industri:1} },
    { text:"Video dokumenter atau kampanye sosial media",               icon:"🎥", scores:{ilmu_komunikasi:3,fotografi:2,hub_internasional:1,kesejahteraan_sosial:2,dkv:1} },
    { text:"Riset atau makalah tentang isu yang lagi trending",         icon:"📋", scores:{ilmu_hukum:2,ekonomi_pembangunan:2,administrasi_publik:2,teknik_lingkungan:2,kedokteran:2,pend_biologi:1} },
    { text:"Produk kreatif — makanan unik, desain, musik, atau karya seni", icon:"🎨", scores:{teknologi_pangan:3,seni_musik:3,dkv:2,fotografi:2,pend_bahasa_indonesia:1} },
  ]},
  { text:"Isu global mana yang paling bikin kamu peduli?", hint:"Yang sering bikin kamu scroll lama di sosmed", icon:"🌍", options:[
    { text:"Perubahan iklim, polusi, dan kelestarian lingkungan",         icon:"🌱", scores:{teknik_lingkungan:3,pwk:2,pend_biologi:2,teknologi_pangan:1} },
    { text:"Kesenjangan sosial, kemiskinan, dan akses pendidikan",        icon:"🤲", scores:{kesejahteraan_sosial:3,pgsd:2,administrasi_publik:2,ekonomi_pembangunan:2,ppkn:2,pend_ekonomi:2} },
    { text:"Perkembangan AI, teknologi, dan transformasi digital",        icon:"🤖", scores:{teknik_informatika:3,bisnis_digital:3,teknik_industri:2,teknik_mesin:2} },
    { text:"Hak asasi manusia, demokrasi, dan hubungan antar negara",    icon:"🕊️", scores:{ilmu_hukum:3,hub_internasional:3,ilmu_komunikasi:1,administrasi_publik:1} },
  ]},
  { text:"Gaya belajar kamu lebih ke mana?", hint:"Cara kamu menyerap informasi paling efektif", icon:"🧠", options:[
    { text:"Praktek langsung — learning by doing di lab atau lapangan", icon:"🔧", scores:{teknik_mesin:3,teknik_lingkungan:2,kedokteran:3,teknologi_pangan:2,teknik_informatika:2,pend_biologi:2} },
    { text:"Diskusi, debat, dan tukar pikiran sama orang lain",          icon:"💬", scores:{ilmu_hukum:3,hub_internasional:2,ilmu_komunikasi:2,manajemen:2,pend_bahasa_indonesia:2,pend_ekonomi:1} },
    { text:"Visual — lewat gambar, diagram, video, atau peta",           icon:"👁️", scores:{dkv:3,fotografi:3,pwk:3,seni_musik:1,pgsd:1} },
    { text:"Analisis data, hitung-hitungan, dan problem solving",        icon:"📐", scores:{akuntansi:3,pend_matematika:3,teknik_industri:3,ekonomi_pembangunan:2,administrasi_bisnis:1} },
  ]},
  { text:"Kamu lebih suka bekerja di lingkungan yang kayak gimana?", hint:"Suasana kerja ideal kamu", icon:"🏠", options:[
    { text:"Kantor modern atau startup — cepat, dinamis, penuh tantangan",          icon:"⚡", scores:{bisnis_digital:3,teknik_informatika:2,manajemen:2,administrasi_bisnis:2,ilmu_komunikasi:2} },
    { text:"Rumah sakit, sekolah, atau lembaga sosial — meaningful work",           icon:"🏥", scores:{kedokteran:3,pgsd:3,pend_matematika:2,pend_biologi:2,kesejahteraan_sosial:3,ppkn:2,pend_bahasa_indonesia:2,pend_ekonomi:2} },
    { text:"Studio kreatif, outdoor, atau freelance — bebas berekspresi",           icon:"🎪", scores:{dkv:3,fotografi:3,seni_musik:3,sastra_inggris:2,pwk:1,teknik_lingkungan:1} },
    { text:"Instansi pemerintah, kantor hukum, atau organisasi internasional",      icon:"🏛️", scores:{ilmu_hukum:3,administrasi_publik:3,hub_internasional:3,ekonomi_pembangunan:2,akuntansi:1} },
  ]},
  { text:"Skill apa yang paling pengen kamu kuasai?", hint:"Kemampuan yang bikin kamu pede di masa depan", icon:"⚔️", options:[
    { text:"Coding, data analysis, atau digital marketing",              icon:"🖥️", scores:{teknik_informatika:3,bisnis_digital:3,teknik_industri:2,dkv:1,akuntansi:1} },
    { text:"Public speaking, negosiasi, dan leadership",                 icon:"🎤", scores:{manajemen:3,ilmu_komunikasi:2,hub_internasional:2,administrasi_bisnis:2,ilmu_hukum:2,sastra_inggris:1} },
    { text:"Desain, fotografi, videografi, atau musik",                  icon:"🎹", scores:{dkv:3,fotografi:3,seni_musik:3,ilmu_komunikasi:1} },
    { text:"Riset, menulis ilmiah, dan critical thinking",               icon:"🔬", scores:{kedokteran:2,teknik_lingkungan:2,ekonomi_pembangunan:2,pend_biologi:2,pend_matematika:2,ilmu_hukum:2,teknologi_pangan:2,pend_bahasa_indonesia:2} },
  ]},
  { text:"Terakhir! Motto hidup mana yang paling relate sama kamu?", hint:"Trust your gut! 🔥", icon:"🔥", options:[
    { text:'"Teknologi adalah kunci masa depan"',                        icon:"🚀", scores:{teknik_informatika:3,teknik_mesin:2,bisnis_digital:2,teknik_industri:2,teknik_lingkungan:1} },
    { text:'"Kreativitas tidak ada batasnya"',                           icon:"🌈", scores:{dkv:3,fotografi:3,seni_musik:3,ilmu_komunikasi:2,sastra_inggris:1,pend_bahasa_indonesia:1} },
    { text:'"Perubahan dimulai dari pendidikan dan keadilan"',           icon:"✊", scores:{pgsd:3,ilmu_hukum:2,kesejahteraan_sosial:2,pend_matematika:2,pend_biologi:2,ppkn:2,administrasi_publik:2,pend_ekonomi:2,pend_bahasa_indonesia:1} },
    { text:'"Sukses itu soal strategi dan eksekusi"',                    icon:"🎯", scores:{manajemen:3,akuntansi:2,ekonomi_pembangunan:2,administrasi_bisnis:2,hub_internasional:1,kedokteran:1} },
  ]},
];

// ============================================================
// PIXEL HELPERS
// ============================================================
const pixelReady = () => typeof window.fbq === 'function';

// EVENT 2: Quiz Started
function trackQuizStart() {
  if (!pixelReady()) { console.warn('⚠️ E2: fbq not ready'); return; }
  window.fbq('track', 'Lead', { content_name: 'quiz_start', content_category: 'quiz_kecocokan_prodi' });
  console.log('✅ Pixel: quiz_start fired');
}

// EVENT 3: Quiz Progress — Halfway (Pertanyaan 5)
function trackQuizProgress(questionNumber) {
  if (questionNumber === 5) {
    if (!pixelReady()) { console.warn('⚠️ E3: fbq not ready'); return; }
    window.fbq('track', 'ViewContent', { content_name: 'quiz_progress', content_category: 'q5_halfway' });
    console.log('✅ Pixel: quiz_progress Q5 fired');
  }
}

// EVENT 4: Data Submitted
function trackDataSubmit() {
  if (!pixelReady()) { console.warn('⚠️ E4: fbq not ready'); return; }
  window.fbq('track', 'CompleteRegistration', { content_name: 'quiz_data_submit', status: 'lead_captured' });
  console.log('✅ Pixel: data_submit fired');
}

// EVENT 5: Result Viewed
function trackResultView(topProdi) {
  if (!pixelReady()) { console.warn('⚠️ E5: fbq not ready'); return; }
  window.fbq('track', 'ViewContent', { content_name: 'quiz_result', content_category: topProdi });
  console.log('✅ Pixel: result_view fired —', topProdi);
}

// EVENT 6: CTA Clicked
function trackCTAClick(ctaType) {
  if (!pixelReady()) { console.warn('⚠️ E6: fbq not ready'); return; }
  window.fbq('track', 'InitiateCheckout', { content_name: 'quiz_cta_click', content_category: ctaType });
  console.log('✅ Pixel: cta_click fired —', ctaType);
}

// ============================================================
// CONFETTI
// ============================================================
function Confetti({ active }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!active || !ref.current) return;
    const el = ref.current;
    const colors = ['#818cf8', '#22d3ee', '#34d399', '#fbbf24', '#fb7185', '#a78bfa'];
    const timers = [];
    for (let i = 0; i < 50; i++) {
      const t = setTimeout(() => {
        const c = document.createElement('div');
        c.className = 'qv3-confetti-piece';
        Object.assign(c.style, {
          left: Math.random() * 100 + '%',
          backgroundColor: colors[Math.floor(Math.random() * colors.length)],
          borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          width:  (Math.random() * 8 + 5) + 'px',
          height: (Math.random() * 8 + 5) + 'px',
          animationDuration: (Math.random() * 2 + 2) + 's',
          animationDelay:    Math.random() * 0.5 + 's',
        });
        el.appendChild(c);
        setTimeout(() => c.remove(), 4000);
      }, i * 50);
      timers.push(t);
    }
    return () => timers.forEach(clearTimeout);
  }, [active]);
  return <div ref={ref} style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:1000, overflow:'hidden' }} />;
}

// ============================================================
// COUNTDOWN HOOK
// ============================================================
function useCountdown(active) {
  const [cd, setCd] = useState({ d:'--', h:'--', m:'--', s:'--' });
  useEffect(() => {
    if (!active) return;
    const end = new Date(active.end);
    end.setHours(23, 59, 59, 999);
    const tick = () => {
      const diff = end - new Date();
      if (diff <= 0) { setCd({ d:'00', h:'00', m:'00', s:'00' }); return; }
      setCd({
        d: String(Math.floor(diff / 86400000)).padStart(2, '0'),
        h: String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0'),
        m: String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0'),
        s: String(Math.floor((diff % 60000) / 1000)).padStart(2, '0'),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [active]);
  return cd;
}

// ============================================================
// RESULT CARD COMPONENT
// ============================================================
function ProdiCard({ prodiKey, score, maxScore, rank, openIdx, setOpenIdx }) {
  const d = PD[prodiKey];
  const pct = Math.round((score / maxScore) * 100);
  const circumference = Math.PI * 22;
  const offset = circumference - (pct / 100) * circumference;
  const isOpen = openIdx === rank;
  const isTop  = rank === 0;
  const cicilanLabel = d.isFKIP ? '(cicilan 1 dari 3)' : d.isKedokteran ? '(cicilan 1, Gel.1)' : '(cicilan 1 dari 2)';
  const rankLabels = ['#1','#2','#3','#4'];

  return (
    <div
      className={`qv3-res-card${isTop ? ' qv3-top' : ''}${isOpen ? ' qv3-open' : ''} qv3-anim-up qv3-d${rank + 1}`}
    >
      {/* Card header — clickable */}
      <div
        onClick={() => setOpenIdx(isOpen ? null : rank)}
        style={{ padding:'14px 16px', display:'flex', alignItems:'center', gap:'10px', cursor:'pointer' }}
      >
        {/* Rank badge */}
        <div style={{
          width:'26px', height:'26px', borderRadius:'7px', display:'flex', alignItems:'center',
          justifyContent:'center', fontSize:'0.6rem', fontWeight:800, flexShrink:0,
          background: rank === 0 ? 'linear-gradient(135deg,#fbbf24,#f59e0b)' : '#222845',
          color: rank === 0 ? '#451a03' : '#94a3b8',
        }}>
          {rankLabels[rank]}
        </div>

        {/* Prodi info */}
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:'0.88rem', fontWeight:700, color:'#fff', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{d.name}</div>
          <div style={{ fontSize:'0.62rem', color:'#64748b', fontWeight:600, marginTop:'1px' }}>{d.fak}</div>
        </div>

        {/* Match percentage + ring */}
        <div style={{ display:'flex', alignItems:'center', gap:'6px', flexShrink:0 }}>
          <span style={{ fontSize:'0.75rem', fontWeight:800, color:'#818cf8' }}>{pct}%</span>
          <svg viewBox="0 0 28 28" width="28" height="28" style={{ transform:'rotate(-90deg)' }}>
            <circle className="qv3-ring-bg" cx="14" cy="14" r="11" />
            <circle
              className="qv3-ring-fg" cx="14" cy="14" r="11"
              strokeDasharray={circumference}
              strokeDashoffset={isOpen ? offset : circumference}
              style={{ transition:'stroke-dashoffset 1s ease' }}
            />
          </svg>
        </div>

        <span className="qv3-chevron">▼</span>
      </div>

      {/* Expandable body */}
      <div className="qv3-res-body">
        <div style={{ padding:'0 16px 16px' }}>
          <p style={{ fontSize:'0.78rem', color:'#94a3b8', lineHeight:1.6, marginBottom:'0.8rem' }}>{d.desc}</p>

          {/* Traits */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:'5px', marginBottom:'1rem' }}>
            {(d.traits || []).map(t => <span key={t} className="qv3-trait">{t}</span>)}
          </div>

          {/* Biaya box */}
          <div style={{ background:'#131729', border:'1px solid #2a3055', borderRadius:'12px', padding:'12px 14px', marginBottom:'10px' }}>
            <div style={{ fontSize:'0.58rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'#10b981', marginBottom:'6px', display:'flex', alignItems:'center', gap:'5px' }}>
              <span>💰</span> PREVIEW BIAYA KULIAH
            </div>
            <div style={{ fontSize:'1.3rem', fontWeight:900, color:'#fff', letterSpacing:'-0.5px' }}>{fmt(d.c1)}</div>
            <div style={{ fontSize:'0.65rem', color:'#64748b', marginBottom:'0.8rem', lineHeight:1.4 }}>{cicilanLabel} — bayar ini, langsung resmi jadi mahasiswa!</div>

            <div style={{ borderTop:'1px solid #2a3055', paddingTop:'8px' }}>
              {(d.rincian || []).map(r => (
                <div key={r.k} style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', padding:'4px 0', fontSize:'0.72rem', borderBottom:'1px solid rgba(42,48,85,0.4)' }}>
                  <div style={{ color:'#94a3b8', fontWeight:500 }}>
                    {r.k}
                    {KOMP_HELP[r.k] && <small style={{ display:'block', fontSize:'0.56rem', color:'#64748b', fontWeight:400, marginTop:'1px', lineHeight:1.3 }}>{KOMP_HELP[r.k]}</small>}
                  </div>
                  <div style={{ fontWeight:700, color:'#cbd5e1', fontVariantNumeric:'tabular-nums', whiteSpace:'nowrap', marginLeft:'8px' }}>{fmt(r.v)}</div>
                </div>
              ))}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0 4px', fontSize:'0.72rem', borderTop:'2px solid #2a3055', marginTop:'4px' }}>
                <div style={{ fontWeight:800, color:'#f1f5f9' }}>Total Cicilan 1</div>
                <div style={{ fontWeight:900, color:'#34d399', fontVariantNumeric:'tabular-nums' }}>{fmt(d.c1)}</div>
              </div>
            </div>

            <div style={{ marginTop:'8px', paddingTop:'8px', borderTop:'1px solid #2a3055', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ fontSize:'0.65rem', color:'#64748b' }}>Estimasi total s/d lulus: <strong style={{ color:'#cbd5e1', fontWeight:800 }}>~{fmtJt(d.total)}</strong></div>
            </div>

            {d.isKedokteran && (
              <div style={{ background:'rgba(251,191,36,0.08)', border:'1px solid rgba(251,191,36,0.2)', borderRadius:'8px', padding:'8px 12px', fontSize:'0.65rem', color:'#fbbf24', fontWeight:500, lineHeight:1.4, marginTop:'8px' }}>
                ⚠️ Biaya Kedokteran bervariasi per gelombang (angka di atas Gel.1). Belum termasuk Infak Kelipatan (min. kelipatan Rp 25 juta).
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PROMO SECTION COMPONENT
// ============================================================
function PromoSection({ topKey }) {
  const d = PD[topKey];
  const momList = getMomentumStatus();
  const active  = momList.find(m => m.status === 'active') || null;
  const dpCut   = active ? active.dpCut : (momList.find(m => m.status === 'upcoming')?.dpCut || 0);
  const isKedokteran = !!d.isKedokteran;
  const bestDpCut = momList.reduce((max, m) => Math.max(max, m.dpCut), 0);
  const maxSaving = bestDpCut + (isKedokteran ? 0 : DPP_INCENTIVE);

  const cd = useCountdown(active);

  // Quota animation
  const [quotaPct, setQuotaPct] = useState(0);
  const [quotaLeft, setQuotaLeft] = useState(active?.quota || 0);
  useEffect(() => {
    if (!active) return;
    const start = new Date(active.start), end = new Date(active.end), now = new Date();
    end.setHours(23, 59, 59);
    const elapsed = (now - start) / (end - start);
    const base = Math.min(0.85, elapsed * 0.9);
    const filled = Math.min(0.92, Math.max(0.15, base + Math.random() * 0.05));
    const remaining = active.quota - Math.round(active.quota * filled);
    const t = setTimeout(() => { setQuotaPct(filled * 100); setQuotaLeft(remaining); }, 800);
    return () => clearTimeout(t);
  }, [active]);

  return (
    <div className="qv3-anim-up qv3-d5" style={{ marginBottom:'1.2rem' }}>
      {/* Section title */}
      <div style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'0.72rem', fontWeight:800, color:'#fbbf24', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'0.6rem' }}>
        <span>🎁</span> POTONGAN & INSENTIF YANG BISA KAMU DAPATKAN
      </div>

      {/* Momentum DP card */}
      <div style={{ background:'#1a1f35', border:'1.5px solid rgba(251,191,36,0.2)', borderRadius:'16px', overflow:'hidden', position:'relative' }}>
        {/* Gold top stripe */}
        <div style={{ position:'absolute', top:0, left:0, right:0, height:'3px', background:'linear-gradient(90deg,#fbbf24,#fb923c)' }} />

        <div style={{ padding:'14px 16px 10px', display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'10px' }}>
          <div style={{ flex:1 }}>
            <div style={{
              display:'inline-flex', alignItems:'center', gap:'4px',
              padding:'3px 10px', borderRadius:'100px', fontSize:'0.56rem', fontWeight:800,
              textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'6px',
              background: active ? 'rgba(16,185,129,0.08)' : 'rgba(99,102,241,0.1)',
              border: active ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(99,102,241,0.2)',
              color: active ? '#34d399' : '#818cf8',
            }}>
              {active ? '● Sedang Berlaku' : 'Segera Dibuka'}
            </div>
            <div style={{ fontSize:'0.92rem', fontWeight:800, color:'#fff', marginBottom:'2px' }}>Potongan Dana Pembangunan (DP)</div>
            <div style={{ fontSize:'0.65rem', color:'#64748b', fontWeight:500 }}>Daftar di waktu yang tepat, dapat potongan biaya DP</div>
          </div>
        </div>

        {/* Countdown + quota (active only) */}
        {active && (
          <div style={{ padding:'0 16px' }}>
            {/* Countdown */}
            <div style={{ background:'#131729', border:'1px solid #2a3055', borderRadius:'8px', padding:'10px 12px', marginBottom:'8px' }}>
              <div style={{ fontSize:'0.58rem', fontWeight:700, color:'#fb7185', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'6px', display:'flex', alignItems:'center', gap:'4px' }}>
                <span className="qv3-blink" style={{ display:'inline-block', width:'6px', height:'6px', borderRadius:'50%', background:'#fb7185' }} />
                Periode {active.name} berakhir dalam
              </div>
              <div style={{ display:'flex', gap:'6px', justifyContent:'center' }}>
                {[['d','Hari'],['h','Jam'],['m','Menit'],['s','Detik']].map(([k, label]) => (
                  <div key={k} style={{ textAlign:'center', background:'#222845', borderRadius:'6px', padding:'6px 10px', minWidth:'48px' }}>
                    <div style={{ fontSize:'1.1rem', fontWeight:900, color:'#fff', fontVariantNumeric:'tabular-nums' }}>{cd[k]}</div>
                    <div style={{ fontSize:'0.5rem', fontWeight:600, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.06em', marginTop:'1px' }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quota bar */}
            <div style={{ background:'#131729', border:'1px solid #2a3055', borderRadius:'8px', padding:'10px 12px', marginBottom:'8px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'6px' }}>
                <div style={{ fontSize:'0.62rem', fontWeight:700, color:'#94a3b8' }}>Kuota potongan {active.name}</div>
                <div style={{ fontSize:'0.62rem', fontWeight:800, color:'#fbbf24' }}>{quotaLeft} / {active.quota} tersisa</div>
              </div>
              <div style={{ height:'6px', background:'#222845', borderRadius:'100px', overflow:'hidden' }}>
                <div className={`qv3-quota-fill${quotaPct > 70 ? ' low' : ''}`} style={{ width:`${quotaPct}%` }} />
              </div>
              {quotaPct > 50 && (
                <div style={{ fontSize:'0.58rem', color:'#fb7185', fontWeight:600, marginTop:'5px', display:'flex', alignItems:'center', gap:'4px' }}>
                  <span>⚡</span> Kuota terbatas — siapa cepat, dia dapat!
                </div>
              )}
            </div>
          </div>
        )}

        {/* Momentum timeline */}
        <div style={{ display:'flex', flexDirection:'column', gap:'6px', padding:'6px 16px 12px' }}>
          {momList.map(m => (
            <div key={m.id} className={`qv3-mt-row ${m.status}`}>
              <div className={`qv3-mt-dot ${m.status}`} />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:'0.68rem', fontWeight:700, color:'#cbd5e1' }}>{m.name}</div>
                <div style={{ fontSize:'0.58rem', color:'#64748b', fontWeight:500 }}>{m.period} · {m.jalur} · Kuota {m.quota}</div>
              </div>
              <div style={{ fontSize:'0.72rem', fontWeight:800, flexShrink:0, color: m.status==='active' ? '#34d399' : m.status==='upcoming' ? '#818cf8' : '#64748b', textDecoration: m.status==='ended' ? 'line-through' : 'none' }}>
                {m.status === 'ended' ? fmt(m.dpCut) : '-' + fmt(m.dpCut)}
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <div style={{ padding:'0 16px 12px' }}>
          <div style={{ fontSize:'0.62rem', color:'#64748b', lineHeight:1.45, padding:'8px 10px', background:'#131729', borderRadius:'8px' }}>
            <strong style={{ color:'#94a3b8' }}>Cara kerja:</strong> Potongan DP bukan potongan langsung di tagihan awal, melainkan penyesuaian biaya DP di semester berikutnya setelah kamu resmi aktif sebagai mahasiswa. Berlaku selama kuota tersedia.
          </div>
        </div>
      </div>

      {/* Insentif Pelunasan DPP (non-Kedokteran) */}
      {!isKedokteran && (
        <div style={{ background:'#1a1f35', border:'1.5px solid #2a3055', borderRadius:'16px', padding:'14px 16px', marginTop:'8px', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:0, left:0, right:0, height:'3px', background:'linear-gradient(90deg,#10b981,#22d3ee)' }} />
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px' }}>
            <div style={{ fontSize:'0.82rem', fontWeight:800, color:'#fff' }}>💎 Bonus Pelunasan DPP</div>
            <div style={{ fontSize:'0.88rem', fontWeight:900, color:'#34d399' }}>-{fmt(DPP_INCENTIVE)}</div>
          </div>
          <p style={{ fontSize:'0.68rem', color:'#94a3b8', lineHeight:1.5, marginBottom:'8px' }}>
            Lunasi DPP untuk 2 semester pertama sekaligus, dan dapatkan credit Rp 1 juta yang mengurangi tagihan DPP di Semester 3. Bisa digabung dengan beasiswa!
          </p>
          <div style={{ display:'flex', gap:'6px', alignItems:'stretch' }}>
            {[['Step 1','Lunasi DPP\nSem 1 & 2'],['→',null],['Step 2','Verifikasi\nKeuangan'],['→',null],['Bonus','Credit Rp 1 jt\ndi Semester 3']].map((item, i) => (
              item[1] === null
                ? <div key={i} style={{ display:'flex', alignItems:'center', color:'#64748b', fontSize:'0.6rem', flexShrink:0 }}>{item[0]}</div>
                : <div key={i} style={{ flex:1, padding:'8px 10px', background:'#131729', borderRadius:'8px', textAlign:'center' }}>
                    <div style={{ fontSize:'0.55rem', fontWeight:800, color:'#818cf8', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'3px' }}>{item[0]}</div>
                    <div style={{ fontSize:'0.6rem', color:'#94a3b8', fontWeight:600, lineHeight:1.35, whiteSpace:'pre-line' }}>{item[1]}</div>
                  </div>
            ))}
          </div>
        </div>
      )}

      {/* Refund guarantee */}
      <div style={{ display:'flex', alignItems:'flex-start', gap:'12px', background:'linear-gradient(135deg,rgba(99,102,241,0.08),rgba(129,140,248,0.05))', border:'1.5px solid rgba(99,102,241,0.25)', borderRadius:'16px', padding:'14px 16px', marginTop:'8px' }}>
        <div style={{ fontSize:'1.5rem', flexShrink:0, lineHeight:1 }}>🛡️</div>
        <div>
          <div style={{ fontSize:'0.82rem', fontWeight:800, color:'#fff', marginBottom:'3px' }}>Garansi 100% Uang Kembali</div>
          <div style={{ fontSize:'0.68rem', color:'#94a3b8', lineHeight:1.55 }}>Jika kamu diterima di Perguruan Tinggi Negeri (PTN), biaya yang sudah dibayarkan ke UNPAS akan dikembalikan 100%. Daftar tanpa risiko!</div>
        </div>
      </div>

      {/* Savings summary */}
      {maxSaving > 0 && (
        <div style={{ background:'linear-gradient(135deg,rgba(16,185,129,0.08),rgba(34,211,238,0.06))', border:'1.5px solid rgba(16,185,129,0.2)', borderRadius:'16px', padding:'14px 16px', marginTop:'10px', textAlign:'center' }}>
          <div style={{ fontSize:'0.6rem', fontWeight:700, color:'#10b981', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'4px' }}>Total potongan yang bisa kamu dapatkan hingga</div>
          <div style={{ fontSize:'1.4rem', fontWeight:900, color:'#34d399', letterSpacing:'-0.5px' }}>-{fmt(maxSaving)}</div>
          <div style={{ fontSize:'0.6rem', color:'#64748b', marginTop:'3px' }}>Potongan DP{isKedokteran ? '' : ' + Insentif Pelunasan DPP'} · Berlaku dengan syarat & ketentuan</div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// MAIN QUIZ COMPONENT
// ============================================================
export default function Quiz() {
  const [screen, setScreen]   = useState('landing');
  const [curQ, setCurQ]       = useState(0);
  const [answers, setAnswers] = useState(Array(QS.length).fill(null));
  const [form, setForm]       = useState({ name:'', phone:'', school:'' });
  const [resultData, setResultData] = useState(null);
  const [openIdx, setOpenIdx] = useState(0);
  const [confetti, setConfetti] = useState(false);

  // Inject CSS once
  useEffect(() => {
    const id = 'qv3-global-css';
    if (!document.getElementById(id)) {
      const s = document.createElement('style');
      s.id = id; s.textContent = GLOBAL_CSS;
      document.head.appendChild(s);
    }
  }, []);

  useEffect(() => { window.scrollTo({ top:0, behavior:'smooth' }); }, [screen]);

  // Open ring animation when card opens
  const prevOpenIdx = useRef(null);
  useEffect(() => { prevOpenIdx.current = openIdx; }, [openIdx]);

  // ── Input validation ──────────────────────────────────────
  const validatePhone = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    return /^08\d{8,11}$/.test(cleaned) ? cleaned : null;
  };

  // ── Handlers ─────────────────────────────────────────────
  const startQuiz = () => {
    trackQuizStart(); // 📌 E2
    setCurQ(0);
    setAnswers(Array(QS.length).fill(null));
    setScreen('quiz');
  };

  const selectOpt = (idx) => {
    const a = [...answers];
    a[curQ] = idx;
    setAnswers(a);
  };

  const prevQ = () => { if (curQ > 0) setCurQ(curQ - 1); };

  const nextQ = () => {
    if (answers[curQ] === null) return;
    if (curQ < QS.length - 1) {
      const nq = curQ + 1;
      trackQuizProgress(nq + 1); // 📌 E3
      setCurQ(nq);
    } else {
      setScreen('capture');
    }
  };

  const submitData = async () => {
    if (!form.name.trim() || !form.phone.trim() || !form.school.trim()) {
      Swal.fire({ icon:'warning', title:'Data belum lengkap', text:'Mohon isi Nama Lengkap, Nomor WhatsApp, dan Asal Sekolah ya 😊', confirmButtonText:'OK' });
      return;
    }
    const validPhone = validatePhone(form.phone);
    if (!validPhone) {
      Swal.fire({ icon:'error', title:'Nomor tidak valid', text:'Nomor WhatsApp harus diawali 08 dan terdiri dari 10–13 digit', confirmButtonText:'Mengerti' });
      return;
    }

    // ── Hitung hasil quiz ──────────────────────────────────
    const scores = {};
    Object.keys(PD).forEach(k => scores[k] = 0);
    answers.forEach((ai, qi) => {
      if (ai !== null) {
        const opt = QS[qi].options[ai];
        Object.entries(opt.scores).forEach(([p, s]) => { scores[p] = (scores[p] || 0) + s; });
      }
    });
    const sorted   = Object.entries(scores).sort((a, b) => b[1] - a[1]).filter(([, s]) => s > 0);
    const maxScore = sorted[0] ? sorted[0][1] : 1;
    const top4     = sorted.slice(0, 4);
    const topKey   = top4[0][0];

    setScreen('loading');

    try {
      // ── Kirim ke backend (tanpa field result) ─────────────
      await axios.post(API_URL, {
        name:    form.name.trim(),
        phone:   validPhone,
        school:  form.school.trim(),
        answers,
      });

      await Swal.fire({ icon:'success', title:'Berhasil 🎉', text:'Data kamu sudah tersimpan!', confirmButtonText:'Lihat hasil' });

    } catch (err) {
      await Swal.fire({ icon:'error', title:'Oops...', text:'Terjadi kesalahan saat mengirim data', confirmButtonText:'Coba lagi' });
    }

    // ── Tampilkan result ───────────────────────────────────
    setResultData({ top4, maxScore });
    setOpenIdx(0);
    setScreen('result');
    setConfetti(true);
    setTimeout(() => setConfetti(false), 4500);

    trackDataSubmit();         // 📌 E4
    trackResultView(topKey);   // 📌 E5
  };

  const handleDaftar = () => {
    trackCTAClick('daftar'); // 📌 E6
    window.open('https://pmb.unpas.ac.id', '_blank');
  };

  const handleChat = () => {
    trackCTAClick('chat_admisi'); // 📌 E6
    const topProdi = resultData ? PD[resultData.top4[0][0]] : null;
    const msg = encodeURIComponent(
      `Halo, saya ${form.name}. Saya baru selesai tes kecocokan prodi dan hasilnya cocok di ${topProdi?.name}. Bisa info lebih lanjut soal pendaftaran, biaya, dan potongan?`
    );
    window.open(`https://wa.me/62811960193?text=${msg}`, '_blank');
  };

  const handleShare = () => {
    const text = "Aku baru coba Tes Kecocokan Prodi dari UNPAS dan hasilnya seru! Coba juga yuk 🎯👉 https://pmb.unpas.ac.id/quiz/";
    if (navigator.share) navigator.share({ title:'Tes Kecocokan Prodi UNPAS', text });
    else navigator.clipboard.writeText(text).then(() => alert('Link sudah dicopy! Share ke teman kamu ya 😊'));
  };

  const progressPct = Math.round((curQ / QS.length) * 100);
  const hasAnswer   = answers[curQ] !== null;
  const isLastQ     = curQ === QS.length - 1;

  // ── RENDER ───────────────────────────────────────────────
  return (
    <>
      <Confetti active={confetti} />

      {/* Container — max-width 540px sesuai HTML v3 */}
      <div style={{ maxWidth:'540px', margin:'0 auto', padding:'1rem', minHeight:'100vh', display:'flex', flexDirection:'column', fontFamily:"'Plus Jakarta Sans', sans-serif", background:'#0c0f1a', color:'#f1f5f9' }}>

        {/* ════ LANDING ════ */}
        {screen === 'landing' && (
          <div style={{ display:'flex', flexDirection:'column', flex:1, textAlign:'center', justifyContent:'center', alignItems:'center', padding:'2rem 0.5rem', gap:'0.5rem' }}>
            <div className="qv3-float" style={{ fontSize:'3rem' }}>🎯</div>

            {/* Live pill */}
            <div style={{ display:'inline-flex', alignItems:'center', gap:'6px', padding:'6px 14px', borderRadius:'100px', background:'linear-gradient(135deg,#4f46e5,#818cf8)', fontSize:'0.7rem', fontWeight:700, color:'#fff', margin:'0.8rem 0' }}>
              <div className="qv3-pulse" style={{ width:'7px', height:'7px', borderRadius:'50%', background:'#fff', flexShrink:0 }} />
              2.847 orang sudah coba!
            </div>

            <h1 style={{ fontSize:'clamp(1.6rem,5vw,2rem)', fontWeight:900, lineHeight:1.15, color:'#fff' }}>
              Cocok di{' '}
              <em style={{ fontStyle:'normal', background:'linear-gradient(135deg,#818cf8,#22d3ee)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                Prodi Apa
              </em>{' '}
              Kamu?
            </h1>

            <p style={{ color:'#94a3b8', fontSize:'0.95rem', maxWidth:'380px', margin:'0.3rem auto 0.8rem', lineHeight:1.6 }}>
              Jawab 10 pertanyaan singkat, temukan prodi yang sesuai minat kamu — lengkap dengan info biaya & potongan!
            </p>

            {/* Stats row */}
            <div style={{ display:'flex', gap:'1.5rem', justifyContent:'center', margin:'0.5rem 0 1.5rem' }}>
              {[['27','Program Studi'],['7','Fakultas'],['~2 min','Durasi']].map(([n, l]) => (
                <div key={l} style={{ textAlign:'center' }}>
                  <div style={{ fontSize:'1.1rem', fontWeight:800, color:'#818cf8' }}>{n}</div>
                  <div style={{ fontSize:'0.62rem', color:'#64748b', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em', marginTop:'2px' }}>{l}</div>
                </div>
              ))}
            </div>

            <button className="qv3-btn-start" onClick={startQuiz}>Mulai Tes →</button>

            {/* Features */}
            <div style={{ display:'flex', gap:'1.2rem', justifyContent:'center', marginTop:'1.2rem', flexWrap:'wrap' }}>
              {[['✅','Gratis'],['🎯','Personal'],['💰','Info Biaya'],['🎁','Info Potongan']].map(([ic, label]) => (
                <div key={label} style={{ display:'flex', alignItems:'center', gap:'5px', fontSize:'0.72rem', color:'#64748b', fontWeight:500 }}>
                  <div className="qv3-feat-ic">{ic}</div>
                  {label}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════ QUIZ ════ */}
        {screen === 'quiz' && (
          <div style={{ display:'flex', flexDirection:'column', flex:1, padding:'0.5rem 0' }}>
            {/* Progress bar */}
            <div style={{ height:'5px', background:'#222845', borderRadius:'100px', marginBottom:'1.5rem', overflow:'hidden' }}>
              <div style={{ height:'100%', background:'linear-gradient(90deg,#4f46e5,#22d3ee)', borderRadius:'100px', width:`${progressPct}%`, transition:'width 0.4s ease' }} />
            </div>

            {/* Q meta */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.6rem' }}>
              <div style={{ fontSize:'0.7rem', fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.06em' }}>
                Pertanyaan {curQ + 1} dari {QS.length}
              </div>
              <div style={{ fontSize:'1.3rem' }}>{QS[curQ].icon}</div>
            </div>

            {/* Q text */}
            <div className="qv3-q-text" style={{ fontSize:'1.15rem', fontWeight:800, color:'#fff', lineHeight:1.35, marginBottom:'0.3rem' }}>
              {QS[curQ].text}
            </div>

            {/* Q hint */}
            <div style={{ fontSize:'0.76rem', color:'#64748b', marginBottom:'1.2rem', fontWeight:500 }}>
              {QS[curQ].hint}
            </div>

            {/* Options */}
            <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
              {QS[curQ].options.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  className={`qv3-option${answers[curQ] === i ? ' qv3-sel' : ''}`}
                  onClick={() => selectOpt(i)}
                >
                  <span style={{ fontSize:'1.3rem', flexShrink:0, width:'32px', textAlign:'center', lineHeight:1 }}>{opt.icon}</span>
                  <span className="qv3-opt-txt" style={{ fontSize:'0.88rem', fontWeight:600, color:'#f1f5f9', lineHeight:1.35 }}>{opt.text}</span>
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div style={{ display:'flex', justifyContent:'space-between', marginTop:'1.5rem', paddingTop:'0.5rem' }}>
              <button type="button" className="qv3-btn-back" onClick={prevQ} style={{ visibility: curQ === 0 ? 'hidden' : 'visible' }}>
                ← Kembali
              </button>
              <button type="button" className={`qv3-btn-next${!hasAnswer ? ' qv3-dim' : ''}`} onClick={nextQ}>
                {isLastQ ? 'Lihat Hasil 🎉' : 'Lanjut →'}
              </button>
            </div>
          </div>
        )}

        {/* ════ CAPTURE ════ */}
        {screen === 'capture' && (
          <div style={{ display:'flex', flexDirection:'column', flex:1, justifyContent:'center', padding:'1.5rem 0.5rem' }}>
            <div style={{ background:'#1a1f35', border:'1.5px solid #2a3055', borderRadius:'16px', padding:'1.8rem 1.5rem' }}>
              <h2 style={{ fontSize:'1.2rem', fontWeight:800, color:'#fff', marginBottom:'0.3rem' }}>Satu langkah lagi! 🎉</h2>
              <p style={{ color:'#94a3b8', fontSize:'0.85rem', marginBottom:'1.3rem', lineHeight:1.6 }}>
                Isi data singkat untuk lihat hasil tes, rekomendasi prodi, dan info potongan biaya kamu.
              </p>

              {[
                { label:'Nama Lengkap',   key:'name',   type:'text', ph:'Masukkan nama kamu' },
                { label:'Nomor WhatsApp', key:'phone',  type:'tel',  ph:'08xxxxxxxxxx' },
                { label:'Asal Sekolah',   key:'school', type:'text', ph:'Nama SMA/SMK kamu' },
              ].map(({ label, key, type, ph }) => (
                <div key={key} style={{ marginBottom:'0.8rem' }}>
                  <label style={{ display:'block', fontSize:'0.72rem', fontWeight:700, color:'#94a3b8', marginBottom:'4px', textTransform:'uppercase', letterSpacing:'0.04em' }}>
                    {label}
                  </label>
                  <input className="qv3-input" type={type} placeholder={ph} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
                </div>
              ))}

              <button className="qv3-btn-submit" type="button" onClick={submitData}>
                Lihat Hasil Tes Saya →
              </button>
              <p style={{ fontSize:'0.65rem', color:'#64748b', textAlign:'center', marginTop:'0.8rem' }}>
                🔒 Data kamu aman. Hanya digunakan untuk rekomendasi & info PMB UNPAS.
              </p>
            </div>
          </div>
        )}

        {/* ════ LOADING ════ */}
        {screen === 'loading' && (
          <div style={{ display:'flex', flexDirection:'column', flex:1, justifyContent:'center', alignItems:'center', textAlign:'center', padding:'2rem' }}>
            <div className="qv3-spinner" style={{ width:'44px', height:'44px', border:'4px solid #2a3055', borderTopColor:'#818cf8', borderRadius:'50%', margin:'0 auto 1rem' }} />
            <p style={{ color:'#94a3b8', fontSize:'0.88rem', fontWeight:500 }}>Menganalisis jawaban kamu...</p>
          </div>
        )}

        {/* ════ RESULT ════ */}
        {screen === 'result' && resultData && (
          <div style={{ display:'flex', flexDirection:'column', flex:1, padding:'0.5rem 0 2rem' }}>
            {/* Header */}
            <div style={{ textAlign:'center', marginBottom:'1.2rem' }}>
              <span className="qv3-float" style={{ fontSize:'2.5rem', display:'block', marginBottom:'0.3rem' }}>🎉</span>
              <h2 style={{ fontSize:'1.3rem', fontWeight:900, color:'#fff' }}>Hasil Tes Kamu!</h2>
              <p style={{ fontSize:'0.82rem', color:'#94a3b8', marginTop:'0.2rem' }}>Rekomendasi prodi + info biaya & potongan yang bisa kamu dapatkan</p>
            </div>

            {/* Prodi result cards */}
            <div style={{ display:'flex', flexDirection:'column', gap:'0.7rem', marginBottom:'1rem' }}>
              {resultData.top4.map(([key, score], i) => (
                <ProdiCard
                  key={key}
                  prodiKey={key}
                  score={score}
                  maxScore={resultData.maxScore}
                  rank={i}
                  openIdx={openIdx}
                  setOpenIdx={setOpenIdx}
                />
              ))}
            </div>

            {/* Promo section */}
            <PromoSection topKey={resultData.top4[0][0]} />

            {/* CTA buttons */}
            <div className="qv3-anim-up qv3-d6" style={{ display:'flex', flexDirection:'column', gap:'0.6rem', marginTop:'0.3rem' }}>
              <button type="button" className="qv3-btn-cta-primary" onClick={handleDaftar}>
                📋 Daftar Sekarang di PMB UNPAS →
              </button>
              <button type="button" className="qv3-btn-cta-secondary" onClick={handleChat}>
                💬 Chat Tim Admisi
              </button>
              <button type="button" className="qv3-btn-share" onClick={handleShare}>
                📤 Share Hasil ke Teman
              </button>
            </div>

            <div style={{ textAlign:'center', fontSize:'0.6rem', color:'#64748b', marginTop:'1.2rem', fontWeight:500, opacity:0.6 }}>
              Universitas Pasundan — Pilihan Pasti Setiap Generasi
            </div>
          </div>
        )}

      </div>
    </>
  );
}
