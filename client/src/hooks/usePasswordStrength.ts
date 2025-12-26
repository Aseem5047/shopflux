export function usePasswordStrength(password: string) {
	const rules = [
		{ label: "8+ characters", valid: password.length >= 8 },
		{ label: "Uppercase letter", valid: /[A-Z]/.test(password) },
		{ label: "Lowercase letter", valid: /[a-z]/.test(password) },
		{ label: "Number", valid: /\d/.test(password) },
		{ label: "Special character", valid: /[@$!%*?&]/.test(password) },
	];

	return rules;
}
