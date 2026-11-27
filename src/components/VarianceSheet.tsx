import React, { useMemo, useState } from 'react';
import { Download, RotateCcw } from 'lucide-react';
import { VarianceRow } from '../types/workspace';

interface VarianceSheetProps {
  rows: VarianceRow[];
  onUpdateRow: (id: string, field: 'q4Forecast' | 'q4Actual', value: number) => void;
  onResetData: () => void;
  onExportCsv: () => void;
  onTriggerStealth: () => void;
}

const currencyFmt = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export const VarianceSheet: React.FC<VarianceSheetProps> = ({
  rows,
  onUpdateRow,
  onResetData,
  onExportCsv,
  onTriggerStealth,
}) => {
  const [editingCell, setEditingCell] = useState<{
    id: string;
    field: 'q4Forecast' | 'q4Actual';
    draft: string;
  } | null>(null);

  const [selectedQuarter, setSelectedQuarter] = useState<'all' | 'q4'>('all');

  const totals = useMemo(() => {
    const q1 = rows.reduce((acc, r) => acc + r.q1Forecast, 0);
    const q2 = rows.reduce((acc, r) => acc + r.q2Forecast, 0);
    const q3 = rows.reduce((acc, r) => acc + r.q3Forecast, 0);
    const q4Forecast = rows.reduce((acc, r) => acc + r.q4Forecast, 0);
    const q4Actual = rows.reduce((acc, r) => acc + r.q4Actual, 0);
    const variance = q4Actual - q4Forecast;
    const variancePct = q4Forecast > 0 ? (variance / q4Forecast) * 100 : 0;
    const accuracy = q4Forecast > 0 ? Math.max(0, 100 - Math.abs(variancePct)) : 100;

    return { q1, q2, q3, q4Forecast, q4Actual, variance, variancePct, accuracy };
  }, [rows]);

  const commitEdit = () => {
    if (!editingCell) return;
    const parsed = Number(editingCell.draft.replace(/[^0-9.-]/g, ''));
    if (Number.isFinite(parsed) && parsed >= 0) {
      onUpdateRow(editingCell.id, editingCell.field, Math.round(parsed));
    }
    setEditingCell(null);
  };

  const maxChartVal = Math.max(totals.q1, totals.q2, totals.q3, totals.q4Forecast, totals.q4Actual, 1);

  return (
    <div className="space-y-6">
      {/* 4-Column Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-slate-200 bg-white rounded-lg divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
        <div className="p-4">
          <div className="text-xs font-medium text-slate-500">Q4 Operating Budget</div>
          <div className="mt-1.5 text-2xl font-semibold text-slate-900 font-mono-tabular">
            {currencyFmt.format(totals.q4Forecast)}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            8 cost centers · FY26 baseline
          </div>
        </div>

        <div className="p-4">
          <div className="text-xs font-medium text-slate-500">Q4 Actual Spend</div>
          <div className="mt-1.5 text-2xl font-semibold text-slate-900 font-mono-tabular">
            {currencyFmt.format(totals.q4Actual)}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Reconciled through Nov 25
          </div>
        </div>

        <div className="p-4">
          <div className="text-xs font-medium text-slate-500">Net Variance</div>
          <div
            className={`mt-1.5 text-2xl font-semibold font-mono-tabular ${
              totals.variance <= 0 ? 'text-emerald-700' : 'text-red-700'
            }`}
          >
            {totals.variance > 0 ? '+' : ''}
            {currencyFmt.format(totals.variance)}
          </div>
          <div className="mt-1 text-xs text-slate-500 font-mono-tabular">
            {totals.variance <= 0 ? 'Under budget' : 'Over budget'} ({totals.variancePct > 0 ? '+' : ''}
            {totals.variancePct.toFixed(2)}%)
          </div>
        </div>

        <div className="p-4">
          <div className="text-xs font-medium text-slate-500">Forecast Accuracy</div>
          <div className="mt-1.5 text-2xl font-semibold text-slate-900 font-mono-tabular">
            {totals.accuracy.toFixed(1)}%
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Target threshold · 95.0%
          </div>
        </div>
      </div>

      {/* Main Editable Spreadsheet Table */}
      <div className="border border-slate-200 bg-white rounded-lg overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 border-b border-slate-200 bg-slate-50/70">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Department Variance Matrix
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any Q4 Forecast or Q4 Actual cell to revise figures inline
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-0.5 bg-slate-200/70 rounded-md">
              <button
                type="button"
                onClick={() => setSelectedQuarter('all')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                  selectedQuarter === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Full Year
              </button>
              <button
                type="button"
                onClick={() => setSelectedQuarter('q4')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                  selectedQuarter === 'q4'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Q4 Focus
              </button>
            </div>

            <button
              type="button"
              onClick={onResetData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>

            <button
              type="button"
              onClick={onExportCsv}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-medium text-slate-500">
                <th className="py-2.5 px-3 w-12 text-center border-r border-slate-200 font-mono-tabular">
                  Row
                </th>
                <th className="py-2.5 px-3 border-r border-slate-200">Acct</th>
                <th className="py-2.5 px-4 border-r border-slate-200">Department / Category</th>
                {selectedQuarter === 'all' && (
                  <>
                    <th className="py-2.5 px-3 text-right border-r border-slate-200">Q1</th>
                    <th className="py-2.5 px-3 text-right border-r border-slate-200">Q2</th>
                    <th className="py-2.5 px-3 text-right border-r border-slate-200">Q3</th>
                  </>
                )}
                <th className="py-2.5 px-3 text-right border-r border-slate-200">Q4 Forecast</th>
                <th className="py-2.5 px-3 text-right border-r border-slate-200">Q4 Actual</th>
                <th className="py-2.5 px-3 text-right border-r border-slate-200">Variance ($)</th>
                <th
                  onDoubleClick={onTriggerStealth}
                  title="Double-click to open interactive model"
                  className="py-2.5 px-3 text-right select-none cursor-default"
                >
                  Var (%)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {rows.map((row, idx) => {
                const diff = row.q4Actual - row.q4Forecast;
                const diffPct = row.q4Forecast > 0 ? (diff / row.q4Forecast) * 100 : 0;
                const isEditingForecast =
                  editingCell?.id === row.id && editingCell.field === 'q4Forecast';
                const isEditingActual =
                  editingCell?.id === row.id && editingCell.field === 'q4Actual';

                return (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50/80 transition-colors h-10"
                  >
                    <td className="py-2 px-3 text-center text-xs text-slate-400 border-r border-slate-200 font-mono-tabular bg-slate-50/50">
                      {idx + 1}
                    </td>
                    <td className="py-2 px-3 text-xs text-slate-500 border-r border-slate-200 font-mono-tabular">
                      {row.code}
                    </td>
                    <td className="py-2 px-4 border-r border-slate-200">
                      <div className="font-medium text-slate-900 leading-tight">{row.department}</div>
                      <div className="text-xs text-slate-500">
                        {row.category} · {row.owner}
                      </div>
                    </td>

                    {selectedQuarter === 'all' && (
                      <>
                        <td className="py-2 px-3 text-right text-slate-600 border-r border-slate-200 font-mono-tabular">
                          {currencyFmt.format(row.q1Forecast)}
                        </td>
                        <td className="py-2 px-3 text-right text-slate-600 border-r border-slate-200 font-mono-tabular">
                          {currencyFmt.format(row.q2Forecast)}
                        </td>
                        <td className="py-2 px-3 text-right text-slate-600 border-r border-slate-200 font-mono-tabular">
                          {currencyFmt.format(row.q3Forecast)}
                        </td>
                      </>
                    )}

                    <td
                      className="py-1.5 px-3 text-right border-r border-slate-200 font-mono-tabular cursor-text hover:bg-blue-50/50"
                      onClick={() =>
                        setEditingCell({
                          id: row.id,
                          field: 'q4Forecast',
                          draft: String(row.q4Forecast),
                        })
                      }
                    >
                      {isEditingForecast ? (
                        <input
                          type="text"
                          autoFocus
                          value={editingCell.draft}
                          onChange={(e) =>
                            setEditingCell({ ...editingCell, draft: e.target.value })
                          }
                          onBlur={commitEdit}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') commitEdit();
                            if (e.key === 'Escape') setEditingCell(null);
                          }}
                          className="w-24 px-1.5 py-0.5 text-right text-sm bg-white border border-blue-500 rounded outline-none font-mono-tabular"
                        />
                      ) : (
                        <span className="text-slate-900">{currencyFmt.format(row.q4Forecast)}</span>
                      )}
                    </td>

                    <td
                      className="py-1.5 px-3 text-right border-r border-slate-200 font-mono-tabular cursor-text hover:bg-blue-50/50"
                      onClick={() =>
                        setEditingCell({
                          id: row.id,
                          field: 'q4Actual',
                          draft: String(row.q4Actual),
                        })
                      }
                    >
                      {isEditingActual ? (
                        <input
                          type="text"
                          autoFocus
                          value={editingCell.draft}
                          onChange={(e) =>
                            setEditingCell({ ...editingCell, draft: e.target.value })
                          }
                          onBlur={commitEdit}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') commitEdit();
                            if (e.key === 'Escape') setEditingCell(null);
                          }}
                          className="w-24 px-1.5 py-0.5 text-right text-sm bg-white border border-blue-500 rounded outline-none font-mono-tabular"
                        />
                      ) : (
                        <span className="font-medium text-slate-900">
                          {currencyFmt.format(row.q4Actual)}
                        </span>
                      )}
                    </td>

                    <td
                      className={`py-2 px-3 text-right border-r border-slate-200 font-mono-tabular font-medium ${
                        diff <= 0 ? 'text-emerald-700' : 'text-red-700'
                      }`}
                    >
                      {diff > 0 ? '+' : ''}
                      {currencyFmt.format(diff)}
                    </td>

                    <td
                      className={`py-2 px-3 text-right font-mono-tabular text-xs font-medium ${
                        diff <= 0 ? 'text-emerald-700' : 'text-red-700'
                      }`}
                    >
                      {diffPct > 0 ? '+' : ''}
                      {diffPct.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-200 bg-slate-50 font-semibold text-sm text-slate-900">
                <td className="py-2.5 px-3 border-r border-slate-200 text-center text-xs text-slate-500 font-mono-tabular">
                  Σ
                </td>
                <td className="py-2.5 px-3 border-r border-slate-200 text-xs text-slate-500 font-mono-tabular">
                  ALL
                </td>
                <td className="py-2.5 px-4 border-r border-slate-200">Total Operating Expenses</td>
                {selectedQuarter === 'all' && (
                  <>
                    <td className="py-2.5 px-3 text-right border-r border-slate-200 font-mono-tabular">
                      {currencyFmt.format(totals.q1)}
                    </td>
                    <td className="py-2.5 px-3 text-right border-r border-slate-200 font-mono-tabular">
                      {currencyFmt.format(totals.q2)}
                    </td>
                    <td className="py-2.5 px-3 text-right border-r border-slate-200 font-mono-tabular">
                      {currencyFmt.format(totals.q3)}
                    </td>
                  </>
                )}
                <td className="py-2.5 px-3 text-right border-r border-slate-200 font-mono-tabular">
                  {currencyFmt.format(totals.q4Forecast)}
                </td>
                <td className="py-2.5 px-3 text-right border-r border-slate-200 font-mono-tabular">
                  {currencyFmt.format(totals.q4Actual)}
                </td>
                <td
                  className={`py-2.5 px-3 text-right border-r border-slate-200 font-mono-tabular ${
                    totals.variance <= 0 ? 'text-emerald-700' : 'text-red-700'
                  }`}
                >
                  {totals.variance > 0 ? '+' : ''}
                  {currencyFmt.format(totals.variance)}
                </td>
                <td
                  className={`py-2.5 px-3 text-right font-mono-tabular text-xs ${
                    totals.variance <= 0 ? 'text-emerald-700' : 'text-red-700'
                  }`}
                >
                  {totals.variancePct > 0 ? '+' : ''}
                  {totals.variancePct.toFixed(2)}%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Quarterly Trajectory Visualization */}
      <div className="border border-slate-200 bg-white rounded-lg p-5">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Quarterly Run-Rate Progression
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Aggregate forecasted spend across FY26 vs Q4 actuals
            </p>
          </div>
          <button
            type="button"
            onClick={onTriggerStealth}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Open Interactive Canvas
          </button>
        </div>

        <div className="grid grid-cols-5 gap-4 items-end h-40 pt-4 border-t border-slate-100">
          {[
            { label: 'Q1 Forecast', value: totals.q1, tone: 'bg-slate-300' },
            { label: 'Q2 Forecast', value: totals.q2, tone: 'bg-slate-400' },
            { label: 'Q3 Forecast', value: totals.q3, tone: 'bg-slate-500' },
            { label: 'Q4 Forecast', value: totals.q4Forecast, tone: 'bg-slate-700' },
            {
              label: 'Q4 Actual',
              value: totals.q4Actual,
              tone: totals.variance <= 0 ? 'bg-emerald-600' : 'bg-red-600',
            },
          ].map((bar) => {
            const pct = Math.max(12, Math.round((bar.value / maxChartVal) * 100));
            return (
              <div key={bar.label} className="flex flex-col items-center h-full justify-end gap-2">
                <span className="text-xs font-mono-tabular text-slate-700 font-medium">
                  {currencyFmt.format(bar.value)}
                </span>
                <div className="w-full max-w-[72px] flex-1 flex items-end">
                  <div
                    className={`w-full rounded-t ${bar.tone} transition-all duration-200`}
                    style={{ height: `${pct}%` }}
                  />
                </div>
                <span className="text-xs text-slate-500 whitespace-nowrap">{bar.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
