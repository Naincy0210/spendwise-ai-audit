/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, BarChart3, ArrowRight, Wallet, Info, Menu, X, CheckCircle2 } from 'lucide-react';
import Landing from './views/Landing';
import AuditForm from './views/AuditForm';
import Results from './views/Results';
import { AuditResult } from './types';

export default function App() {
  const [view, setView] = useState<'landing' | 'audit' | 'results'>('landing');
  const [currentAudit, setCurrentAudit] = useState<AuditResult | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Check URL for shared audit ID
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const auditId = params.get('aid');
    if (auditId) {
      setView('results');
    }
  }, []);

  const handleStartAudit = () => setView('audit');
  
  const handleAuditComplete = (result: AuditResult) => {
    setCurrentAudit(result);
    setView('results');
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass border-b px-4 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer group" 
          onClick={() => {
            setView('landing');
            const url = new URL(window.location.href);
            url.searchParams.delete('aid');
            window.history.pushState({}, '', url);
          }}
        >
          <div className="w-8 h-8 rounded-full bg-credex-green flex items-center justify-center text-white group-hover:rotate-12 transition-transform">
            <Wallet className="w-5 h-5" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">SpendWise</span>
          <span className="text-[10px] bg-emerald-100 text-credex-green px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">Audit</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#how-it-works" className="hover:text-credex-green transition-colors">How it Works</a>
          <a href="#pricing" className="hover:text-credex-green transition-colors">AI Pricing Benchmarks</a>
          <button 
            onClick={handleStartAudit}
            className="bg-credex-green text-white px-5 py-2 rounded-full hover:bg-credex-green-light transition-all shadow-lg shadow-credex-green/20"
          >
            Start Audit
          </button>
        </div>

        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-16 z-40 bg-white p-6 md:hidden"
          >
            <div className="flex flex-col gap-6 text-lg font-medium">
              <a href="#" className="flex items-center justify-between">How it Works <ArrowRight className="w-4 h-4" /></a>
              <a href="#" className="flex items-center justify-between">Benchmarks <ArrowRight className="w-4 h-4" /></a>
              <button 
                onClick={() => {
                  handleStartAudit();
                  setIsMenuOpen(false);
                }}
                className="w-full bg-credex-green text-white py-4 rounded-xl text-center"
              >
                Launch Auditor
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow pt-8 pb-16">
        <AnimatePresence mode="wait">
          {view === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Landing onStart={handleStartAudit} />
            </motion.div>
          )}

          {view === 'audit' && (
            <motion.div
              key="audit"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <AuditForm onComplete={handleAuditComplete} />
            </motion.div>
          )}

          {view === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Results auditResult={currentAudit} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white">
              <Wallet className="w-6 h-6 text-emerald-400" />
              <span className="font-display font-bold text-lg">SpendWise</span>
            </div>
            <p className="text-sm">
              The defensible AI spend audit tool for high-growth startups. Built by Credex.
            </p>
          </div>
          <div className="space-y-4 text-sm">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs">Product</h4>
            <div className="flex flex-col gap-2">
              <a href="#" className="hover:text-white">Audit Engine</a>
              <a href="#" className="hover:text-white">Credits Program</a>
              <a href="#" className="hover:text-white">Benchmarks</a>
            </div>
          </div>
          <div className="space-y-4 text-sm">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs">Trust</h4>
            <div className="flex flex-col gap-2">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Pricing Data (May 2026)</a>
              <p className="mt-4 flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" /> 
                Data traceably sourced from vendor docs.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

