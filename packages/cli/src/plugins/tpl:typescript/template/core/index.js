"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const infos = {
    name: 'king',
    profession: 'developer',
};
exports.getInfos = () => Object.keys(infos).forEach((key) => console.log(key, infos[key]));
