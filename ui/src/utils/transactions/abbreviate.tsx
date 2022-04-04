export const abbreviate = (str: string, len = 20) => {
  return str.slice(0, len) + "..." + str.slice(-len);
};
