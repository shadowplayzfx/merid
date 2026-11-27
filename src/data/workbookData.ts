import { CloakPresetId, LedgerEntry, StealthSettings, VarianceRow } from '../types/workspace';

export interface CloakPreset {
  id: CloakPresetId;
  label: string;
  title: string;
  faviconSvg: string;
}

export const CLOAK_PRESETS: CloakPreset[] = [
  {
    id: 'sheets',
    label: 'Google Sheets',
    title: 'Q4 Operating Model - Google Sheets',
    faviconSvg:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="5" fill="#0F9D58"/><rect x="7" y="9" width="18" height="14" rx="1.5" fill="none" stroke="#fff" stroke-width="2"/><line x1="7" y1="14" x2="25" y2="14" stroke="#fff" stroke-width="1.8"/><line x1="15" y1="9" x2="15" y2="23" stroke="#fff" stroke-width="1.8"/></svg>',
  },
  {
    id: 'docs',
    label: 'Google Docs',
    title: 'Q4 Variance Memo - Google Docs',
    faviconSvg:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="5" fill="#4285F4"/><line x1="8" y1="11" x2="24" y2="11" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/><line x1="8" y1="16" x2="24" y2="16" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/><line x1="8" y1="21" x2="18" y2="21" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></svg>',
  },
  {
    id: 'canvas',
    label: 'Canvas LMS',
    title: 'Dashboard - Canvas',
    faviconSvg:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="5" fill="#E13F2B"/><circle cx="16" cy="16" r="7" fill="none" stroke="#fff" stroke-width="2.5" stroke-dasharray="3 2.5"/></svg>',
  },
  {
    id: 'notion',
    label: 'Notion Page',
    title: 'FY26 Planning & OKRs',
    faviconSvg:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="5" fill="#18181B"/><path d="M10 23V9h3.2l6.2 8.7V9H22v14h-3l-6.4-9v9H10z" fill="#fff"/></svg>',
  },
  {
    id: 'custom',
    label: 'Custom Title',
    title: 'Meridian Ledger — Q4 Operating Model',
    faviconSvg:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="5" fill="#0F172A"/><rect x="8" y="10" width="16" height="12" rx="1.5" fill="none" stroke="#fff" stroke-width="2"/></svg>',
  },
];

export const DEFAULT_STEALTH_SETTINGS: StealthSettings = {
  cloakPreset: 'sheets',
  customTitle: 'Q4 Operating Model - Google Sheets',
  bossKey: '`',
  layoutMode: 'embedded',
  opacityPercent: 100,
  desaturateCamo: false,
  unloadOnHide: true,
  autoHideOnTabLeave: true,
  showQuickTip: true,
};

export const INITIAL_VARIANCE_ROWS: VarianceRow[] = [
  {
    id: 'row-1',
    code: '5100',
    department: 'Cloud Infrastructure',
    category: 'Hosting & Compute',
    q1Forecast: 142000,
    q2Forecast: 148500,
    q3Forecast: 156000,
    q4Forecast: 164000,
    q4Actual: 159420,
    owner: 'R. Patel',
  },
  {
    id: 'row-2',
    code: '5240',
    department: 'Data Engineering',
    category: 'Warehouse & ETL',
    q1Forecast: 68000,
    q2Forecast: 71200,
    q3Forecast: 74500,
    q4Forecast: 79000,
    q4Actual: 82350,
    owner: 'M. Lin',
  },
  {
    id: 'row-3',
    code: '6110',
    department: 'Product & Design',
    category: 'Software Licenses',
    q1Forecast: 34500,
    q2Forecast: 35000,
    q3Forecast: 36800,
    q4Forecast: 38000,
    q4Actual: 36910,
    owner: 'K. Okafor',
  },
  {
    id: 'row-4',
    code: '6320',
    department: 'Enterprise Sales',
    category: 'Field & Enablement',
    q1Forecast: 92000,
    q2Forecast: 98000,
    q3Forecast: 104000,
    q4Forecast: 118000,
    q4Actual: 114800,
    owner: 'D. Alvarez',
  },
  {
    id: 'row-5',
    code: '6410',
    department: 'Security & Audit',
    category: 'SOC2 & Pen Testing',
    q1Forecast: 28000,
    q2Forecast: 28000,
    q3Forecast: 31500,
    q4Forecast: 42000,
    q4Actual: 41250,
    owner: 'S. Park',
  },
  {
    id: 'row-6',
    code: '7020',
    department: 'People Operations',
    category: 'Recruiting & Onboarding',
    q1Forecast: 54000,
    q2Forecast: 56500,
    q3Forecast: 52000,
    q4Forecast: 49500,
    q4Actual: 51680,
    owner: 'E. Novak',
  },
  {
    id: 'row-7',
    code: '7190',
    department: 'General & Admin',
    category: 'Facilities & Legal',
    q1Forecast: 41000,
    q2Forecast: 42200,
    q3Forecast: 43000,
    q4Forecast: 44500,
    q4Actual: 43120,
    owner: 'T. Brennan',
  },
  {
    id: 'row-8',
    code: '7400',
    department: 'Customer Success',
    category: 'Support Tooling',
    q1Forecast: 23500,
    q2Forecast: 24800,
    q3Forecast: 26200,
    q4Forecast: 28000,
    q4Actual: 27490,
    owner: 'L. Chen',
  },
];

export const INITIAL_LEDGER_ENTRIES: LedgerEntry[] = [
  {
    id: 'TX-9041',
    date: '2026-11-24',
    vendor: 'Amazon Web Services',
    costCenter: '5100 · Cloud Infra',
    memo: 'US-East & Tokyo cluster reserved instance renewal',
    amount: 54820,
    status: 'Posted',
  },
  {
    id: 'TX-9040',
    date: '2026-11-22',
    vendor: 'Snowflake Computing',
    costCenter: '5240 · Data Eng',
    memo: 'Q4 analytics warehouse compute credits',
    amount: 28450,
    status: 'Posted',
  },
  {
    id: 'TX-9039',
    date: '2026-11-20',
    vendor: 'Vanta Security Inc.',
    costCenter: '6410 · Security',
    memo: 'Annual continuous compliance monitoring & audit prep',
    amount: 18500,
    status: 'Reviewed',
  },
  {
    id: 'TX-9038',
    date: '2026-11-18',
    vendor: 'Figma Organization',
    costCenter: '6110 · Product',
    memo: 'Seat true-up for design systems team (24 seats)',
    amount: 11280,
    status: 'Posted',
  },
  {
    id: 'TX-9037',
    date: '2026-11-15',
    vendor: 'Deloitte Advisory LLP',
    costCenter: '7190 · G&A',
    memo: 'FY26 tax provision review & transfer pricing memo',
    amount: 14900,
    status: 'Pending',
  },
  {
    id: 'TX-9036',
    date: '2026-11-12',
    vendor: 'Datadog Inc.',
    costCenter: '5100 · Cloud Infra',
    memo: 'APM hosts and log ingestion overage reconciliation',
    amount: 16340,
    status: 'Posted',
  },
  {
    id: 'TX-9035',
    date: '2026-11-09',
    vendor: 'Greenhouse Software',
    costCenter: '7020 · People Ops',
    memo: 'Q4 enterprise recruiting pipeline subscription',
    amount: 12400,
    status: 'Reviewed',
  },
  {
    id: 'TX-9034',
    date: '2026-11-05',
    vendor: 'Zendesk Enterprise',
    costCenter: '7400 · Success',
    memo: 'Tier-2 support routing & SLA analytics add-on',
    amount: 9850,
    status: 'Posted',
  },
];

export const INITIAL_NOTES = `Q4 Operating Variance — Finance Sync Notes
Updated: Nov 25, 2026

1. Cloud & Infrastructure (5100)
   - Q4 actuals tracking $4,580 under forecast due to commitment discounts on Tokyo region nodes.
   - Recommend locking 1-year Savings Plan prior to Dec 15 close.

2. Data Warehouse & ETL (5240)
   - Overrun of +$3,350 driven by backfill jobs for enterprise cohort reporting.
   - M. Lin reviewing auto-suspend timeout thresholds (drop from 10m to 3m).

3. Action Items Before Dec 5 Board Packet
   - Finalize Deloitte pending invoice approval (TX-9037).
   - Export reconciled Q4 ledger CSV for FP&A consolidation.
   - Confirm Q1 headcount requisitions with People Ops.
`;
