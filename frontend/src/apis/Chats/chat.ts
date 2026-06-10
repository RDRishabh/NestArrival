import api from "../client";

export const chatApi = {
  listRooms: () => api.get("/chat"),
  listMessages: (roomId: string) => api.get("/chat/messages", { params: { roomId } }),
  sendMessage: (payload: any) => api.post("/chat/messages", payload),
};
