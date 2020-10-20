import { CreateAPI } from '@oishi/oishi-shared';

const service = new CreateAPI(
  'https://cybertron-application-api.souche-inc.com',
);

export interface IGetApplicationList {
  page: number;
  pageSize: number;
  appType?: number;
}

export const getApplicationList = async (params: IGetApplicationList) =>
  service.getJSON(`/application/list`, params, {
    headers: { cookie: '_security_token_inc=91602724851399184' },
  });
