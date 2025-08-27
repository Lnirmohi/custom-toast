import { createContext, useContext, type ActionDispatch } from "react";
import { type ToastActions } from "./ToastReducer";
import type { ToastEventDetail } from "../utils/toastBus";


export const ToastContext = createContext<{
  toasts: ToastEventDetail[],
  dispatch: ActionDispatch<[action: ToastActions]>
} | null>(null);

export default function useToastContext() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("ToastContext not provided");
  }

  return context;
}
