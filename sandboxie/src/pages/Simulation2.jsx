import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './Simulation2.css';

const Simulation2 = () => {
  const { lang } = useLanguage();

  const [sandboxActive, setSandboxActive] = useState(false);
  const [trojanActive, setTrojanActive] = useState(false);
  const [ransomwareActive, setRansomwareActive] = useState(false);
  const [trojanLog, setTrojanLog] = useState([]);
  
  // Safe desktop files state
  const [files, setFiles] = useState([
    { id: 1, name: 'Thesis_Final.pdf', icon: '📄', isMalware: false },
    { id: 2, name: 'Family_Photos', icon: '📁', isMalware: false },
    { id: 3, name: 'Passwords.txt', icon: '🔑', isMalware: false },
    { id: 4, name: 'Free_Game.exe', icon: '🎮', isMalware: 'trojan' },
    { id: 5, name: 'Invoice_Urgent.doc', icon: '🧾', isMalware: 'ransomware' }
  ]);

  // Reset the environment
  const handleReset = () => {
    setTrojanActive(false);
    setRansomwareActive(false);
    setTrojanLog([]);
    setSandboxActive(false);
    
    // Restore files
    setFiles([
      { id: 1, name: 'Thesis_Final.pdf', icon: '📄', isMalware: false },
      { id: 2, name: 'Family_Photos', icon: '📁', isMalware: false },
      { id: 3, name: 'Passwords.txt', icon: '🔑', isMalware: false },
      { id: 4, name: 'Free_Game.exe', icon: '🎮', isMalware: 'trojan' },
      { id: 5, name: 'Invoice_Urgent.doc', icon: '🧾', isMalware: 'ransomware' }
    ]);
  };

  // Handle double clicking a file
  const handleFileClick = (file) => {
    if (ransomwareActive) return; // Desktop is locked!

    if (file.isMalware === 'trojan') {
      triggerTrojan();
    } else if (file.isMalware === 'ransomware') {
      triggerRansomware();
    }
  };

  const triggerTrojan = () => {
    setTrojanActive(true);
    setTrojanLog([
      '> Initializing Free_Game.exe...',
      '> Unpacking assets...',
      '> [BACKGROUND] Connecting to remote server...',
      '> [BACKGROUND] Accessing Passwords.txt...',
      '> [BACKGROUND] Uploading credentials to 192.168.x.x...',
      '> Done. Enjoy the game!'
    ]);
  };

  const triggerRansomware = () => {
    setRansomwareActive(true);
    // Change all safe files to encrypted state
    setFiles(prevFiles => prevFiles.map(f => {
      if (f.isMalware) return f;
      return {
        ...f,
        name: `${f.name}.ENCRYPTED`,
        icon: '🔒'
      };
    }));
  };

  // If user disables sandbox while malware is active, the malware escapes! (Unless they reset)
  // Actually, closing sandbox should just act like a reset.
  const toggleSandbox = () => {
    if (sandboxActive) {
      // Turning OFF sandbox -> Reset everything (Sandbox closed, malware destroyed)
      handleReset();
    } else {
      setSandboxActive(true);
    }
  };

  return (
    <div className="sim2-page">
      {/* Breadcrumb */}
      <div className="sim2-header">
        <nav className="module-breadcrumb" aria-label="breadcrumb">
          <Link to="/">Dashboard</Link>
          <span className="module-breadcrumb-sep">›</span>
          <Link to="/simulations">Simulations</Link>
          <span className="module-breadcrumb-sep">›</span>
          <span className="module-breadcrumb-current">
            {lang === 'il' ? 'Trojan & Ransomware' : 'Trojan & Ransomware'}
          </span>
        </nav>
        <h1 className="module-title" style={{ marginTop: '16px', fontSize: '28px' }}>
          {lang === 'il' ? 'Simulation: Peke a PC Desktop' : 'Simulation: Mock PC Desktop'}
        </h1>
      </div>

      {/* OS Container */}
      <div className={`os-container ${ransomwareActive ? 'ransomware-active' : ''} ${sandboxActive ? 'sandbox-active' : ''}`}>
        
        {/* Sandbox Badge */}
        {sandboxActive && (
          <div className="sandbox-badge">
            {lang === 'il' ? '🛡️ SANDBOX AKTIBO' : '🛡️ SANDBOX ACTIVE'}
          </div>
        )}

        {/* Desktop Icons */}
        <div className="os-desktop">
          {files.map(file => (
            <div 
              key={file.id} 
              className={`desktop-icon ${ransomwareActive && !file.isMalware ? 'locked' : ''}`}
              onDoubleClick={() => handleFileClick(file)}
              onClick={() => {
                // Mobile support for single click simulation
                if(window.innerWidth <= 768) handleFileClick(file);
              }}
              title={lang === 'il' ? 'I-double click tapno luktan' : 'Double-click to open'}
            >
              <div className="desktop-icon-emoji">{file.icon}</div>
              <div className="desktop-icon-name">{file.name}</div>
            </div>
          ))}
        </div>

        {/* Trojan Window */}
        {trojanActive && (
          <div className="os-window">
            <div className="os-window-header">
              <div className="os-window-controls">
                <div className="os-window-ctrl" onClick={() => setTrojanActive(false)}></div>
                <div className="os-window-ctrl"></div>
                <div className="os-window-ctrl"></div>
              </div>
              <div className="os-window-title">Free_Game_Installer.exe</div>
            </div>
            <div className="os-window-body">
              {trojanLog.map((log, i) => (
                <span key={i} className={`hacker-text ${log.includes('[BACKGROUND]') ? 'danger' : ''}`}>
                  {log}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Ransomware Note */}
        {ransomwareActive && (
          <div className="ransom-note">
            <div className="ransom-title">⚠️ YOUR FILES ARE ENCRYPTED ⚠️</div>
            <div className="ransom-text">
              {lang === 'il' 
                ? 'Na-lock amin a files mo! Masapul nga agbayad ka ti $1,000 iti Bitcoin tapno maalam ti decryption key. No saan, mabura amin a files mo!'
                : 'All your files have been locked! You must pay $1,000 in Bitcoin to get the decryption key. Otherwise, your files will be deleted forever!'}
            </div>
            <button className="ransom-btn" onClick={() => alert(lang === 'il' ? 'Saan a mabalin! Malware daytoy.' : 'Payment failed! Never pay the ransom.')}>
              {lang === 'il' ? 'Ag-Bayad Ita' : 'Pay Now'}
            </button>
          </div>
        )}

        {/* Taskbar */}
        <div className="os-taskbar">
          <div className="os-taskbar-icons">
            <div className="os-taskbar-icon">🪟</div>
            <div className="os-taskbar-icon">📁</div>
            <div className="os-taskbar-icon">🌐</div>
            {sandboxActive && <div className="os-taskbar-icon" style={{background: 'rgba(0,255,136,0.2)'}}>🛡️</div>}
          </div>
        </div>
      </div>

      {/* External Controls & Info Panel */}
      <div className="sim2-info-panel">
        <div className="sim2-info-header">
          <h2 style={{ fontSize: '18px', margin: 0 }}>{lang === 'il' ? 'Kontrol ti Simulation' : 'Simulation Controls'}</h2>
          <div className="sim2-controls">
            <button className={`btn-sandbox-toggle ${sandboxActive ? 'on' : 'off'}`} onClick={toggleSandbox}>
              {sandboxActive ? '🛡️ Sandbox: ON' : '🛡️ Sandbox: OFF'}
            </button>
            <button className="btn-reset" onClick={handleReset}>
              ↻ {lang === 'il' ? 'I-reset ti PC' : 'Reset PC'}
            </button>
          </div>
        </div>
        
        <div className="sim2-instruction">
          <strong style={{ color: 'var(--accent-light)' }}>{lang === 'il' ? 'Panggep:' : 'Objective:'} </strong>
          {lang === 'il' 
            ? 'I-double click dagiti files idiay pek-peke a desktop. Kitaen no ania ti aramiden ti Trojan (Free_Game.exe) ken Ransomware (Invoice_Urgent.doc). Kalpasanna, i-ON ti Sandbox ken padasen ulit tapno makitam no kasano na maprotektaran ti pudno a computer mo (i-OFF laeng ti Sandbox tapno maikkat ti malware).'
            : 'Double-click the files on the mock desktop. See what happens when you run the Trojan (Free_Game.exe) and the Ransomware (Invoice_Urgent.doc). Then, turn ON the Sandbox and try again to see how it protects your system (simply turn OFF the Sandbox to instantly destroy the malware).'}
        </div>

        {/* Detailed Educational Breakdown */}
        {(trojanActive || ransomwareActive) && (
          <div className="sim2-breakdown">
            <h3 className="sim2-breakdown-title">
              {lang === 'il' ? '🔍 Panang-adal iti Malware' : '🔍 Malware Breakdown'}
            </h3>
            
            <div className="sim2-breakdown-grid">
              {/* 1. Attack Vector */}
              <div className="sim2-breakdown-card">
                <div className="sim2-breakdown-icon">🎣</div>
                <h4>{lang === 'il' ? '1. Ti Pammarang (Vector)' : '1. The Disguise (Vector)'}</h4>
                <p>
                  {trojanActive 
                    ? (lang === 'il' ? 'Agpampammarang ti Trojan kasla mapagtalkan a programa ("Free_Game.exe"). Agkasapulan ti tao a mang-click tapno mangrugi.' : 'The Trojan disguised itself as a desirable program ("Free_Game.exe"). It relied on social engineering to trick you into running it.')
                    : (lang === 'il' ? 'Nalemmeng ti Ransomware iti uneg ti maysa a dokumento ("Invoice_Urgent.doc"). Gagangay daytoy kadagiti peke nga email.' : 'The Ransomware was hidden inside what looked like a normal document ("Invoice_Urgent.doc"). This is common in phishing emails.')}
                </p>
              </div>

              {/* 2. Payload */}
              <div className="sim2-breakdown-card danger">
                <div className="sim2-breakdown-icon">💣</div>
                <h4>{lang === 'il' ? '2. Ti Dakes nga Aramiden (Payload)' : '2. The Attack (Payload)'}</h4>
                <p>
                  {trojanActive
                    ? (lang === 'il' ? 'Iti likudan ti screen, linuktanna dagiti files mo ken in-upload na dagiti passwords mo iti sabali a server.' : 'While the fake game ran, it silently accessed your personal files and uploaded your passwords to a remote server.')
                    : (lang === 'il' ? 'Na-encrypt (na-lock) ti malware dagiti files mo. Saan mo a maluktan dagitoy aginggana saan ka nga agbayad ti ransom key.' : 'The malware encrypted all your files using complex math. You cannot open them without the attacker\'s decryption key.')}
                </p>
              </div>

              {/* 3. Sandbox Defense */}
              <div className={`sim2-breakdown-card ${sandboxActive ? 'success' : 'fail'}`}>
                <div className="sim2-breakdown-icon">{sandboxActive ? '🛡️' : '💀'}</div>
                <h4>{lang === 'il' ? '3. Depensa ti Sandboxie' : '3. Sandboxie Defense'}</h4>
                <p>
                  {sandboxActive
                    ? (lang === 'il' 
                        ? 'Gapu ta nakalukat ti Sandbox, ti malware ket adda iti uneg ti "virtual layer". Saanna a madadael ti pudno a computer. No iserram ti Sandbox, maikkat a dagus ti malware!' 
                        : 'Because Sandboxie is ON, the malware is trapped inside a virtual layer. It cannot touch your real hard drive. Turning the Sandbox OFF instantly deletes the malware and undoes the encryption/theft!')
                    : (lang === 'il'
                        ? 'Awan ti Sandbox! Ti malware ket direkta a nakastrek iti computer mo. Na-infecten ti systemam. (I-click ti Reset PC)'
                        : 'Sandboxie is OFF! The malware had direct access to your real hard drive and network. Your system is now compromised. (Click Reset PC)')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Permanent Educational Section */}
        <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border-subtle)' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '12px', color: 'var(--text-primary)' }}>
            {lang === 'il' ? 'Kasano a Makatulong ti Sandboxie?' : 'How Sandboxie Helps'}
          </h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '15px' }}>
            {lang === 'il'
              ? 'Ti Sandboxie ket agaramid iti naisina a "virtual space" iti uneg ti hard drive mo. Amin a programa a patarayen iti uneg ti Sandbox (kas iti browser wenno na-download a file) ket saan a mabalin a mangbaliw kadagiti pudno a files wenno system settings. No adda virus wenno ransomware, makulongda laeng iti uneg daytoy a virtual space. Gapu iti daytoy, natalged ti pudno a computer mo, ken mabalin a buraen a dagus ti malware babaen ti panang-isera iti Sandbox.'
              : 'Sandboxie creates an isolated "virtual space" on your hard drive. Any program run inside the Sandbox (like a web browser or a downloaded file) is prevented from making permanent changes to your real files or system settings. If a virus or ransomware executes, it is trapped inside this virtual layer. This keeps your actual computer completely safe, and allows you to instantly delete the malware simply by closing the Sandbox.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Simulation2;
