import T from './types';
import { logger } from './shared';

const infos: T.DynamicObject = {
  name: 'king',
  profession: 'developer',
};

export const getInfos = () =>
  Object.keys(infos).forEach((key) => logger.success(key, infos[key]));

getInfos();

logger.space();
logger.info('hello');
logger.warn('world');
