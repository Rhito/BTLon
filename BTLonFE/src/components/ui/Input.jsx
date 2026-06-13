import React, { forwardRef } from "react";

// shared class strings

const baseClasses = [
  "w-full rounded-md border bg-white px-3 text-sm text-gray-900",
  "placeholder:text-gray-400",
  "transition-colors duration-150",
  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
  "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400",
].join(" ");

const stateClasses = {
  default: "border-gray-300",
  error: "border-red-500 focus:ring-red-500 focus:border-red-500",
};

// Label + Helper / Error text
const Label = ({ htmlFor, required, children }) =>
  children ? (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  ) : null;

const HelperText = ({ error, hint }) => {
  if (error) return <p className="mt-1 text-xs text-red-500">{error}</p>;
  if (hint) return <p className="mt-1 text-xs text-gray-400">{hint}</p>;
  return null;
};

const InputWrapper = ({ leftIcon, rightIcon, children }) => (
  <div className="relative flex items-center">
    {leftIcon && (
      <span className="absolute left-3 text-gray-400 pointer-events-none">
        {leftIcon}
      </span>
    )}
    {React.cloneElement(children, {
      className: [
        children.props.className,
        leftIcon ? "pl-9" : "",
        rightIcon ? "pr-9" : "",
      ]
        .filter(Boolean)
        .join(" "),
    })}
    {rightIcon && (
      <span className="absolute right-3 text-gray-400 pointer-events-none">
        {rightIcon}
      </span>
    )}
  </div>
);

export const Input = forwardRef(
  (
    {
      id,
      type = "text",
      label,
      hint,
      error,
      required,
      leftIcon,
      rightIcon,
      className = "",
      ...rest
    },
    ref,
  ) => {
    const state = error ? "error" : "default";

    const inputEl = (
      <input
        ref={ref}
        id={id}
        type={type}
        required={required}
        className={`${baseClasses} ${stateClasses[state]} h-10 ${className}`}
        {...rest}
      />
    );

    return (
      <div className="flex flex-col">
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
        {leftIcon || rightIcon ? (
          <InputWrapper leftIcon={leftIcon} rightIcon={rightIcon}>
            {inputEl}
          </InputWrapper>
        ) : (
          inputEl
        )}
        <HelperText error={error} hint={hint} />
      </div>
    );
  },
);

Input.displayName = "Input";

export const Textarea = forwardRef(
  (
    { id, label, hint, error, required, rows = 4, className = "", ...rest },
    ref,
  ) => {
    const state = error ? "error" : "default";

    return (
      <div className="flex flex-col">
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
        <textarea
          ref={ref}
          id={id}
          rows={rows}
          required={required}
          className={`${baseClasses} ${stateClasses[state]} py-2 resize-y ${className}`}
          {...rest}
        />
        <HelperText error={error} hint={hint} />
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export const Select = forwardRef(
  (
    {
      id,
      label,
      hint,
      error,
      required,
      options = [],
      placeholder,
      className = "",
      ...rest
    },
    ref,
  ) => {
    const state = error ? "error" : "default";

    return (
      <div className="flex flex-col">
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
        <div className="relative">
          <select
            ref={ref}
            id={id}
            required={required}
            className={`${baseClasses} ${stateClasses[state]} h-10 pr-9 appearance-none cursor-pointer ${className}`}
            {...rest}
          >
            {placeholder && (
              <option value="" disabled hidden>
                {placeholder}
              </option>
            )}
            {options.map(({ value, label, disabled }) => (
              <option key={value} value={value} disabled={disabled}>
                {label}
              </option>
            ))}
          </select>
          {/* Chevron icon */}
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </div>
        <HelperText error={error} hint={hint} />
      </div>
    );
  },
);

Select.displayName = "Select";
