import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface Props {
	children: React.ReactNode;
	direction?: "left" | "right";
}

export default function DirectionTransition({
	children,
	direction = "right",
}: Props) {
	const ref = useRef<HTMLDivElement>(null);

	useGSAP(
		() => {
			const animations = {
				left: { x: -30, opacity: 0 },
				right: { x: 30, opacity: 0 },
			};

			gsap.from(ref.current, {
				...animations[direction],
				duration: 0.5,
				ease: "power2.in",
			});
		},
		{ scope: ref }
	);

	return <div ref={ref}>{children}</div>;
}
