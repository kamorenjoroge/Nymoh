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
  __v: number;
}

interface Customer {
  email: string;
  name: string;
  orderCount: number;
  latestOrderDate: string;
  totalSpent: number;
}

const Page = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/orders");
      setOrders(response.data.data || response.data); 
      setLoading(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Process customer data
  const getCustomers = (orders: Order[]): Customer[] => {
    // Count successful orders per customer
    const getSuccessfulOrderCount = (email: string) => {
      return orders.filter(order => 
        order.customerEmail === email && order.status.toLowerCase() !== "cancelled"
      ).length;
    };

    // Get unique customers
    return Array.from(new Set(orders.map(order => order.customerEmail)))
      .map(email => {
        const customerOrders = orders.filter(order => order.customerEmail === email);
        const latestOrder = customerOrders.reduce((latest, order) => 
          new Date(order.date) > new Date(latest.date) ? order : latest
        );
        return {
          email,
          name: latestOrder.customerName,
          orderCount: getSuccessfulOrderCount(email),
          latestOrderDate: latestOrder.date,
          totalSpent: customerOrders
            .filter(order => order.status.toLowerCase() !== "cancelled")
            .reduce((sum, order) => sum + order.total, 0)
        };
      });
  };

  const customers = getCustomers(orders);

  const columns: { header: string; accessor: keyof Customer; className: string }[] = [
    {
      header: "Customer",
      accessor: "name",
      className: "min-w-[180px]",
    },
    {
      header: "Successful Orders",
      accessor: "orderCount",
      className: "text-center min-w-[120px]",
    },
    {
      header: "Total Spent",
      accessor: "totalSpent",
      className: "text-right min-w-[120px]",
    },
    {
      header: "Last Order Date",
      accessor: "latestOrderDate",
      className: "hidden md:table-cell min-w-[120px]",
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return `Kes ${amount.toFixed(0)}`;
  };

  const renderRow = (customer: Customer) => (
    <tr key={customer.email} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-col">
          <span className="font-medium text-gray-800">
            {customer.name}
          </span>
          <span className="text-sm text-gray-500">{customer.email}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        {customer.orderCount}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        {formatCurrency(customer.totalSpent)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
        {formatDate(customer.latestOrderDate)}
      </td>
    </tr>
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Customers</h1>

      {loading && <p className="text-gray-500">Loading customers...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <Tables<Customer>
          columns={columns}
          data={customers}
          renderRow={renderRow}
        />
      )}
    </div>
  );
};

export default Page;