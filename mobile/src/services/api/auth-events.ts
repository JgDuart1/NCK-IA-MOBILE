export type UnauthorizedHandler = () => void;

let unauthorizedHandler: UnauthorizedHandler | null = null;

export const authEvents = {
  setUnauthorizedHandler(handler: UnauthorizedHandler) {
    unauthorizedHandler = handler;
  },
  clearUnauthorizedHandler() {
    unauthorizedHandler = null;
  },
  notifyUnauthorized() {
    if (unauthorizedHandler) {
      unauthorizedHandler();
    }
  },
};
