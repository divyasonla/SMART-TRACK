import React, { forwardRef } from 'react';

export const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className="flex flex-col mb-4 w-full">
      {label && (
        <label className="mb-2 text-sm font-bold uppercase tracking-wider text-[var(--text-main)]">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`px-4 py-3 bg-[var(--bg-main)] border-2 ${error ? 'border-[var(--color-primary)]' : 'border-[var(--border-color)]'} focus:outline-none focus:shadow-[4px_4px_0px_var(--shadow-color)] transition-all w-full text-[var(--text-main)] ${className}`}
        {...props}
      />
      {error && <span className="mt-1 text-xs font-bold text-[var(--color-primary)] uppercase">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export const Select = forwardRef(({ label, options, error, className = '', ...props }, ref) => {
  return (
    <div className="flex flex-col mb-4 w-full">
      {label && (
        <label className="mb-2 text-sm font-bold uppercase tracking-wider text-[var(--text-main)]">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={`px-4 py-3 bg-[var(--bg-main)] border-2 ${error ? 'border-[var(--color-primary)]' : 'border-[var(--border-color)]'} focus:outline-none focus:shadow-[4px_4px_0px_var(--shadow-color)] transition-all w-full text-[var(--text-main)] appearance-none ${className}`}
        {...props}
      >
        <option value="" disabled>Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="mt-1 text-xs font-bold text-[var(--color-primary)] uppercase">{error}</span>}
    </div>
  );
});

Select.displayName = 'Select';
