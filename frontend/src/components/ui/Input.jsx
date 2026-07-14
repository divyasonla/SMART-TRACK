import React, { forwardRef } from 'react';

export const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className="flex flex-col mb-4 w-full">
      {label && (
        <label className="mb-2 text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`px-4 py-3 bg-white/50 border ${error ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors w-full text-slate-700 ${className}`}
        {...props}
      />
      {error && <span className="mt-1 text-xs text-red-500">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export const Select = forwardRef(({ label, options, error, className = '', ...props }, ref) => {
  return (
    <div className="flex flex-col mb-4 w-full">
      {label && (
        <label className="mb-2 text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={`px-4 py-3 bg-white/50 border ${error ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors w-full text-slate-700 appearance-none ${className}`}
        {...props}
      >
        <option value="" disabled>Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="mt-1 text-xs text-red-500">{error}</span>}
    </div>
  );
});

Select.displayName = 'Select';
