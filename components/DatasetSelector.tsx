
import React from 'react';
import { DatasetId, DatasetInfo } from '../types';

const DATASETS: DatasetInfo[] = [
  {
    id: 'house_prices',
    name: 'House Prices',
    description: 'Predict sales prices and practice feature engineering with 79 explanatory variables.',
    type: 'Regression',
    complexity: 'Intermediate',
    icon: '🏠'
  },
  {
    id: 'titanic',
    name: 'Titanic Survival',
    description: 'The classic ML dataset. Predict survival based on age, gender, and class.',
    type: 'Classification',
    complexity: 'Beginner',
    icon: '🚢'
  },
  {
    id: 'credit_fraud',
    name: 'Credit Card Fraud',
    description: 'Handle extreme class imbalance. EDA focused on anomaly detection and PCA-transformed features.',
    type: 'Classification',
    complexity: 'Advanced',
    icon: '🛡️'
  },
  {
    id: 'rossmann_sales',
    name: 'Rossmann Store Sales',
    description: 'Complex time-series data with seasonal trends, promotions, and school holidays.',
    type: 'Time-Series',
    complexity: 'Advanced',
    icon: '📊'
  },
  {
    id: 'customer_segmentation',
    name: 'E-commerce Segment',
    description: 'Unsupervised learning EDA. Identify customer groups using RFM analysis and high-dimensional clustering.',
    type: 'Clustering',
    complexity: 'Advanced',
    icon: '👥'
  },
  {
    id: 'penguins',
    name: 'Palmer Penguins',
    description: 'A great alternative to Iris. Predict penguin species based on physical traits.',
    type: 'Classification',
    complexity: 'Beginner',
    icon: '🐧'
  },
  {
    id: 'diamonds',
    name: 'Diamond Prices',
    description: 'Predict the price of diamonds based on cut, color, clarity, and carats.',
    type: 'Regression',
    complexity: 'Intermediate',
    icon: '💎'
  },
  {
    id: 'wine_quality',
    name: 'Wine Quality',
    description: 'Explore the chemical properties of wine and how they impact quality scores.',
    type: 'Regression',
    complexity: 'Beginner',
    icon: '🍷'
  }
];

interface DatasetSelectorProps {
  onSelect: (dataset: DatasetInfo) => void;
}

const DatasetSelector: React.FC<DatasetSelectorProps> = ({ onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {DATASETS.map((ds) => (
        <button
          key={ds.id}
          onClick={() => onSelect(ds)}
          className="group text-left bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/5 transition-all active:scale-[0.98]"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-2xl group-hover:bg-indigo-50 transition-colors">
              {ds.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-bold text-slate-900">{ds.name}</h4>
                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                  ds.type === 'Regression' ? 'bg-blue-50 text-blue-600' : 
                  ds.type === 'Classification' ? 'bg-purple-50 text-purple-600' :
                  ds.type === 'Time-Series' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                }`}>
                  {ds.type}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                {ds.description}
              </p>
              <div className="flex gap-2 mt-3">
                <span className={`text-[9px] font-bold border px-2 py-0.5 rounded ${
                  ds.complexity === 'Advanced' ? 'text-red-600 border-red-100 bg-red-50' : 
                  ds.complexity === 'Intermediate' ? 'text-indigo-600 border-indigo-100 bg-indigo-50' : 
                  'text-slate-400 border-slate-100 bg-slate-50'
                }`}>
                  {ds.complexity}
                </span>
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default DatasetSelector;
