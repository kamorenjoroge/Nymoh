"use client";

import Image from "next/image";
import { useState, useRef, ChangeEvent, FormEvent, useEffect } from "react";
import axios from "axios";
import { FiUpload, FiX, FiSave,  } from "react-icons/fi";
import toast from "react-hot-toast";

interface ProductData {
  name: string;
  price: string;
  quantity: number;
  details: string;
  color: string;
  images?: string[];
}

interface ProductFormProps {
  type: "create" | "update";
  productData?: ProductData;
  productId?: string;
  onSuccess?: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  type = "create",
  productData,
  productId,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<ProductData>({
    name: "",
    price: "",
    quantity: 1,
    details: "",
    color: "#000000",
    images: [],
  });

  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (type === "update" && productData) {
      setFormData({
        name: productData.name,
        price: productData.price,
        quantity: productData.quantity,
        details: productData.details,
        color: productData.color,
      });

      if (productData.images) {
        setExistingImages(productData.images);
      }
    }
  }, [type, productData]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    if (files.length + images.length > 4) {
      setError("Maximum 4 images allowed");
      return;
    }

    setError("");
    setImages([...images, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    const newPreviews = [...previews];
    URL.revokeObjectURL(previews[index]);
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setImages(newImages);
    setPreviews(newPreviews);
  };

  const removeExistingImage = (index: number) => {
    const newExistingImages = [...existingImages];
    newExistingImages.splice(index, 1);
    setExistingImages(newExistingImages);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (images.length === 0 && existingImages.length === 0) {
      setError("At least one image is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formDataToSend = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key !== "images") {
          formDataToSend.append(key, String(formData[key as keyof ProductData]));
        }
      });

      images.forEach((image) => {
        formDataToSend.append("images", image);
      });

      existingImages.forEach((image) => {
        formDataToSend.append("existingImages", image);
      });

      const url =
        type === "create" ? "/api/products" : `/api/products/${productId}`;
      const method = type === "create" ? "post" : "put";

      const response = await axios[method](url, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success(
          `Product ${type === "create" ? "added" : "updated"} successfully`
        );

        if (onSuccess) onSuccess();

        if (type === "create") {
          resetForm();
        }
      } else {
        throw new Error(response.data.error || `Failed to ${type} product`);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.error || err.message || `Failed to ${type} product`
        );
      } else if (err instanceof Error) {
        setError(err.message || `Failed to ${type} product`);
      } else {
        setError(`Failed to ${type} product`);
      }
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      quantity: 1,
      details: "",
      color: "#000000",
      images: [],
    });
    setImages([]);
    setExistingImages([]);
    previews.forEach((preview) => URL.revokeObjectURL(preview));
    setPreviews([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">
        {type === "create" ? "Add New Product" : "Update Product"}
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (Kes) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={loading}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color
            </label>
            <input
              type="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="w-full h-10"
              disabled={loading}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Details
          </label>
          <textarea
            name="details"
            value={formData.details}
            onChange={handleChange}
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={loading}
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Images (Max 4)
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
            disabled={loading}
          />
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
          >
            <FiUpload /> Upload
          </button>

          <div className="flex flex-wrap gap-4 mt-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative">
                <Image
                  src={preview}
                  alt="Preview"
                  width={100}
                  height={100}
                  className="rounded"
                />
                <button
                  type="button"
                  className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                  onClick={() => removeImage(index)}
                >
                  <FiX />
                </button>
              </div>
            ))}

            {existingImages.map((image, index) => (
              <div key={`existing-${index}`} className="relative">
                <Image
                  src={image}
                  alt="Existing"
                  width={100}
                  height={100}
                  className="rounded"
                />
                <button
                  type="button"
                  className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                  onClick={() => removeExistingImage(index)}
                >
                  <FiX />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            disabled={loading}
          >
            <FiSave />
            {loading
              ? "Saving..."
              : type === "create"
              ? "Add Product"
              : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
