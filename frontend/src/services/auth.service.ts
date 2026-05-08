import {
  SignupServicePayload,
  LoginServicePayload,
} from "@/types/service.type";
import { ApiResponse } from "@/types/response.type";

export async function signupService(
  payload: SignupServicePayload,
): Promise<ApiResponse> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

    const data: ApiResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Signup failed");
    }

    return data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Network error");
  }
}

export async function loginService(
  payload: LoginServicePayload,
): Promise<{ token: string; user: any }> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    // Assuming the response includes token and user data
    return data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Network error");
  }
}
