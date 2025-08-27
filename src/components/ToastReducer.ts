import type { ToastEventDetail } from "../utils/toastBus";

export type ToastStates = "SUCCESS" | "ERROR" | "INFO";

export type ToastActions =
  | { type: 'HIDE', payload: string }
  | { type: 'ADD', payload: ToastEventDetail }
  | { type: 'DISCARD' };

export function toastReducer(state: ToastEventDetail[], action: ToastActions) {
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
