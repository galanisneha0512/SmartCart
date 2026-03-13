import { useState } from "react";
import { useCart } from "../context/CartContext";

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill={i <= Math.round(rating ?? 0) ? "#f59e0b" : "none"}
          stroke="#f59e0b"
          strokeWidth="2"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

const TAG_COLORS = {
  "Best Seller": "bg-orange-600 text-white",
  New: "bg-blue-600 text-white",
  "Eco Pick": "bg-green-600 text-white",
  "Top Rated": "bg-purple-600 text-white",
};

export default function ProductCard({ product, viewOnly = false }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [imgError, setImgError] = useState(false);

  const originalPrice = product.original_price ?? product.originalPrice ?? 0;
  const storeName = product.store_name ?? product.storeName ?? "";
  const categoryName = product.category_name ?? product.category ?? "";
  const price = product.price ?? 0;
  const rating = product.rating ?? 0;

  const discount =
    originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const showImage = product.image_url && !imgError;

  return (
    <div className="group bg-white rounded-2xl border border-stone-200 overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative flex flex-col">
      {product.tag && (
        <span
          className={`absolute top-3 left-3 z-10 text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide ${TAG_COLORS[product.tag] ?? "bg-stone-600 text-white"}`}
        >
          {product.tag}
        </span>
      )}

      {!viewOnly && (
        <button
          onClick={() => setWishlisted((w) => !w)}
          className="absolute top-3 right-3 z-10 w-8 h-8 bg-white border border-stone-200 rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        >
          <span className="text-sm">{wishlisted ? "❤️" : "🤍"}</span>
        </button>
      )}

      {/* Image or Emoji */}
      <div className="h-44 bg-gradient-to-br from-stone-50 to-stone-100 flex items-center justify-center overflow-hidden">
        {showImage ? (
          <img
            src={product.image_url}
            alt={product.name}
            onError={() => setImgError(true)}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="text-6xl select-none">{product.emoji ?? "📦"}</span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 gap-2">
        <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest">
          {categoryName}
          {storeName && <span className="text-orange-400"> · {storeName}</span>}
        </p>

        <h3 className="text-sm font-semibold text-stone-900 leading-snug line-clamp-2">
          {product.name}
        </h3>

        <p className="text-xs text-stone-400 leading-relaxed line-clamp-2">
          {product.description}
        </p>

        {rating > 0 && (
          <div className="flex items-center gap-1.5">
            <StarRating rating={rating} />
            <span className="text-[11px] text-stone-400">{rating}</span>
          </div>
        )}

        <div className="flex-1" />

        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-stone-900">
            ₹{price.toLocaleString()}
          </span>
          {originalPrice > price && (
            <>
              <span className="text-xs text-stone-400 line-through">
                ₹{originalPrice.toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-green-600">
                {discount}% off
              </span>
            </>
          )}
        </div>

        {!viewOnly ? (
          <button
            onClick={handleAddToCart}
            className={`w-full mt-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300
              ${added ? "bg-green-500 text-white" : "bg-stone-900 text-white hover:bg-orange-600"}`}
          >
            {added ? "✓ Added to Cart!" : "Add to Cart"}
          </button>
        ) : (
          <div className="w-full mt-1 py-2.5 rounded-xl text-sm font-medium text-center text-stone-400 bg-stone-100">
            Competitor Product
          </div>
        )}
      </div>
    </div>
  );
}
