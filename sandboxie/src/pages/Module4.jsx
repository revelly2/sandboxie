import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import ModuleFooter from '../components/ModuleFooter';

const Module4 = () => {
  const { lang } = useLanguage();

  const symptoms = lang === 'il'
    ? [
        'Kellaat nga adda aglukat a pop-up windows.',
        'Nabaliwan ti default search engine ti browser mo (kasla nagbalin a sabali imbes a Google).',
        'Napabuntog ti panag-browse mo iti internet.',
      ]
    : [
        'Sudden appearance of pop-up windows.',
        "Your browser's default search engine has changed unexpectedly (e.g., it is no longer Google).",
        'Your internet browsing has become significantly slower.',
      ];

  const steps = lang === 'il'
    ? [
        'Idiay Windows Sandbox, padasen nga i-install ti app nga adda adware na tapno makitam no kasano a mangrugi.',
        'Padasen ti mapan idiay Control Panel → Programs and Features, ken i-uninstall ti saan mo a pulos nga am-ammo a programa.',
        'Padasen a dalusan ti Extensions idiay browser (kasla Google Chrome).',
        'Agsanay nga i-run ti AdwCleaner wenno Malwarebytes idiay uneg ti Sandbox tapno maikkat amin a dakes nga ads.',
      ]
    : [
        'Inside Windows Sandbox, try installing an app with adware to observe how it behaves.',
        'Go to Control Panel → Programs and Features, and try uninstalling programs you don\'t recognize.',
        'Try cleaning up the Extensions in your browser (like Google Chrome).',
        'Practice running AdwCleaner or Malwarebytes inside the Sandbox to remove all malicious ads.',
      ];

  return (
    <div className="module-page">
      {/* Breadcrumb */}
      <nav className="module-breadcrumb" aria-label="breadcrumb">
        <Link to="/">Dashboard</Link>
        <span className="module-breadcrumb-sep">›</span>
        <span className="module-breadcrumb-current">
          {lang === 'il' ? 'Modul 4' : 'Module 4'}
        </span>
      </nav>

      {/* Header */}
      <div className="module-header">
        <div className="module-header-tag">🧹 {lang === 'il' ? 'Modul 4' : 'Module 4'}</div>
        <h1 className="module-title">
          {lang === 'il' ? 'Panangikkat ti Adware' : 'Removing Adware'}
        </h1>
      </div>

      <div className="module-divider"></div>

      {/* Section 1 */}
      <div className="module-section">
        <h2 className="module-section-title">
          {lang === 'il' ? 'Ano ti Adware?' : 'What is Adware?'}
        </h2>
        <p>
          {lang === 'il'
            ? 'Ti Adware ket maysa a programa a mangipakita ti adu unay nga ads (pa-anunsio) idiay computer mo, nangnangruna no ag-internet ka. Uray no saan da a kasla kapeggad ti ransomware, makasuron da ken pabanayen da ti computer mo.'
            : 'Adware is a program that displays excessive advertisements on your computer, especially when browsing the internet. While they may not be as dangerous as ransomware, they are extremely annoying and can slow down your computer.'}
        </p>
      </div>

      {/* Section 2 — Symptoms */}
      <div className="module-section">
        <h2 className="module-section-title">
          {lang === 'il' ? 'Sintomas ti Adware' : 'Symptoms of Adware'}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {symptoms.map((symptom, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                fontSize: 14,
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
              }}
            >
              <span style={{ color: 'var(--mod-amber)', flexShrink: 0, marginTop: 2 }}>⚡</span>
              {symptom}
            </div>
          ))}
        </div>
      </div>

      {/* Section 3 — Steps */}
      <div className="module-section">
        <h2 className="module-section-title">
          {lang === 'il' ? 'Kasano nga Ikkatten?' : 'How to Remove It?'}
        </h2>
        <ol className="module-steps">
          {steps.map((step, i) => (
            <li key={i} data-step={i + 1}>{step}</li>
          ))}
        </ol>
      </div>
      <ModuleFooter moduleId={4} />
    </div>
  );
};

export default Module4;
