import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import ModuleFooter from '../components/ModuleFooter';

const Module1 = () => {
  const { lang } = useLanguage();

  return (
    <div className="module-page">
      {/* Breadcrumb */}
      <nav className="module-breadcrumb" aria-label="breadcrumb">
        <Link to="/">Dashboard</Link>
        <span className="module-breadcrumb-sep">›</span>
        <span className="module-breadcrumb-current">
          {lang === 'il' ? 'Modul 1' : 'Module 1'}
        </span>
      </nav>

      {/* Header */}
      <div className="module-header">
        <div className="module-header-tag">🪟 {lang === 'il' ? 'Modul 1' : 'Module 1'}</div>
        <h1 className="module-title">
          {lang === 'il' ? 'Panglukat ti Windows Sandbox' : 'Getting Started with Windows Sandbox'}
        </h1>
      </div>

      <div className="module-divider"></div>

      {/* Section 1 */}
      <div className="module-section">
        <h2 className="module-section-title">
          {lang === 'il' ? 'Ano ti Windows Sandbox?' : 'What is Windows Sandbox?'}
        </h2>
        <p>
          {lang === 'il'
            ? 'Ti Windows Sandbox ket maysa a natalged (safe) a lugar iti uneg ti computer a mabalinmo a pagpadpadasan a paglukatan kadagiti programa wenno file nga amak mo a makadadael. No iserram ti Sandbox, maikkat amin dagiti naaramid ditoy, isu a saan a madangran ti pudno a computer mo.'
            : 'Windows Sandbox is a secure (safe) environment inside your computer where you can safely test programs or files that you fear might be harmful. When you close the Sandbox, everything done inside it is deleted, so your real computer is never harmed.'}
        </p>
      </div>

      {/* Section 2 — Steps */}
      <div className="module-section">
        <h2 className="module-section-title">
          {lang === 'il' ? 'Kasano nga I-setup?' : 'How to Set It Up?'}
        </h2>
        <ol className="module-steps">
          {[
            lang === 'il'
              ? 'Siguraduen nga adda iti Windows 10 Pro wenno Windows 11 Pro ti computer mo.'
              : 'Ensure your computer is running Windows 10 Pro or Windows 11 Pro.',
            lang === 'il'
              ? 'Laukem ti Control Panel ken mapan iti Programs.'
              : 'Open the Control Panel and go to Programs.',
            lang === 'il'
              ? 'I-click ti Turn Windows features on or off.'
              : 'Click on Turn Windows features on or off.',
            lang === 'il'
              ? 'Biruken ti Windows Sandbox, tsek-am, ken i-click ti OK.'
              : 'Find Windows Sandbox, check the box, and click OK.',
            lang === 'il'
              ? 'I-restart ti computer tapno ma-activate.'
              : 'Restart the computer to activate it.',
          ].map((step, i) => (
            <li key={i} data-step={i + 1}>{step}</li>
          ))}
        </ol>
      </div>

      {/* Callout */}
      <div className="module-callout">
        <span className="module-callout-icon">💡</span>
        <div>
          <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>
            {lang === 'il' ? 'Palagip' : 'Reminder'}
          </strong>
          {lang === 'il'
            ? 'Masapul a naka-enable ti "Virtualization" idiay BIOS tapno agbalin ti Sandbox.'
            : 'Virtualization must be enabled in your BIOS for the Sandbox to work.'}
        </div>
      </div>
      <ModuleFooter moduleId={1} />
    </div>
  );
};

export default Module1;
