"use client";
import axios from "axios";
import Table from "../components/Tables";
import { useEffect, useState } from "react";
import TestModal from "../components/modal/TestModal";

interface Test {
  _id: string;
  name: string;
}

const Page = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTests = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("/api/test");
      setTests(response.data.data || response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const columns = [
    {
      header: "Name",
      accessor: "name" as keyof Test,
      className: "min-w-[180px]",
    },
    {
      header: "Action",
      accessor: "_id" as keyof Test, // Use unique key
      className: "",
    },
  ];

  const renderRow = (test: Test) => (
    <tr key={test._id} className="hover:bg-gray-50">
      <td className="px-4 py-3">{test.name}</td>
      <td className="px-4 py-3  text-gray-600">
          <div className="flex items-center gap-2">
          <TestModal type="view" id={test._id} />
          <TestModal
            type="update"
            id={test._id}
            data={{ name: test.name }}
            onSuccess={fetchTests}
          />
          <TestModal
            type="delete"
            id={test._id}
            onSuccess={fetchTests}
          />
        </div>
      </td>
    </tr>
  );

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Tests</h1>
         <TestModal type="create" onSuccess={fetchTests} />
      </div>

      {loading && (
        <div className="mb-4 p-4 bg-blue-50 text-blue-700 rounded-lg">
          Loading tests...
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
          Error: {error}
          <button
            onClick={fetchTests}
            className="ml-4 px-3 py-1 bg-red-100 hover:bg-red-200 rounded"
          >
            Retry
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        {tests.length > 0 ? (
          <Table<Test> columns={columns} data={tests} renderRow={renderRow} />
        ) : !loading && !error ? (
          <div className="p-4 bg-gray-50 text-gray-500 rounded-lg">
            No tests found
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Page;
