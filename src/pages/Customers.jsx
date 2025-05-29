import { useEffect, useState } from "react";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [totalSpend, setTotalSpend] = useState(0);
  const [visits, setVisits] = useState(0);
  const [tags, setTags] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
console.log("🧾 Token being sent:", token); // log it

fetch("http://localhost:8000/api/customers", {
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
      const res = await fetch("http://localhost:8000/api/customers", {
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
          tags: tags.split(",").map(tag => tag.trim()),
        }),
      });

      const data = await res.json();
      setCustomers(prev => [...prev, data]);

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
          <input className="border p-2 rounded" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
          <input className="border p-2 rounded" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input className="border p-2 rounded" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
          <input className="border p-2 rounded" type="number" placeholder="Total Spend" value={totalSpend} onChange={e => setTotalSpend(Number(e.target.value))} />
          <input className="border p-2 rounded" type="number" placeholder="Visits" value={visits} onChange={e => setVisits(Number(e.target.value))} />
          <input className="border p-2 rounded" placeholder="Tags (comma separated)" value={tags} onChange={e => setTags(e.target.value)} />
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
