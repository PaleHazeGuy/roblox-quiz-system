import { HttpService, RunService } from "@rbxts/services";
import { Logger } from "shared/logger";
import { API_URL } from "./config";
import { DEV_API_SECRET } from "./dev-secret";

interface TokenResponse {
	token: string;
	expiresIn: number;
}

export interface ApiResponse<T> {
	status: number;
	data: T | undefined;
}

const log = new Logger("api");

let token: string | undefined;
let expiresAt = 0;

function secretHeader(): string | Secret {
	const [ok, secret] = pcall(() => HttpService.GetSecret("API_SECRET"));
	if (ok) return secret as Secret;
	if (RunService.IsStudio()) return DEV_API_SECRET;
	error("API_SECRET is not configured");
}

function send(method: "GET" | "POST", path: string, headers: Record<string, string | Secret>, body?: unknown) {
	const [ok, response] = pcall(() =>
		HttpService.RequestAsync({
			Url: `${API_URL}${path}`,
			Method: method,
			Headers: { "Content-Type": "application/json", ...headers } as Record<string, string>,
			Body: body !== undefined ? HttpService.JSONEncode(body) : undefined,
		}),
	);
	if (!ok) {
		log.warn(`${method} ${path} failed: ${response}`);
		return undefined;
	}
	return response as RequestAsyncResponse;
}

function refreshToken() {
	const response = send("POST", "/auth/roblox/token", { "x-api-secret": secretHeader() }, { placeId: game.PlaceId });
	if (response === undefined || !response.Success) {
		log.warn(`token request rejected (${response?.StatusCode ?? "no response"}) for place ${game.PlaceId}`);
		return false;
	}
	const data = HttpService.JSONDecode(response.Body) as TokenResponse;
	token = data.token;
	expiresAt = os.time() + data.expiresIn - 30;
	return true;
}

function ensureToken() {
	if (token !== undefined && os.time() < expiresAt) return true;
	return refreshToken();
}

export function apiPost<T>(path: string, body: unknown): ApiResponse<T> {
	if (!ensureToken()) return { status: 0, data: undefined };

	let response = send("POST", path, { Authorization: `Bearer ${token}` }, body);
	if (response !== undefined && response.StatusCode === 401 && refreshToken()) {
		response = send("POST", path, { Authorization: `Bearer ${token}` }, body);
	}
	if (response === undefined) return { status: 0, data: undefined };

	const [decoded, data] = pcall(() => HttpService.JSONDecode(response.Body));
	return { status: response.StatusCode, data: decoded ? (data as T) : undefined };
}
