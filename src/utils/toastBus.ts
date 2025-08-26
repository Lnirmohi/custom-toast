import type { ToastStates } from "../components/ToastReducer";

export const toastEventTarget = new EventTarget();
function generateId() {
  return crypto.randomUUID();
}

export const toast = {
  success: (msg: string) => {
    generateToastDetail({msg, type: 'SUCCESS'});
  },
  error: (msg: string) => {
    generateToastDetail({msg, type: 'ERROR'});
  },
  info: (msg: string) => {
    generateToastDetail({msg, type: 'INFO'});
  },
};

function generateToastDetail({
  msg,
  type,
}: {
  msg: string;
  type: ToastStates;
}) {
  const event = new CustomEvent("toast", {
    detail: { msg, id: generateId(), type },
  });
  toastEventTarget.dispatchEvent(event);
}
