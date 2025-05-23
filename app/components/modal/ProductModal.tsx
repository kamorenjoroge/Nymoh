"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import toast from "react-hot-toast";
import { FiEye, FiEdit2, FiTrash2, FiPlus, FiX } from "react-icons/fi";

// Dynamically import form and view components
const ProductForm = dynamic(() => import("../form/ProductForm"), {
  loading: () => <p>Loading form...</p>,
});
const ProductView = dynamic(() => import("../modal/ProductView"), {
  loading: () => <p>Loading details...</p>,
});

type ProductActionType = "view" | "create" | "update" | "delete";

type ProductData = {
  name: string;
  price: number;
  description: string;
  quantity: number;
  color: string;
  images: string[];
  _id?: string;
};

type ProductModalProps = {
  type: ProductActionType;
  data?: ProductData;
  id?: string;
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

const ProductModal: React.FC<ProductModalProps> = ({ type, data, id, onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Product deleted successfully");
        onSuccess?.();
        setOpen(false);
      } else {
        const result = await res.json();
        toast.error("Delete failed: " + (result.error || "Unknown error"));
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error("Error: " + err.message);
      } else {
        toast.error("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    switch (type) {
      case "view":
        return id ? <ProductView id={id} /> : <p>No product ID provided</p>;
      case "create":
        return (
          <ProductForm
            type="create"
            productData={data ? {
              name: data.name,
              price: data.price.toString(),
              quantity: data.quantity,
              details: data.description,
              color: data.color,
              images: data.images
            } : undefined}
            onSuccess={() => {
              setOpen(false);
              onSuccess?.();
            }}
          />
        );
      case "update":
        return id ? (
          <ProductForm
            type="update"
            productId={id}
            productData={data ? {
              name: data.name,
              price: data.price.toString(),
              quantity: data.quantity,
              details: data.description,
              color: data.color,
              images: data.images
            } : undefined}
            onSuccess={() => {
              setOpen(false);
              onSuccess?.();
            }}
          />
        ) : (
          <p>No product ID provided for update</p>
        );
      case "delete":
        return (
          <div className="text-center flex flex-col items-center gap-4">
            <p className="font-medium">
              Are you sure you want to delete this product?
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
        aria-label={type}
      >
        {iconMap[type]}
      </button>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center z-50  bg-opacity-60">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[95%] sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] max-h-[95vh] overflow-y-auto relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-dark hover:text-red-500"
              aria-label="Close modal"
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

export default ProductModal;