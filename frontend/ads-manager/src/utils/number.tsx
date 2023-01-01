export const getRandom = () => Math.random();

export const getThousandString = (val: number, fixNumber = 2, prefix = '') => {
  if (val >= 10000) {
    return `${prefix}${parseFloat(String(val / 1000)).toFixed(fixNumber)}K`;
  }
};

export const getThousandFormat = (val: number, prefix = '') => {
  const numberFormated = new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 2,
  }).format(val);
  return `${prefix}${numberFormated}`;
};
