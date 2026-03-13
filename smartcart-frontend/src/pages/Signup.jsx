import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { signup } = useAuth();
  const navigate   = useNavigate();

  const [step, setStep]     = useState(1); // 1 = role select, 2 = form
  const [role, setRole]     = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");
  const [form, setForm]     = useState({
    name: "", email: "", password: "", confirmPassword: "", storeName: ""
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all fields."); return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match."); return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters."); return;
    }
    if (role === "seller" && !form.storeName) {
      setError("Store name is required."); return;
    }

    setLoading(true);
    try {
      const user = await signup({
        name:      form.name,
        email:     form.email,
        password:  form.password,
        role,
        storeName: form.storeName,
      });
      navigate(user.role === "seller" ? "/dashboard" : "/shop");
    } catch (err) {
      setError(err.response?.data?.detail || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Role Selection 
  if (step === 1) {
    return (
      <div className="min-h-screen bg-[#f7f4ef] flex flex-col items-center justify-center px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold font-serif">
            Smart<span className="text-orange-500">Cart</span>
          </h1>
          <p className="text-stone-500 text-sm mt-1">Create your free account</p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 shadow-lg p-8 w-full max-w-sm">
          <h2 className="text-xl font-bold text-stone-900 mb-1">Join as a...</h2>
          <p className="text-stone-500 text-sm mb-6">Choose how you want to use SmartCart</p>

          <div className="flex flex-col gap-3">
            {[
              { role: "buyer",  emoji: "🛍️", title: "Buyer",  desc: "Browse and buy products from multiple stores.", tag: "Free forever",      tagColor: "text-orange-600" },
              { role: "seller", emoji: "🏪", title: "Seller", desc: "Create your own store, list unlimited products.", tag: "You can also buy as a seller", tagColor: "text-green-600" },
            ].map((r) => (
              <button
                key={r.role}
                onClick={() => { setRole(r.role); setStep(2); }}
                className="flex items-start gap-4 p-5 rounded-xl border-2 border-stone-200 hover:border-orange-500 hover:bg-orange-50 hover:shadow-md transition-all text-left w-full"
              >
                <span className="text-3xl">{r.emoji}</span>
                <div>
                  <p className="font-bold text-stone-900">{r.title}</p>
                  <p className="text-sm text-stone-500 mt-0.5">{r.desc}</p>
                  <p className={`text-xs font-semibold mt-2 ${r.tagColor}`}>{r.tag}</p>
                </div>
              </button>
            ))}
          </div>

          <p className="text-center text-sm text-stone-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-orange-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    );
  }

  // Step 2: Form 
  return (
    <div className="min-h-screen bg-[#f7f4ef] flex flex-col items-center justify-center px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold font-serif">
          Smart<span className="text-orange-500">Cart</span>
        </h1>
        <p className="text-stone-500 text-sm mt-1">Create your free account</p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-lg p-8 w-full max-w-sm">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setStep(1)} className="text-stone-400 hover:text-stone-700 text-sm">←</button>
          <span className="text-sm font-semibold text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            {role === "buyer" ? "🛍️" : "🏪"} Signing up as {role === "buyer" ? "Buyer" : "Seller"}
          </span>
        </div>

        <h2 className="text-xl font-bold text-stone-900 mb-5">Create your account</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {[
            { name: "name",            label: "Full name",       type: "text",     placeholder: "Arjun Sharma" },
            { name: "email",           label: "Email address",   type: "email",    placeholder: "you@example.com" },
            { name: "password",        label: "Password",        type: "password", placeholder: "Min. 6 characters" },
            { name: "confirmPassword", label: "Confirm password",type: "password", placeholder: "Repeat your password" },
            ...(role === "seller" ? [{ name: "storeName", label: "Store name", type: "text", placeholder: "e.g. TechZone" }] : []),
          ].map((f) => (
            <div key={f.name}>
              <label className="text-sm font-semibold text-stone-700 block mb-1.5">{f.label}</label>
              <input
                name={f.name}
                type={f.type}
                value={form[f.name]}
                onChange={handleChange}
                placeholder={f.placeholder}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-stone-900 text-white font-bold rounded-xl hover:bg-orange-600 transition-all text-sm mt-2 disabled:opacity-60"
          >
            {loading ? "Creating account..." : `Create ${role === "buyer" ? "Buyer" : "Seller"} Account →`}
          </button>
        </form>

        <p className="text-center text-sm text-stone-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-orange-600 font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}