export const calculateBasalMetabolic = (
  sex: 'man' | 'woman',
  weight: number,
  height: number,
  age: number,
) => {
  return sex === 'man'
    ? ~~(66 + 13.8 * weight + 5 * height - 6.8 * age)
    : ~~(655 + 9.6 * weight + 1.9 * height - 4.7 * age);
};

export const fixTime = (time: number) =>
  time > 10 ? String(time) : `0${time}`;

// eslint-disable-next-line no-return-assign
export const getTime = (now?: Date) =>
  // eslint-disable-next-line no-param-reassign
  (now instanceof Date || (now = new Date())) &&
  `${now.getFullYear()}-${fixTime(now.getMonth() + 1)}-${fixTime(
    now.getDate(),
  )}`;

export const getAge = (age: number) =>
  age > 500 ? new Date().getFullYear() - age : age;
