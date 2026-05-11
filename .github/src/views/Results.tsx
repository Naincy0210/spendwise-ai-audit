import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingDown, 
  ArrowUpRight, 
  Share2, 
  Download, 
  Calculator, 
  PhoneCall, 
  ChevronRight, 
  AlertCircle, 
  Sparkles,
  Lock,
  Mail,
  Building,
  CheckCircle2
} from 'lucide-react';
import { AuditResult, Lead } from '../types';
import { generatePersonalizedSummary } from '../lib/gemini';
import { captureLead, saveAuditResult, getAuditResult } from '../lib/firebase';
import { PRICING_DATA } from '../lib/pricing-data';

interface ResultsProps {
  auditResult: AuditResult | null;
}

export default function Results({ auditResult: initialAuditResult }: ResultsProps) {
  const [result, setResult] = useState<AuditResult | null>(initialAuditResult);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    // If we have an ID in the URL but no result, fetch it
    const params = new URLSearchParams(window.location.search);
    const auditId = params.get('aid');
    
    if (auditId && !result) {
      getAuditResult(auditId).then(data => setResult(data));
    }
    
    // Save new result if provided
    if (initialAuditResult && !initialAuditResult.id) {
       saveAuditResult(initialAuditResult).then(id => {
         const newResult = { ...initialAuditResult, id };
         setResult(newResult);
         
         // Update URL without reloading
         const url = new URL(window.location.href);
         url.searchParams.set('aid', id);
         window.history.pushState({}, '', url);
       });
    }
  }, [initialAuditResult]);

  useEffect(() => {
    if (result && !aiSummary && !isGeneratingAi) {
      setIsGeneratingAi(true);
      // We pass some mock context for now as AuditForm doesn't propagate everything yet
      generatePersonalizedSummary(result, 5, 'coding').then(summary => {
        setAiSummary(summary);
        setIsGeneratingAi(false);
      });
    }
  }, [result]);

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
          <Calculator className="w-12 h-12 text-slate-300" />
        </motion.div>
        <p className="text-slate-400 font-medium">Loading audit data...</p>
      </div>
    );
  }

  const handleLeadCapture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    await captureLead({
      email,
      companyName,
      auditId: result.id,
      teamSize: 5
    });

    setLeadCaptured(true);
  };

  const handleShare = async () => {
    setIsSharing(true);
    const shareUrl = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My AI Spend Audit Result',
          text: `I just saved $${result.totalPotentialMonthlySavings}/mo on my AI stack with SpendWise!`,
          url: shareUrl,
        });
      } catch (e) {}
    } else {
      await navigator.clipboard.writeText(shareUrl);
      alert("Link copied to clipboard!");
    }
    setIsSharing(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 space-y-12 pb-24">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 glass rounded-[3rem] p-10 flex flex-col justify-between border-emerald-100/50 bg-gradient-to-br from-white to-emerald-50/30">
          <div className="space-y-1">
             <div className="flex items-center gap-2 text-credex-green font-bold text-xs uppercase tracking-[0.2em] mb-4">
                <TrendingDown className="w-4 h-4" />
                Savings Opportunity
             </div>
             <h2 className="text-5xl md:text-7xl font-display font-bold text-slate-900 leading-tight">
               Save <span className="text-credex-green">${result.totalPotentialMonthlySavings.toLocaleString()}</span> <br /> 
               <span className="text-2xl text-slate-400 font-medium tracking-normal">Per month, identified.</span>
             </h2>
          </div>
          <div className="mt-12 flex items-center gap-8">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Annual Savings</p>
              <p className="text-2xl font-display font-bold text-slate-700">${result.totalPotentialAnnualSavings.toLocaleString()}</p>
            </div>
            <div className="w-px h-10 bg-slate-200" />
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Efficiency Gain</p>
              <p className="text-2xl font-display font-bold text-slate-700">
                {Math.round((result.totalPotentialMonthlySavings / result.totalCurrentMonthlySpend) * 100)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-[3rem] p-10 text-white flex flex-col justify-between shadow-2xl shadow-slate-900/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="space-y-6 relative">
            <h3 className="font-display font-bold text-2xl">Personalized Summary</h3>
            {isGeneratingAi ? (
              <div className="space-y-3 opacity-50">
                <div className="h-3 w-full bg-slate-700 rounded-full animate-pulse" />
                <div className="h-3 w-5/6 bg-slate-700 rounded-full animate-pulse" />
                <div className="h-3 w-4/6 bg-slate-700 rounded-full animate-pulse" />
              </div>
            ) : (
              <p className="text-slate-300 text-sm leading-relaxed font-medium">
                {aiSummary || "Generating your custom optimization insight..."}
              </p>
            )}
          </div>
          <div className="mt-8 flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest relative">
            <Sparkles className="w-4 h-4" /> Gemini AI Engine
          </div>
        </div>
      </div>

      {/* Per-Tool Breakdown */}
      <div className="space-y-8">
        <h3 className="text-2xl font-bold font-display px-2">Defensible Optimization Plan</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {result.recommendations.map((rec, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i} 
              className="bg-white border border-slate-100 rounded-3xl p-8 flex flex-col justify-between group hover:border-emerald-200 transition-all hover:shadow-xl hover:shadow-emerald-500/5"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-900 font-bold uppercase text-xs">
                      {rec.toolId.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg capitalize">{rec.toolId}</h4>
                      <p className="text-xs text-slate-400 font-medium">Plan: {rec.currentPlan}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-emerald-500 font-bold font-display text-lg">Save ${rec.monthlySavings.toFixed(0)}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Monthly</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl space-y-1 group-hover:bg-emerald-50 transition-colors">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <ArrowUpRight className="w-3 h-3" /> Optimal Action
                  </div>
                  <p className="text-sm font-bold text-slate-800">{rec.recommendedAction}</p>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed italic">
                  "{rec.reason}"
                </p>
              </div>
            </motion.div>
          ))}
          {result.recommendations.length === 0 && (
            <div className="md:col-span-2 p-12 text-center glass rounded-3xl border-emerald-100 flex flex-col items-center gap-4">
              <CheckCircle2 className="w-12 h-12 text-credex-green" />
              <p className="text-xl font-bold font-display">Your stack is lean.</p>
              <p className="text-slate-500 max-w-md mx-auto">No major overspend detected based on current benchmarks. You are spending highly efficiently for your team size.</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Section / Lead Capture */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-12 border-t">
        <div className="space-y-6">
          <h3 className="text-3xl font-bold font-display">Realize these savings.</h3>
          <p className="text-slate-600 leading-relaxed text-lg">
            Our audit logic is defensive, but the implementation requires coordination. 
            {result.totalPotentialMonthlySavings > 500 
              ? "Your potential savings meet the threshold for a guided Credex consultation. We can automate the switch and lock in your credit discounts today."
              : "Save these results to your inbox and we'll notify you when new plan optimizations are benchmarked for your stack."}
          </p>
          <div className="flex flex-wrap gap-4">
             <button 
              onClick={handleShare}
              disabled={isSharing}
              className="px-6 py-4 rounded-xl border-2 border-slate-200 font-bold flex items-center gap-2 hover:bg-slate-50 transition-all"
             >
                <Share2 className="w-5 h-5 text-slate-400" /> Share Audit
             </button>
             <button className="px-6 py-4 rounded-xl border-2 border-slate-200 font-bold flex items-center gap-2 hover:bg-slate-50 transition-all opacity-50 cursor-not-allowed">
                <Download className="w-5 h-5 text-slate-400" /> PDF Report (Soon)
             </button>
          </div>
        </div>

        <div className="glass p-10 rounded-[3rem] border-emerald-100 relative overflow-hidden group">
          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-credex-green text-white flex items-center justify-center">
                {result.totalPotentialMonthlySavings > 500 ? <PhoneCall className="w-6 h-6" /> : <Mail className="w-6 h-6" />}
              </div>
              <div>
                <h4 className="font-bold text-xl">{result.totalPotentialMonthlySavings > 500 ? 'Book Consultation' : 'Capture Report'}</h4>
                <p className="text-sm text-slate-500 font-medium">{result.totalPotentialMonthlySavings > 500 ? 'Speak to a Credex credit specialist' : 'Get your defensible audit via email'}</p>
              </div>
            </div>

            {leadCaptured ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 rounded-3xl bg-emerald-50 border border-emerald-100 text-center space-y-4"
              >
                <CheckCircle2 className="w-10 h-10 text-credex-green mx-auto" />
                <p className="font-display font-bold text-xl">Request Received.</p>
                <p className="text-sm text-slate-600">A specialist will reach out to [your-email] within 24 hours.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleLeadCapture} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                  <input 
                    type="email" 
                    required
                    placeholder="Work Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 pl-12 text-sm font-bold focus:ring-2 focus:ring-credex-green transition-all"
                  />
                </div>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                  <input 
                    type="text" 
                    placeholder="Company Name (Optional)"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 pl-12 text-sm font-bold focus:ring-2 focus:ring-credex-green transition-all"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-credex-green text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-credex-green-light transition-all shadow-xl shadow-credex-green/20"
                >
                  {result.totalPotentialMonthlySavings > 500 ? 'Book My Call' : 'Send My Audit'}
                  <ChevronRight className="w-5 h-5" />
                </button>
                <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center gap-1.5">
                  <Lock className="w-3 h-3" /> Your privacy is priority. No spam.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
      
      {/* Disclaimer */}
      <div className="bg-slate-100 p-6 rounded-2xl flex gap-3">
        <AlertCircle className="w-5 h-5 text-slate-400 flex-shrink-0" />
        <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
          The audit results provided are estimates based on standard retail pricing and Credex discount benchmarks as of May 11, 2026. Actual savings may vary based on specific contract terms, usage volume, and eligibility for credit programs. This audit constitutes entrepreneurial advice and does not guarantee financial outcomes.
        </p>
      </div>
    </div>
  );
}
