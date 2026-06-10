import api from "../client";

export const subscriptionsApi = {
  list: () => api.get("/subscriptions"),
  create: (payload: { planId: string; type: "ONETIME" | "SUBSCRIPTION"; purchaseUrgentMatch?: boolean }) =>
    api.post("/subscriptions", payload),
};
