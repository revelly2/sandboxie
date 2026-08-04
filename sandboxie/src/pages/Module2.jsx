import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import ModuleFooter from '../components/ModuleFooter';

const Module2 = () => {
  const { lang } = useLanguage();

  return (
    <div className="module-page">
      {/* Breadcrumb */}
      <nav className="module-breadcrumb" aria-label="breadcrumb">
        <Link to="/">Dashboard</Link>
        <span className="module-breadcrumb-sep">›</span>
        <span className="module-breadcrumb-current">
          {lang === 'il' ? 'Modul 2' : 'Module 2'}
        </span>
      </nav>

      {/* Header */}
      <div className="module-header">
        <div className="module-header-tag">🦠 {lang === 'il' ? 'Modul 2' : 'Module 2'}</div>
        <h1 className="module-title">
          {lang === 'il' ? 'Panangbigbig Kadagiti Virus ken Worms' : 'Identifying Viruses and Worms'}
        </h1>
      </div>

      <div className="module-divider"></div>

      {/* Section 1 — Comparison */}
      <div className="module-section">
        <h2 className="module-section-title">
          {lang === 'il' ? 'Diferensia ti Virus ken Worm' : 'Difference between a Virus and a Worm'}
        </h2>
        <div className="module-compare-grid">
          <div className="module-compare-card">
            <div className="module-compare-header danger">
              🦠 Virus
            </div>
            <div className="module-compare-body">
              {lang === 'il'
                ? 'Ti Virus ket masapul na ti tao tapno ag-spread. Kas pagarigan, masapul nga i-click mo ti infektado a file tapno kumalat daytoy iti computer mo. Mapagserbi da dagiti programa tapno idadael da.'
                : 'A Virus requires human interaction to spread. For example, you must click on an infected file for it to spread on your computer. They attach themselves to programs to cause damage.'}
            </div>
          </div>
          <div className="module-compare-card">
            <div className="module-compare-header warning">
              🐛 Worm
            </div>
            <div className="module-compare-body">
              {lang === 'il'
                ? 'Ti Worm ket kabaelanna ti ag-kopya iti bagbagina nga awan tulong ti tao. Mabalinda a mang-infect kadagiti computer babaen iti network, isu a naparpartak da a kumalat kompara iti virus.'
                : 'A Worm can replicate itself without human intervention. They can infect computers through a network, making them spread much faster than a virus.'}
            </div>
          </div>
        </div>
      </div>

      {/* Section 2 — Isolation Steps */}
      <div className="module-section">
        <h2 className="module-section-title">
          {lang === 'il' ? 'Kasano nga I-isolate iti Windows Sandbox?' : 'How to Isolate them in Windows Sandbox?'}
        </h2>
        <p style={{ marginBottom: 20 }}>
          {lang === 'il'
            ? 'Tapno saan a makalat ti malware iti pudno a sistemam, usarem ti Sandbox:'
            : 'To prevent malware from spreading to your actual system, use the Sandbox:'}
        </p>
        <ol className="module-steps">
          {[
            lang === 'il'
              ? 'Ikopia (Copy) ti suspetsado a file idiay host (pudno a computer).'
              : 'Copy the suspicious file from the host (real computer).',
            lang === 'il'
              ? 'I-paste idiay uneg ti Windows Sandbox.'
              : 'Paste it inside the Windows Sandbox.',
            lang === 'il'
              ? 'Piduten wenno luktan ti file idiay Sandbox tapno kitaen no ania ti aramidenna (panag-monitor).'
              : 'Open or run the file inside the Sandbox to see what it does (monitoring).',
            lang === 'il'
              ? 'No makitam nga adda virus o worm, iserram laeng ti Sandbox. Maikkat amin dagiti naaramid na (Isolated).'
              : 'If you see signs of a virus or worm, simply close the Sandbox. Everything it did will be erased (Isolated).',
          ].map((step, i) => (
            <li key={i} data-step={i + 1}>{step}</li>
          ))}
        </ol>
      </div>
      <ModuleFooter moduleId={2} />
    </div>
  );
};

export default Module2;
