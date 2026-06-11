export type Persona = 'product' | 'designer' | 'developer';

export interface ComponentRecommendation {
  name: string;
  rationale: string;
  relevantVariants?: string[];
  docUrl: string;
}

export interface LayoutRegion {
  label: string;
  note?: string;
  direction?: 'row' | 'column';
  children?: LayoutRegion[];
}

export interface Guidance {
  component: string;
  do: string;
  avoid?: string;
}

export interface ReworkWarning {
  trigger: string;
  warning: string;
  suggestion: string;
}

export interface Recommendation {
  summary: string;
  components: ComponentRecommendation[];
  layout: {
    description: string;
    regions: LayoutRegion;
  };
  guidance: Guidance[];
  warnings: ReworkWarning[];
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}
