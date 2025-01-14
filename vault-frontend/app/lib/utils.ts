import { months } from '@/app/lib/constants';
import { SelectOption } from '@/app/lib/definitions';

export function formatDollarAmount(amount: number): string {
  const originalAmount = String(amount);
  let formattedAmount = [];
  let seenDecimal = false;
  let count = 0;

  for (let i = originalAmount.length - 1; i >= 0; i--) { // 1234.56
    const c = originalAmount.charAt(i);

    if (!seenDecimal) {
      if (c === '.') seenDecimal = true;
      formattedAmount.push(c);
    } else {
      if (count == 3) {
        formattedAmount.push(',');
        count = 0;
      }
      formattedAmount.push(c);
      count++;
    }
  }

  formattedAmount.push('$');
  return formattedAmount.reverse().join('');
}

export function getLast12MonthsAsOptions(): SelectOption[] {
  const today = new Date();
  let last12Months: SelectOption[] = [];

  for (let i = 0; i <= 12; i++) {
    const prevMonthDate = new Date(today.getFullYear(), today.getMonth() - i);
    const month = prevMonthDate.getMonth() + 1;
    const prevMonth = month < 10 ? `0${month}` : month;
    const monthNumber = Number(`${prevMonthDate.getFullYear()}${prevMonth}`);
    last12Months.push({value: monthNumber, text: formatMonth(monthNumber)});
  }

  return last12Months;
}

export function getCurrentMonth(): number { // YYYYMM
  const today = new Date();
  const month = today.getMonth() + 1;
  const currMonth = month < 10 ? `0${month}` : month;
  return Number(`${today.getFullYear()}${currMonth}`);
}

export function getPreviousMonth(): number { // YYYYMM
  const today = new Date();
  const prevMonthDate = new Date(today.getFullYear(), today.getMonth() - 1);
  const month = prevMonthDate.getMonth() + 1;
  const prevMonth = month < 10 ? `0${month}` : month;
  return Number(`${prevMonthDate.getFullYear()}${prevMonth}`);
}

export function getPreviousMonthFromMonth(month: number): number { // YYYYMM
  const fullMonthString = String(month);
  let yearNumber = Number(fullMonthString.substring(0, 4));
  let monthNumber = Number(fullMonthString.substring(4));
  if (monthNumber === 1) {
    yearNumber--;
    monthNumber = 12;
  } else monthNumber--;
  
  return Number(`${yearNumber}${monthNumber}`);
}

export function getCurrentYear(): number { // YYYY
  return (new Date()).getFullYear();
}

export function getLast5YearsAsOptions(): SelectOption[] {
  const thisYear = (new Date()).getFullYear();
  let last5Years: SelectOption[] = [];

  for (let i = 0; i <= 5; i++) {
    last5Years.push({value: thisYear - i, text: String(thisYear - i)});
  }

  return last5Years;
}

export function formatMonth(month: number): string {  // Mmm YYYY
  const monthString = String(month);
  return `${months[Number(monthString.substring(4))]} ${monthString.substring(0, 4)}`;
}

export function formatDate(date: number): string { // YYYYMMDD
  const dateString = String(date);
  return `${months[Number(dateString.substring(4, 6))]} ${Number(dateString.substring(6))}, ${dateString.substring(0, 4)}`;
}

export function formatMonthName(month: number): string { // Mmm
  return `${months[Number(String(month).substring(4))]}`;
}

// export function formatTime(dateTime: number): string {
//   const dateTimeString = String(dateTime);
//   const time = dateTimeString.substring(8);
//   let hour = '';
//   if (Number(time.substring(0, 2)) >= 13) hour = `${Number(time.substring(0, 2)) - 12}`;
//   else hour = time.substring(0, 2);

//   return `${hour}:${time.substring(2)} on ${formatDate(Number(dateTimeString.substring(0, 8)))}`
// }