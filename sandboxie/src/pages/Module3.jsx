import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import ModuleFooter from '../components/ModuleFooter';

const Module3 = () => {
  const { lang } = useLanguage();

  return (
    <div className="module-page">
      {/* Breadcrumb */}
      <nav className="module-breadcrumb" aria-label="breadcrumb">
        <Link to="/">Dashboard</Link>
        <span className="module-breadcrumb-sep">›</span>
        <span className="module-breadcrumb-current">
          {lang === 'il' ? 'Modul 3' : 'Module 3'}
        </span>
      </nav>

      {/* Header */}
      <div className="module-header">
        <div className="module-header-tag">🛡️ {lang === 'il' ? 'Modul 3' : 'Module 3'}</div>
        <h1 className="module-title">
          {lang === 'il' ? 'Panangiggem ti Trojans ken Ransomware' : 'Handling Trojans and Ransomware'}
        </h1>
      </div>

      <div className="module-divider"></div>

      {/* Section 1 — Understanding */}
      <div className="module-section">
        <h2 className="module-section-title">
          {lang === 'il' ? 'Ammuen ti Trojan ken Ransomware' : 'Understanding Trojans and Ransomware'}
        </h2>
        <div className="module-compare-grid">
          <div className="module-compare-card">
            <div className="module-compare-header info">
              🎭 Trojan
            </div>
            <div className="module-compare-body">
              {lang === 'il'
                ? 'Ti Trojan ket agpampammarang nga imbag a software (kasla ay-ayam wenno tool) ngem iti kinapudnona ket adda dakes nga ikagumaan na (kasla mang-takaw ti password).'
                : 'A Trojan disguises itself as legitimate software (like a game or tool) but in reality, it has malicious intent (like stealing passwords).'}
            </div>
          </div>
          <div className="module-compare-card">
            <div className="module-compare-header danger">
              🔒 Ransomware
            </div>
            <div className="module-compare-body">
              {lang === 'il'
                ? 'Ti Ransomware ket i-lock na dagiti files mo ken agkiddaw ti bayad (ransom) sakbay na ibalik kadaka dagitoy.'
                : 'Ransomware locks your files and demands payment (ransom) before returning access to them.'}
            </div>
          </div>
        </div>
      </div>

      {/* Section 2 — Safe Testing */}
      <div className="module-section">
        <h2 className="module-section-title">
          {lang === 'il' ? 'Natalged a Panag-Testing' : 'Safe Testing Practices'}
        </h2>
        <p style={{ marginBottom: 20 }}>
          {lang === 'il'
            ? 'Gapu ta napigsa dagitoy a malware, masapul a nag-ingat tayo:'
            : 'Because these types of malware are very dangerous, we must be careful:'}
        </p>
        <ol className="module-steps">
          <li data-step="1">
            <div>
              <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>
                {lang === 'il' ? 'Awan ti internet' : 'No Internet'}
              </strong>
              {lang === 'il'
                ? 'Sakbay a luktan ti ransomware idiay Sandbox, masayaat no awan ti internet connection ti computer mo tapno saan da a makapagpadala ti impormasyon.'
                : 'Before opening ransomware in the Sandbox, it is best to disconnect your computer from the internet so it cannot transmit information.'}
            </div>
          </li>
          <li data-step="2">
            <div>
              <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>
                {lang === 'il' ? 'Panag-obserba' : 'Observation'}
              </strong>
              {lang === 'il'
                ? 'Padasen a luktan ti Trojan idiay Sandbox. Makitam a kellaat nga adda aglukat a command prompt wenno dadduma pay a programa a saan mo nga inkabil.'
                : 'Try opening a Trojan in the Sandbox. You might notice a command prompt or other programs opening suddenly without your input.'}
            </div>
          </li>
          <li data-step="3">
            <div>
              <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>
                {lang === 'il' ? 'Kasano i-reset' : 'How to reset'}
              </strong>
              {lang === 'il'
                ? 'Uray no i-lock ti ransomware ti Sandbox mo, saanna a mairaman ti pudno a computer mo. Iserram laeng ti Sandbox ket malpasin ti problema.'
                : 'Even if ransomware locks your Sandbox, it will not affect your real computer. Just close the Sandbox and the problem is gone.'}
            </div>
          </li>
        </ol>
      </div>

      {/* Warning Callout */}
      <div className="module-callout" style={{ borderColor: 'rgba(224,92,92,0.3)', background: 'rgba(224,92,92,0.08)' }}>
        <span className="module-callout-icon">⚠️</span>
        <div>
          <strong style={{ color: '#f87171', display: 'block', marginBottom: 4 }}>
            {lang === 'il' ? 'Ballaag' : 'Warning'}
          </strong>
          {lang === 'il'
            ? 'Saan pulos a paglukatan ti ransomware iti pudno a computer mo, pasig a mangdadael ken mang-lock kadagiti files mo!'
            : 'Never open ransomware on your real computer, it will absolutely ruin and lock your files!'}
        </div>
      </div>
      <ModuleFooter moduleId={3} />
    </div>
  );
};

export default Module3;
