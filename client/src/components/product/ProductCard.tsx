import { Star, ShoppingCart } from "lucide-react";
export interface Product {
    id: string;
    title: string;
    price: number;
    rating: number;
    specification: string[];
    detail: string;
    image: string[];
    type: string;
}
interface ProductCardProps {
    product: Product;
}
export function ProductCard({ product }: ProductCardProps) {
    return (
        <div className="group relative flex flex-col rounded-2xl bg-white p-3 shadow-md ring-1 ring-gray-200 transition-all hover:shadow-xl hover:ring-gray-300">
            <div className="relative h-56 w-full overflow-hidden rounded-xl bg-white flex items-center justify-center border border-gray-100 dark:border-none">
                <img
                    src={product.image[0]}
                    alt={product.title}
                    className="h-full w-full object-contain p-4 mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-2 right-2 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-gray-800 shadow-sm backdrop-blur-md">
                    <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                    <span>{product.rating.toFixed(1)}</span>
                </div>
            </div>
            <div className="flex flex-1 flex-col p-3 pt-4">
                <div className="mb-2 flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(product.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-200 text-gray-200"
                                }`}
                        />
                    ))}
                    <span className="ml-1.5 text-xs font-medium text-gray-500">
                        ({product.rating})
                    </span>
                </div>
                <h3 className="line-clamp-2 text-base font-semibold text-gray-900 mb-1">
                    {product.title}
                </h3>
                <p className="line-clamp-2 text-sm text-gray-500 mb-5 flex-1">
                    {product.detail}
                </p>
                <div className="mt-auto flex items-end justify-between">
                    <div>
                        <p className="text-xs font-medium text-gray-500 mb-0.5">Price</p>
                        <p className="text-xl font-bold text-gray-900">
                            ₹{product.price.toLocaleString("en-IN")}
                        </p>
                    </div>
                    <button className="cursor-pointer flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition-all hover:bg-gray-100 hover:scale-105 active:scale-95">
                        <ShoppingCart className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}