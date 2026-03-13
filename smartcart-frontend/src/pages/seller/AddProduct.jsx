import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../api/axios";

const EMOJIS = [
  "📦",
  "📱",
  "💻",
  "⌨️",
  "🖥️",
  "🎧",
  "🔊",
  "🔌",
  "📷",
  "🎮",
  "👗",
  "👟",
  "👜",
  "👛",
  "🎒",
  "🧢",
  "💍",
  "⌚",
  "🛋️",
  "🕯️",
  "☕",
  "🪴",
  "🧺",
  "🛁",
  "🍶",
  "🌵",
  "💡",
  "🧘",
  "💪",
  "🏃",
  "🏋️",
  "⚽",
  "🎾",
  "🏸",
  "📓",
  "✒️",
  "📝",
  "🖊️",
  "📐",
  "🗂️",
];
const TAGS = ["Best Seller", "New", "Eco Pick", "Top Rated"];

export default function AddProduct() {
  const navigate = useNavigate();
  const fileRef = useRef();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    original_price: "",
    stock: "",
    emoji: "📦",
    tag: "",
    category_id: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);

  useEffect(() => {
    api
      .get("/products/categories/all")
      .then(({ data }) => setCategories(data))
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleImagePick = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB.");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.stock) {
      setError("Name, price and stock are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. Upload image if selected
      let image_url = null;
      if (imageFile) {
        setUploading(true);
        const fd = new FormData();
        fd.append("file", imageFile);
        const { data: uploadData } = await api.post("/upload/image", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        image_url = uploadData.url;
        setUploading(false);
      }

      // 2. Create product
      await api.post("/products/", {
        name: form.name,
        description: form.description || null,
        price: parseFloat(form.price),
        original_price: form.original_price
          ? parseFloat(form.original_price)
          : null,
        stock: parseInt(form.stock),
        emoji: form.emoji,
        tag: form.tag || null,
        category_id: form.category_id ? parseInt(form.category_id) : null,
        image_url,
      });

      setSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to add product. Try again.",
      );
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  // Success Screen
  if (success) {
    return (
      <div className="min-h-screen bg-[#f7f4ef]">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-lg p-12 max-w-sm w-full">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-stone-900 mb-2">
              Product Listed!
            </h2>
            <p className="text-stone-500 text-sm mb-8">
              Your product is now live in the marketplace.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setSuccess(false);
                  setForm({
                    name: "",
                    description: "",
                    price: "",
                    original_price: "",
                    stock: "",
                    emoji: "📦",
                    tag: "",
                    category_id: "",
                  });
                  setImageFile(null);
                  setImagePreview(null);
                }}
                className="w-full py-3 bg-stone-900 text-white font-bold rounded-xl hover:bg-orange-600 transition-all text-sm"
              >
                + Add Another Product
              </button>
              <button
                onClick={() => navigate("/my-products")}
                className="w-full py-3 bg-stone-100 text-stone-700 font-bold rounded-xl hover:bg-stone-200 transition-all text-sm"
              >
                View My Products
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const discount =
    form.price && form.original_price
      ? Math.round(
          ((form.original_price - form.price) / form.original_price) * 100,
        )
      : 0;

  return (
    <div className="min-h-screen bg-[#f7f4ef]">
      <Navbar />
      <div className="max-w-6xl mx-auto px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-serif text-stone-900">
            Add New Product
          </h1>
          <p className="text-sm text-stone-500 mt-1.5">
            Fill in the details to list your product
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Form ── */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-2 flex flex-col gap-6"
          >
            {/* Image Upload */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6">
              <h2 className="text-sm font-bold text-stone-700 mb-4">
                Product Image
              </h2>
              <div
                onClick={() => fileRef.current.click()}
                className="border-2 border-dashed border-stone-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-all min-h-[160px]"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="max-h-36 object-contain rounded-lg"
                  />
                ) : (
                  <>
                    <span className="text-4xl mb-2">🖼️</span>
                    <p className="text-sm font-semibold text-stone-600">
                      Click to upload image
                    </p>
                    <p className="text-xs text-stone-400 mt-1">
                      JPEG, PNG, WEBP — max 5MB
                    </p>
                  </>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImagePick}
              />
              {imagePreview && (
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                  className="mt-3 text-xs text-red-500 hover:underline font-medium"
                >
                  ✕ Remove image
                </button>
              )}
            </div>

            {/* Basic Info */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col gap-4">
              <h2 className="text-sm font-bold text-stone-700">Basic Info</h2>

              <div>
                <label className="text-sm font-semibold text-stone-700 block mb-1.5">
                  Product Name *
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Wireless Headphones"
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-stone-700 block mb-1.5">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Describe your product..."
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-stone-700 block mb-1.5">
                    Category
                  </label>
                  <select
                    name="category_id"
                    value={form.category_id}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm outline-none focus:border-orange-400 transition-all"
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-stone-700 block mb-1.5">
                    Tag
                  </label>
                  <select
                    name="tag"
                    value={form.tag}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm outline-none focus:border-orange-400 transition-all"
                  >
                    <option value="">No tag</option>
                    {TAGS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col gap-4">
              <h2 className="text-sm font-bold text-stone-700">
                Pricing & Stock
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {[
                  {
                    name: "price",
                    label: "Selling Price *",
                    placeholder: "₹0",
                  },
                  {
                    name: "original_price",
                    label: "Original Price",
                    placeholder: "₹0",
                  },
                  { name: "stock", label: "Stock Qty *", placeholder: "0" },
                ].map((f) => (
                  <div key={f.name}>
                    <label className="text-sm font-semibold text-stone-700 block mb-1.5">
                      {f.label}
                    </label>
                    <input
                      name={f.name}
                      type="number"
                      value={form[f.name]}
                      onChange={handleChange}
                      placeholder={f.placeholder}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                    />
                  </div>
                ))}
              </div>
              {discount > 0 && (
                <p className="text-xs text-green-600 font-semibold bg-green-50 border border-green-200 px-3 py-2 rounded-lg">
                  ✓ Showing {discount}% discount to buyers
                </p>
              )}
            </div>

            {/* Emoji Picker */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6">
              <h2 className="text-sm font-bold text-stone-700 mb-3">
                Fallback Emoji{" "}
                <span className="text-stone-400 font-normal">
                  (shown if no image)
                </span>
              </h2>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setShowEmojis((e) => !e)}
                  className="text-4xl p-3 bg-stone-50 border border-stone-200 rounded-xl hover:border-orange-400 transition-all"
                >
                  {form.emoji}
                </button>
                <p className="text-sm text-stone-500">
                  Selected:{" "}
                  <span className="font-semibold text-stone-800">
                    {form.emoji}
                  </span>
                </p>
              </div>
              {showEmojis && (
                <div className="mt-3 flex flex-wrap gap-2 p-3 bg-stone-50 rounded-xl border border-stone-200 max-h-32 overflow-y-auto">
                  {EMOJIS.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => {
                        setForm((p) => ({ ...p, emoji: e }));
                        setShowEmojis(false);
                      }}
                      className={`text-2xl p-1.5 rounded-lg hover:bg-white transition-all ${form.emoji === e ? "bg-white shadow-sm border border-orange-300" : ""}`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || uploading}
              className="w-full py-4 bg-stone-900 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all text-sm disabled:opacity-60"
            >
              {uploading
                ? "Uploading image..."
                : loading
                  ? "Adding product..."
                  : "🚀 List Product"}
            </button>
          </form>

          {/* ── Live Preview ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">
                Live Preview
              </p>
              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
                <div className="h-44 bg-gradient-to-br from-stone-50 to-stone-100 flex items-center justify-center overflow-hidden">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-6xl">{form.emoji}</span>
                  )}
                </div>
                <div className="p-4 flex flex-col gap-2">
                  {form.tag && (
                    <span className="self-start text-[10px] font-bold px-2.5 py-1 rounded-full bg-orange-600 text-white">
                      {form.tag}
                    </span>
                  )}
                  <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest">
                    {categories.find((c) => c.id === parseInt(form.category_id))
                      ?.name || "Category"}
                  </p>
                  <h3 className="text-sm font-semibold text-stone-900 leading-snug line-clamp-2">
                    {form.name || "Product name will appear here"}
                  </h3>
                  <p className="text-xs text-stone-400 line-clamp-2">
                    {form.description || "Your product description..."}
                  </p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-lg font-bold text-stone-900">
                      ₹{parseFloat(form.price || 0).toLocaleString()}
                    </span>
                    {form.original_price && (
                      <>
                        <span className="text-xs text-stone-400 line-through">
                          ₹{parseFloat(form.original_price).toLocaleString()}
                        </span>
                        {discount > 0 && (
                          <span className="text-xs font-semibold text-green-600">
                            {discount}% off
                          </span>
                        )}
                      </>
                    )}
                  </div>
                  <div className="w-full mt-1 py-2.5 rounded-xl text-sm font-semibold text-center bg-stone-900 text-white">
                    Add to Cart
                  </div>
                </div>
              </div>
              <p className="text-xs text-stone-400 text-center mt-3">
                This is how buyers will see your product
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
