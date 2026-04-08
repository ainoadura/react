import { DateTime } from 'luxon';

export const getDaysDifference = (dateA: string, dateB: DateTime): number => {
  const d1 = DateTime.fromFormat(dateA, 'dd/MM/yyyy');
  const d2 = dateB;

  if (!d1.isValid || !d2.isValid) {
    console.warn("One of the dates is invalid:", dateA);
    return 0;
  }

  const diff = d1.diff(d2, 'days').days;
  
  return Math.abs(Math.trunc(diff));
};
