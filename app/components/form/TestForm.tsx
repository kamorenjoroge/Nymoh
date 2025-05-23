"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface TestFormProps {
  id?: string;
  initialData?: { name: string };
  onClose: () => void;
  onSuccess?: () => void;
}

const TestForm: React.FC<TestFormProps> = ({ id, initialData, onClose, onSuccess }) => {
  const [name, setName] = useState(initialData?.name || "");
  const [loading, setLoading] = useState(false);
  const isUpdateMode = Boolean(id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isUpdateMode) {
        await axios.put(`/api/test/${id}`, { name });
        toast.success("Data updated successfully");
      } else {
        await axios.post("/api/test", { name });
        toast.success("Data inserted successfully");
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error("Something went wrong");
      console.error("Submit error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={loading}
        >
          {isUpdateMode ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
};

export default TestForm;
