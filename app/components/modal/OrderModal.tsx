"use client";
import { useState } from "react";
import { FiEye, FiCheck, FiX, FiTruck } from "react-icons/fi";
import ViewOrder from "./ViewOrder";
import axios from "axios";
import { toast } from "react-hot-toast";


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

type OrderActionType = "view" | "confirm" | "cancel" | "ship";

type OrderModalProps = {
  type: OrderActionType;
  order: Order;
   onSuccess?: () => void;
};

const iconMap = {
  view: <FiEye size={18} />,
  confirm: <FiCheck size={18} />,
  cancel: <FiX size={18} />,
  ship: <FiTruck size={18} />,
};

const colorMap = {
  view: "bg-blue-500 hover:bg-blue-600",
  confirm: "bg-primary hover:bg-green-700",
  cancel: "bg-warning hover:bg-red-700",
  ship: "bg-secondary hover:bg-amber-600",
};

const OrderModal: React.FC<OrderModalProps> = ({ type, order, onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  

  const handleAction = async () => {
    const statusMap = {
      confirm: "confirmed",
      cancel: "cancelled",
      ship: "shipped",
    };

    try {
      setIsLoading(true);
      const response = await axios.put(`/api/orders/${order._id}`, {
        status: statusMap[type as Exclude<OrderActionType, "view">],
      });

      if (response.data) {
        toast.success(`Order status updated to "${response.data.status}"`);
         onSuccess?.();
        setOpen(false);
        
      }
    
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error("Error updating order: " + (error.response?.data?.error || error.message));
      } else if (error instanceof Error) {
        toast.error("Error updating order: " + error.message);
      } else {
        toast.error("An unknown error occurred while updating the order.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (type === "view") {
      return <ViewOrder id={order._id} />;
    }

    const labelMap = {
      confirm: "Are you sure you want to confirm this order?",
      cancel: "Are you sure you want to cancel this order?",
      ship: "Mark this order as shipped?",
    };

    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="font-medium text-gray-800 dark:text-black">{labelMap[type]}</p>
        <button
          onClick={handleAction}
          disabled={isLoading}
          className={`px-4 py-2 rounded-md text-white ${
            type === "confirm" ? "bg-primary hover:bg-green-700" :
            type === "cancel" ? "bg-lama hover:bg-red-700" :
            "bg-secondary hover:bg-amber-600"
          } ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          } transition-colors duration-200`}
        >
          {isLoading ? "Processing..." : `Yes, ${type}`}
        </button>
      </div>
    );
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`p-2 rounded-full text-white ${colorMap[type]} transition-colors duration-200`}
      >
        {iconMap[type]}
      </button>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center z-50  bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-[95%] sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] max-h-[95vh] overflow-y-auto relative border-2 border-primary">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-lama transition-colors duration-200"
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

export default OrderModal;