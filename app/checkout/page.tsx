// app/checkout/page.tsx
import { cookies } from "next/headers";
import CheckoutClient from "./checkout-client";

export default async function CheckoutPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken");

  return <CheckoutClient isLoggedIn={!!token} />;
}