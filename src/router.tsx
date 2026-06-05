import { getRouter as appGetRouter } from '../app';

export function createRouter() {
  return appGetRouter();
}

export const getRouter = appGetRouter;