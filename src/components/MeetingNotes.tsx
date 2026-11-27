import React from 'react';
import { Clock } from 'lucide-react';

interface MeetingNotesProps {
  notes: string;
  onChange: (value: string) => void;
  compact?: boolean;
}

export const MeetingNotes: React.FC<MeetingNotesProps> = ({
  notes,
  onChange,
  compact = false,
}) => {
  const wordCount = notes.trim() ? notes.trim().split(/\s+/).length : 0;

  const insertTimestamp = () => {
    const stamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    onChange(`${notes.trimEnd()}\n\n[${stamp}] Follow-up: `);
  };

  return (
    <div className="border border-slate-200 bg-white rounded-lg flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between gap-4 px-4 py-3 border-b border-slate-200 bg-slate-50/70">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Finance Sync Scratchpad</h2>
          <p className="text-xs text-slate-500 mt-0.5 font-mono-tabular">
            {wordCount} words · Saved locally
          </p>
        </div>
        <button
          type="button"
          onClick={insertTimestamp}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
        >
          <Clock className="w-3.5 h-3.5" />
          Timestamp
        </button>
      </div>

      <textarea
        value={notes}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={true}
        placeholder="Enter quarterly review notes, reconciliation items, or board packet memos..."
        className={`w-full flex-1 p-5 text-sm leading-relaxed text-slate-800 bg-white focus:outline-none resize-none font-mono-tabular ${
          compact ? 'min-h-[420px]' : 'min-h-[540px]'
        }`}
      />
    </div>
  );
};
