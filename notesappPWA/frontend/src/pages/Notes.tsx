import { useEffect, useState } from "react";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  archiveNote,
  syncPendingChanges,
} from "../services/noteService";
import { getTags } from "../services/tagService";
import AddNoteCard from "../components/AddNoteCard";
import NoteCard from "../components/NoteCard";
import { useOfflineSync } from "../hooks/useOfflineSync";

import type { Tag } from "../services/tagService";

type Note = {
  id: number;
  title: string;
  content: string;
  archived: boolean;
  tags?: Tag[];
};

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const isOnline = useOfflineSync();

  useEffect(() => {
    getNotes().then(setNotes).catch(console.error);
    getTags().then(setTags).catch(console.error);

    // Sincronizar cambios pendientes si estamos online
    if (isOnline) {
      syncPendingChanges()
        .then((updatedNotes) => {
          if (updatedNotes) setNotes(updatedNotes);
        })
        .catch(console.error);
    }
  }, []);
  const handleCreateNote = async (data: {
    title: string;
    content: string;
    tags?: number[];
  }) => {
    try {
      await createNote(data);
      // Recargar todas las notas para obtener la nueva nota con sus etiquetas
      getNotes().then(setNotes).catch(console.error);
    } catch (error) {
      console.error("Error creando nota:", error);
    }
  };

  const handleUpdateNote = async (
    id: number,
    data: { title: string; content: string }
  ) => {
    try {
      const updated = await updateNote(id, data);
      setNotes((prev) =>
        prev.map((note) => (note.id === id ? { ...note, ...updated } : note))
      );
    } catch (error) {
      console.error("Error actualizando nota:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter((note) => note.id !== id));
    } catch (error) {
      console.error("Error eliminando nota:", error);
    }
  };

  const handleArchive = async (id: number) => {
    try {
      const updated = await archiveNote(id);
      setNotes((prev) =>
        prev.map((note) => (note.id === id ? { ...note, ...updated } : note))
      );
    } catch (error) {
      console.error("Error archivando nota:", error);
    }
  };
  // Filtramos las notas no archivadas y por etiquetas seleccionadas
  const activeNotes = notes.filter((note) => {
    if (note.archived) return false;
    if (selectedTags.length === 0) return true;
    return note.tags?.some((tag) => selectedTags.includes(tag.id)) ?? false;
  });

  const handleTagsChange = () => {
    // Recargar las notas para obtener las etiquetas actualizadas
    getNotes().then(setNotes).catch(console.error);
  };

  const handleTagFilter = (tagId: number) => {
    setSelectedTags((prev) => {
      if (prev.includes(tagId)) {
        return prev.filter((id) => id !== tagId);
      }
      return [...prev, tagId];
    });
  };

  return (
    <div className="pt-24 px-6">
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => handleTagFilter(tag.id)}
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                selectedTags.includes(tag.id)
                  ? "text-white"
                  : "text-gray-700 border border-gray-300 hover:bg-gray-100"
              }`}
              style={{
                backgroundColor: selectedTags.includes(tag.id)
                  ? tag.color
                  : "transparent",
              }}
            >
              <span>{tag.name}</span>
              {selectedTags.includes(tag.id) && (
                <span className="text-white">&times;</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <AddNoteCard onSave={handleCreateNote} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {activeNotes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onDelete={handleDelete}
            onArchive={handleArchive}
            onSave={handleUpdateNote}
            onTagsChange={handleTagsChange}
          />
        ))}
      </div>
    </div>
  );
}
