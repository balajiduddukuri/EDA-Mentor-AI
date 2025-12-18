
export enum Sender {
  User = 'user',
  AI = 'ai'
}

export type Theme = 'neon' | 'art' | 'classic';

export interface Message {
  id: string;
  sender: Sender;
  text: string;
  timestamp: number;
}

export enum EDAStep {
  Clarification = 'Clarification',
  Overview = 'Dataset Overview',
  Quality = 'Data Quality',
  Univariate = 'Univariate Analysis',
  Bivariate = 'Bivariate Analysis',
  Outliers = 'Outliers & Distributions',
  FeatureEng = 'Feature Engineering',
  Summary = 'Summary & Recap'
}

export type DatasetId = 
  | 'house_prices' 
  | 'titanic' 
  | 'iris' 
  | 'penguins' 
  | 'diamonds' 
  | 'wine_quality' 
  | 'credit_fraud'
  | 'rossmann_sales'
  | 'customer_segmentation'
  | 'unknown';

export interface DatasetInfo {
  id: DatasetId;
  name: string;
  description: string;
  type: 'Regression' | 'Classification' | 'Clustering' | 'Time-Series';
  complexity: 'Beginner' | 'Intermediate' | 'Advanced';
  icon: string;
  source: string;
}

export interface UserContext {
  datasetId: DatasetId;
  datasetName?: string;
  learningGoal?: string;
  targetVariable?: string;
  skillLevel?: 'beginner' | 'intermediate' | 'advanced';
  currentStep: EDAStep;
  theme: Theme;
}

export const AUTHOR = "BalajiDuddukuri";
