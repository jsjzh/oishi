import { PluginAPI } from '@oishi/cli-core/typings/plugin';
import T from '../../types';

import { Prompt } from '../../shared';
import { calculateBasalMetabolic, getTime, getAge } from './helper';
import fs from 'fs-extra';
import path from 'path';

export default (api: PluginAPI<T.IContent>): void => {
  api.registerCommand(
    {
      command: 'calorie',
      description: '根据身体状况计算基础代谢、估算减脂所需时长',
      options: [],
    },
    async (args, ctx) => {
      const [name] = args;
      const { argv, cliRoot, root, helper, logger } = ctx;
      // const { word, age } = argv;

      const homePath = process.env.HOME || process.env.USERPROFILE || root;

      const date = getTime();

      const userInfoPath = path.resolve(
        homePath,
        `node-temp/${process.env.npm_package_name}/calorie/${date}/userInfo.json`,
      );

      const globalConfig = {
        oldInputs: {} as any,
        userInputs: {} as any,
      };

      helper
        // helper 创建任务链函数
        .createTaskList({ hasTip: true })
        .add({
          title: '查询当日是否记录',
          task: async () => {
            if (await fs.pathExists(userInfoPath))
              globalConfig.oldInputs = await fs.readJSON(userInfoPath);
          },
        })
        .add({
          title: '记录身体参数、目标',
          task: async () => {
            globalConfig.userInputs = await Prompt.create([
              {
                name: 'sex',
                message: '请选择性别',
                type: 'list',
                default: globalConfig.oldInputs.sex,
                choices: [
                  { name: '男', value: 'man' },
                  { name: '女', value: 'woman' },
                ],
              },
              {
                name: 'weight',
                message: '请输入体重（kg）',
                type: 'number',
                default: globalConfig.oldInputs.weight,
              },
              {
                name: 'height',
                message: '请输入身高（cm）',
                type: 'number',
                default: globalConfig.oldInputs.height,
              },
              {
                name: 'age',
                message: '请输入年龄（或出生年份）',
                type: 'number',
                default: globalConfig.oldInputs.age,
              },
              {
                name: 'bodyFat',
                message: '请输入体脂率（%）',
                type: 'number',
                default: globalConfig.oldInputs.bodyFat,
              },
              {
                name: 'targetBodyFat',
                message: '请输入目标体脂率（%）',
                type: 'number',
                default: globalConfig.oldInputs.targetBodyFat,
              },
              {
                name: 'heatVacancy',
                message:
                  '请输入每日目标空缺热量（建议 400~800 之间，太高了掉肌肉，太低了效果差）',
                type: 'number',
                default: globalConfig.oldInputs.heatVacancy,
              },
              {
                name: 'ratio',
                message: '请选择合适的活动系数',
                type: 'list',
                default: globalConfig.oldInputs.ratio,
                choices: [
                  {
                    name: '01. 基本不运动（每天上下班甚至不用挤地铁）',
                    value: '1.1',
                  },
                  {
                    name: '02. 不怎么运动（上下班挤个地铁，再稍微走两步）',
                    value: '1.2',
                  },
                  {
                    name: '03. 偶尔散个步（心血来潮偶尔会散个步）',
                    value: '1.3',
                  },
                  {
                    name:
                      '04. 高频率散步（每周有固定的三到四次，五公里以上的散步计划）',
                    value: '1.4',
                  },
                  {
                    name:
                      '05. 低强度健身（一周三四次次健身房练半个小时，没有训练计划）',
                    value: '1.5',
                  },
                  {
                    name:
                      '06. 中强度健身（一周五次以上健身房无氧和有氧结合训练，有计划安排）',
                    value: '1.6',
                  },
                  {
                    name:
                      '07. 高强度健身（一天两练、有计划有安排的强悍的朋友）',
                    value: '1.7',
                  },
                  {
                    name: '08. 低强度行业（本身就从事教练等大消耗行业的）',
                    value: '1.8',
                  },
                  {
                    name: '09. 中强度行业（中级教练，自己练的也勤奋）',
                    value: '1.9',
                  },
                  {
                    name: '10. 高强度行业（高级教练，那都是打比赛的水平）',
                    value: '2.0',
                  },
                ],
              },
            ]).excute();
          },
        })
        .add({
          title: '根据输入参数计算数据',
          task: async () => {
            let {
              sex,
              weight,
              height,
              age,
              bodyFat,
              targetBodyFat,
              heatVacancy,
              ratio,
            } = globalConfig.userInputs;

            age = getAge(age);

            const basalMetabolic = calculateBasalMetabolic(
              sex,
              weight,
              height,
              age,
            );

            const totalMetabolic = basalMetabolic * ratio;

            const canEatCalorie = totalMetabolic - heatVacancy;

            const consumeFat = weight * ((bodyFat - targetBodyFat) / 100);

            const energyConsumption = consumeFat * 7700;

            const targetDay = energyConsumption / heatVacancy;

            logger.space();
            logger.info(`基础代谢 ${~~basalMetabolic} kcal`);
            logger.info(`总体代谢 ${~~totalMetabolic} kcal`);
            logger.info(`每天摄入 ${~~canEatCalorie} kcal`);
            logger.info(`需要减去 ${~~consumeFat * 2} 斤纯肥肉`);
            logger.info(`需要消耗 ${~~energyConsumption} kcal`);
            logger.info(`大概需要 ${~~targetDay} 天可以达到目标`);
            logger.space();
          },
        })
        .add({
          title: '',
          task: async () => {
            await fs.ensureFile(userInfoPath);
            await fs.writeJSON(userInfoPath, globalConfig.userInputs);
          },
        })
        .run();
    },
  );
};
