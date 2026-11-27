export type WorkspaceTab = 'variance' | 'ledger' | 'notes' | 'preview';

export type CloakPresetId = 'sheets' | 'docs' | 'canvas' | 'notion' | 'custom';

export type PlayLayoutMode = 'embedded' | 'split' | 'full';

export type BossKeyOption = '`' | '\\' | 'F9' | 'Alt+H';

export interface StealthSettings {
  cloakPreset: CloakPresetId;
  customTitle: string;
  bossKey: BossKeyOption;
  layoutMode: PlayLayoutMode;
  opacityPercent: number;
  desaturateCamo: boolean;
  unloadOnHide: boolean;
  autoHideOnTabLeave: boolean;
  showQuickTip: boolean;
}

export interface VarianceRow {
  id: string;
  code: string;
  department: string;
  category: string;
  q1Forecast: number;
  q2Forecast: number;
  q3Forecast: number;
  q4Forecast: number;
  q4Actual: number;
  owner: string;
}

export interface LedgerEntry {
  id: string;
  date: string;
  vendor: string;
  costCenter: string;
  memo: string;
  amount: number;
  status: 'Posted' | 'Pending' | 'Reviewed';
}
