import { useRef, useState } from "react";
import { Upload, Star, Trash2, X } from "lucide-react";

// Existing image from server
function ExistingImage({ img, onSetMain, onDelete }) {
  const src = img.thumbnail_url ?? null;
  return (
    <div
      className={[
        "relative group rounded-lg overflow-hidden border-2 transition-colors",
        img.is_main
          ? "border-blue-500"
          : "border-gray-200 hover:border-gray-300",
      ].join(" ")}
    >
      <img src={src} alt="" className="w-full aspect-square object-cover" />

      {img.is_main && (
        <span className="absolute top-1 left-1 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
          Main
        </span>
      )}

      <div
        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity
        flex items-center justify-center gap-2"
      >
        {!img.is_main && (
          <button
            onClick={() => onSetMain(img.id)}
            className="p-1.5 rounded-full bg-white/90 text-yellow-500 hover:bg-white"
            title="Set as main"
          >
            <Star className="h-3.5 w-3.5" />
          </button>
        )}
        <button
          onClick={() => onDelete(img.id)}
          className="p-1.5 rounded-full bg-white/90 text-red-500 hover:bg-white"
          title="Delete"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

// New image preview (not yet uploaded)
function NewImagePreview({ preview, index, isMain, onSetMain, onRemove }) {
  return (
    <div
      className={[
        "relative group rounded-lg overflow-hidden border-2 transition-colors",
        isMain
          ? "border-blue-500"
          : "border-dashed border-gray-300 hover:border-gray-400",
      ].join(" ")}
    >
      <img
        src={preview.url}
        alt=""
        className="w-full aspect-square object-cover"
      />

      {isMain && (
        <span className="absolute top-1 left-1 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
          Main
        </span>
      )}

      <div
        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity
        flex items-center justify-center gap-2"
      >
        {!isMain && (
          <button
            onClick={() => onSetMain(index)}
            className="p-1.5 rounded-full bg-white/90 text-yellow-500 hover:bg-white"
            title="Set as main"
          >
            <Star className="h-3.5 w-3.5" />
          </button>
        )}
        <button
          onClick={() => onRemove(index)}
          className="p-1.5 rounded-full bg-white/90 text-red-500 hover:bg-white"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

/**
 * @param {array}    existingImages  — images from server [{id, img_url, thumbnail_url, is_main}]
 * @param {function} onDeleteExisting(imageId)
 * @param {function} onSetMainExisting(imageId)
 * @param {array}    newPreviews     — [{file, url}]
 * @param {number}   mainNewIndex    — index of main among new previews
 * @param {function} onFilesAdded(files)
 * @param {function} onRemoveNew(index)
 * @param {function} onSetMainNew(index)
 */
export default function ImageManager({
  existingImages = [],
  onDeleteExisting,
  onSetMainExisting,
  newPreviews = [],
  mainNewIndex = 0,
  onFilesAdded,
  onRemoveNew,
  onSetMainNew,
}) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = (files) => {
    const valid = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (valid.length) onFilesAdded(valid);
  };

  const hasMain = existingImages.some((i) => i.is_main);
  const total = existingImages.length + newPreviews.length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Images</label>
        <span className="text-xs text-gray-400">{total} / 10</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {/* Existing */}
        {existingImages.map((img) => (
          <ExistingImage
            key={img.id}
            img={img}
            onSetMain={onSetMainExisting}
            onDelete={onDeleteExisting}
          />
        ))}

        {/* New previews */}
        {newPreviews.map((p, i) => (
          <NewImagePreview
            key={i}
            index={i}
            preview={p}
            isMain={!hasMain && i === mainNewIndex}
            onSetMain={onSetMainNew}
            onRemove={onRemoveNew}
          />
        ))}

        {/* Upload zone */}
        {total < 10 && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              handleFiles(e.dataTransfer.files);
            }}
            className={[
              "aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-1",
              "text-gray-400 hover:text-blue-500 hover:border-blue-400 transition-colors",
              dragging
                ? "border-blue-400 bg-blue-50 text-blue-500"
                : "border-gray-200",
            ].join(" ")}
          >
            <Upload className="h-5 w-5" />
            <span className="text-xs">Upload</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <p className="text-xs text-gray-400">
        JPG, PNG, WebP · Max 5MB each · First image becomes main if none
        selected
      </p>
    </div>
  );
}
