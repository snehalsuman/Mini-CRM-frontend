import { useEffect, useState } from "react";

const API_BASE = "https://mini-crm-backend-cl7l.onrender.com";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [totalSpend, setTotalSpend] = useState(0);
  const [visits, setVisits] = useState(0);
  const [tags, setTags] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API_BASE}/api/customers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setCustomers(data))
      .catch((error) => console.error("Failed to fetch customers:", error))
      .finally(() => setLoading(false));
  }, []);

  const handleAddCustomer = async () => {
    const token = localStorage.getItem("token");
    if (!name || !email) return alert("Name and Email are required.");

    try {
      const res = await fetch(`${API_BASE}/api/customers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          totalSpend,
          visits,
          tags: tags.split(",").map((tag) => tag.trim()),
        }),
      });

      const data = await res.json();
      setCustomers((prev) => [...prev, data]);

      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setTotalSpend(0);
      setVisits(0);
      setTags("");

      alert("✅ Customer added!");
    } catch (err) {
      console.error("Error adding customer:", err);
      alert("❌ Failed to add customer.");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold mb-4">👥 Customers</h2>

      {/* Add Customer Form */}
      <div className="bg-white p-4 border rounded shadow space-y-4">
        <h3 className="text-lg font-medium">➕ Add New Customer</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input className="border p-2 rounded w-full" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input className="border p-2 rounded w-full" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input className="border p-2 rounded w-full" placeholder="10-digit number" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Total Spend (₹)</label>
            <input className="border p-2 rounded w-full" type="number" value={totalSpend} onChange={(e) => setTotalSpend(Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Total Visits</label>
            <input className="border p-2 rounded w-full" type="number" value={visits} onChange={(e) => setVisits(Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
            <input className="border p-2 rounded w-full" placeholder="e.g. loyal, premium" value={tags} onChange={(e) => setTags(e.target.value)} />
          </div>
        </div>
        <button onClick={handleAddCustomer} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Save Customer
        </button>
      </div>

      {/* Customer Table */}
      {loading ? (
        <p className="text-gray-600">Loading customers...</p>
      ) : customers.length === 0 ? (
        <p className="text-gray-600">No customers found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg mt-4">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2 border-b">Name</th>
                <th className="px-4 py-2 border-b">Email</th>
                <th className="px-4 py-2 border-b">Phone</th>
                <th className="px-4 py-2 border-b">Total Spend</th>
                <th className="px-4 py-2 border-b">Visits</th>
                <th className="px-4 py-2 border-b">Tags</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((cust) => (
                <tr key={cust._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{cust.name}</td>
                  <td className="px-4 py-2 border-b">{cust.email}</td>
                  <td className="px-4 py-2 border-b">{cust.phone}</td>
                  <td className="px-4 py-2 border-b">₹{cust.totalSpend}</td>
                  <td className="px-4 py-2 border-b">{cust.visits}</td>
                  <td className="px-4 py-2 border-b text-sm text-gray-600">{cust.tags.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Customers;
