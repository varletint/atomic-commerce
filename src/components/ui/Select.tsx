import { useState, useRef, useEffect, useCallback, forwardRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps {
  label: string;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
  name?: string;
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (e: { target: { name?: string; value: string | number } }) => void;
  onBlur?: () => void;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      label,
      options,
      error,
      placeholder = 'Select an option',
      name,
      value: controlledValue,
      defaultValue,
      onChange,
      onBlur,
      disabled = false,
      className = '',
      id,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [internalValue, setInternalValue] = useState<string | number | undefined>(defaultValue);
    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const [focusedIndex, setFocusedIndex] = useState(-1);

    const selectId = id || label.toLowerCase().replace(/\s+/g, '-');

    // Determine the current value (controlled vs uncontrolled)
    const currentValue = controlledValue !== undefined ? controlledValue : internalValue;
    const selectedOption = options.find((opt) => String(opt.value) === String(currentValue));

    // Close on outside click
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
          setFocusedIndex(-1);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Scroll focused option into view
    useEffect(() => {
      if (isOpen && focusedIndex >= 0 && listRef.current) {
        const items = listRef.current.querySelectorAll('[role="option"]');
        items[focusedIndex]?.scrollIntoView({ block: 'nearest' });
      }
    }, [focusedIndex, isOpen]);

    const selectOption = useCallback(
      (option: SelectOption) => {
        setInternalValue(option.value);
        // Fire a synthetic change event so react-hook-form picks it up
        onChange?.({ target: { name, value: option.value } });
        setIsOpen(false);
        setFocusedIndex(-1);
        onBlur?.();
      },
      [name, onChange, onBlur]
    );

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;

      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (isOpen && focusedIndex >= 0) {
            selectOption(options[focusedIndex]);
          } else {
            setIsOpen(true);
            setFocusedIndex(options.findIndex((o) => String(o.value) === String(currentValue)));
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
            setFocusedIndex(0);
          } else {
            setFocusedIndex((prev) => Math.min(prev + 1, options.length - 1));
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (isOpen) {
            setFocusedIndex((prev) => Math.max(prev - 1, 0));
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setFocusedIndex(-1);
          break;
        case 'Tab':
          setIsOpen(false);
          setFocusedIndex(-1);
          break;
      }
    };

    return (
      <div className={`input-group ${className}`} ref={containerRef}>
        <label htmlFor={selectId} className="input-label">
          {label}
        </label>

        {/* Trigger */}
        <button
          ref={ref}
          id={selectId}
          type="button"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-labelledby={selectId}
          disabled={disabled}
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            // Delay to allow click on option to register
            setTimeout(() => {
              if (!containerRef.current?.contains(document.activeElement)) {
                setIsOpen(false);
                onBlur?.();
              }
            }, 150);
          }}
          className={`
            input-field w-full text-left flex items-center justify-between gap-2 cursor-pointer
            transition-colors duration-[var(--duration-fast)]
            ${error ? 'input-error' : ''}
            ${isOpen ? 'border-[var(--color-accent)]' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <span
            className={
              selectedOption ? 'text-[var(--color-text-heading)]' : 'text-[var(--color-text-muted)]'
            }
          >
            {selectedOption?.label || placeholder}
          </span>
          <ChevronDown
            size={16}
            className={`
              text-[var(--color-text-muted)] shrink-0
              transition-transform duration-150
              ${isOpen ? 'rotate-180' : ''}
            `}
          />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <ul
            ref={listRef}
            role="listbox"
            className="
              absolute z-50 mt-1 w-full
              border border-[var(--color-border-strong)] bg-[var(--color-bg)]
              shadow-[var(--shadow-lg)]
              max-h-60 overflow-auto
              animate-fadeIn
            "
            style={{ position: 'relative' }}
          >
            {options.map((option, index) => {
              const isSelected = String(option.value) === String(currentValue);
              const isFocused = index === focusedIndex;

              return (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setFocusedIndex(index)}
                  onClick={() => selectOption(option)}
                  className={`
                    flex items-center justify-between gap-2
                    px-[var(--space-4)] py-[var(--space-3)]
                    text-sm cursor-pointer
                    transition-colors duration-[var(--duration-fast)]
                    ${isFocused ? 'bg-[var(--color-bg-muted)]' : ''}
                    ${
                      isSelected
                        ? 'font-bold text-[var(--color-text-heading)]'
                        : 'text-[var(--color-text)] font-medium'
                    }
                  `}
                >
                  <span>{option.label}</span>
                  {isSelected && (
                    <Check size={14} className="text-[var(--color-accent)] shrink-0" />
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {error && <span className="input-error-text">{error}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';
