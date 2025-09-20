export type Theme = 'light' | 'dark';

export interface Component {
  type: 'CPU' | 'GPU' | 'Motherboard' | 'RAM' | 'Storage' | 'PSU' | 'Case';
  name: string;
  price?: number;
  priceLink?: string;
  specs?: string;
  powerDraw?: number;
}

export interface GamePerformance {
    gameName: string;
    fps: string;
    settings: string;
}

export interface PCBuild {
  id?: string;
  buildName: string;
  totalPrice: number;
  currency: string;
  components: Component[];
  performance: string;
  estimatedWattage?: number;
  gamePerformance: GamePerformance[];
  averageFps: number;
  targetResolution: string;
}

export interface BuildRequest {
    budget: number;
    currency: string;
    count: number;
    purpose: string;
    performanceTier: string;
    notes: string;
}