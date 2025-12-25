import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import AuthLayout from "../layouts/AuthLayout";

export default function AppRoutes() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route element={<AuthLayout />}>
					<Route path="/login" element={<LoginPage />} />
					<Route path="/register" element={<RegisterPage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}
