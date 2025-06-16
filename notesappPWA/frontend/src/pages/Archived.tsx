import { useEffect, useState } from "react";
import {
  getNotes,
  updateNote,
  deleteNote,
  unarchiveNote,
} from "../services/noteService";
import NoteCard from "../components/NoteCard";

type Note = {
  id: number;
  title: string;
  content: string;
  archived: boolean;
};

export default function Archived() {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    getNotes().then(setNotes).catch(console.error);
  }, []);

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

  const handleUnarchive = async (id: number) => {
    try {
      const updated = await unarchiveNote(id);
      setNotes((prev) =>
        prev.map((note) => (note.id === id ? { ...note, ...updated } : note))
      );
    } catch (error) {
      console.error("Error desarchivando nota:", error);
    }
  };

  // Filtramos las notas archivadas una sola vez antes del renderizado
  const archivedNotes = notes.filter((note) => note.archived);

  return (
    <div className="pt-24 px-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Notas Archivadas
      </h2>
      {archivedNotes.length === 0 ? (
        <p className="text-gray-600 text-center">No hay notas archivadas</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {archivedNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onDelete={handleDelete}
              onArchive={handleUnarchive}
              onSave={handleUpdateNote}
            />
          ))}
        </div>
      )}
    </div>
  );
}
