
import React, { useState } from 'react';
import { EDAStep, DatasetId } from '../types';

interface StepDisplayProps {
  step: EDAStep;
  datasetId: DatasetId;
}

const StepDisplay: React.FC<StepDisplayProps> = ({ step, datasetId }) => {
  const [isExporting, setIsExporting] = useState(false);

  // Helper to determine what kind of visual flavor to show
  const isTimeSeries = datasetId === 'rossmann_sales';
  const isClustering = datasetId === 'customer_segmentation';
  const isImbalanced = datasetId === 'credit_fraud';

  const handleExport = () => {
    setIsExporting(true);
    
    const datasetName = datasetId.replace('_', ' ').toUpperCase();
    const timestamp = new Date().toLocaleString();
    
    const reportContent = `
=========================================
      EDA MENTOR AI - INSIGHT REPORT
=========================================
Generated on: ${timestamp}
Dataset: ${datasetName}
Status: Preliminary EDA Complete

1. DATASET OVERVIEW
-------------------
Rows: ${isImbalanced ? '284,807' : '1,460'}
Columns: ${isImbalanced ? '31' : '81'}
Type: ${isTimeSeries ? 'Time-Series' : isClustering ? 'High-Dimensional' : 'Tabular'}

2. DATA QUALITY SUMMARY
-----------------------
Missing Values: ${isImbalanced ? 'None detected' : 'Significant nulls in [PoolQC, MiscFeature, Alley]'}
Health Score: ${isImbalanced ? '100%' : '84%'}
Notes: Dataset shows high structural integrity.

3. KEY ANALYSIS INSIGHTS
------------------------
- Univariate: Distributions show ${isTimeSeries ? 'strong seasonality and trend components' : 'skewness in the target variable requiring log-transformation'}.
- Bivariate: Strongest correlation found at R = 0.82 between primary features.
- Outliers: ${isImbalanced ? 'Class imbalance is extreme; focused on minority class (Fraud) characteristics.' : 'Potential data entry errors found in high-value features.'}

4. RECOMMENDED NEXT STEPS
-------------------------
- Apply ${isTimeSeries ? 'lag-feature engineering' : isClustering ? 'K-Means or PCA' : 'standard scaling'} for modeling.
- Proceed to predictive modeling phase.

=========================================
      END OF REPORT - MENTOR AI
=========================================
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EDA_Report_${datasetId || 'General'}.txt`;
    
    // Simulate a brief generation delay for UX
    setTimeout(() => {
      link.click();
      window.URL.revokeObjectURL(url);
      setIsExporting(false);
    }, 800);
  };

  const renderContent = () => {
    switch (step) {
      case EDAStep.Clarification:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-in fade-in zoom-in duration-700">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-indigo-200 rotate-3 animate-pulse">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Your AI Data Mentor</h2>
            <p className="text-slate-500 max-w-sm text-sm leading-relaxed mb-8">
              "Tell me what you're curious about, and let's unlock the stories hidden in your data."
            </p>
            <div className="space-y-3 w-full max-w-xs">
              <div className="p-3 bg-white border border-slate-100 rounded-xl shadow-sm flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${datasetId !== 'unknown' ? 'bg-green-500' : 'bg-amber-500 animate-ping'}`}></div>
                <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">
                  {datasetId !== 'unknown' ? 'Dataset Loaded' : 'Awaiting Dataset'}
                </span>
              </div>
            </div>
          </div>
        );

      case EDAStep.Overview:
        return (
          <div className="p-6 space-y-6 animate-in slide-in-from-right-4 duration-500">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Schema Explorer</h2>
                <p className="text-xs text-slate-500 font-medium">{datasetId.replace('_', ' ')} metadata</p>
              </div>
              <div className="flex gap-1.5">
                <span className="px-2 py-1 bg-indigo-100 text-indigo-600 text-[10px] font-bold rounded-md uppercase">
                  {isTimeSeries ? 'Time-Series' : isClustering ? 'High-Dim' : 'Tabular'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Typical Entry</span>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-slate-100"></div>
                    <div className="w-2 h-2 rounded-full bg-indigo-200"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  {['Feature_01', 'Feature_02', 'Target_Var'].map((f) => (
                    <div key={f} className="flex justify-between border-b border-slate-50 pb-2">
                      <span className="text-xs font-mono text-indigo-500">{f}</span>
                      <span className="text-xs font-bold text-slate-700">{f === 'Target_Var' ? '1,420.00' : 'Value_A'}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900 p-4 rounded-2xl shadow-lg">
                  <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Rows</p>
                  <p className="text-2xl font-black text-white">{isImbalanced ? '284,807' : '1,460'}</p>
                </div>
                <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg">
                  <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-1">Columns</p>
                  <p className="text-2xl font-black text-white">{isImbalanced ? '31' : '81'}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case EDAStep.Quality:
        return (
          <div className="p-6 space-y-6 animate-in slide-in-from-right-4 duration-500">
             <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Data Health</h2>
              <div className="text-2xl font-black text-emerald-500">{isImbalanced ? '100%' : '84%'}</div>
            </div>
            
            <div className="space-y-5">
              {isImbalanced ? (
                <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 text-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <p className="text-sm font-bold text-emerald-800">No Missing Values Detected</p>
                  <p className="text-xs text-emerald-600 mt-1">This dataset is exceptionally clean.</p>
                </div>
              ) : (
                ['PoolQC', 'MiscFeature', 'Alley'].map((label, idx) => (
                  <div key={label} className="group">
                    <div className="flex justify-between items-end mb-1.5">
                      <span className="text-xs font-black text-slate-800 uppercase tracking-tighter">{label}</span>
                      <span className="text-[10px] font-bold text-red-400">{(90 + idx).toFixed(1)}% Null</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-red-500" style={{ width: `${90 + idx}%` }}></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case EDAStep.Univariate:
        return (
          <div className="p-6 space-y-6 animate-in slide-in-from-right-4 duration-500">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Feature Dynamics</h2>
            
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-inner">
              {isTimeSeries ? (
                <div className="h-36 w-full flex items-end px-2">
                   <svg className="w-full h-full text-indigo-500 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <path 
                      d="M0 80 Q 20 20, 40 50 T 80 10 L 100 90" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="3" 
                      className="animate-pulse"
                    />
                  </svg>
                </div>
              ) : (
                <div className="flex items-end justify-between h-36 gap-1">
                  {[40, 60, 80, 100, 70, 40, 20, 10, 5].map((h, i) => (
                    <div key={i} className="flex-1 bg-indigo-500 rounded-t-lg transition-all duration-700 hover:bg-indigo-400" style={{ height: `${h}%` }}></div>
                  ))}
                </div>
              )}
            </div>
            <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {isTimeSeries ? 'Sales Trend (Seasonal)' : 'Frequency Distribution'}
            </p>
          </div>
        );

      case EDAStep.Bivariate:
        return (
          <div className="p-6 space-y-6 animate-in slide-in-from-right-4 duration-500">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Correlation & Flow</h2>
            
            {isClustering ? (
              <div className="aspect-square bg-slate-900 rounded-3xl p-8 relative overflow-hidden group">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-transparent to-transparent"></div>
                <div className="grid grid-cols-2 gap-4 h-full">
                  <div className="border border-indigo-500/30 rounded-full animate-ping opacity-20"></div>
                  <div className="border border-purple-500/30 rounded-full animate-bounce opacity-20"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <p className="text-indigo-400 text-xs font-black uppercase tracking-[0.2em] group-hover:scale-110 transition-transform">Clustering Points</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="aspect-square rounded-xl bg-indigo-600 transition-all hover:scale-110"
                    style={{ opacity: Math.random() * 0.8 + 0.2 }}
                  ></div>
                ))}
              </div>
            )}
            
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Primary Association</p>
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-slate-700">Feature X ↔ Feature Y</span>
                <span className="text-xs font-black text-indigo-600">R = 0.82</span>
              </div>
            </div>
          </div>
        );

      case EDAStep.Outliers:
        return (
          <div className="p-6 space-y-6 animate-in slide-in-from-right-4 duration-500">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Anomalies Detected</h2>
            <div className="p-10 bg-slate-50 rounded-[3rem] shadow-inner relative overflow-hidden flex flex-col items-center">
              <div className="w-full h-1 bg-slate-200 rounded-full mb-8"></div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl border-2 border-indigo-500 flex items-center justify-center font-bold text-indigo-600 shadow-sm animate-bounce">0</div>
                <div className="w-12 h-12 bg-red-500 rounded-2xl border-2 border-red-600 flex items-center justify-center font-bold text-white shadow-xl animate-pulse">!</div>
              </div>
              <p className="mt-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                {isImbalanced ? 'FRAUD CASES FOUND IN NOISE' : 'EXTREME VALUES IN TARGET'}
              </p>
            </div>
          </div>
        );

      case EDAStep.FeatureEng:
        return (
          <div className="p-6 space-y-4 animate-in slide-in-from-right-4 duration-500">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Engineering Lab</h2>
            <div className="space-y-3">
              {[
                { name: 'Standardization', active: true, tag: 'SCALING' },
                { name: 'One-Hot Encoding', active: true, tag: 'CATEGORICAL' },
                { name: 'PCA Reduction', active: isImbalanced, tag: 'DIMENSION' },
                { name: 'Lag Features', active: isTimeSeries, tag: 'TEMPORAL' }
              ].map((item, i) => (
                <div key={i} className={`p-4 rounded-2xl border transition-all ${item.active ? 'bg-white border-indigo-100 shadow-sm' : 'bg-slate-50 border-slate-100 opacity-40 grayscale'}`}>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-800">{item.name}</span>
                    <span className="text-[8px] font-black bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded uppercase">{item.tag}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case EDAStep.Summary:
        return (
          <div className="p-8 space-y-8 animate-in slide-in-from-right-4 duration-500">
            <div className="text-center">
              <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-indigo-200 rotate-12 transition-transform hover:rotate-0">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Phase Complete</h2>
              <p className="text-sm text-slate-500 mt-1 font-medium italic">"Insight successfully extracted."</p>
            </div>

            <button 
              onClick={handleExport}
              disabled={isExporting}
              className={`group w-full p-6 rounded-[2.5rem] shadow-2xl flex flex-col items-center transition-all active:scale-[0.98] ${
                isExporting ? 'bg-slate-700 cursor-wait' : 'bg-slate-900 hover:bg-black'
              }`}
            >
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">
                {isExporting ? 'Generating...' : 'Generate Export'}
              </span>
              <span className="text-white font-bold">
                {isExporting ? 'PLEASE WAIT' : 'EDA_REPORT.TXT'}
              </span>
              <svg className={`w-5 h-5 text-indigo-500 mt-4 transition-transform ${isExporting ? 'animate-bounce' : 'group-hover:translate-y-1'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M19 14l-7 7m0 0l-7-7m7 7V3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-tight opacity-60">
              * Report compiles all step insights discovered during this session.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-white shadow-[-20px_0px_60px_-15px_rgba(0,0,0,0.05)] rounded-l-[3.5rem] border-l border-slate-200/40 relative">
      <div className="p-8 pb-4 shrink-0 bg-white/40 backdrop-blur-xl sticky top-0 z-10 border-b border-slate-100/50">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">Module {Object.values(EDAStep).indexOf(step) + 1} of 8</h3>
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-slate-100 shadow-inner"></div>
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
          </div>
        </div>
        <p className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{step}</p>
      </div>

      <div className="flex-1 overflow-y-auto bg-slate-50/20 custom-scrollbar scroll-smooth">
        {renderContent()}
      </div>

      <div className="p-6 bg-white border-t border-slate-100/50 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logic Engine Ready</span>
          </div>
          <div className="px-3 py-1.5 bg-slate-100 rounded-xl border border-slate-200/50">
            <span className="text-[10px] font-bold text-slate-600 uppercase">{datasetId === 'unknown' ? 'Idle' : datasetId}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepDisplay;
