"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Tables from "../components/Tables";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  _id: string;
}

interface Order {
  _id: string;
  customerName: string;
  customerEmail: string;
  date: string;
  status: string;
  shippingAddress: string;
  Mpesatransactioncode: string;
  items: OrderItem[];
  total: number;
  createdAt: string;
  updatedAt: string;
}

const Page = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/orders");
      const data = response.data.data || response.data; // Depending on your API response shape
      setOrders(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const columns = [
    {
      header: "Customer",
      accessor: "customerName" as keyof Order,
      className: "min-w-[180px]",
    },
    {
      header: "Items",
      accessor: "items" as keyof Order,
      className: "hidden sm:table-cell text-center min-w-[80px]",
    },
    {
      header: "Total",
      accessor: "total" as keyof Order,
      className: "text-right min-w-[100px]",
    },
    {
      header: "Date",
      accessor: "date" as keyof Order,
      className: "hidden md:table-cell min-w-[120px]",
    },
    {
      header: "Status",
      accessor: "status" as keyof Order,
      className: "hidden lg:table-cell min-w-[100px]",
    },
    // Remove the "Action" column if your Table component expects only keys of Order
    // If you need the "Action" column, you should update the Column type to allow custom accessors
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const renderRow = (order: Order) => (
    <tr key={order._id} className="hover:bg-gray-50">
      <td className="px-4 py-3">
        <div className="flex flex-col">
          <span className="font-medium text-gray-800">
            {order.customerName}
          </span>
          <span className="text-sm text-gray-500">{order.customerEmail}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-center hidden sm:table-cell">
        {order.items.length}
      </td>
      <td className="px-4 py-3 text-right">
        Kes {order.total.toFixed(0)}
      </td>
      <td className="px-4 py-3 hidden md:table-cell">
        {formatDate(order.date)}
      </td>
      <td className="px-4 py-3 hidden lg:table-cell">
        <span
          className={`px-2 py-1 capitalize rounded-full text-xs ${
            order.status === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : order.status === "shipped"
              ? "bg-blue-100 text-blue-800"
              : order.status === "cancelled"
              ? "bg-red-100 text-red-800"
              : order.status === "confirmed"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {order.status}
        </span>
      </td>
      <td className="flex items-center gap-2 px-4 py-3">
        <button className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600">
          View
        </button>
        <button className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600">
          Delete
        </button>
      </td>
    </tr>
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>

      {loading && <p className="text-gray-500">Loading orders...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <Tables<Order>
          columns={columns}
          data={orders}
          renderRow={renderRow}
        />
      )}
    </div>
  );
};

export default Page;
