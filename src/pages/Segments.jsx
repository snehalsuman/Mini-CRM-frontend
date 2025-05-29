import { useState } from "react";

const API_BASE = "https://mini-crm-backend-cl7l.onrender.com";

const Segments = () => {
  const [segmentName, setSegmentName] = useState("");
  const [rules, setRules] = useState({
    totalSpend: { operator: "gt", value: 5000 },
    visits: { operator: "lt", value: 3 },
    inactiveDays: 90,
  });
  const [preview, setPreview] = useState(null);

  const token = localStorage.getItem("token");

  const handlePreview = async () => {
    const res = await fetch(`${API_BASE}/api/segments/preview`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ rules }),
    });
    const data = await res.json();
    setPreview(data);
  };

  const handleCreate = async () => {
    const res = await fetch(`${API_BASE}/api/segments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: segmentName, rules }),
    });
    const data = await res.json();
    alert("Segment created ✅");
    console.log(data);
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">🎯 Create Segment</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block mb-1 text-sm font-medium">Segment Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded"
            value={segmentName}
            onChange={(e) => setSegmentName(e.target.value)}
            placeholder="e.g. VIP Customers"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Total Spend &gt;</label>
          <input
            type="number"
            className="w-full px-4 py-2 border rounded"
            value={rules.totalSpend.value}
            onChange={(e) =>
              setRules((prev) => ({
                ...prev,
                totalSpend: { ...prev.totalSpend, value: parseInt(e.target.value) },
              }))
            }
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Visits &lt;</label>
          <input
            type="number"
            className="w-full px-4 py-2 border rounded"
            value={rules.visits.value}
            onChange={(e) =>
              setRules((prev) => ({
                ...prev,
                visits: { ...prev.visits, value: parseInt(e.target.value) },
              }))
            }
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Inactive Days &gt;</label>
          <input
            type="number"
            className="w-full px-4 py-2 border rounded"
            value={rules.inactiveDays}
            onChange={(e) =>
              setRules((prev) => ({ ...prev, inactiveDays: parseInt(e.target.value) }))
            }
          />
        </div>
      </div>

      <div className="flex gap-4 mt-4">
        <button
          onClick={handlePreview}
          className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded"
        >
          Preview Audience
        </button>
        <button
          onClick={handleCreate}
          className="px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded"
        >
          Create Segment
        </button>
      </div>

      {preview && (
        <div className="mt-6">
          <h4 className="text-lg font-medium">📋 Preview Result</h4>
          <p className="text-sm text-gray-700">
            Total Matches: <strong>{preview.count}</strong>
          </p>
          {preview.sample?.length > 0 && (
            <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
              {preview.sample.map((cust) => (
                <li key={cust._id}>
                  {cust.name} ({cust.email})
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Segments;
