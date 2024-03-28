import { scale } from 'react-native-size-matters';
import { textMappings } from './mappings';
// const result: any = {};
// const arr = new Array(50).fill(null).map((_, i) => (result[i] = `text-[${i}px]`));
// console.log(result);

const createMapping = (obj: any) => {
  const result: { [key: string]: string } = {};
  Object.entries(obj).map(([key, value]: [string, any]) => {
    result[key] = textMappings[Math.round(scale(+value)).toString()];
  });
  return result;
};

export const textSizes = createMapping({
  xs: 8,
  sm: 13,
  md: 18,
  lg: 23,
  xl: 28,
});
