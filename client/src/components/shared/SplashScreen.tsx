const SplashScreen = () => {
	return (
		<div className="absolute top-0 left-0 flex justify-center items-center h-screen w-full z-40">
			<img
				src="/images/splash.png"
				alt="Loading"
				className="w-40 sm:w-48 md:w-56 animate-pulse select-none"
				draggable={false}
			/>
		</div>
	);
};

export default SplashScreen;
