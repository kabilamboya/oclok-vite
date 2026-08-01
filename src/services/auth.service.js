const AUTH_STORAGE_KEY = "oclok_registered_user";

const canUseStorage = () => typeof window !== "undefined" && window.localStorage;

export const registerUser = ({ name, email }) => {
	const user = {
		name: String(name || "").trim(),
		email: String(email || "").trim().toLowerCase(),
		registeredAt: new Date().toISOString(),
	};

	if (!user.name || !user.email) return null;
	if (canUseStorage()) {
		window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
	}
	return user;
};

export const getRegisteredUser = () => {
	if (!canUseStorage()) return null;

	try {
		const stored = JSON.parse(window.localStorage.getItem(AUTH_STORAGE_KEY) || "null");
		return stored?.name && stored?.email ? stored : null;
	} catch (_error) {
		return null;
	}
};

export const isRegisteredUser = () => Boolean(getRegisteredUser());

export const clearRegisteredUser = () => {
	if (canUseStorage()) window.localStorage.removeItem(AUTH_STORAGE_KEY);
};
