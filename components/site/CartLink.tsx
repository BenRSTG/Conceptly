"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart/CartContext";

export function CartLink() {
  const { itemCount } = useCart();

  return (
    <Link href="/warenkorb" className="hover:text-sand-dark">
      Warenkorb{itemCount > 0 && ` (${itemCount})`}
    </Link>
  );
}
