
import React from 'react';
import { EDAStep, AUTHOR } from '../types';

interface WorkflowSidebarProps {
  currentStep: EDAStep;
  onStepClick: (step: EDAStep) => void;
}

const steps = Object.values(EDAStep);

const WorkflowSidebar: React.FC<WorkflowSidebarProps> = ({ currentStep, onStepClick }) => {
  const currentIdx = steps.indexOf(currentStep);

  return (
    <nav className="bg-card h-full border-r border-slate-800/50 p-8 flex flex-col w-80 shrink-0 z-30" role="navigation" aria-label="Learning Workflow">
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(0,242,255,0.3)] rotate-6">
            <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-slate-100 serif-font">Data Proctor</h1>
        </div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Curated by {AUTHOR}</p>
      </div>

      <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar pr-3">
        <h2 className="text-[9px] font-black text-primary uppercase tracking-[0.4em] mb-6 px-1">Progression Matrix</h2>
        {steps.map((step, index) => {
          const isActive = currentStep === step;
          const isPast = index < currentIdx;
          const isLocked = index > currentIdx + 1 && currentStep === EDAStep.Clarification;
          
          return (
            <button 
              key={step}
              onClick={() => !isLocked && onStepClick(step)}
              disabled={isLocked}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 group text-left border ${
                isActive 
                  ? 'bg-primary text-black border-primary shadow-[0_0_25px_rgba(0,242,255,0.15)] translate-x-2' 
                  : isLocked
                    ? 'opacity-20 grayscale cursor-not-allowed border-transparent'
                    : 'hover:bg-slate-800/50 border-transparent hover:border-slate-700/50'
              }`}
              aria-current={isActive ? 'step' : undefined}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black border-2 transition-all ${
                isActive 
                  ? 'border-black bg-white/20 text-black' 
                  : isPast 
                    ? 'border-primary/50 bg-primary/5 text-primary'
                    : 'border-slate-800 bg-slate-900 text-slate-600'
              }`}>
                {isPast ? '✓' : index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <span className={`text-xs font-black block truncate ${
                  isActive ? 'text-black' : isPast ? 'text-slate-300' : 'text-slate-500 group-hover:text-slate-300'
                }`}>
                  {step}
                </span>
                {isActive && (
                  <span className="text-[8px] font-black text-black/60 uppercase tracking-widest block mt-0.5">Active Sequence</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="pt-8 border-t border-slate-800/50 mt-8">
        <div className="bg-slate-900 rounded-[2rem] p-6 border border-slate-800 group relative overflow-hidden">
          <div className="absolute inset-0 art-pattern opacity-10"></div>
          <h3 className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Resource Node</h3>
          <p className="text-[11px] text-slate-400 mb-6 font-medium leading-relaxed">External repositories for deeper data extraction.</p>
          <a 
            href="https://www.kaggle.com/datasets" 
            target="_blank" 
            className="w-full text-center text-[10px] font-black bg-slate-800 border border-slate-700 text-primary px-4 py-3 rounded-xl block hover:bg-primary hover:text-black hover:border-primary transition-all shadow-xl"
            rel="noopener noreferrer"
          >
            EXTRACT DATA SOURCES
          </a>
        </div>
      </div>
    </nav>
  );
};

export default WorkflowSidebar;
