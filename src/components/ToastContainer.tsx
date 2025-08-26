import { memo, useCallback, useEffect, useReducer, useRef, useState } from "react";
import { toastEventTarget } from "../utils/toastBus";
import CloseIcon from "../UI/CloseIcon";
import { animated, useSpring } from "@react-spring/web";
import { toastReducer, type ToastDetail, type ToastStates } from "./ToastReducer";
import useToastContext, { ToastContext } from "./ToastContext";

const expiryIndicatorColor: Record<ToastStates, string> = {
  SUCCESS: 'bg-green-500',
  ERROR: 'bg-red-500',
  INFO: 'bg-blue-500'
};
const initialState: ToastDetail[] = [];

function ToastContainer() {
  const [toasts, dispatch] = useReducer(toastReducer, initialState);

  const timeoutRef = useRef<number[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    const timeouts = timeoutRef.current;

    toastEventTarget.addEventListener('toast', (e) => {
      const toastEvent = e as CustomEvent<Omit<ToastDetail, 'show'>>;
      const { msg, id, type } = toastEvent.detail;

      dispatch({ type: 'ADD', payload: { msg, id, show: true, type } });

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
  }, [dispatch]);

  const closeToast = useCallback((id: string) => {
    dispatch({ type: 'HIDE', payload: id });
  }, [dispatch]);

  return (
    <ToastContext value={{toasts, dispatch}}>
      <div id="toast-container" className="fixed top-2 right-2 flex flex-col gap-3">
        {toasts.map(i => (
          <ToastComponent toast={i} key={i.id} closeToast={closeToast} />
        ))}
      </div>
    </ToastContext>
  );
}

function ToastComponent({ toast, closeToast }: { toast: ToastDetail; closeToast: (id: string) => void }) {
  const {dispatch} = useToastContext(ToastContext);
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
      onResolve: () => {
        closeToast(toast.id);
        dispatch({type: 'DISCARD'});
      },
    });
  };

  useEffect(() => {
    if (!toast.show) {
      api.start({
        to: { transform: "translateX(120%)" },
        onResolve: () => {
          setVisible(false);
          closeToast(toast.id);
          dispatch({type: 'DISCARD'});
        },
      });
    }
  }, [toast.show, api, closeToast, toast.id, dispatch]);

  if (!visible) {
    return null;
  }

  return (
    <animated.div style={{ ...styles }} className="relative shadow rounded">
      <ToastExpiryIndicator type={toast.type} />
      <div className="flex flex-col  p-2 min-w-60 min-h-20 bg-white">
        <button
          className="absolute top-1 right-2 text-gray-300 rounded self-end hover:cursor-pointer hover:text-gray-500 active:scale-90"
          onClick={handleClose}
        >
          <CloseIcon />
        </button>
        <p>{toast.msg}</p>
      </div>
    </animated.div>
  );
};

function ToastExpiryIndicator({ type }: {type: keyof typeof expiryIndicatorColor}) {
  const [styles] = useSpring(() => ({
    from: { width: '100%' },
    to: { width: '0' },
    config: { duration: 2500, tension: 220, friction: 20 }
  }));

  return (
    <div>
      <animated.div style={{ ...styles }} className={`rounded ${expiryIndicatorColor[type]} h-2`} />
    </div>
  );
}

export default memo(ToastContainer);