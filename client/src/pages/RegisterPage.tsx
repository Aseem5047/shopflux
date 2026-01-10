import { useNavigate } from "react-router-dom";
import RegisterForm from "../auth/RegisterForm";

const RegisterPage = () => {
	const navigate = useNavigate();
	const handleStateChange = () => {
		navigate("/login");
	};
	return (
		<div className="authenticationContainer noScrollbar">
			<div className="h-full overflow-y-auto noScrollbar flex flex-col items-center px-4 py-6 md:py-10">
				<RegisterForm />
			</div>

			<div className="h-full flexCenter flex-col gradientContainer px-6 py-10 text-center">
				<span className="text-4xl md:text-5xl font-extrabold mb-4">
					Welcome Back
				</span>
				<span className="text-xl mb-4 text-center max-w-100">
					To keep you connected with us please register using your personal info
				</span>
				<p className="text-center text-base md:text-lg  font-normal mt-4">
					Already have an account?
				</p>
				<button
					className="button gradientButton mt-4"
					onClick={handleStateChange}
				>
					Authenticate
				</button>
			</div>
		</div>
	);
};

export default RegisterPage;
