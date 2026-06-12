import { redirect } from "next/navigation";

export default function NewListingPage() {
  redirect("/owner/dashboard?create=true");
}
