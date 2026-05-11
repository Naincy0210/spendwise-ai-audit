import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Calculator, ArrowRight, ArrowLeft, Info, HelpCircle } from 'lucide-react';
import { AuditInput, UserToolInput, AuditResult, PlanType } from '../types';
import { PRICING_DATA } from '../lib/pricing-data';
import { runAudit } from '../lib/audit-engine';

interface AuditFormProps {
  onComplete: (result: AuditResult) => void;
}

export default function AuditForm({ onComplete }: AuditFormProps) {
  const [step, setStep] = useState(1);
  const [teamSize, setTeamSize] = useState(5);
  const [useCase, setUseCase] = useState<AuditInput['useCase']>('coding');
  const [tools, setTools] = useState<UserToolInput[]>([
    { toolId: 'cursor', plan: 'pro', monthlySpend: 20, seats: 1 }
  ]);
  const [isCalculating, setIsCalculating] = useState(false);

  // Persistence logic
  useEffect(() => {
    const saved = localStorage.getItem('spendwise_form_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTeamSize(parsed.teamSize);
        setUseCase(parsed.useCase);
        setTools(parsed.tools);
      } catch (e) {
        console.warn("Failed to restore form state");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('spendwise_form_state', JSON.stringify({ teamSize, useCase, tools }));
  }, [teamSize, useCase, tools]);

  const addTool = () => {
    setTools([...tools, { toolId: 'copilot', plan: 'individual', monthlySpend: 10, seats: 1 }]);
  };

  const removeTool = (index: number) => {
    setTools(tools.filter((_, i) => i !== index));
  };

  const updateTool = (index: number, updates: Partial<UserToolInput>) => {
    const newTools = [...tools];
    newTools[index] = { ...newTools[index], ...updates };
    
    // Auto-calculate spend if price/seats change
    if (updates.plan || updates.seats) {
      const toolData = PRICING_DATA[newTools[index].toolId];
      if (toolData) {
        const planData = toolData.plans[newTools[index].plan];
        if (planData) {
          newTools[index].monthlySpend = planData.pricePerUser * newTools[index].seats;
        }
      }
    }
    
    setTools(newTools);
  };

  const handleSubmit = async () => {
    setIsCalculating(true);
    const result = runAudit({ teamSize, useCase, tools });
    
    // Simulate thinking time
    setTimeout(() => {
      onComplete(result);
      setIsCalculating(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Progress Header */}
      <div className="flex items-center justify-between mb-12">
        <div className="flex gap-2">
          {[1, 2].map((s) => (
            <div 
              key={s} 
              className={`h-1.5 w-16 rounded-full transition-colors ${step >= s ? 'bg-credex-green' : 'bg-slate-200'}`} 
            />
          ))}
        </div>
        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Step {step} of 2</span>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-12"
          >
            <div className="space-y-4">
              <h2 className="text-3xl font-bold font-display">Let's baseline your team.</h2>
              <p className="text-slate-500">We use these inputs to benchmark your density vs. peers.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider block">Team Size</label>
                <div className="flex items-center gap-6">
                   <input 
                    type="range" 
                    min="1" 
                    max="100" 
                    value={teamSize} 
                    onChange={(e) => setTeamSize(parseInt(e.target.value))}
                    className="flex-grow accent-credex-green"
                   />
                   <div className="w-16 h-16 rounded-2xl bg-white border-2 border-credex-green flex items-center justify-center font-display font-bold text-2xl text-credex-green shadow-lg shadow-credex-green/10">
                    {teamSize}
                   </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider block">Primary Use Case</label>
                <div className="grid grid-cols-2 gap-3">
                  {['coding', 'writing', 'data', 'research', 'mixed'].map((u) => (
                    <button
                      key={u}
                      onClick={() => setUseCase(u as any)}
                      className={`px-4 py-3 rounded-xl text-sm font-bold border-2 capitalize transition-all ${
                        useCase === u 
                          ? 'border-credex-green bg-emerald-50 text-credex-green' 
                          : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={() => setStep(2)}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-xl"
            >
              Continue to Audit Stack
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-12"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold font-display">Configure your stack.</h2>
                <p className="text-slate-500">Add every tool you currently pay for.</p>
              </div>
              <button 
                onClick={addTool}
                className="flex items-center gap-2 text-credex-green font-bold text-sm bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100"
              >
                <Plus className="w-4 h-4" /> Add Tool
              </button>
            </div>

            <div className="space-y-4">
              {tools.map((tool, index) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={index} 
                  className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm relative group"
                >
                  <button 
                    onClick={() => removeTool(index)}
                    className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tool</label>
                      <select 
                        value={tool.toolId}
                        onChange={(e) => updateTool(index, { toolId: e.target.value })}
                        className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold"
                      >
                        {Object.values(PRICING_DATA).map(t => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Plan</label>
                      <select 
                        value={tool.plan}
                        onChange={(e) => updateTool(index, { plan: e.target.value as PlanType })}
                        className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold"
                      >
                        {Object.entries(PRICING_DATA[tool.toolId].plans)
                          .filter(([_, data]) => data !== null)
                          .map(([key, data]) => (
                            <option key={key} value={key}>{data?.name}</option>
                          ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Seats</label>
                      <input 
                        type="number"
                        min="1"
                        value={tool.seats}
                        onChange={(e) => updateTool(index, { seats: parseInt(e.target.value) || 0 })}
                        className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Monthly Spend</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                        <input 
                          type="number"
                          value={tool.monthlySpend}
                          onChange={(e) => updateTool(index, { monthlySpend: parseInt(e.target.value) || 0 })}
                          className="w-full bg-slate-50 border-none rounded-xl p-3 pl-6 text-sm font-bold"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button 
                onClick={() => setStep(1)}
                className="flex-1 bg-white border border-slate-200 text-slate-600 py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
                disabled={isCalculating}
              >
                <ArrowLeft className="w-5 h-5" /> Back
              </button>
              <button 
                onClick={handleSubmit}
                disabled={isCalculating || tools.length === 0}
                className={`flex-[2] bg-credex-green text-white py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 shadow-xl shadow-credex-green/30 transition-all ${isCalculating ? 'opacity-70 cursor-wait' : 'hover:bg-credex-green-light'}`}
              >
                {isCalculating ? (
                  <>
                    <motion.div 
                      animate={{ rotate: 360 }} 
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Calculator className="w-6 h-6 text-emerald-300" />
                    </motion.div>
                    Calculating Savings...
                  </>
                ) : (
                  <>
                    Run Defensible Audit
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
            
            <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-1.5 font-medium">
              <Info className="w-3 h-3" />
              Logic benchmarked against PRICING_DATA.md sourced URLs.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
