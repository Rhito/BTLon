import React, { forwardRef, useEffect, useMemo, useState, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  List,
  Heading2,
  ListOrdered,
  Undo,
  Redo,
  Minus,
  ChevronDown,
  Check,
} from "lucide-react";
import BoldT from "@tiptap/extension-bold";
import ItalicT from "@tiptap/extension-italic";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Underline } from "@tiptap/extension-underline";
import { TextAlign } from "@tiptap/extension-text-align";
import { Highlight } from "@tiptap/extension-highlight";
import { Link } from "@tiptap/extension-link";

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

const scrollbarClasses = "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300/50 hover:[&::-webkit-scrollbar-thumb]:bg-gray-400/80 [&::-webkit-scrollbar-thumb]:rounded-full";

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

export const MultiSelect = forwardRef(
  (
    {
      id,
      label,
      hint,
      error,
      required,
      options = [],
      placeholder = "Select options",
      className = "",
      value = [], // array of selected values
      onChange,
      disabled,
      ...rest
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const containerRef = useRef(null);
    const searchInputRef = useRef(null);

    // Focus search when dropdown opens & reset when closed
    useEffect(() => {
      if (isOpen && searchInputRef.current) {
        setTimeout(() => searchInputRef.current.focus(), 10);
      } else if (!isOpen) {
        setSearchQuery("");
      }
    }, [isOpen]);

    // Handle click outside to close dropdown
    useEffect(() => {
      const handleClickOutside = (e) => {
        if (containerRef.current && !containerRef.current.contains(e.target)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const state = error ? "error" : "default";

    const handleToggle = (optionValue) => {
      const newValue = value.includes(optionValue)
        ? value.filter((v) => v !== optionValue)
        : [...value, optionValue];
      
      onChange?.(newValue);
    };

    const filteredOptions = options.filter(opt => 
      opt.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="flex flex-col" ref={containerRef}>
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
        <div className="relative">
          {/* Custom Dropdown Trigger */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            className={`${baseClasses} ${stateClasses[state]} min-h-[40px] py-1.5 w-full flex items-center justify-between cursor-pointer text-left ${disabled ? "bg-gray-50 cursor-not-allowed" : ""} ${className}`}
          >
            <div className="flex flex-wrap gap-1.5 items-center flex-1">
              {value.length === 0 ? (
                 <span className="text-gray-400 px-1">{placeholder}</span>
              ) : (
                 <div className="flex flex-wrap gap-1.5">
                    {value.map(val => {
                       const opt = options.find(o => o.value === val);
                       if (!opt) return null;
                       return (
                         <span key={val} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-medium border border-blue-200">
                            {opt.label}
                            <div 
                              onClick={(e) => { e.stopPropagation(); handleToggle(val); }} 
                              className="hover:bg-blue-200 text-blue-500 hover:text-blue-700 rounded-full p-0.5 cursor-pointer transition-colors"
                            >
                               <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </div>
                         </span>
                       )
                    })}
                 </div>
              )}
            </div>
            <ChevronDown
              className={`h-4 w-4 text-gray-400 transition-transform duration-200 shrink-0 ml-2 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Custom Dropdown Menu */}
          {isOpen && (
            <div className="absolute z-50 mt-1 w-full rounded-lg bg-white shadow-lg border border-gray-100 py-1 text-sm ring-1 ring-black ring-opacity-5 focus:outline-none flex flex-col max-h-[300px] animate-in fade-in zoom-in-95 duration-100 origin-top">
              {/* Search Box (Sticky) */}
              <div className="p-2 border-b border-gray-100 shrink-0">
                <div className="relative">
                  <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full bg-gray-50 border border-gray-200 rounded-md py-1.5 pl-8 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* Options List */}
              <div className={`overflow-y-auto flex-1 ${scrollbarClasses}`}>
                {filteredOptions.map((opt) => {
                  const isSelected = value.includes(opt.value);
                  return (
                    <label
                      key={opt.value}
                      className={`flex items-center gap-3 cursor-pointer select-none py-2 px-3 ${
                        opt.disabled
                          ? "text-gray-300 cursor-not-allowed bg-gray-50/50"
                          : "hover:bg-gray-50 text-gray-700"
                      } transition-colors`}
                    >
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer" 
                        checked={isSelected}
                        disabled={opt.disabled}
                        onChange={() => handleToggle(opt.value)}
                      />
                      <span className={`block truncate ${isSelected ? "font-medium text-gray-900" : ""}`}>{opt.label}</span>
                    </label>
                  );
                })}
                {filteredOptions.length === 0 && (
                  <div className="py-4 px-4 text-gray-500 text-center text-sm">No results found</div>
                )}
              </div>
            </div>
          )}
        </div>
        <HelperText error={error} hint={hint} />
      </div>
    );
  },
);
MultiSelect.displayName = "MultiSelect";

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
      value,
      defaultValue,
      onChange,
      disabled,
      ...rest
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [internalValue, setInternalValue] = useState(value ?? defaultValue ?? "");
    const containerRef = useRef(null);

    // Sync external value updates
    useEffect(() => {
      if (value !== undefined) setInternalValue(value);
    }, [value]);

    // Handle click outside to close dropdown
    useEffect(() => {
      const handleClickOutside = (e) => {
        if (containerRef.current && !containerRef.current.contains(e.target)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const state = error ? "error" : "default";
    const selectedOption = options.find((o) => o.value == internalValue);

    const handleSelect = (optionValue) => {
      setInternalValue(optionValue);
      setIsOpen(false);
      
      // Trigger original onChange if provided
      if (onChange) {
        onChange({ target: { name: rest.name, id, value: optionValue } });
      }
    };

    return (
      <div className="flex flex-col" ref={containerRef}>
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
        <div className="relative">
          {/* Hidden native select to preserve form compatibility & refs */}
          <select
            ref={ref}
            id={id}
            required={required}
            value={internalValue}
            onChange={(e) => handleSelect(e.target.value)}
            disabled={disabled}
            className="sr-only"
            tabIndex={-1}
            {...rest}
          >
            {placeholder && (
              <option value="" disabled hidden>
                {placeholder}
              </option>
            )}
            {options.map(({ value, label, disabled: optDisabled }) => (
              <option key={value} value={value} disabled={optDisabled}>
                {label}
              </option>
            ))}
          </select>

          {/* Custom Dropdown Trigger */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            className={`${baseClasses} ${stateClasses[state]} h-10 w-full flex items-center justify-between cursor-pointer text-left ${
              !selectedOption ? "text-gray-400" : "text-gray-900"
            } ${disabled ? "bg-gray-50 cursor-not-allowed" : ""} ${className}`}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
          >
            <span className="block truncate">
              {selectedOption ? selectedOption.label : placeholder || "Select an option"}
            </span>
            <ChevronDown
              className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Custom Dropdown Menu */}
          {isOpen && (
            <div className={`absolute z-50 mt-1 w-full rounded-lg bg-white shadow-lg border border-gray-100 py-1 text-sm ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 overflow-auto animate-in fade-in zoom-in-95 duration-100 origin-top ${scrollbarClasses}`}>
              {options.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => !opt.disabled && handleSelect(opt.value)}
                  className={`relative cursor-pointer select-none py-2.5 pl-4 pr-10 ${
                    opt.disabled
                      ? "text-gray-300 cursor-not-allowed bg-gray-50/50"
                      : opt.value == internalValue
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  } transition-colors`}
                >
                  <span className="block truncate">{opt.label}</span>
                  {opt.value == internalValue && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                      <Check className="h-4 w-4" strokeWidth={2.5} />
                    </span>
                  )}
                </div>
              ))}
              {options.length === 0 && (
                <div className="py-2.5 px-4 text-gray-500 text-center">No options</div>
              )}
            </div>
          )}
        </div>
        <HelperText error={error} hint={hint} />
      </div>
    );
  },
);
Select.displayName = "Select";

export function TextEditor({ value, onChange, error }) {
  const extensions = useMemo(
    () => [
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      BoldT.configure({ HTMLAttributes: { class: "font-bold" } }),
      ItalicT.configure({ HTMLAttributes: { class: "italic" } }),
      TextStyle,
      Color,
      Underline,
      Highlight.configure({ HTMLAttributes: { class: "bg-yellow-200" } }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 underline cursor-pointer",
        },
      }),
    ],
    [],
  );
  const editor = useEditor({
    extensions: extensions,
    content: value ?? "",
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "outline-none min-h-[180px] p-3 text-sm text-gray-800",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;

    // tránh loop vô hạn
    if (editor.getHTML() !== (value ?? "")) {
      editor.commands.setContent(value ?? "", false);
    }
  }, [editor, value]);

  if (!editor) return null;

  const btn = (isActive, action, title) => (
    <button
      type="button" // ← tránh submit form
      title={title}
      onMouseDown={(e) => {
        e.preventDefault(); // ← giữ focus editor
        action();
      }}
      className={[
        "p-1.5 rounded transition-colors",
        isActive
          ? "bg-blue-100 text-blue-600"
          : "text-gray-500 hover:bg-gray-100 hover:text-gray-800",
      ].join(" ")}
    >
      {/* children injected via wrapper below */}
    </button>
  );

  const ToolBtn = ({ icon: Icon, isActive, action, title }) => (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        e.preventDefault();
        action();
      }}
      className={[
        "p-1.5 rounded transition-colors",
        isActive
          ? "bg-blue-100 text-blue-600"
          : "text-gray-500 hover:bg-gray-100 hover:text-gray-800",
      ].join(" ")}
    >
      <Icon className="h-4 w-4" />
    </button>
  );

  return (
    <div
      className={[
        "border rounded-md overflow-hidden bg-white",
        error ? "border-red-500 ring-1 ring-red-500" : "border-gray-300",
        "focus-within:border-blue-100 focus-within:ring-1 focus-within:ring-blue-500",
        "transition-colors",
      ].join(" ")}
    >
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 flex-wrap px-2 py-1.5 border-b border-gray-200 bg-gray-50">
        <ToolBtn
          icon={Bold}
          isActive={editor.isActive("bold")}
          action={() => editor.chain().focus().toggleBold().run()}
          title="Bold"
        />
        <ToolBtn
          icon={Italic}
          isActive={editor.isActive("italic")}
          action={() => editor.chain().focus().toggleItalic().run()}
          title="Italic"
        />

        <div className="w-px h-4 bg-gray-200 mx-1" />

        <ToolBtn
          icon={Heading2}
          isActive={editor.isActive("heading", { level: 2 })}
          action={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          title="Heading 2"
        />

        <div className="w-px h-4 bg-gray-200 mx-1" />

        <ToolBtn
          icon={List}
          isActive={editor.isActive("bulletList")}
          action={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet list"
        />
        <ToolBtn
          icon={ListOrdered}
          isActive={editor.isActive("orderedList")}
          action={() => editor.chain().focus().toggleOrderedList().run()}
          title="Ordered list"
        />

        <div className="w-px h-4 bg-gray-200 mx-1" />

        <ToolBtn
          icon={Minus}
          isActive={false}
          action={() => editor.chain().focus().setHorizontalRule().run()}
          title="Divider"
        />

        <div className="flex-1" />

        <ToolBtn
          icon={Undo}
          isActive={false}
          action={() => editor.chain().focus().undo().run()}
          title="Undo"
        />
        <ToolBtn
          icon={Redo}
          isActive={false}
          action={() => editor.chain().focus().redo().run()}
          title="Redo"
        />
      </div>

      {/* Editor content */}
      <EditorContent
        editor={editor}
        className="
          [&_.ProseMirror]:outline-none
          [&_.ProseMirror]:min-h-[180px]
          [&_.ProseMirror]:p-3
          [&_.ProseMirror]:text-sm
          [&_.ProseMirror]:text-gray-800
          [&_.ProseMirror]:leading-relaxed
          [&_.ProseMirror_h2]:text-base
          [&_.ProseMirror_h2]:font-semibold
          [&_.ProseMirror_h2]:text-gray-900
          [&_.ProseMirror_h2]:mt-3
          [&_.ProseMirror_h2]:mb-1
          [&_.ProseMirror_p]:mb-2
          [&_.ProseMirror_p:last-child]:mb-0
          [&_.ProseMirror_ul]:list-disc
          [&_.ProseMirror_ul]:pl-5
          [&_.ProseMirror_ul]:mb-2
          [&_.ProseMirror_ol]:list-decimal
          [&_.ProseMirror_ol]:pl-5
          [&_.ProseMirror_ol]:mb-2
          [&_.ProseMirror_li]:mb-0.5
          [&_.ProseMirror_strong]:font-semibold
          [&_.ProseMirror_em]:italic
          [&_.ProseMirror_hr]:border-gray-200
          [&_.ProseMirror_hr]:my-3
          [&_.ProseMirror_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]
          [&_.ProseMirror_.is-editor-empty:first-child::before]:text-gray-400
          [&_.ProseMirror_.is-editor-empty:first-child::before]:pointer-events-none
          [&_.ProseMirror_.is-editor-empty:first-child::before]:float-left
          [&_.ProseMirror_.is-editor-empty:first-child::before]:h-0
        "
      />
    </div>
  );
}

TextEditor.displayName = "TextEditor";
