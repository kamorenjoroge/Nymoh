"use client";
import axios from "axios";
import { useEffect, useState } from "react";

import { FiBox, FiDollarSign, FiShoppingCart, FiUsers } from "react-icons/fi";

const Page = () => {
  const [dashboardData, setDashboardData] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    activeUsers: 0,
  });
  

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get("/api/dashboard");
        if (res.data.success) {
          setDashboardData(res.data.data);
        }
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      }
    };
    fetchDashboardData();
    
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Orders Card */}
        <div className="bg-back rounded-lg shadow p-6 flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
            <FiShoppingCart size={24} />
          </div>
          <div>
            <p className="text-gray-500">Total Orders</p>
            <h3 className="text-2xl font-bold">{dashboardData.totalOrders}</h3>
            <p className="text-green-500 text-sm">+12% from last month</p>
          </div>
        </div>

        {/* Total Products Card */}
        <div className="bg-back rounded-lg shadow p-6 flex items-center">
          <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
            <FiBox size={24} />
          </div>
          <div>
            <p className="text-gray-500">Registered Products</p>
            <h3 className="text-2xl font-bold">
              {dashboardData.totalProducts}
            </h3>
            <p className="text-green-500 text-sm">+5 new this week</p>
          </div>
        </div>

        {/* Total Revenue Card */}
        <div className="bg-back rounded-lg shadow p-6 flex items-center">
          <div className="p-3 rounded-full bg-amber-100 text-amber-600 mr-4">
            <FiDollarSign size={24} />
          </div>
          <div>
            <p className="text-gray-500">Total Revenue</p>
            <h3 className="text-2xl font-bold">
              Kes {dashboardData.totalRevenue.toLocaleString()}
            </h3>
            <p className="text-green-500 text-sm">+8% from last month</p>
          </div>
        </div>

        {/* Active Users Card */}
        <div className="bg-back rounded-lg shadow p-6 flex items-center">
          <div className="p-3 rounded-full bg-white text-gray-800 mr-4">
            <FiUsers size={24} />
          </div>
          <div>
            <p className="text-gray-500">Active Users</p>
            <h3 className="text-2xl font-bold">{dashboardData.activeUsers}</h3>
            <p className="text-green-500 text-sm">+24 new today</p>
          </div>
        </div>
      </div> 
    </div>
  );
};

export default Page;
