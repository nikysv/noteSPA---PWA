import { useEffect, useState } from "react";
import {
  getTags,
  createTag,
  addTagToNote,
  removeTagFromNote,
  type Tag,
} from "../services/tagService";

type Props = {
  noteId: number;
  currentTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  isNewNote?: boolean;
};

export default function TagSelector({
  noteId,
  currentTags,
  onTagsChange,
  isNewNote = false,
}: Props) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#ff0000");

  useEffect(() => {
    getTags().then(setTags).catch(console.error);
  }, []);

  const handleTagClick = async (tag: Tag) => {
    try {
      const isTagged = currentTags.some((t) => t.id === tag.id);
      const newTags = isTagged
        ? currentTags.filter((t) => t.id !== tag.id)
        : [...currentTags, tag];

      if (!isNewNote) {
        if (isTagged) {
          await removeTagFromNote(noteId, tag.id);
        } else {
          await addTagToNote(noteId, tag.id);
        }
      }

      onTagsChange(newTags);
    } catch (error) {
      console.error("Error modificando etiquetas:", error);
    }
  };

  const handleCreateTag = async () => {
    try {
      if (!newTagName.trim()) return;

      const newTag = await createTag({
        name: newTagName.trim(),
        color: newTagColor,
      });

      setTags((prev) => [...prev, newTag]);
      setNewTagName("");
      setNewTagColor("#ff0000");
      setIsCreating(false);

      // Seleccionar automáticamente la nueva etiqueta
      handleTagClick(newTag);
    } catch (error) {
      console.error("Error creando etiqueta:", error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-600 hover:text-gray-800 text-lg"
        title="Gestionar etiquetas"
      >
        🏷️
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-50 border">
          <div className="py-2">
            <div className="px-4 py-2 border-b">
              <h3 className="text-sm font-semibold text-gray-700">
                Gestionar etiquetas
              </h3>
            </div>

            {isCreating ? (
              <div className="p-4">
                <input
                  type="text"
                  placeholder="Nombre de la etiqueta"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  className="w-full px-3 py-2 border rounded mb-2 text-sm focus:outline-none focus:border-blue-500"
                  autoFocus
                />
                <div className="flex gap-2 items-center mb-3">
                  <label className="text-sm text-gray-600">Color:</label>
                  <input
                    type="color"
                    value={newTagColor}
                    onChange={(e) => setNewTagColor(e.target.value)}
                    className="rounded cursor-pointer"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsCreating(false)}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleCreateTag}
                    disabled={!newTagName.trim()}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                  >
                    Crear
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setIsCreating(true)}
                  className="w-full text-left px-4 py-2 text-sm text-blue-500 hover:bg-blue-50 flex items-center gap-2"
                >
                  <span className="font-bold">+</span> Nueva etiqueta
                </button>

                <div className="border-t my-2"></div>

                {tags.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-gray-500 text-center">
                    No hay etiquetas creadas
                  </div>
                ) : (
                  <div className="max-h-48 overflow-y-auto">
                    {tags.map((tag) => {
                      const isSelected = currentTags.some(
                        (t) => t.id === tag.id
                      );
                      return (
                        <button
                          key={tag.id}
                          onClick={() => handleTagClick(tag)}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 ${
                            isSelected ? "font-semibold" : ""
                          }`}
                        >
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: tag.color }}
                          />
                          {tag.name}
                          {isSelected && <span className="ml-auto">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
