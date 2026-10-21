"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./auth";
import { api } from "@/lib/api";
import type { Cart } from "@/lib/types";
const CartContext = createContext({ count: 0, refreshCart: async () => {} });
export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [count, setCount] = useState(0);
  const refreshCart = useCallback(async () => {
    if (user?.role !== "student") {
      setCount(0);
      return;
    }
    try {
      const cart = await api<Cart>("/cart");
      setCount(cart.count);
    } catch {
      setCount(0);
    }
  }, [user]);
  useEffect(() => {
    void refreshCart();
  }, [refreshCart]);
  return (
    <CartContext.Provider value={{ count, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}
export const useCart = () => useContext(CartContext);
