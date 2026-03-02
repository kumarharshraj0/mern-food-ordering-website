import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { GoogleLogin } from "@react-oauth/google";

export default function SignUp() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // "user" or "deliveryBoy"

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signup(name, email, password, role);
      navigate("/signin");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">

        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight">
            Join <span className="text-orange-600">Us</span>
          </h2>
          <p className="text-gray-500 mt-2 font-medium">Choose your role and start your journey</p>
        </div>

        {error && (
          <p className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            placeholder="Full Name"
            className="w-full border p-3 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full border p-3 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              type="button"
              onClick={() => setRole("user")}
              className={`py-3 rounded-xl font-bold transition-all duration-300 border-2 ${role === "user"
                ? "bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-100"
                : "bg-white text-gray-500 border-gray-100 hover:border-orange-200"
                }`}
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => setRole("deliveryBoy")}
              className={`py-3 rounded-xl font-bold transition-all duration-300 border-2 ${role === "deliveryBoy"
                ? "bg-orange-600 text-white border-orange-600 shadow-lg shadow-orange-100"
                : "bg-white text-gray-500 border-gray-100 hover:border-orange-200"
                }`}
            >
              Delivery Boy
            </button>
          </div>

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-3 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600"
            disabled={loading}
          >
            {loading ? "Creating..." : "Sign Up"}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                setLoading(true);
                await googleLogin(credentialResponse.credential);
                navigate("/");
              } catch (err) {
                setError("Google Signup failed");
              } finally {
                setLoading(false);
              }
            }}
            onError={() => {
              setError("Google Login failed");
            }}
            useOneTap
          />
        </div>

        <p className="text-sm mt-4 text-center">
          Already have an account?{" "}
          <Link to="/signin" className="text-orange-600">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
