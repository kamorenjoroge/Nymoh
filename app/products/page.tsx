"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Table from "../components/Tables";
import Image from "next/image";
import ProductModal from "../components/modal/ProductModal";

interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  details: string;
  color: string;
  images: string[];
  status: "active" | "inactive" | "out-of-stock";
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const Page = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("/api/products");
      setProducts(response.data.data || response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const columns = [
    {
      header: "Product",
      accessor: "name" as keyof Product,
      className: "min-w-[200px]",
    },
    {
      header: "Image",
      accessor: "images" as keyof Product,
      className: "hidden sm:table-cell min-w-[100px]",
    },
    {
      header: "Price",
      accessor: "price" as keyof Product,
      className: "text-right min-w-[100px]",
    },
    {
      header: "Stock",
      accessor: "quantity" as keyof Product,
      className: "hidden md:table-cell text-center min-w-[80px]",
    },
    {
      header: "Action",
      accessor: "_id" as keyof Product,
      className: "",
    },
  ];

  const renderRow = (product: Product) => (
    <tr key={product._id} className="hover:bg-gray-50">
      <td className="px-4 py-3">
        <div className="flex flex-col">
          <span className="font-medium text-gray-800">{product.name}</span>
          <span className="text-sm text-gray-500 line-clamp-1">
            {product.details}
          </span>
        </div>
      </td>
      <td className="px-4 py-3 hidden sm:table-cell">
        {product.images.length > 0 && (
          <Image
            width={1000}
            height={1000}
            src={product.images[0]}
            alt={product.name}
            className="w-12 h-12 object-cover rounded"
          />
        )}
      </td>
      <td className="px-4 py-3 text-right">Kes {product.price}</td>
      <td className="px-4 py-3 text-center hidden md:table-cell">
        {product.quantity}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <ProductModal type="view" id={product._id} />
          <ProductModal
            type="update"
            id={product._id}
            data={{
              ...product,
              description: product.details,
            }}
            onSuccess={fetchProducts}
          />
          <ProductModal
            type="delete"
            id={product._id}
            onSuccess={fetchProducts}
          />
        </div>
      </td>
    </tr>
  );

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <ProductModal type="create" onSuccess={fetchProducts} />
      </div>

      {loading && (
        <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg">
          Loading products...
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
          Error: {error}
          <button
            onClick={fetchProducts}
            className="ml-4 px-3 py-1 bg-red-100 hover:bg-red-200 rounded"
          >
            Retry
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        {products.length > 0 ? (
          <Table<Product>
            columns={columns}
            data={products}
            renderRow={renderRow}
          />
        ) : !loading && !error ? (
          <div className="p-4 bg-gray-50 text-gray-500 rounded-lg">
            No products found
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Page;
