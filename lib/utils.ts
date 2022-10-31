
export const dateIsValid = (date: object) => {
  return date instanceof Date && !isNaN(date as any);
}

export const fromLowerCaseToFirstUpperCase = (value: string) => {
  if (value.length <= 0) return value;
  return value.charAt(0).toUpperCase() + value.slice(1)
}