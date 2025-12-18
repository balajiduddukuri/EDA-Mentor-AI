
import React, { useState } from 'react';
import { DatasetId, DatasetInfo } from '../types';

const DATASETS: DatasetInfo[] = [
  { id: 'house_prices', name: 'Mansion Economics', description: 'Deep feature engineering module with 79 variables for regression mastery.', type: 'Regression', complexity: 'Intermediate', icon: '🏠', source: 'Kaggle: House Prices - Advanced Regression' },
  { id: 'titanic', name: 'The Atlantic Tragedy', description: 'Survival classification on historical ship data. Excellent for beginners.', type: 'Classification', complexity: 'Beginner', icon: '🚢', source: 'Kaggle: Titanic' },
  { id: 'credit_fraud', name: 'Secure Ledger', description: 'Detecting anomalies in extreme class imbalances using PCA-transformed data.', type: 'Classification', complexity: 'Advanced', icon: '🛡️', source: 'Kaggle: Credit Card Fraud' },
  { id: 'rossmann_sales', name: 'Commerce Temporal', description: 'Time-series module dealing with seasonality, holidays, and trends.', type: 'Time-Series', complexity: 'Advanced', icon: '📊', source: 'Kaggle: Rossmann Store Sales' },
  { id: 'customer_segmentation', name: 'Persona Architect', description: 'Identify hidden groups using high-dimensional clustering and RFM analysis.', type: 'Clustering', complexity: 'Advanced', icon: '👥', source: 'Kaggle: E-commerce Segmentation' },
  { id: 'penguins', name: 'Palmer Archive', description: 'Species classification based on morphological measurements.', type: 'Classification', complexity: 'Beginner', icon: '🐧', source: 'Allison Horst: Palmer Penguins' },
  { id: 'diamonds', name: 'Crystalline Pricing', description: 'Analyzing the 4Cs of diamond value through multi-variate regression.', type: 'Regression', complexity: 'Intermediate', icon: '💎', source: 'ggplot2 Diamonds dataset' },
  { id: 'wine_quality', name: 'Vintage Analytics', description: 'Chemical profiling of vintage wines and their subjective quality scores.', type: 'Regression', complexity: 'Beginner', icon: '🍷', source: 'UCI: Wine Quality' }
];

interface DatasetSelectorProps {
  onSelect: (dataset: DatasetInfo) => void;
}

const DatasetSelector: React.FC<DatasetSelectorProps> = ({ onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('All');

  const filtered = DATASETS.filter(ds => {
    const matchesSearch = ds.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         ds.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'All' || ds.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const types = ['All', 'Regression', 'Classification', 'Time-Series', 'Clustering'];

  return (
    <div className="space-y-8 mt-12 mb-24">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <input 
            type="text"
            placeholder="Search Modules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all"
            aria-label="Search dataset modules"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2" role="tablist">
          {types.map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                filterType === type ? 'bg-primary text-black border-primary' : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-600'
              }`}
              role="tab"
              aria-selected={filterType === type}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" role="list">
        {filtered.map((ds) => (
          <button
            key={ds.id}
            onClick={() => onSelect(ds)}
            className="group relative bg-card rounded-[2rem] p-6 text-left border border-slate-800/50 hover:border-primary transition-all duration-500 overflow-hidden shadow-2xl hover:shadow-primary/5 active:scale-95"
            aria-label={`Select ${ds.name} module, Type: ${ds.type}, Complexity: ${ds.complexity}`}
          >
            {/* Vibe Pattern overlay */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/20 transition-all"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-inner">
                  {ds.icon}
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-primary tracking-widest uppercase mb-1">{ds.type}</span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${
                    ds.complexity === 'Advanced' ? 'border-red-500/30 text-red-400' : 'border-slate-700 text-slate-400'
                  }`}>
                    {ds.complexity}
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-black text-slate-100 mb-2 accessible-link">{ds.name}</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-2">{ds.description}</p>
              
              <div className="flex items-center gap-2 pt-4 border-t border-slate-800/50">
                <svg className="w-3 h-3 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span className="text-[9px] font-bold text-slate-600 truncate">{ds.source}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
      
      {filtered.length === 0 && (
        <div className="text-center py-20 bg-slate-900/50 rounded-[3rem] border border-dashed border-slate-800">
          <p className="text-slate-500 font-bold uppercase tracking-widest">No modules found matching your query.</p>
        </div>
      )}
    </div>
  );
};

export default DatasetSelector;
