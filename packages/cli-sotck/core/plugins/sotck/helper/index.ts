import { Prompt } from '../../../shared';

export const toFixedToNumber = (num: number, fix = 3) =>
  Number(num.toFixed(fix));

export const createInput = async () =>
  await Prompt.create([
    { name: 'price', message: '交易价格（元）', type: 'number' },
    { name: 'rate', message: '网格大小（%）', type: 'number', default: 3 },
  ]).excute();

export const createSelect = async (downPrice: number, upPrice: number) =>
  await Prompt.create([
    {
      name: 'selectPrice',
      message: '交易价格（元）',
      type: 'list',
      choices: [
        { name: `买入价格 ${downPrice} 元`, value: downPrice },
        { name: `卖出价格 ${upPrice} 元`, value: upPrice },
      ],
    },
  ]).excute();
