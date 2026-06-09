import api from "../client";

export const adminApi = {
  analytics: () => api.get("/admin/analytics"),
  verifications: () => api.get("/admin/verifications"),
  verificationAction: (payload: any) => api.post("/admin/verifications", payload),
  refundList: () => api.get("/admin/refunds"),
  refundModerate: (payload: any) => api.put("/admin/refunds", payload),
  users: () => api.get("/admin/users"),
  banUser: (payload: any) => api.post("/admin/users/ban", payload),
  moderateListing: (payload: any) => api.post("/admin/listings/moderate", payload),
  refundRequest: (payload: any) => api.post("/admin/refunds", payload),
  cmsList: () => api.get("/cms"),
  cmsUpdate: (payload: any) => api.put("/cms", payload),
};
