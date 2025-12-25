import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface Props {
	children: React.ReactNode;
	variant?: "fade" | "slide" | "scale";
}

export default function PageTransition({ children, variant = "fade" }: Props) {
	const ref = useRef<HTMLDivElement>(null);

	useGSAP(
		() => {
			const animations = {
				fade: { opacity: 0 },
				slide: { y: 30, opacity: 0 },
				scale: { scale: 0.96, opacity: 0 },
			};

			gsap.from(ref.current, {
				...animations[variant],
				duration: 0.5,
				ease: "power3.out",
			});
		},
		{ scope: ref }
	);

	return <div ref={ref}>{children}</div>;
}
