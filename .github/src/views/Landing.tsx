import { motion } from 'motion/react';
import { ShieldCheck, BarChart3, ArrowRight, Zap, Target, TrendingDown, Users, Search } from 'lucide-react';

interface LandingProps {
  onStart: () => void;
}

export default function Landing({ onStart }: LandingProps) {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-12 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-emerald-50 text-credex-green px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-8 border border-emerald-100"
        >
          <Zap className="w-3 h-3 fill-current" />
          New: Updated for May 2026 Pricing
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-display font-bold text-slate-900 mb-8 leading-[1.1]"
        >
          Stop Overpaying <br /> For Your <span className="text-credex-green">AI Stack.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Startups waste 25% of their AI budget on redundant seats and overpriced plans. 
          Get a defensible, numbers-backed audit in 90 seconds.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button 
            onClick={onStart}
            className="group bg-credex-green text-white px-8 py-5 rounded-2xl text-lg font-bold flex items-center gap-2 hover:bg-credex-green-light transition-all shadow-xl shadow-credex-green/30"
          >
            Run Free Audit
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-sm text-slate-500 font-medium italic">
            No login required. <br className="sm:hidden" /> Results in seconds.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 text-left">
          {[
            {
              icon: Search,
              title: "Redundancy Detection",
              desc: "Identify seat overlap between tools like Cursor and Copilot."
            },
            {
              icon: TrendingDown,
              title: "Plan Optimization",
              desc: "Surface cheaper plans from same-vendor that fit your actual team size."
            },
            {
              icon: ShieldCheck,
              title: "Defensible Logic",
              desc: "Finance-literate reasoning that traces back to official vendor URLs."
            }
          ].map((f, i) => (
            <motion.div 
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-credex-green mb-6 group-hover:bg-credex-green group-hover:text-white transition-colors">
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl mb-3">{f.title}</h3>
              <p className="text-slate-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="w-full bg-slate-50 py-24 border-y border-slate-200/60">
        <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-12">Trusted by founders at</p>
          <div className="flex flex-wrap justify-center gap-12 grayscale opacity-50 contrast-125">
             <span className="text-2xl font-display font-black tracking-tighter">FLOWSTATE</span>
             <span className="text-2xl font-display font-black tracking-tighter">LINEAR</span>
             <span className="text-2xl font-display font-black tracking-tighter">RAILWAY</span>
             <span className="text-2xl font-display font-black tracking-tighter">REPLICATE</span>
          </div>
          
          <div className="mt-20 max-w-3xl glass p-10 rounded-[2.5rem] border-emerald-100/50 shadow-inner">
            <p className="text-xl text-slate-700 italic text-center leading-relaxed">
              "SpendWise saved us $1,200/mo on GitHub Copilot overnight. The audit was defensible enough for our Finance lead to approve the switch immediately."
            </p>
            <div className="mt-8 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-slate-200 mb-3" />
              <p className="font-bold text-slate-900">Jason C.</p>
              <p className="text-sm text-slate-500">CTO at FlowState</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Blocks */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-24 w-full">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 space-y-6">
            <h2 className="text-4xl font-bold leading-tight">Built for Finance, <br /> Loved by Engineers.</h2>
            <p className="text-lg text-slate-600">
              Most audit tools give vague advice like "Cursor is better." <br /><br />
              We provide **actual usage-fit reasoning with numbers**. We analyze seat caps, redundant features, and credit arbitrage opportunities to give you a report that your CFO will actually sign off on.
            </p>
            <ul className="space-y-4">
              {[
                "Seat-based optimization for Cursor/Copilot",
                "API usage benchmarks for Anthropic/OpenAI",
                "Credex credit inventory pool access",
                "Anonymous benchmark comparisons"
              ].map(item => (
                <li key={item} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-credex-green flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-100 transition-colors" />
            <div className="space-y-6 relative">
              <div className="flex items-center justify-between border-b pb-6">
                <span className="font-display font-bold">Audit Preview</span>
                <span className="text-xs bg-slate-100 px-2 py-1 rounded">Draft</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                  <Users className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-bold">Team Size: 12</p>
                  <p className="text-xs text-slate-500">Coding Case</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-credex-green uppercase tracking-wider">
                  <span>Recommendation</span>
                  <span>Save $240/mo</span>
                </div>
                <p className="text-sm text-slate-700 font-medium">Consolidate Copilot to Cursor Business for 12 seats.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function CheckCircle2({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
