export const thousandSeparator = (x: number): string | number => {
  if (Number.isNaN(x)) {
    return x;
  }
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const listYears = (back: number) => {
  const year = new Date().getFullYear();
  return Array.from({ length: back }, (_v, i) => year - back + i + 1);
};
