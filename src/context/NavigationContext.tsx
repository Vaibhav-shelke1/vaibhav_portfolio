"use client";
import { createContext, useContext } from "react";

export const NavigationContext = createContext<(id: string) => void>(() => {});
export const useNavigate = () => useContext(NavigationContext);
