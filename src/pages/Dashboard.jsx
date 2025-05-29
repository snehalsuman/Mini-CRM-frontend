import { useEffect, useState } from "react";

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    customers: 0,
    segments: 0,
    campaigns: 0,
    messagesSent: 0,
    messagesFailed: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token found in localStorage");
      return;
    }

    const fetchMetrics = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch dashboard metrics");
        }

        const data = await res.json();
        setMetrics(data);
      } catch (err) {
        console.error("❌ Failed to fetch dashboard metrics:", err);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold mb-4">📊 Dashboard Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card label="Customers" value={metrics.customers} />
        <Card label="Segments" value={metrics.segments} />
        <Card label="Campaigns" value={metrics.campaigns} />
        <Card label="Messages Sent" value={metrics.messagesSent} />
        <Card label="Messages Failed" value={metrics.messagesFailed} />
      </div>
    </div>
  );
};

const Card = ({ label, value }) => (
  <div className="bg-white shadow rounded-lg p-4 border">
    <p className="text-gray-500 text-sm">{label}</p>
    <p className="text-2xl font-bold mt-1">{value}</p>
  </div>
);

export default Dashboard;
