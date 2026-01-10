import { useNavigate } from "react-router-dom";
import LoginForm from "../auth/LoginForm";

const LoginPage = () => {
	const navigate = useNavigate();
	const handleStateChange = () => {
		navigate("/register");
	};

	return (
		<div className="authenticationContainer noScrollbar">
			<div className="h-full overflow-y-auto noScrollbar flex flex-col items-center justify-center px-4 py-6 md:py-10">
				<LoginForm />
			</div>
			<div className="flexCenter flex-col gradientContainer px-6 py-10 text-center">
				<span className="text-4xl md:text-5xl font-extrabold mb-4 text-center">
					Hello Friend
				</span>
				<span className="text-xl mb-4 text-center max-w-100">
					We are glad to have you please enter your details and start your
					journey with us
				</span>
				<p className="text-center text-base md:text-lg  font-normal mt-4">
					Start by creating a new account
				</p>
				<button
					className="button gradientButton mt-4"
					onClick={handleStateChange}
				>
					Register
				</button>
			</div>
		</div>
	);
};

export default LoginPage;
