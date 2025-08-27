import type { ToastStates } from "../components/ToastReducer";

export type ToastEventDetail = {
  id: string;
  type: "SUCCESS" | "ERROR" | "INFO";
  show: boolean;
  msg?: string;
  duration?: number;
  component?: React.ReactNode;
};

export const toastEventTarget = new EventTarget();
function generateId() {
  return crypto.randomUUID();
}

type ToastTypeArgs = Omit<ToastEventDetail, "id" | "type" | "show">

export const toast = {
  success: ({msg, duration}: ToastTypeArgs) => {
    generateToastDetail({msg: msg ?? '', type: 'SUCCESS', duration});
  },
  error: ({msg, duration}: ToastTypeArgs) => {
    generateToastDetail({msg: msg ?? '', type: 'ERROR', duration});
  },
  info: ({msg, duration}: ToastTypeArgs) => {
    generateToastDetail({msg: msg ?? '', type: 'INFO', duration});
  },
};

function generateToastDetail({
  msg,
  type,
  duration
  
}: {
  msg: string;
  type: ToastStates;
  duration?: number;
}) {
  const event = new CustomEvent<ToastEventDetail>("toast", {
    detail: { msg, id: generateId(), type, show: true, duration },
  });
  toastEventTarget.dispatchEvent(event);
}
