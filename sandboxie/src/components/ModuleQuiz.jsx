import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { supabase } from '../lib/supabase';
import { fireConfetti } from '../lib/confetti';
import '../pages/Auth.css';

// Quiz data for all 4 modules, bilingual
const quizData = {
  1: {
    il: [
      {
        question: 'Ania ti Windows Sandbox?',
        options: [
          'Maysa a ay-ayam',
          'Natalged a lugar iti uneg ti computer a pangpadas kadagiti programa',
          'Maysa a website',
          'Maysa a antivirus software'
        ],
        correct: 1
      },
      {
        question: 'Ania ti mapasamak no iserram ti Windows Sandbox?',
        options: [
          'Ag-restart ti computer',
          'Ma-save amin dagiti file',
          'Maikkat amin dagiti naaramid iti uneg na',
          'Awan ti mapasamak'
        ],
        correct: 2
      },
      {
        question: 'Ania ti masapul a naka-enable iti BIOS tapno agbalin ti Sandbox?',
        options: [
          'Bluetooth',
          'Secure Boot',
          'Virtualization',
          'Fast Boot'
        ],
        correct: 2
      },
    ],
    en: [
      {
        question: 'What is Windows Sandbox?',
        options: [
          'A video game',
          'A secure environment inside your computer to test programs',
          'A website',
          'An antivirus software'
        ],
        correct: 1
      },
      {
        question: 'What happens when you close Windows Sandbox?',
        options: [
          'The computer restarts',
          'All files are saved',
          'Everything done inside is deleted',
          'Nothing happens'
        ],
        correct: 2
      },
      {
        question: 'What must be enabled in BIOS for Sandbox to work?',
        options: [
          'Bluetooth',
          'Secure Boot',
          'Virtualization',
          'Fast Boot'
        ],
        correct: 2
      },
    ]
  },
  2: {
    il: [
      {
        question: 'Ania ti pagdumaan ti Virus ken Worm?',
        options: [
          'Ti Virus ket masapul na ti tao tapno ag-spread, ti Worm ket saan',
          'Ti Worm ket masapul na ti tao, ti Virus ket saan',
          'Awan ti pagdumaan da',
          'Ti Virus ket iti internet laeng'
        ],
        correct: 0
      },
      {
        question: 'Kasano a kumalat ti Worm?',
        options: [
          'Babaen ti USB laeng',
          'Babaen ti network a saan a masapul ti tao',
          'Babaen ti i-click ti user',
          'Saan a kumalat'
        ],
        correct: 1
      },
      {
        question: 'Ania ti aramiden no makitam a virus ti file idiay Sandbox?',
        options: [
          'I-delete ti pudno a computer',
          'I-restart ti computer',
          'Iserram laeng ti Sandbox',
          'Pabayen laeng'
        ],
        correct: 2
      },
    ],
    en: [
      {
        question: 'What is the difference between a Virus and a Worm?',
        options: [
          'A Virus requires human interaction to spread, a Worm does not',
          'A Worm requires human interaction, a Virus does not',
          'There is no difference',
          'A Virus only exists on the internet'
        ],
        correct: 0
      },
      {
        question: 'How does a Worm spread?',
        options: [
          'Only through USB drives',
          'Through a network without human intervention',
          'By the user clicking on it',
          'It does not spread'
        ],
        correct: 1
      },
      {
        question: 'What should you do if you find a virus in a file inside the Sandbox?',
        options: [
          'Delete files on the real computer',
          'Restart the computer',
          'Simply close the Sandbox',
          'Ignore it'
        ],
        correct: 2
      },
    ]
  },
  3: {
    il: [
      {
        question: 'Ania ti Trojan?',
        options: [
          'Maysa a programa a mangidadael ti hardware',
          'Agpampammarang nga imbag a software ngem dakes ti aramid na',
          'Maysa a klase ti worm',
          'Maysa a antivirus'
        ],
        correct: 1
      },
      {
        question: 'Ania ti aramiden ti Ransomware?',
        options: [
          'Mangpapardas ti computer',
          'I-lock na dagiti files mo ken agkiddaw ti bayad',
          'Mangikkat ti malware',
          'Mangpaadu ti RAM'
        ],
        correct: 1
      },
      {
        question: 'Ania ti masayaat nga aramiden sakbay a luktan ti ransomware idiay Sandbox?',
        options: [
          'I-update ti Windows',
          'Idiskonektar ti internet',
          'Manginstall ti ay-ayam',
          'Mangikabil ti password'
        ],
        correct: 1
      },
    ],
    en: [
      {
        question: 'What is a Trojan?',
        options: [
          'A program that damages hardware',
          'Malware disguised as legitimate software',
          'A type of worm',
          'An antivirus program'
        ],
        correct: 1
      },
      {
        question: 'What does Ransomware do?',
        options: [
          'Speeds up the computer',
          'Locks your files and demands payment',
          'Removes malware',
          'Increases RAM'
        ],
        correct: 1
      },
      {
        question: 'What should you do before opening ransomware in the Sandbox?',
        options: [
          'Update Windows',
          'Disconnect from the internet',
          'Install a game',
          'Set a password'
        ],
        correct: 1
      },
    ]
  },
  4: {
    il: [
      {
        question: 'Ania ti Adware?',
        options: [
          'Programa a mangpapardas ti internet',
          'Programa a mangipakita ti adu unay nga ads',
          'Maysa a klase ti virus',
          'Maysa a browser extension'
        ],
        correct: 1
      },
      {
        question: 'Ania ti maysa a sintomas ti Adware?',
        options: [
          'Napardas ti computer',
          'Kellaat nga adda aglukat a pop-up windows',
          'Naadu ti storage',
          'Nalaing ti internet'
        ],
        correct: 1
      },
      {
        question: 'Ania ti mabalin a tool a mangusar tapno maikkat ti adware?',
        options: [
          'Notepad',
          'Calculator',
          'AdwCleaner wenno Malwarebytes',
          'Paint'
        ],
        correct: 2
      },
    ],
    en: [
      {
        question: 'What is Adware?',
        options: [
          'A program that speeds up the internet',
          'A program that displays excessive advertisements',
          'A type of virus',
          'A browser extension'
        ],
        correct: 1
      },
      {
        question: 'What is one symptom of Adware?',
        options: [
          'The computer runs faster',
          'Sudden appearance of pop-up windows',
          'More storage space',
          'Better internet speed'
        ],
        correct: 1
      },
      {
        question: 'What tool can be used to remove adware?',
        options: [
          'Notepad',
          'Calculator',
          'AdwCleaner or Malwarebytes',
          'Paint'
        ],
        correct: 2
      },
    ]
  }
};

const ModuleQuiz = ({ moduleId }) => {
  const { lang } = useLanguage();
  const { user } = useAuth();
  const toast = useToast();
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const questions = quizData[moduleId]?.[lang] || [];
  const question = questions[currentQ];

  const handleSelect = (index) => {
    if (confirmed) return;
    setSelected(index);
  };

  const handleConfirm = () => {
    if (selected === null) return;
    setConfirmed(true);
    const newAnswers = [...answers, { selected, correct: question.correct }];
    setAnswers(newAnswers);

    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ(currentQ + 1);
        setSelected(null);
        setConfirmed(false);
      } else {
        setShowResult(true);
        const score = newAnswers.filter(a => a.selected === a.correct).length;
        if (score === questions.length) {
          fireConfetti();
        }
        // Save quiz score to Supabase
        if (user) {
          supabase.from('quiz_scores').upsert({
            user_id: user.id,
            module_id: moduleId,
            score,
            total: questions.length,
            completed_at: new Date().toISOString()
          }, { onConflict: 'user_id,module_id' }).then(({ error }) => {
            if (error) console.error('Failed to save quiz:', error);
          });
        }
      }
    }, 1200);
  };

  const score = answers.filter(a => a.selected === a.correct).length;
  const percentage = Math.round((score / questions.length) * 100);

  const handleRetry = () => {
    setCurrentQ(0);
    setSelected(null);
    setAnswers([]);
    setShowResult(false);
    setConfirmed(false);
  };

  if (questions.length === 0) return null;

  if (showResult) {
    return (
      <div style={{ marginTop: '32px' }}>
        <div className="module-divider"></div>
        <div style={{
          padding: '32px', borderRadius: 'var(--radius-lg)',
          background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
          textAlign: 'center', marginTop: '24px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>
            {percentage >= 80 ? '🏆' : percentage >= 50 ? '👍' : '📚'}
          </div>
          <h3 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px', fontFamily: "'Rajdhani', sans-serif" }}>
            {score} / {questions.length}
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            {percentage >= 80
              ? (lang === 'il' ? 'Nalaing ka! Napasam ti quiz!' : 'Great job! You passed the quiz!')
              : percentage >= 50
                ? (lang === 'il' ? 'Imbag! Ngem mabalin pay a mapasayaat.' : 'Good! But there is room for improvement.')
                : (lang === 'il' ? 'Padasen manen. Basaem manen ti modul.' : 'Try again. Review the module content.')}
          </p>
          <div style={{
            width: '100%', height: '8px', borderRadius: '999px',
            background: 'var(--bg-elevated)', overflow: 'hidden', marginBottom: '20px'
          }}>
            <div style={{
              height: '100%', borderRadius: '999px',
              width: `${percentage}%`,
              background: percentage >= 80 ? 'var(--mod-green)' : percentage >= 50 ? 'var(--mod-amber)' : 'var(--mod-red)',
              transition: 'width 0.6s ease'
            }} />
          </div>
          <button
            className="btn-open-module"
            onClick={handleRetry}
            style={{ padding: '10px 24px' }}
          >
            {lang === 'il' ? 'Padasen Manen' : 'Try Again'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '32px' }}>
      <div className="module-divider"></div>
      <div className="module-section" style={{ marginTop: '24px' }}>
        <h2 className="module-section-title">
          {lang === 'il' ? 'Quiz' : 'Quiz'}
        </h2>
        
        {/* Progress */}
        <div style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
          marginBottom: '16px', fontSize: '13px', color: 'var(--text-muted)' 
        }}>
          <span>{lang === 'il' ? 'Saludsod' : 'Question'} {currentQ + 1} / {questions.length}</span>
          <div style={{ display: 'flex', gap: '4px' }}>
            {questions.map((_, i) => (
              <div key={i} style={{
                width: '24px', height: '4px', borderRadius: '999px',
                background: i < currentQ ? 'var(--accent)' : i === currentQ ? 'var(--accent-light)' : 'var(--bg-elevated)',
                transition: 'background 0.3s'
              }} />
            ))}
          </div>
        </div>

        {/* Question */}
        <div style={{
          padding: '24px', borderRadius: 'var(--radius-lg)',
          background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px', lineHeight: 1.5 }}>
            {question.question}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {question.options.map((option, i) => {
              let borderColor = 'var(--border-subtle)';
              let bg = 'var(--bg-elevated)';
              let textColor = 'var(--text-secondary)';

              if (confirmed) {
                if (i === question.correct) {
                  borderColor = 'rgba(63,190,138,0.5)';
                  bg = 'rgba(63,190,138,0.1)';
                  textColor = '#6ee7b7';
                } else if (i === selected && i !== question.correct) {
                  borderColor = 'rgba(248,113,113,0.5)';
                  bg = 'rgba(248,113,113,0.1)';
                  textColor = '#f87171';
                }
              } else if (i === selected) {
                borderColor = 'rgba(124,92,252,0.5)';
                bg = 'rgba(124,92,252,0.1)';
                textColor = 'var(--accent-light)';
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={confirmed}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '14px 18px', borderRadius: 'var(--radius-md)',
                    border: `1px solid ${borderColor}`, background: bg,
                    color: textColor, fontSize: '14px', fontFamily: 'inherit',
                    cursor: confirmed ? 'default' : 'pointer',
                    transition: 'all 0.2s', textAlign: 'left',
                    fontWeight: i === selected ? 600 : 400
                  }}
                >
                  <span style={{
                    width: '24px', height: '24px', borderRadius: '50%',
                    border: `2px solid ${borderColor}`, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: 700, flexShrink: 0,
                    background: i === selected ? (confirmed ? bg : 'rgba(124,92,252,0.2)') : 'transparent'
                  }}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {option}
                </button>
              );
            })}
          </div>

          {!confirmed && (
            <button
              className="auth-submit-btn"
              onClick={handleConfirm}
              disabled={selected === null}
              style={{ 
                marginTop: '16px', maxWidth: '180px',
                opacity: selected === null ? 0.5 : 1,
                cursor: selected === null ? 'not-allowed' : 'pointer'
              }}
            >
              {lang === 'il' ? 'Ikompirma' : 'Confirm'}
            </button>
          )}

          {confirmed && (
            <div style={{ 
              marginTop: '12px', fontSize: '14px', fontWeight: 600,
              color: selected === question.correct ? 'var(--mod-green)' : 'var(--mod-red)'
            }}>
              {selected === question.correct
                ? (lang === 'il' ? '✓ Husto!' : '✓ Correct!')
                : (lang === 'il' ? '✕ Saan a husto' : '✕ Incorrect')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModuleQuiz;
