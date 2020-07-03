import { CreateAPI } from '@oishi/oishi-shared';

const service = new CreateAPI('http://food.boohee.com');

export const getFoodDetail = (food: string) =>
  service.getJSON(`/fb/v1/foods/${food}/mode_show`, {});

interface ISearchFood {
  word: string;
  page: number;
}

export const searchFood = (query: ISearchFood) => {
  if (query.page !== 0 && !query.page) throw new Error('query.page error');
  return service.getJSON(`/fb/v1/search`, { q: query.word, page: query.page });
};

export interface IGetFoodList {
  // 1~12
  // 1~30
  // 1~7
  value: number;
  page: number;
  kind: 'group' | 'brand' | 'restaurant';
  order_asc?: 0 | 1;
  order_by?:
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
    | 18
    | 19
    | 20
    | 21
    | 22
    | 23;
}

interface IFood {
  id: number;
  code: string;
  name: string;
  thumb_image_url: string;
  is_liquid: boolean;
  health_light: number;
  weight: string;
  calory: string;
  fat: string;
  protein: string;
  fiber_dietary: string;
  carbohydrate: string;
  vitamin_a: string;
  thiamine: string;
  lactoflavin: string;
  vitamin_c: string;
  vitamin_e: string;
  niacin: string;
  natrium: string;
  calcium: string;
  iron: string;
  kalium: string;
  iodine: string;
  zinc: string;
  selenium: string;
  magnesium: string;
  copper: string;
  manganese: string;
  cholesterol: string;
}

export interface IGetFoodListResp {
  page: number;
  total_pages: number;
  foods: IFood[];
}

export const getFoodList = (query: IGetFoodList) => {
  query.order_asc = query.order_asc ? query.order_asc : 0;
  query.order_by = query.order_by ? query.order_by : 1;

  if (!query.kind) throw new Error('query.kind error');
  if (query.value !== 0 && !query.value) throw new Error('query.value error');
  if (query.page !== 0 && !query.page) throw new Error('query.page error');

  return service.getJSON<IGetFoodListResp>(`/fb/v1/foods`, query);
};
