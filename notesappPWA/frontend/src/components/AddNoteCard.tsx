import { useState } from "react";
import TagSelector from "./TagSelector";
import type { Tag } from "../services/tagService";

type Props = {
  onSave: (note: { title: string; content: string; tags?: number[] }) => void;
};

export default function AddNoteCard({ onSave }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const handleSubmit = () => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    // Require both title and content
    if (!trimmedTitle || !trimmedContent) return;

    onSave({
      title: trimmedTitle,
      content: trimmedContent,
      tags: selectedTags.map((tag) => tag.id),
    });
    setTitle("");
    setContent("");
    setSelectedTags([]);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitle("");
    setContent("");
    setIsEditing(false);
  };

  return (
    <div className="mb-6">
      {isEditing ? (
        <div className="bg-white p-4 rounded shadow-md w-full max-w-sm relative">
          <input
            className="w-full text-xl font-bold border-b mb-2 focus:outline-none"
            placeholder="Título..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />{" "}
          <textarea
            className="w-full text-sm border rounded p-2 focus:outline-none mb-4"
            placeholder="Contenido..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
          />
          <div className="mb-4">
            <TagSelector
              noteId={0}
              currentTags={selectedTags}
              onTagsChange={(tags) => setSelectedTags(tags)}
              isNewNote={true}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              disabled={!title.trim() && !content.trim()}
            >
              Guardar
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-3 p-4 bg-pink-500 rounded-lg text-white font-semibold hover:brightness-110"
        >
          <div className="w-16 h-16 bg-pink-600 rounded-xl"></div>+ Add note
        </button>
      )}
    </div>
  );
}
