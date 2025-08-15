import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { toastEventTarget } from "../utils/toastBus";
import CloseIcon from "../UI/CloseIcon";

interface ToastDetail  {
  id: string; 
  msg: string; 
  show: boolean
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastDetail[]>([]);
  
  const timeoutRef = useRef<number[]>([]);
  
  useEffect(() => {
    const controller = new AbortController();
    const timeouts = timeoutRef.current;

    toastEventTarget.addEventListener('toast', (e) => {
      const toastEvent = e as CustomEvent;
      const {msg, id} = toastEvent.detail;

      setToasts(prev => [...prev, {msg, id, show: true}]);
      
      const timeoutId = setTimeout(() => {
        setToasts(prev => {
          return prev.map(i => {
            if (i.id === id) {
              return {...i, show: false};
            }
            return i;
          });
        });
      }, 10000);

      timeoutRef.current.push(timeoutId);
    }, {signal: controller.signal});

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
    setToasts(prev => {
      return prev.map((toast) => {
        if (id === toast.id) {
          return {...toast, show: false};
        }

        return toast;
      });
    });
  }, []);

  return (
    <div id="toast-container" className="absolute top-2 right-2 flex flex-col gap-3">
    {toasts.map(i => (
      <Fragment key={i.id}>
      {i.show && (
        <div className="flex flex-col shadow rounded-md p-2 w-60 h-24">
          <button 
            className="text-gray-300 rounded self-end hover:cursor-pointer hover:text-gray-500 active:scale-90"
            onClick={() => closeToast(i.id)}
          >
            <CloseIcon />
          </button>
          <p>{i.msg}</p>
        </div>
      )}
      </Fragment>
    ))}
    </div>
  );
}