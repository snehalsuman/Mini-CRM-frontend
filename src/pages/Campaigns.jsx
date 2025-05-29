import { useEffect, useState } from "react";

const Campaigns = () => {
  const [segments, setSegments] = useState([]);
  const [selectedSegment, setSelectedSegment] = useState("");
  const [message, setMessage] = useState("");
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [objective, setObjective] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(null);

  const token = localStorage.getItem("token");

  // 🔁 Load segments and campaigns on mount
  useEffect(() => {
    if (!token) return;

    const fetchSegments = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/segments", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setSegments(data);
      } catch (err) {
        console.error("❌ Failed to load segments:", err);
      }
    };

    const fetchCampaigns = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/campaigns", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setCampaigns(data);
      } catch (err) {
        console.error("❌ Failed to load campaigns:", err);
      }
    };

    fetchSegments();
    fetchCampaigns();
  }, [token]);

  useEffect(() => {
    if (aiSuggestions.length > 0) {
      document.getElementById("ai-suggestions")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [aiSuggestions]);

  const handleCreateCampaign = async () => {
    if (!selectedSegment || !message) {
      alert("Please select a segment and write a message");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/campaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: "New Campaign",
          segmentId: selectedSegment,
          message,
        }),
      });

      const data = await res.json();
      setCampaigns((prev) => [data, ...prev]);
      setMessage("");
      alert("✅ Campaign launched!");
    } catch (err) {
      console.error("❌ Campaign error", err);
      alert("Something went wrong while launching the campaign.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async () => {
    if (!objective) return alert("Please enter a campaign objective first.");
    setAiLoading(true);
    setSelectedSuggestionIndex(null);
    try {
      const res = await fetch("http://localhost:8000/api/ai/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ objective }),
      });
      const data = await res.json();
      setAiSuggestions(data.messages || []);
    } catch (err) {
      console.error("⚠️ AI error:", err);
      setAiSuggestions(["⚠️ Something went wrong. Try again later."]);
    }
    setAiLoading(false);
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">📢 Campaigns</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block mb-1 text-sm font-medium">Select Segment</label>
          <select
            value={selectedSegment}
            onChange={(e) => setSelectedSegment(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          >
            <option value="">-- Choose Segment --</option>
            {segments.map((seg) => (
              <option key={seg._id} value={seg._id}>
                {seg.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Message</label>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4 py-2 border rounded resize-none"
            placeholder="Write your message here..."
          ></textarea>
        </div>
      </div>

      {/* AI Input */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block mb-1 text-sm font-medium">🧠 AI Objective</label>
          <input
            type="text"
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            placeholder="e.g. bring back inactive users"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={fetchSuggestions}
            disabled={aiLoading}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            {aiLoading ? "Generating..." : "Suggest Messages"}
          </button>
        </div>
      </div>

      {/* AI Suggestions */}
      {aiSuggestions.length > 0 && (
        <div id="ai-suggestions" className="bg-gray-50 border p-4 rounded mt-2">
          <p className="font-medium mb-1">✨ AI Suggestions:</p>
          <ul className="list-disc list-inside text-sm space-y-1">
            {aiSuggestions.map((msg, i) => (
              <li
                key={i}
                className={`cursor-pointer hover:text-blue-600 ${
                  selectedSuggestionIndex === i ? "text-blue-600 font-semibold" : ""
                }`}
                onClick={() => {
                  setMessage(msg);
                  setSelectedSuggestionIndex(i);
                }}
              >
                {msg}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={handleCreateCampaign}
        disabled={loading}
        className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded"
      >
        {loading ? "Sending..." : "Send Campaign"}
      </button>

      <div className="mt-6">
        <h4 className="text-lg font-medium mb-2">📈 Recent Campaigns</h4>
        {campaigns.length === 0 ? (
          <p className="text-gray-600">No campaigns launched yet.</p>
        ) : (
          <ul className="space-y-3">
            {campaigns.map((c) => (
              <li
                key={c._id}
                className="p-4 border rounded bg-white shadow-sm flex justify-between"
              >
                <div>
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-sm text-gray-500">
                    Sent: {c.sent}, Failed: {c.failed}
                  </p>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(c.createdAt).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Campaigns;
