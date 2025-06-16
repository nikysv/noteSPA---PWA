import { useState } from "react";

type Props = {
  onClose: () => void;
  onSave: (data: { name: string; color: string }) => void;
};

export default function CreateTagDialog({ onClose, onSave }: Props) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#ff4081");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave({ name: name.trim(), color });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">Nueva Etiqueta</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-pink-500 focus:outline-none"
              placeholder="Nombre de la etiqueta"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Color
            </label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="mt-1 block w-full h-10 rounded-md border border-gray-300"
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
