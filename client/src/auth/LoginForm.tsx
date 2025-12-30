import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema } from "./auth.schema";
import type { LoginData } from "./auth.types";

import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/ui/form";
import { Spinner } from "@/components/shared/Spinner";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useLogin } from "@/features/auth/useAuth";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
	const [showPassword, setShowPassword] = useState(false);
	const { mutateAsync: loginUser, isPending } = useLogin();

	const navigate = useNavigate();

	const form = useForm<LoginData>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			identifier: "",
			password: "",
		},
	});

	// eslint-disable-next-line react-hooks/incompatible-library
	const password = form.watch("password");

	const onSubmit = async (data: LoginData) => {
		const payload = data.identifier.includes("@")
			? { email: data.identifier, password: data.password }
			: { username: data.identifier, password: data.password };

		try {
			await loginUser(payload);
			toast.success("Authenticated successfully!");
			form.reset();
			navigate("/");
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			toast.error(err?.response?.data?.message ?? "Login failed");
		}
	};

	return (
		<Form {...form}>
			<div className="text-center mb-2">
				<h1 className="text-2xl md:text-3xl font-bold text-gray-900">
					Welcome Back
				</h1>
				<p className="text-sm md:text-base text-gray-500 mt-1">
					Enter your credentials to access your account
				</p>
			</div>

			<div className="flex items-center gap-3 my-4 w-full max-w-md">
				<span className="h-px flex-1 bg-gray-200" />
				<span className="text-xs text-gray-400">secure login</span>
				<span className="h-px flex-1 bg-gray-200" />
			</div>

			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="overflow-y-auto noScrollbar space-y-4 w-full max-w-md flex flex-col items-center pb-10"
			>
				<FormField
					control={form.control}
					name="identifier"
					render={({ field }) => (
						<FormItem className="w-full max-w-md">
							<FormLabel className="sr-only">Email or Username</FormLabel>
							<FormControl>
								<Input
									placeholder="email or username"
									autoComplete="username"
									className="input flex-1"
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
									<Input
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
							<FormMessage className="errorMessage" />
						</FormItem>
					)}
				/>

				<button
					type="submit"
					disabled={isPending}
					className="button gradientButton gap-2"
				>
					{isPending ? <Spinner /> : "Login"}
				</button>
			</form>
		</Form>
	);
}
