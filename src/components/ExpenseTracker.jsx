import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Tag } from 'lucide-react';

export default function ExpenseTracker({ expenses, onAddExpense, onDeleteExpense }) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount) return;

    onAddExpense({
      id: Date.now().toString(),
      title,
      amount: parseFloat(amount),
      date: new Date().toISOString()
    });

    setTitle('');
    setAmount('');
    setIsAdding(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-800">Expenses</h3>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="text-blue-600 hover:text-blue-800 p-1 bg-blue-50 rounded-md transition-colors"
          title="Add Expense"
        >
          <Plus size={18} />
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 bg-slate-50 p-3 rounded-lg border border-slate-200 overflow-hidden"
            onSubmit={handleSubmit}
          >
            <div className="space-y-3 mb-3">
              <input
                type="text"
                placeholder="What did you buy?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
                required
              />
              <div className="flex relative">
                <span className="absolute left-3 top-1.5 text-slate-400 text-sm">$</span>
                <input
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-6 pr-3 py-1.5 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
        {expenses.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-4">No expenses recorded yet.</p>
        ) : (
          <AnimatePresence>
            {expenses.map((expense) => (
              <motion.div
                key={expense.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg group"
              >
                <div className="flex items-center">
                  <div className="bg-slate-100 p-2 rounded-md mr-3">
                    <Tag size={14} className="text-slate-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{expense.title}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold text-slate-900 mr-3">
                    ${parseFloat(expense.amount).toFixed(2)}
                  </span>
                  <button
                    onClick={() => onDeleteExpense(expense.id)}
                    className="text-slate-300 hover:text-red-500 transition-colors hidden group-hover:block"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
