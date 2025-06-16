import { useEffect, useState } from "react";
import { getTags, createTag, deleteTag } from "../services/tagService";
import type { Tag } from "../services/tagService";
import {
  deleteNote,
  updateNote,
  archiveNote,
  unarchiveNote,
} from "../services/noteService";
import NoteCard from "../components/NoteCard";
import CreateTagDialog from "../components/CreateTagDialog";

export default function Tags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = () => {
    getTags().then(setTags).catch(console.error);
  };

  const handleCreateTag = async (tagData: { name: string; color: string }) => {
    try {
      await createTag(tagData);
      loadTags();
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Error creando etiqueta:", error);
    }
  };

  const handleDeleteTag = async (id: number) => {
    try {
      await deleteTag(id);
      setTags((prev) => prev.filter((tag) => tag.id !== id));
    } catch (error) {
      console.error("Error eliminando etiqueta:", error);
    }
  };

  return (
    <div className="pt-24 px-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Tags</h2>
        <button
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600"
        >
          Nueva Etiqueta
        </button>
      </div>{" "}
      {tags.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-600 mb-4">No hay etiquetas creadas</p>
          <p className="text-sm text-gray-500">
            Crea etiquetas para organizar tus notas y visualizarlas por
            categorías
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {tags.map((tag) => {
            const activeNotes =
              tag.notes?.filter((note) => !note.archived) || [];

            if (activeNotes.length === 0) return null;

            return (
              <div
                key={tag.id}
                className="space-y-4 bg-white rounded-lg p-6 shadow-sm"
              >
                <div className="flex items-center gap-2 border-b pb-4">
                  <div
                    className="w-6 h-6 rounded-full flex-shrink-0"
                    style={{ backgroundColor: tag.color }}
                  />
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold truncate">
                        {tag.name}
                      </h3>
                      <span className="text-sm text-gray-500 flex-shrink-0">
                        ({activeNotes.length}{" "}
                        {activeNotes.length === 1 ? "nota" : "notas"})
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteTag(tag.id)}
                    className="ml-auto text-red-500 hover:text-red-700 flex-shrink-0 p-2"
                    aria-label="Eliminar etiqueta"
                  >
                    🗑️
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {activeNotes.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onDelete={async (id) => {
                        try {
                          await deleteNote(id);
                          loadTags(); // Recargar para actualizar la vista
                        } catch (error) {
                          console.error("Error deleting note:", error);
                        }
                      }}
                      onArchive={async (id) => {
                        try {
                          if (note.archived) {
                            await unarchiveNote(id);
                          } else {
                            await archiveNote(id);
                          }
                          loadTags(); // Recargar para actualizar la vista
                        } catch (error) {
                          console.error(
                            "Error archiving/unarchiving note:",
                            error
                          );
                        }
                      }}
                      onSave={async (id, data) => {
                        try {
                          await updateNote(id, data);
                          loadTags(); // Recargar para actualizar la vista
                        } catch (error) {
                          console.error("Error updating note:", error);
                        }
                      }}
                      onTagsChange={loadTags} // Recargar cuando cambian las etiquetas
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {isCreateDialogOpen && (
        <CreateTagDialog
          onClose={() => setIsCreateDialogOpen(false)}
          onSave={handleCreateTag}
        />
      )}
    </div>
  );
}
