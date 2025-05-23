
import { useEffect, useState } from "react";
import Image from "next/image";

type ViewProps = {
  id: string;
};

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  _id: string;
}

interface OrderData {
  _id: string;
  customerName: string;
  customerEmail: string;
  phone:string;
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

const ViewOrder = ({ id }: ViewProps) => {
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

 // In your ViewOrder component
useEffect(() => {
  const fetchOrderData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/orders/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch order data');
      }
      const data = await response.json();
      setOrderData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  fetchOrderData();
}, [id]);

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-back p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-dark">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-back p-6 flex items-center justify-center">
        <div className="bg-light p-6 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-dark mb-4">Error Loading Order</h2>
          <p className="text-dark mb-4">{error}</p>
          <button 
            className="px-4 py-2 bg-primary text-light rounded-lg hover:bg-green-600 transition-colors"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-back p-6 flex items-center justify-center">
        <div className="bg-light p-6 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-dark mb-4">Order Not Found</h2>
          <p className="text-dark mb-4">The requested order could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-back p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8"> 
          <div>
            <h1 className="text-3xl font-bold text-dark">Order Details</h1>
          </div>
        </div>

        {/* Order Card */}
        <div className="bg-light rounded-xl shadow-lg overflow-hidden">
          {/* Order Header */}
          <div className="bg-gradient-to-r from-primary to-green-400 p-6 text-light">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold">
                  Order #{orderData._id.substring(0, 8)}
                </h2>
                <p className="opacity-90">
                  Placed on {formatDate(orderData.date)}
                </p>
              </div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  orderData.status === "pending"
                                 ? "bg-yellow-100 text-yellow-800"
              : orderData.status === "shipped"
              ? "bg-blue-100 text-blue-800"
              : orderData.status === "cancelled"
              ? "bg-red-100 text-red-800"
              : orderData.status === "confirmed"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
                }`}
              >
                {orderData.status.charAt(0).toUpperCase() +
                  orderData.status.slice(1)}
              </span>
            </div>
          </div>

          {/* Order Content */}
          <div className="p-6">
            {/* Customer Info */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-dark mb-4 pb-2 border-b border-gray-200">
                Customer Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-back p-4 rounded-lg">
                  <p className="text-dark mb-1">
                    <span className="font-medium">Name:</span>{" "}
                    {orderData.customerName}
                  </p>
                  <p className="text-dark">
                    <span className="font-medium">Email:</span>{" "}
                    {orderData.customerEmail}
                  </p>
                </div>
                <div className="bg-back p-4 rounded-lg">
                  <p className="text-dark font-medium mb-1">Shipping Address</p>
                  <p className="text-dark">{orderData.shippingAddress}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-dark mb-4 pb-2 border-b border-gray-200">
                Order Items
              </h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="hidden md:grid grid-cols-12 bg-backold p-4 font-medium text-dark">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>
                {orderData.items.map((item) => (
                  <div
                    key={item._id}
                    className="grid grid-cols-1 md:grid-cols-12 p-4 border-b border-gray-200 last:border-b-0 hover:bg-backold/50 transition-colors"
                  >
                    <div className="col-span-6 flex items-center mb-3 md:mb-0">
                      <div className="w-16 h-16 bg-gray-100 rounded-md mr-4 overflow-hidden flex items-center justify-center">
                        {item.image ? (
                          <Image
                            width={64}
                            height={64}
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xs text-gray-500">
                            No Image
                          </span>
                        )}
                      </div>
                      <p className="font-medium text-dark">{item.name}</p>
                    </div>
                    <div className="col-span-2 flex md:block mb-2 md:mb-0">
                      <span className="md:hidden font-medium mr-2">Price:</span>
                      <p className="text-dark text-center">
                        Kes {item.price.toFixed(0)}
                      </p>
                    </div>
                    <div className="col-span-2 flex md:block mb-2 md:mb-0">
                      <span className="md:hidden font-medium mr-2">Qty:</span>
                      <p className="text-dark text-center">{item.quantity}</p>
                    </div>
                    <div className="col-span-2 flex md:block">
                      <span className="md:hidden font-medium mr-2">Total:</span>
                      <p className="text-dark font-medium text-right">
                        Kes {(item.price * item.quantity).toFixed(0)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-back p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-dark mb-4">
                Order Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-dark mb-2">
                    Payment Information
                  </h4>
                  <div className="space-y-2">
                    <p className="text-dark">
                      <span className="font-medium">Method:</span> M-Pesa
                    </p>
                    <p className="text-dark">
                      <span className="font-medium">Transaction Code:</span>{" "}
                      {orderData.Mpesatransactioncode}
                    </p>
                    <p className="text-dark">
                      <span className="font-medium">Phone:</span>{" "}
                      {orderData.phone}
                    </p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between mb-2">
                    <span className="text-dark">Subtotal:</span>
                    <span className="text-dark">
                      Kes {orderData.total.toFixed(0)}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-dark">Shipping:</span>
                    <span className="text-dark">Kes 0.00</span>
                  </div>
                 
                  <div className="flex justify-between pt-3 mt-3 border-t border-gray-200">
                    <span className="font-bold text-lg text-dark">Total:</span>
                    <span className="font-bold text-lg text-primary">
                      Kes {orderData.total.toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewOrder;