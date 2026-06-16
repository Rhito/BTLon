import React, { forwardRef, useEffect, useMemo } from "react";
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
