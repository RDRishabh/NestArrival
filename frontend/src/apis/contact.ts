import api from "./client";

export type ContactTicketPayload = {
  identity: string;
  fullName: string;
  email: string;
  destinationCity: string;
  permitStatus: string;
  subject: string;
  message: string;
};

export const contactApi = {
  submitTicket: (payload: ContactTicketPayload) => api.post("/contact", payload),
};
