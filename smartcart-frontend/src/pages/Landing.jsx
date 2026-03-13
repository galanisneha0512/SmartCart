import { useNavigate } from "react-router-dom";

const features = [
  { emoji: "🛍️", title: "Buy from Multiple Stores", desc: "Browse thousands of products from verified sellers across all categories." },
  { emoji: "🏪", title: "Sell Your Products", desc: "Create your store, list products, and start earning in minutes." },
  { emoji: "🤖", title: "AI Shopping Assistant", desc: "Get smart product recommendations powered by Claude AI." },
  { emoji: "🚚", title: "Fast Delivery", desc: "Free shipping on orders above ₹999. Track your orders in real time." },
];

const categories = [
  { emoji: "📱", name: "Electronics" },
  { emoji: "👗", name: "Fashion" },
  { emoji: "🏠", name: "Home & Living" },
  { emoji: "⚽", name: "Sports" },
  { emoji: "📚", name: "Books" },
  { emoji: "🌿", name: "Lifestyle" },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f7f4ef] font-sans">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#f7f4ef]/95 backdrop-blur border-b border-stone-200 px-8 h-16 flex items-center justify-between">
        <h1 className="text-xl font-bold font-serif text-stone-900">
          Smart<span className="text-orange-600">Cart</span>
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 text-sm font-medium text-stone-700 border border-stone-300 rounded-lg hover:bg-white transition-all"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="px-4 py-2 text-sm font-semibold bg-stone-900 text-white rounded-lg hover:bg-orange-600 transition-all"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative bg-stone-900 text-white overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-[-80px] right-[-80px] w-[400px] h-[400px] rounded-full bg-orange-600/10 pointer-events-none" />
        <div className="absolute bottom-[-60px] left-[-60px] w-[300px] h-[300px] rounded-full bg-orange-600/8 pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-8 py-24 text-center">
          <span className="inline-block text-orange-400 text-xs font-bold tracking-widest uppercase mb-4 bg-orange-400/10 px-4 py-1.5 rounded-full">
            India's Smartest Marketplace
          </span>
          <h2 className="text-5xl font-bold font-serif leading-tight mb-6">
            Buy Smart. <br />
            <span className="text-orange-400">Sell Smarter.</span>
          </h2>
          <p className="text-stone-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            A multi-vendor marketplace where buyers discover great products and sellers grow their business — all powered by AI.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => navigate("/signup")}
              className="px-8 py-3.5 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-500 transition-all text-sm"
            >
              Start Shopping →
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-8 py-3.5 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-all text-sm border border-white/20"
            >
              Become a Seller 🏪
            </button>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-12 mt-16 pt-10 border-t border-white/10">
            {[
              { value: "500+", label: "Sellers" },
              { value: "10K+", label: "Products" },
              { value: "50K+", label: "Happy Buyers" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-stone-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-5xl mx-auto px-8 py-16">
        <h3 className="text-2xl font-bold font-serif text-stone-900 mb-2">Shop by Category</h3>
        <p className="text-stone-500 text-sm mb-8">Find exactly what you're looking for</p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {categories.map((c) => (
            <button
              key={c.name}
              onClick={() => navigate("/signup")}
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-stone-200 hover:border-orange-400 hover:shadow-md transition-all group"
            >
              <span className="text-3xl group-hover:scale-110 transition-transform">{c.emoji}</span>
              <span className="text-xs font-medium text-stone-700">{c.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-white border-y border-stone-200 py-16">
        <div className="max-w-5xl mx-auto px-8">
          <h3 className="text-2xl font-bold font-serif text-stone-900 mb-2 text-center">Why SmartCart?</h3>
          <p className="text-stone-500 text-sm mb-12 text-center">Everything you need in one platform</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="p-6 rounded-xl bg-[#f7f4ef] border border-stone-200 hover:shadow-md transition-all">
                <span className="text-3xl mb-4 block">{f.emoji}</span>
                <h4 className="font-semibold text-stone-900 mb-2 text-sm">{f.title}</h4>
                <p className="text-xs text-stone-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-8 py-16 text-center">
        <div className="bg-stone-900 rounded-2xl p-12 relative overflow-hidden">
          <div className="absolute top-[-40px] right-[-40px] w-[200px] h-[200px] rounded-full bg-orange-600/15 pointer-events-none" />
          <h3 className="text-3xl font-bold font-serif text-white mb-4">
            Ready to get started?
          </h3>
          <p className="text-stone-400 text-sm mb-8">
            Join thousands of buyers and sellers on SmartCart today.
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="px-10 py-3.5 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-500 transition-all text-sm"
          >
            Create Free Account →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200 py-6 text-center">
        <p className="text-xs text-stone-400">
          © 2026 SmartCart · Built with React + FastAPI
        </p>
      </footer>
    </div>
  );
}