import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { toastEventTarget } from "../utils/toastBus";
import CloseIcon from "../UI/CloseIcon";
import { animated, useSpring } from "@react-spring/web";

interface ToastDetail {
  id: string;
  msg: string;
  show: boolean;
};

type ToastActions =
  | { type: 'HIDE', payload: string }
  | { type: 'ADD', payload: ToastDetail }
  | { type: 'DISCARD' };

function toastReducer(state: ToastDetail[], action: ToastActions) {
  switch (action.type) {
    case 'HIDE':
      return state.map(i => {
        if (i.id === action.payload) {
          return { ...i, show: false };
        }
        return i;
      });
    case 'ADD':
      return [...state, action.payload];
    case 'DISCARD':
      return state.filter(i => i.show);
    default:
      throw new Error('Invalid action type');
  }
}

const initialState: ToastDetail[] = [];

export default function ToastContainer() {
  const [toasts, dispatch] = useReducer(toastReducer, initialState);
  // const [toasts, setToasts] = useState<ToastDetail[]>([]);

  const timeoutRef = useRef<number[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    const timeouts = timeoutRef.current;

    toastEventTarget.addEventListener('toast', (e) => {
      const toastEvent = e as CustomEvent<Omit<ToastDetail, 'show'>>;
      const { msg, id } = toastEvent.detail;

      dispatch({ type: 'ADD', payload: { msg, id, show: true } });

      const timeoutId = setTimeout(() => {
        dispatch({ type: 'HIDE', payload: id });
      }, 2500);

      timeoutRef.current.push(timeoutId);
    }, { signal: controller.signal });

    return () => {
      if (timeouts) {
        for (const i of timeouts) {
          clearTimeout(i);
        }
      }
      controller.abort();
    };
  }, []);

  const closeToast = useCallback((id: string) => {
    dispatch({ type: 'HIDE', payload: id });
  }, []);

  return (
    <div id="toast-container" className="fixed top-2 right-2 flex flex-col gap-3">
      {toasts.map(i => (
        <ToastComponent toast={i} key={i.id} closeToast={closeToast} />
      ))}
    </div>
  );
}

function ToastComponent({ toast, closeToast }: { toast: ToastDetail; closeToast: (id: string) => void }) {
  const [visible, setVisible] = useState(toast.show);

  const [styles, api] = useSpring(() => ({
    from: { transform: 'translateX(120%)' },
    to: { transform: 'translateX(0%)' },
    config: { tension: 220, friction: 20 }
  }));

  // On unmount/close trigger leave animation
  const handleClose = () => {
    api.start({
      to: { transform: 'translateX(120%)' },
      onResolve: () => closeToast(toast.id),
    });
  };

  useEffect(() => {
    if (!toast.show) {
      api.start({
        to: { transform: "translateX(120%)" },
        onResolve: () => {
          setVisible(false);
          closeToast(toast.id);
        },
      });
    }
  }, [toast.show, api, closeToast, toast.id]);

  if (!visible) {
    return null;
  }

  return (
    <animated.div style={{ ...styles }} className="shadow rounded">
      <ToastExpiryIndicator />
      <div className="flex flex-col  p-2 w-60 h-24 bg-white">
        <button
          className="text-gray-300 rounded self-end hover:cursor-pointer hover:text-gray-500 active:scale-90"
          onClick={handleClose}
        >
          <CloseIcon />
        </button>
        <p>{toast.msg}</p>
      </div>
    </animated.div>
  );
};

function ToastExpiryIndicator() {
  const [styles, api] = useSpring(() => ({
    from: { width: '100%' },
    to: { width: '0' },
    config: { duration: 2500, tension: 220, friction: 20 }
  }));

  return (
    <div>
      <animated.div style={{ ...styles }} className="rounded bg-red-500 h-2" />
    </div>
  );
}