import { Link } from "react-router-dom";
import logo from "/images/notFound/monkey.png";

const NotFoundPage = () => {
	return (
		<div className="flex min-h-dvh items-center justify-center px-4 bg-background">
			<div className="flex flex-col items-center text-center max-w-md">
				{/* Image */}
				<img
					src={logo}
					alt="Page Not Found"
					className="size-44 drop-shadow-2xl animate-float"
				/>

				{/* Text */}
				<h1 className="mt-6 text-3xl font-bold text-text-primary">
					Page Not Found
				</h1>

				<p className="mt-2 text-text-secondary">
					This page isn&apos;t available anymore or may have been moved.
				</p>

				{/* Button */}
				<Link
					to="/"
					className="
						mt-6 inline-flex items-center justify-center rounded-lg
						bg-primary px-6 py-3
						text-white font-medium shadow-lg
						transition-all duration-300
						hover:bg-primary-hover hover:scale-105
					"
				>
					Go To Home
				</Link>
			</div>
		</div>
	);
};

export default NotFoundPage;
