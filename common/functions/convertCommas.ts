const convertCommas = (value: number | undefined) => {
  const stringValue = value ? `${value}` : '';
  const formattedValue = stringValue.replace(/,/g, '');
  return formattedValue;
};

export default convertCommas;
