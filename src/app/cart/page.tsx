import { getSession } from "@/core_components/auth/getSession";
import { redirect } from "next/navigation";
import CartPageClient from "@/component_library/cart/CartPageClient";

export default async function CartPage() {
  const session = await getSession();
  if (!session) {
    redirect(`/sign-in?returnUrl=/cart`);
  }
  return <CartPageClient />;
}
