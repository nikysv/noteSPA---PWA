import { useState, useEffect } from "react";
import TagSelector from "./TagSelector";
import type { Tag } from "../services/tagService";

type Note = {
  id: number;
  title: string;
  content: string;
  archived: boolean;
  tags?: Tag[];
};

type Props = {
  note: Note;
  onDelete?: (id: number) => void;
  onArchive?: (id: number) => void;
  onSave?: (id: number, data: { title: string; content: string }) => void;
  onTagsChange?: () => void;
};

export default function NoteCard({
  note,
  onDelete,
  onArchive,
  onSave,
  onTagsChange,
}: Props) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [changed, setChanged] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setChanged(title !== note.title || content !== note.content);
  }, [title, content, note]);

  const handleSave = () => {
    if (onSave && changed) {
      onSave(note.id, { title, content });
      setChanged(false);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setTitle(note.title);
    setContent(note.content);
    setChanged(false);
    setIsEditing(false);
  };

  return (
    <div className="bg-white border rounded p-4 shadow relative">
      {" "}
      <div className="absolute top-2 right-2 flex gap-2">
        {/* Selector de etiquetas */}
        <div className="flex items-center gap-1">
          {" "}
          <TagSelector
            noteId={note.id}
            currentTags={note.tags || []}
            onTagsChange={onTagsChange || (() => {})}
          />
          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
            {note.tags?.length || 0}
          </span>
        </div>
        {/* Botón de editar */}
        <button
          title="Editar"
          onClick={() => setIsEditing(true)}
          className="text-blue-600 hover:text-blue-800"
        >
          ✏️
        </button>
        {/* Botón de archivar */}
        {onArchive && (
          <button
            title={note.archived ? "Desarchivar" : "Archivar"}
            onClick={() => onArchive(note.id)}
            className="text-blue-600 hover:text-blue-800"
          >
            📥
          </button>
        )}
        {/* Botón de eliminar */}
        {onDelete && (
          <button
            title="Eliminar"
            onClick={() => onDelete(note.id)}
            className="text-red-500 hover:text-red-700"
          >
            🗑️
          </button>
        )}
      </div>
      {/* Etiquetas de la nota */}
      {note.tags && note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2 mt-6">
          {note.tags.map((tag) => (
            <span
              key={tag.id}
              className="px-2 py-1 rounded-full text-xs"
              style={{
                backgroundColor: tag.color,
                color: isLightColor(tag.color) ? "#000" : "#fff",
              }}
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}
      {isEditing ? (
        <>
          {/* Título editable */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-lg font-bold mb-2 border-b focus:outline-none focus:border-blue-500"
            placeholder="Título..."
          />

          {/* Contenido editable */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full text-gray-800 border rounded p-2 focus:outline-none focus:border-blue-500"
            placeholder="Contenido..."
          />

          {/* Botones de acción */}
          <div className="mt-2 flex justify-end gap-2">
            <button
              onClick={handleCancel}
              className="px-3 py-1 text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={!changed}
              className="bg-green-500 text-white font-semibold px-4 py-1 rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Guardar
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Vista de solo lectura */}
          <h3 className="text-lg font-bold mb-2 mt-6">{title}</h3>
          <p className="text-gray-800 whitespace-pre-wrap">{content}</p>
        </>
      )}
    </div>
  );
}

// Función auxiliar para determinar si un color es claro u oscuro
function isLightColor(color: string) {
  const hex = color.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128;
}
