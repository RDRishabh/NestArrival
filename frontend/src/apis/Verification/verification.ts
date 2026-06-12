import api from "../client";

export const verificationApi = {
  upload: (file: FormData) =>
    api.post("/verification/upload", file, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  submitTenant: (payload: any) => api.post("/verification/submit", payload),
  submitOwner: (payload: any) => api.post("/verification/submit", payload),
};
