import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Navigation from './components/Navigation';
import SoftAurora from './components/SoftAurora';

import Dashboard from './pages/Dashboard';
import Module1 from './pages/Module1';
import Module2 from './pages/Module2';
import Module3 from './pages/Module3';
import Module4 from './pages/Module4';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <SoftAurora 
          color1="#6d28d9" 
          color2="#a78bfa" 
          speed={0.7} 
          brightness={1.5} 
          enableMouseInteraction={true} 
        />
        <div className="app-shell">
          <Navigation />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/module/1" element={<Module1 />} />
              <Route path="/module/2" element={<Module2 />} />
              <Route path="/module/3" element={<Module3 />} />
              <Route path="/module/4" element={<Module4 />} />
            </Routes>
          </main>
          <footer className="app-footer">
            <div className="app-footer-inner">
              <span className="app-footer-logo">Sanboxie</span>
              <span className="app-footer-copy">© {new Date().getFullYear()} An Ilocano-Based Tutorial System</span>
            </div>
          </footer>
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
