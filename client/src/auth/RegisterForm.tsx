import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { registerSchema } from "./auth.schema";
import type { RegisterData } from "./auth.types";

import { usePasswordStrength } from "@/hooks/usePasswordStrength";

import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/ui/form";
import { Spinner } from "@/components/shared/Spinner";
import { useEffect, useRef, useState } from "react";

export default function RegisterForm() {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [showScrollHint, setShowScrollHint] = useState(false);

	const formRef = useRef<HTMLFormElement | null>(null);
	const bottomRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const el = formRef.current;
		if (!el) return;

		const checkScroll = () => {
			const isScrollable = el.scrollHeight > el.clientHeight;
			const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 5;

			setShowScrollHint(isScrollable && !atBottom);
		};

		checkScroll();
		el.addEventListener("scroll", checkScroll);
		window.addEventListener("resize", checkScroll);

		return () => {
			el.removeEventListener("scroll", checkScroll);
			window.removeEventListener("resize", checkScroll);
		};
	}, []);

	const form = useForm<RegisterData>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			username: "",
			fullname: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const password = form.watch("password");
	const strengthRules = usePasswordStrength(password);

	const onSubmit = async (data: RegisterData) => {
		console.log("Register payload:", data);
	};

	return (
		<Form {...form}>
			<div className="text-center mb-2">
				<h1 className="text-2xl md:text-3xl font-bold text-gray-900">
					Create an account
				</h1>
				<p className="text-sm md:text-base text-gray-500 mt-1">
					Enter your details to get started
				</p>
			</div>

			<div className="flex items-center gap-3 my-4 w-full max-w-md">
				<span className="h-px flex-1 bg-gray-200" />
				<span className="text-xs text-gray-400">secure signup</span>
				<span className="h-px flex-1 bg-gray-200" />
			</div>

			<form
				ref={formRef}
				onSubmit={form.handleSubmit(onSubmit)}
				className="relative overflow-y-auto noScrollbar space-y-4 w-full max-w-md flex flex-col items-center pb-10"
			>
				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem className="w-full max-w-md">
							<FormLabel className="sr-only">Username</FormLabel>
							<FormControl>
								<input className="input" placeholder="username" {...field} />
							</FormControl>
							<FormMessage className="errorMessage" />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="fullname"
					render={({ field }) => (
						<FormItem className="w-full max-w-md">
							<FormLabel className="sr-only">Full Name</FormLabel>
							<FormControl>
								<input className="input" placeholder="full name" {...field} />
							</FormControl>
							<FormMessage className="errorMessage" />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem className="w-full max-w-md">
							<FormLabel className="sr-only">Email</FormLabel>
							<FormControl>
								<input
									className="input"
									type="email"
									placeholder="email"
									{...field}
								/>
							</FormControl>
							<FormMessage className="errorMessage" />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem className="w-full max-w-md">
							<FormLabel className="sr-only">Password</FormLabel>
							<FormControl>
								<div className="relative w-full">
									<input
										className="input pr-14"
										type={showPassword ? "text" : "password"}
										placeholder="password"
										{...field}
									/>
									{password.length > 0 && (
										<button
											type="button"
											onClick={() => setShowPassword((v) => !v)}
											className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-700 cursor-pointer"
										>
											{showPassword ? "Hide" : "Show"}
										</button>
									)}
								</div>
							</FormControl>

							{/* Password strength hint */}
							<div className="mt-3 rounded-lg bg-gray-50 border border-gray-200 p-3">
								<p className="text-xs font-medium text-gray-600 mb-2">
									Password requirements
								</p>

								<ul className="grid grid-cols-2 gap-y-1 gap-x-4 text-xs">
									{strengthRules.map((rule) => (
										<li key={rule.label} className="flex items-center gap-2">
											<span
												className={`h-2 w-2 rounded-full transition-colors ${
													rule.valid ? "bg-green-500" : "bg-gray-300"
												}`}
											/>
											<span
												className={
													rule.valid ? "text-green-600" : "text-gray-500"
												}
											>
												{rule.label}
											</span>
										</li>
									))}
								</ul>
							</div>

							<FormMessage className="errorMessage" />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="confirmPassword"
					render={({ field }) => (
						<FormItem className="w-full max-w-md">
							<FormLabel className="sr-only">Confirm Password</FormLabel>
							<FormControl>
								<div className="relative w-full">
									<input
										className="input pr-14"
										type={showConfirmPassword ? "text" : "password"}
										placeholder="confirm password"
										{...field}
									/>
									{password.length > 0 && (
										<button
											type="button"
											onClick={() => setShowConfirmPassword((v) => !v)}
											className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-700 cursor-pointer"
										>
											{showConfirmPassword ? "Hide" : "Show"}
										</button>
									)}
								</div>
							</FormControl>
							<FormMessage className="errorMessage" />
						</FormItem>
					)}
				/>

				<button
					type="submit"
					disabled={form.formState.isSubmitting}
					className="button gradientButton gap-2"
				>
					{form.formState.isSubmitting ? <Spinner /> : "Register"}
				</button>

				<div ref={bottomRef} />

				{/* Scroll hint */}
				{showScrollHint && (
					<button
						type="button"
						onClick={() =>
							bottomRef.current?.scrollIntoView({ behavior: "smooth" })
						}
						className="
							absolute
							bottom-2
							right-4
							z-10
							flex
							items-center
							gap-2
							rounded-full
							bg-white
							px-4
							py-2
							text-xs
							font-medium
							text-gray-600
							shadow-lg
							border
							border-gray-200
							hover:bg-gray-50
							hover:shadow-xl
							transition
							cursor-pointer
						"
					>
						<span>More</span>
						<svg
							className="h-4 w-4 animate-bounce"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</button>
				)}
			</form>
		</Form>
	);
}
