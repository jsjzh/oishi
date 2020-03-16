import { DynamicObject } from '../global';

const infos: DynamicObject = {
  name: 'king',
  profession: 'developer',
};

export const getInfos = () =>
  Object.keys(infos).forEach((key) => console.log(key, infos[key]));
