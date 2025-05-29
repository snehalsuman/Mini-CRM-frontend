import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSuccess = async (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    console.log("🧑 Google user:", decoded);

    const res = await fetch("http://localhost:8000/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: credentialResponse.credential }),
    });

    const result = await res.json();
    if (result.verified) {
      localStorage.setItem("token", credentialResponse.credential); // ✅ Store token
      login(result); // your context login (if needed)
      navigate("/dashboard");
    }
    
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">Mini CRM</h1>
        <p className="text-sm text-gray-500 mb-8 text-center">
          Sign in to manage your customers and campaigns
        </p>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => alert("Login Failed")}
            theme="outline"
            size="large"
            width="300"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
