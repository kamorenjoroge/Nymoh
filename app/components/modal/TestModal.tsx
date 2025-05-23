
"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import toast from "react-hot-toast";
import { FiEye, FiEdit2, FiTrash2, FiPlus, FiX } from "react-icons/fi";

// Dynamically import form and view components
const TestForm = dynamic(() => import("../form/TestForm"), {
  loading: () => <p>Loading form...</p>,
});
const TestView = dynamic(() => import("../modal/TestView"), {
  loading: () => <p>Loading details...</p>,
});

type TestActionType = "view" | "create" | "update" | "delete";

type TestData = {
  name: string;
};

type TestModalProps = {
  type: TestActionType;
  data?: TestData;
  id?: string | number;
  onSuccess?: () => void;
};

const iconMap = {
  view: <FiEye size={18} />,
  create: <FiPlus size={18} />,
  update: <FiEdit2 size={18} />,
  delete: <FiTrash2 size={18} />,
};

const colorMap = {
  view: "bg-blue-500",
  create: "bg-green-600",
  update: "bg-yellow-600",
  delete: "bg-red-600",
};

const TestModal: React.FC<TestModalProps> = ({ type, data, id, onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const res = await fetch(`/api/test/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Test deleted successfully");
        onSuccess?.();
        setOpen(false);
      } else {
        const result = await res.json();
        alert("Delete failed: " + result.error);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert("Error: " + err.message);
      } else {
        alert("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    switch (type) {
      case "view":
        return <TestView id={id as string} />;
      case "create":
      case "update":
        return (
          <TestForm
            id={type === "update" ? (id as string) : undefined}
            initialData={data}
            onClose={() => setOpen(false)}
            onSuccess={() => {
              setOpen(false);
              onSuccess?.();
            }}
          />
        );
      case "delete":
        return (
          <div className="text-center flex flex-col items-center gap-4">
            <p className="font-medium">
              Are you sure you want to delete this test?
            </p>
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-opacity-80"
            >
              {isLoading ? "Deleting..." : "Yes, Delete"}
            </button>
          </div>
        );
      default:
        return <p>Invalid action</p>;
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`p-2 rounded-full text-white ${colorMap[type]} hover:opacity-80`}
      >
        {iconMap[type]}
      </button>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center z-50  bg-opacity-90">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[95%] sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] max-h-[95vh] overflow-y-auto relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-dark hover:text-red-500"
            >
              <FiX size={22} />
            </button>
            {renderContent()}
          </div>
        </div>
      )}
    </>
  );
};

export default TestModal;
