import React, { useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { LedgerEntry } from '../types/workspace';

interface ExpenseLedgerProps {
  entries: LedgerEntry[];
  onAddEntry: (entry: Omit<LedgerEntry, 'id'>) => void;
}

const currencyFmt = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export const ExpenseLedger: React.FC<ExpenseLedgerProps> = ({ entries, onAddEntry }) => {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Posted' | 'Reviewed' | 'Pending'>('All');
  const [showAddForm, setShowAddForm] = useState(false);

  const [vendor, setVendor] = useState('');
  const [costCenter, setCostCenter] = useState('5100 · Cloud Infra');
  const [memo, setMemo] = useState('');
  const [amount, setAmount] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter((item) => {
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      const matchesQuery =
        !q ||
        item.vendor.toLowerCase().includes(q) ||
        item.memo.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.costCenter.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [entries, query, statusFilter]);

  const totalFiltered = useMemo(
    () => filtered.reduce((sum, item) => sum + item.amount, 0),
    [filtered]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = Number(amount);
    if (!vendor.trim() || !Number.isFinite(numericAmount) || numericAmount <= 0) return;

    onAddEntry({
      date: new Date().toISOString().slice(0, 10),
      vendor: vendor.trim(),
      costCenter,
      memo: memo.trim() || 'Q4 operating expense allocation',
      amount: Math.round(numericAmount),
      status: 'Pending',
    });

    setVendor('');
    setMemo('');
    setAmount('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="border border-slate-200 bg-white rounded-lg overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 border-b border-slate-200 bg-slate-50/70">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search vendor, memo, or ID..."
                className="pl-9 pr-3 py-1.5 text-sm bg-white border border-slate-200 rounded-md w-64 focus:outline-none focus:border-slate-400"
              />
            </div>

            <div className="flex items-center gap-1 p-0.5 bg-slate-200/70 rounded-md">
              {(['All', 'Posted', 'Reviewed', 'Pending'] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                    statusFilter === status
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-xs text-slate-500 font-mono-tabular">
              {filtered.length} entries · {currencyFmt.format(totalFiltered)}
            </div>
            <button
              type="button"
              onClick={() => setShowAddForm((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              Log Entry
            </button>
          </div>
        </div>

        {showAddForm && (
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-5 gap-3 p-4 border-b border-slate-200 bg-slate-50"
          >
            <input
              type="text"
              required
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              placeholder="Vendor name"
              className="px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-md focus:outline-none focus:border-slate-400"
            />
            <select
              value={costCenter}
              onChange={(e) => setCostCenter(e.target.value)}
              className="px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-md focus:outline-none focus:border-slate-400"
            >
              <option>5100 · Cloud Infra</option>
              <option>5240 · Data Eng</option>
              <option>6110 · Product</option>
              <option>6320 · Sales</option>
              <option>6410 · Security</option>
              <option>7190 · G&A</option>
            </select>
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="Description / Memo"
              className="px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-md focus:outline-none focus:border-slate-400 md:col-span-2"
            />
            <div className="flex items-center gap-2">
              <input
                type="number"
                required
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount ($)"
                className="w-full px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-md focus:outline-none focus:border-slate-400 font-mono-tabular"
              />
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 whitespace-nowrap shrink-0"
              >
                Save
              </button>
            </div>
          </form>
        )}

        {filtered.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm font-medium text-slate-900">No matching ledger entries</p>
            <p className="text-xs text-slate-500 mt-1">
              Clear the current search filter or log a new operating expense entry.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-medium text-slate-500">
                  <th className="py-2.5 px-4 border-r border-slate-200">Entry ID</th>
                  <th className="py-2.5 px-4 border-r border-slate-200">Date</th>
                  <th className="py-2.5 px-4 border-r border-slate-200">Vendor</th>
                  <th className="py-2.5 px-4 border-r border-slate-200">Cost Center</th>
                  <th className="py-2.5 px-4 border-r border-slate-200">Memo</th>
                  <th className="py-2.5 px-4 border-r border-slate-200 text-right">Amount</th>
                  <th className="py-2.5 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {filtered.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50/80 transition-colors h-10">
                    <td className="py-2 px-4 text-xs text-slate-500 border-r border-slate-200 font-mono-tabular">
                      {entry.id}
                    </td>
                    <td className="py-2 px-4 text-xs text-slate-600 border-r border-slate-200 font-mono-tabular whitespace-nowrap">
                      {entry.date}
                    </td>
                    <td className="py-2 px-4 font-medium text-slate-900 border-r border-slate-200 whitespace-nowrap">
                      {entry.vendor}
                    </td>
                    <td className="py-2 px-4 text-xs text-slate-600 border-r border-slate-200 whitespace-nowrap">
                      {entry.costCenter}
                    </td>
                    <td className="py-2 px-4 text-slate-600 border-r border-slate-200 max-w-md truncate">
                      {entry.memo}
                    </td>
                    <td className="py-2 px-4 text-right font-medium text-slate-900 border-r border-slate-200 font-mono-tabular">
                      {currencyFmt.format(entry.amount)}
                    </td>
                    <td
                      className={`py-2 px-4 text-right text-xs font-medium whitespace-nowrap ${
                        entry.status === 'Posted'
                          ? 'text-emerald-700'
                          : entry.status === 'Pending'
                            ? 'text-amber-700'
                            : 'text-slate-600'
                      }`}
                    >
                      {entry.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
