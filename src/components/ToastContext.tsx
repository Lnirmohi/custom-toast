import { createContext, useContext, type ActionDispatch } from "react";
import { type ToastActions, type ToastDetail } from "./ToastReducer";


export const ToastContext = createContext<{
  toasts: ToastDetail[],
  dispatch: ActionDispatch<[action: ToastActions]>
} | null>(null);

export default function useToastContext(toastContext: typeof ToastContext) {
  const context = useContext(toastContext);

  if (context === null) {
    throw Error('Context not provided');
  }

  return context;
}
