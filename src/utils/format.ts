export const toRupiah = (amount = 0) => {
  return 'Rp ' + amount.toLocaleString('id-ID').replaceAll('.', ',');
};

export const seperateValueWithDash = (value: string): string => {
  const separatedValue = value.replace(/\B(?=(\d{4})+(?!\d))/g, ' ');
  return separatedValue;
};

export const maskNumericValue = (value: string) => {
  if (!value) {
    return '';
  }

  return Number(value).toLocaleString('id-ID');
};

export const isPDF = (file: File | null) => {
  return !file || file.type === 'application/pdf';
};
