import { useCallback, useEffect, useState } from 'react';
import {
  FileSpreadsheet,
  Receipt,
  FileText,
  SlidersHorizontal,
  Activity,
  EyeOff,
} from 'lucide-react';
import {
  DEFAULT_STEALTH_SETTINGS,
  INITIAL_LEDGER_ENTRIES,
  INITIAL_NOTES,
  INITIAL_VARIANCE_ROWS,
} from './data/workbookData';
import { useTabCloak } from './hooks/useTabCloak';
import {
  LedgerEntry,
  PlayLayoutMode,
  StealthSettings,
  VarianceRow,
  WorkspaceTab,
} from './types/workspace';
import { VarianceSheet } from './components/VarianceSheet';
import { ExpenseLedger } from './components/ExpenseLedger';
import { MeetingNotes } from './components/MeetingNotes';
import { StealthViewport } from './components/StealthViewport';
import { SettingsModal } from './components/SettingsModal';

const STORAGE_KEYS = {
  settings: 'meridian_stealth_settings_v1',
  rows: 'meridian_variance_rows_v1',
  ledger: 'meridian_ledger_entries_v1',
  notes: 'meridian_meeting_notes_v1',
};

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return { ...fallback, ...JSON.parse(raw) };
  } catch {
    return fallback;
  }
}

function loadArray<T>(key: string, fallback: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('variance');
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [settings, setSettings] = useState<StealthSettings>(() =>
    loadJson(STORAGE_KEYS.settings, DEFAULT_STEALTH_SETTINGS)
  );
  const [rows, setRows] = useState<VarianceRow[]>(() =>
    loadArray(STORAGE_KEYS.rows, INITIAL_VARIANCE_ROWS)
  );
  const [ledger, setLedger] = useState<LedgerEntry[]>(() =>
    loadArray(STORAGE_KEYS.ledger, INITIAL_LEDGER_ENTRIES)
  );
  const [notes, setNotes] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.notes) ?? INITIAL_NOTES;
    } catch {
      return INITIAL_NOTES;
    }
  });

  useTabCloak(settings);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
    } catch {
      // ignore storage quota errors
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.rows, JSON.stringify(rows));
    } catch {
      // ignore
    }
  }, [rows]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ledger, JSON.stringify(ledger));
    } catch {
      // ignore
    }
  }, [ledger]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.notes, notes);
    } catch {
      // ignore
    }
  }, [notes]);

  const hideStealth = useCallback(() => {
    setActiveTab('variance');
  }, []);

  const toggleStealth = useCallback(() => {
    setActiveTab((prev) => (prev === 'preview' ? 'variance' : 'preview'));
  }, []);

  // Boss key shortcut
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isEditable =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);

      const matchesBossKey =
        (settings.bossKey === '`' && e.key === '`') ||
        (settings.bossKey === '\\' && e.key === '\\') ||
        (settings.bossKey === 'F9' && e.key === 'F9') ||
        (settings.bossKey === 'Alt+H' && e.altKey && e.key.toLowerCase() === 'h');

      if (!matchesBossKey) return;
      if (isEditable && settings.bossKey !== 'F9' && settings.bossKey !== 'Alt+H') {
        return;
      }

      e.preventDefault();
      toggleStealth();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [settings.bossKey, toggleStealth]);

  // Auto-hide when user switches browser tabs
  useEffect(() => {
    if (!settings.autoHideOnTabLeave) return;
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setActiveTab((prev) => (prev === 'preview' ? 'variance' : prev));
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [settings.autoHideOnTabLeave]);

  const updateSettings = (patch: Partial<StealthSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  };

  const handleUpdateRow = (id: string, field: 'q4Forecast' | 'q4Actual', value: number) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const handleResetRows = () => {
    setRows(INITIAL_VARIANCE_ROWS);
  };

  const handleExportCsv = () => {
    const header = [
      'Account',
      'Department',
      'Category',
      'Owner',
      'Q1 Forecast',
      'Q2 Forecast',
      'Q3 Forecast',
      'Q4 Forecast',
      'Q4 Actual',
      'Variance ($)',
    ];
    const lines = rows.map((r) => [
      r.code,
      `"${r.department}"`,
      `"${r.category}"`,
      `"${r.owner}"`,
      r.q1Forecast,
      r.q2Forecast,
      r.q3Forecast,
      r.q4Forecast,
      r.q4Actual,
      r.q4Actual - r.q4Forecast,
    ]);
    const csv = [header.join(','), ...lines.map((line) => line.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'fy26-q4-operating-variance.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleAddLedgerEntry = (entry: Omit<LedgerEntry, 'id'>) => {
    const nextNum = 9042 + ledger.length;
    setLedger((prev) => [{ ...entry, id: `TX-${nextNum}` }, ...prev]);
  };

  const breadcrumbTitle: Record<WorkspaceTab, string> = {
    variance: 'Operating Variance',
    ledger: 'Expense Ledger',
    notes: 'Finance Sync Notes',
    preview: 'Interactive Model',
  };

  const navItems: {
    id: WorkspaceTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'variance', label: 'Variance Sheet', icon: FileSpreadsheet },
    { id: 'ledger', label: 'Expense Ledger', icon: Receipt },
    { id: 'notes', label: 'Meeting Notes', icon: FileText },
    { id: 'preview', label: 'Interactive Model', icon: Activity },
  ];

  const isPreviewOpen = activeTab === 'preview';

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-slate-900">
      {/* Left Workspace Sidebar */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col justify-between border-r border-slate-200 bg-white">
        <div>
          <div className="h-14 px-5 flex items-center border-b border-slate-200">
            <span className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap">
              Meridian
            </span>
          </div>

          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-3 border-t border-slate-200 space-y-1.5">
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-600 rounded-md hover:bg-slate-100 hover:text-slate-900 transition-colors whitespace-nowrap"
          >
            <SlidersHorizontal className="w-4 h-4 shrink-0" />
            <span>Preferences</span>
          </button>
          <div className="px-3 py-1.5 text-xs text-slate-400 font-mono-tabular">
            Quick switch: {settings.bossKey}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-14 px-4 sm:px-6 bg-white border-b border-slate-200 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2 text-sm min-w-0">
            <span className="md:hidden font-bold text-slate-900 mr-2">Meridian</span>
            <span className="hidden sm:inline text-slate-400">Workbooks</span>
            <span className="hidden sm:inline text-slate-300">/</span>
            <span className="hidden sm:inline text-slate-500">FY26 Q4</span>
            <span className="hidden sm:inline text-slate-300">/</span>
            <span className="font-semibold text-slate-900 truncate">
              {breadcrumbTitle[activeTab]}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Compact mobile nav selector */}
            <div className="flex md:hidden items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`px-2 py-1 text-xs font-medium rounded whitespace-nowrap ${
                    activeTab === item.id
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {item.id === 'variance'
                    ? 'Sheet'
                    : item.id === 'ledger'
                      ? 'Ledger'
                      : item.id === 'notes'
                        ? 'Notes'
                        : 'Model'}
                </button>
              ))}
            </div>

            {isPreviewOpen && (
              <button
                type="button"
                onClick={hideStealth}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
              >
                <EyeOff className="w-3.5 h-3.5" />
                Back to Sheet
              </button>
            )}

            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
            >
              Preferences
            </button>
          </div>
        </header>

        {/* Main Viewport */}
        <main className="flex-1 p-4 sm:p-6 max-w-[1400px] w-full mx-auto space-y-5">
          {/* Dismissible Quick-Start Guide */}
          {settings.showQuickTip && activeTab !== 'preview' && (
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-600">
              <p>
                <span className="font-semibold text-slate-900">Discreet Mode Ready:</span>{' '}
                Click <span className="font-medium text-slate-900">Interactive Model</span> in the sidebar or press{' '}
                <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono-tabular text-slate-800">
                  {settings.bossKey}
                </kbd>{' '}
                to open <span className="font-medium text-slate-900">deadshot.io</span>. Use{' '}
                <span className="font-medium text-slate-900">Preferences</span> to change the browser tab disguise, opacity, or shortcut key.
              </p>
              <button
                type="button"
                onClick={() => updateSettings({ showQuickTip: false })}
                className="text-xs font-medium text-slate-900 underline underline-offset-4 hover:text-slate-600 whitespace-nowrap shrink-0"
              >
                Dismiss notice
              </button>
            </div>
          )}

          {activeTab === 'variance' && (
            <VarianceSheet
              rows={rows}
              onUpdateRow={handleUpdateRow}
              onResetData={handleResetRows}
              onExportCsv={handleExportCsv}
              onTriggerStealth={() => setActiveTab('preview')}
            />
          )}

          {activeTab === 'ledger' && (
            <ExpenseLedger entries={ledger} onAddEntry={handleAddLedgerEntry} />
          )}

          {activeTab === 'notes' && (
            <MeetingNotes notes={notes} onChange={setNotes} />
          )}

          {/* Persistent or On-Demand Stealth Viewport */}
          <StealthViewport
            isOpen={isPreviewOpen}
            settings={settings}
            notes={notes}
            onUpdateNotes={setNotes}
            onChangeLayout={(mode: PlayLayoutMode) => updateSettings({ layoutMode: mode })}
            onChangeOpacity={(opacityPercent: number) => updateSettings({ opacityPercent })}
            onToggleDesaturate={() =>
              updateSettings({ desaturateCamo: !settings.desaturateCamo })
            }
            onHide={hideStealth}
          />
        </main>
      </div>

      <SettingsModal
        isOpen={settingsOpen}
        settings={settings}
        onUpdate={updateSettings}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}
