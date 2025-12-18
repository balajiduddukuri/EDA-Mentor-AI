
import React from 'react';
import { EDAStep } from '../types';

interface WorkflowSidebarProps {
  currentStep: EDAStep;
  onStepClick: (step: EDAStep) => void;
}

const steps = Object.values(EDAStep);

const WorkflowSidebar: React.FC<WorkflowSidebarProps> = ({ currentStep, onStepClick }) => {
  const currentIdx = steps.indexOf(currentStep);

  return (
    <div className="bg-white h-full border-r border-slate-200 p-6 flex flex-col w-72 shrink-0">
      <div className="mb-10">
        <h1 className="text-xl font-black text-slate-900 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-indigo-100 shadow-2xl rotate-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          EDA Mentor
        </h1>
        <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest px-1">Concept to Insight</p>
      </div>

      <div className="space-y-1.5 flex-1 overflow-y-auto custom-scrollbar pr-2">
        <h2 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">Analysis Pipeline</h2>
        {steps.map((step, index) => {
          const isActive = currentStep === step;
          const isPast = index < currentIdx;
          const isLocked = index > currentIdx + 1 && currentStep === EDAStep.Clarification;
          
          return (
            <button 
              key={step}
              onClick={() => !isLocked && onStepClick(step)}
              disabled={isLocked}
              className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 group text-left ${
                isActive 
                  ? 'bg-indigo-600 shadow-xl shadow-indigo-100 translate-x-1' 
                  : isLocked
                    ? 'opacity-30 grayscale cursor-not-allowed'
                    : 'hover:bg-slate-50 active:scale-95'
              }`}
            >
              <div className={`w-6 h-6 rounded-xl flex items-center justify-center text-[10px] font-black border-2 transition-all ${
                isActive 
                  ? 'border-indigo-400 bg-white text-indigo-600 rotate-12' 
                  : isPast 
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                    : 'border-slate-100 bg-slate-50 text-slate-400 group-hover:border-slate-200'
              }`}>
                {isPast ? (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                ) : index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <span className={`text-xs font-bold block truncate ${
                  isActive ? 'text-white' : isPast ? 'text-slate-600' : 'text-slate-400 group-hover:text-slate-600'
                }`}>
                  {step}
                </span>
                {isActive && (
                  <span className="text-[8px] font-black text-indigo-200 uppercase tracking-widest block mt-0.5">In Progress</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="pt-6 border-t border-slate-100 mt-6">
        <div className="bg-slate-900 rounded-3xl p-5 shadow-2xl shadow-indigo-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/20 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Knowledge Base</p>
          <p className="text-[11px] text-slate-300 mb-4 font-medium leading-relaxed">Expand your toolkit with standard datasets.</p>
          <a 
            href="https://www.kaggle.com/datasets" 
            target="_blank" 
            className="w-full text-center text-[10px] font-black bg-indigo-600 text-white px-4 py-2.5 rounded-xl block hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-900/20"
          >
            Browse Kaggle
          </a>
        </div>
      </div>
    </div>
  );
};

export default WorkflowSidebar;
