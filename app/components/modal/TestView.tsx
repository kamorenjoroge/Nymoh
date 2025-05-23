// components/TestView.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface TestViewProps {
  id: string;
}

const TestView: React.FC<TestViewProps> = ({ id }) => {
  const [data, setData] = useState<{ name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await axios.get(`/api/test/${id}`);
        setData(res.data);
      } catch {
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTest();
    }
  }, [id]);

  if (loading) return <p className="text-sm text-gray-500">Loading...</p>;
  if (error) return <p className="text-sm text-red-500">{error}</p>;

  return (
    <div className="space-y-2">
      <div>
        <span className="text-gray-500 text-sm">Name:</span>
        <p className="font-medium text-lg">{data?.name}</p>
      </div>
    </div>
  );
};

export default TestView;
