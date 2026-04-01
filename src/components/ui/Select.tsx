import { forwardRef } from 'react';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, placeholder, className = '', id, ...props }, ref) => {
    // Generate an ID if one isn't provided
    const selectId = id || label.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={`input-group ${className}`}>
        <label htmlFor={selectId} className="input-label">
          {label}
        </label>
        <select
          id={selectId}
          ref={ref}
          className={`input-field ${error ? 'input-error' : ''}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <span className="input-error-text">{error}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';
