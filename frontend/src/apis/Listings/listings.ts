import api from "../client";

export const listingsApi = {
  list: (params?: Record<string, string>) => api.get("/listings", { params }),
  mine: () => api.get("/listings", { params: { scope: "mine" } }),
  all: () => api.get("/listings", { params: { scope: "all" } }),
  saved: () => api.get("/listings/saved"),
  toggleSaved: (listingId: string) => api.post("/listings/saved", { listingId }),
  create: (payload: any) => api.post("/listings", payload),
  update: (listingId: string, payload: any) => api.put(`/listings/${listingId}`, payload),
  remove: (listingId: string) => api.delete(`/listings/${listingId}`),
};
