import { createContext, useContext, type ActionDispatch } from "react";
import { type ToastActions, type ToastDetail } from "./ToastReducer";


export const ToastContext = createContext<{
  toasts: ToastDetail[],
  dispatch: ActionDispatch<[action: ToastActions]>
} | null>(null);

export default function useToastContext() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("ToastContext not provided");
  }

  return context;
}
