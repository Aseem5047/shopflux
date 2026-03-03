import { products } from "../constants/products";
import { ProductCard } from "../components/product/ProductCard";

export default function Home() {
	return (
		<div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 w-full my-8 px-4 sm:px-6 lg:px-8">
			{products.map((product) => (
				<ProductCard key={product.id} product={product} />
			))}
		</div>
	);
}
