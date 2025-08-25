export const apiRequest = async <T>(
	endpoint: string,
	method: "GET" | "POST" | "PATCH" | "DELETE" = "GET",
	body?: any
): Promise<T> => {
	const options: RequestInit = {
		method,
		credentials: "include",
		headers: {},
	};
	if ((method === "POST" || method === "PATCH") && body) {
		options.headers = { "Content-Type": "application/json" };
		options.body = JSON.stringify(body);
	}
	const res = await fetch(`/api${endpoint}`, options);
	if (!res.ok) {
		throw new Error((await res.json()).message || res.status);
	}
	return (await res.json()) as T;
};
