import React, { useState } from 'react';
import { EyeOff, Maximize2, Columns2, Square, RefreshCw, Contrast } from 'lucide-react';
import { PlayLayoutMode, StealthSettings } from '../types/workspace';
import { MeetingNotes } from './MeetingNotes';

interface StealthViewportProps {
  isOpen: boolean;
  settings: StealthSettings;
  notes: string;
  onUpdateNotes: (value: string) => void;
  onChangeLayout: (mode: PlayLayoutMode) => void;
  onChangeOpacity: (opacity: number) => void;
  onToggleDesaturate: () => void;
  onHide: () => void;
}

const TARGET_URL = 'https://deadshot.io/';

export const StealthViewport: React.FC<StealthViewportProps> = ({
  isOpen,
  settings,
  notes,
  onUpdateNotes,
  onChangeLayout,
  onChangeOpacity,
  onToggleDesaturate,
  onHide,
}) => {
  const [reloadNonce, setReloadNonce] = useState(0);

  // If unloadOnHide is enabled and viewport is hidden, unmount iframe completely for instant silence
  if (!isOpen && settings.unloadOnHide) {
    return null;
  }

  const isFull = isOpen && settings.layoutMode === 'full';
  const isSplit = isOpen && settings.layoutMode === 'split';
  const isHiddenPreserved = !isOpen && !settings.unloadOnHide;

  const containerClass = isHiddenPreserved
    ? 'fixed -left-[9999px] top-0 w-[1280px] h-[720px] opacity-0 pointer-events-none overflow-hidden'
    : isFull
      ? 'fixed inset-0 z-50 bg-slate-950 flex flex-col'
      : 'border border-slate-200 bg-white rounded-lg overflow-hidden flex flex-col';

  const iframeFilterStyle: React.CSSProperties = {
    opacity: settings.opacityPercent / 100,
    filter: settings.desaturateCamo ? 'grayscale(100%) contrast(0.92)' : undefined,
  };

  return (
    <div className={containerClass} aria-hidden={isHiddenPreserved}>
      {/* Slim Decoy Control Bar */}
      <div
        className={`flex items-center justify-between gap-4 px-3 border-b select-none ${
          isFull
            ? 'h-9 bg-slate-900 border-slate-800 text-slate-200'
            : 'h-10 bg-slate-50 border-slate-200 text-slate-700'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span
            className={`text-xs font-medium truncate ${
              isFull ? 'text-slate-200' : 'text-slate-900'
            }`}
          >
            {isFull ? 'Meridian · Q4 Interactive Projection' : 'Interactive Model Viewport'}
          </span>
          <span
            className={`hidden md:inline text-xs whitespace-nowrap ${
              isFull ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Press Esc to unlock cursor · {settings.bossKey} to hide
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Layout Switcher */}
          <div
            className={`flex items-center gap-0.5 p-0.5 rounded ${
              isFull ? 'bg-slate-800' : 'bg-slate-200/80'
            }`}
          >
            <button
              type="button"
              onClick={() => onChangeLayout('embedded')}
              title="Embedded frame inside workbook"
              className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                settings.layoutMode === 'embedded'
                  ? isFull
                    ? 'bg-slate-700 text-white'
                    : 'bg-white text-slate-900 shadow-xs'
                  : isFull
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Square className="w-3 h-3" />
              <span className="hidden sm:inline">Embed</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeLayout('split')}
              title="Side-by-side with live meeting notes"
              className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                settings.layoutMode === 'split'
                  ? isFull
                    ? 'bg-slate-700 text-white'
                    : 'bg-white text-slate-900 shadow-xs'
                  : isFull
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Columns2 className="w-3 h-3" />
              <span className="hidden sm:inline">Split</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeLayout('full')}
              title="Full viewport with slim decoy header"
              className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                settings.layoutMode === 'full'
                  ? isFull
                    ? 'bg-slate-700 text-white'
                    : 'bg-white text-slate-900 shadow-xs'
                  : isFull
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Maximize2 className="w-3 h-3" />
              <span className="hidden sm:inline">Full</span>
            </button>
          </div>

          {/* Opacity Camouflage */}
          <label className="hidden lg:flex items-center gap-1.5 px-2 text-xs">
            <span className={isFull ? 'text-slate-400' : 'text-slate-500'}>Opacity</span>
            <input
              type="range"
              min={30}
              max={100}
              step={5}
              value={settings.opacityPercent}
              onChange={(e) => onChangeOpacity(Number(e.target.value))}
              className="w-16 accent-slate-700 cursor-pointer"
            />
            <span className="w-8 text-right font-mono-tabular">{settings.opacityPercent}%</span>
          </label>

          {/* Grayscale Camo Toggle */}
          <button
            type="button"
            onClick={onToggleDesaturate}
            title="Toggle monochrome camouflage"
            className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded border transition-colors whitespace-nowrap shrink-0 ${
              settings.desaturateCamo
                ? 'bg-slate-900 text-white border-slate-900'
                : isFull
                  ? 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Contrast className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Mono</span>
          </button>

          {/* Reload Frame */}
          <button
            type="button"
            onClick={() => setReloadNonce((n) => n + 1)}
            title="Reload viewport"
            className={`inline-flex items-center justify-center p-1.5 rounded border transition-colors ${
              isFull
                ? 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* Instant Panic Hide */}
          <button
            type="button"
            onClick={onHide}
            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
              isFull
                ? 'bg-white text-slate-900 hover:bg-slate-200'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            <EyeOff className="w-3.5 h-3.5" />
            Return to Sheet
          </button>
        </div>
      </div>

      {/* Main Viewport Area */}
      <div
        className={`flex-1 flex ${
          isFull ? 'h-[calc(100vh-36px)]' : 'h-[calc(100vh-220px)] min-h-[540px]'
        }`}
      >
        <div
          className={`relative bg-white ${
            isSplit ? 'w-full lg:w-[64%] border-r border-slate-200' : 'w-full'
          } h-full`}
        >
          <iframe
            key={reloadNonce}
            src={TARGET_URL}
            title="Q4 Interactive Projection Canvas"
            allow="autoplay; fullscreen; pointer-lock; gamepad; clipboard-write"
            allowFullScreen
            style={iframeFilterStyle}
            className="w-full h-full border-0 block bg-[#0c0e12]"
          />
        </div>

        {isSplit && (
          <div className="hidden lg:block lg:w-[36%] h-full p-3 bg-slate-50">
            <MeetingNotes notes={notes} onChange={onUpdateNotes} compact />
          </div>
        )}
      </div>
    </div>
  );
};
