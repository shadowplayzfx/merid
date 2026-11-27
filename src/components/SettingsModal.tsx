import React from 'react';
import { X } from 'lucide-react';
import { CLOAK_PRESETS } from '../data/workbookData';
import { BossKeyOption, CloakPresetId, PlayLayoutMode, StealthSettings } from '../types/workspace';

interface SettingsModalProps {
  isOpen: boolean;
  settings: StealthSettings;
  onUpdate: (patch: Partial<StealthSettings>) => void;
  onClose: () => void;
}

const BOSS_KEYS: { value: BossKeyOption; label: string }[] = [
  { value: '`', label: 'Backtick (`)' },
  { value: '\\', label: 'Backslash (\\)' },
  { value: 'F9', label: 'F9 Key' },
  { value: 'Alt+H', label: 'Alt + H' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  onUpdate,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Workspace & Display Preferences</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure browser tab identity, hotkey switching, and embed behavior
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close settings"
            className="p-1.5 text-slate-500 hover:text-slate-900 rounded-md hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Tab Cloak */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Browser Tab Disguise
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CLOAK_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => onUpdate({ cloakPreset: preset.id as CloakPresetId })}
                  className={`px-3 py-2 text-xs font-medium rounded-md border text-left transition-colors whitespace-nowrap truncate ${
                    settings.cloakPreset === preset.id
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {settings.cloakPreset === 'custom' && (
              <input
                type="text"
                value={settings.customTitle}
                onChange={(e) => onUpdate({ customTitle: e.target.value })}
                placeholder="Enter custom browser tab title..."
                className="mt-2.5 w-full px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-md focus:outline-none focus:border-slate-400"
              />
            )}
          </div>

          {/* Boss Key */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Quick-Switch Shortcut
              </label>
              <select
                value={settings.bossKey}
                onChange={(e) => onUpdate({ bossKey: e.target.value as BossKeyOption })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-md focus:outline-none focus:border-slate-400"
              >
                {BOSS_KEYS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-500 mt-1">
                If cursor is locked inside the game, press Esc first or click the top bar.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Default Canvas Mode
              </label>
              <select
                value={settings.layoutMode}
                onChange={(e) => onUpdate({ layoutMode: e.target.value as PlayLayoutMode })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-md focus:outline-none focus:border-slate-400"
              >
                <option value="embedded">Embedded Inside Workbook</option>
                <option value="split">Split View (With Notes)</option>
                <option value="full">Full Screen + Slim Top Bar</option>
              </select>
            </div>
          </div>

          {/* Opacity */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <span>Viewport Opacity</span>
              <span className="font-mono-tabular text-slate-900">{settings.opacityPercent}%</span>
            </div>
            <input
              type="range"
              min={30}
              max={100}
              step={5}
              value={settings.opacityPercent}
              onChange={(e) => onUpdate({ opacityPercent: Number(e.target.value) })}
              className="w-full accent-slate-900 cursor-pointer"
            />
          </div>

          {/* Toggles */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <label className="flex items-start justify-between gap-4 cursor-pointer">
              <div>
                <div className="text-sm font-medium text-slate-900">
                  Silence & unload immediately on hide
                </div>
                <div className="text-xs text-slate-500">
                  Unmounts the frame when hidden so game audio stops instantly. Turn off to keep your lobby loaded while muted.
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.unloadOnHide}
                onChange={(e) => onUpdate({ unloadOnHide: e.target.checked })}
                className="mt-1 h-4 w-4 accent-slate-900 rounded cursor-pointer shrink-0"
              />
            </label>

            <label className="flex items-start justify-between gap-4 cursor-pointer">
              <div>
                <div className="text-sm font-medium text-slate-900">
                  Auto-hide when switching browser tabs
                </div>
                <div className="text-xs text-slate-500">
                  Automatically returns to the Q4 Variance Sheet whenever this browser tab goes to the background.
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.autoHideOnTabLeave}
                onChange={(e) => onUpdate({ autoHideOnTabLeave: e.target.checked })}
                className="mt-1 h-4 w-4 accent-slate-900 rounded cursor-pointer shrink-0"
              />
            </label>

            <label className="flex items-start justify-between gap-4 cursor-pointer">
              <div>
                <div className="text-sm font-medium text-slate-900">
                  Monochrome camouflage filter
                </div>
                <div className="text-xs text-slate-500">
                  Renders the viewport in subtle grayscale so it blends with financial tables from a distance.
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.desaturateCamo}
                onChange={(e) => onUpdate({ desaturateCamo: e.target.checked })}
                className="mt-1 h-4 w-4 accent-slate-900 rounded cursor-pointer shrink-0"
              />
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-200 bg-slate-50">
          <button
            type="button"
            onClick={() => onUpdate({ showQuickTip: true })}
            className="text-xs font-medium text-slate-600 hover:text-slate-900"
          >
            Show quick-start hint
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
