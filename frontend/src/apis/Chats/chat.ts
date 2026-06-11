import api from "../client";

export const chatApi = {
  listRooms: () => api.get("/chat"),
  listMessages: (roomId: string) => api.get("/chat/messages", { params: { roomId } }),
  sendMessage: (payload: { roomId: string; content: string }) => api.post("/chat/messages", payload),
  initiate: (payload: { listingId: string; firstMessage: string }) => api.post("/chat/initiate", payload),
};
