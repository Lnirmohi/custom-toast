export const toastEventTarget = new EventTarget();
function generateId() {
	return crypto.randomUUID();
}

export const toast = {
  success: (msg: string) => {
    const event = new CustomEvent('toast', {detail: {msg, id: generateId()}});
    toastEventTarget.dispatchEvent(event);
  },
  error: (msg: string) => {
    const event = new CustomEvent('toast', {detail: {msg, id: generateId()}});
    toastEventTarget.dispatchEvent(event);
  },
  info: (msg: string) => {
    const event = new CustomEvent('toast', {detail: {msg, id: generateId()}});
    toastEventTarget.dispatchEvent(event);
  }
};
