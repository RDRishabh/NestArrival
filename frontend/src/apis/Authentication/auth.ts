import api from "../client";

export const authApi = {
  me: () => api.get("/auth/me"),
  login: (payload: { email: string; password: string }) => api.post("/auth/login", payload),
  signup: (payload: { email: string; password: string; fullName: string; role: "TENANT" | "OWNER" }) =>
    api.post("/auth/signup", payload),
  google: (payload: { credential: string; role: string }) => api.post("/auth/google", payload),
  verifyOtp: (payload: { email: string; otp: string }) => api.post("/auth/verify-otp", payload),
  logout: () => api.post("/auth/logout"),
};
