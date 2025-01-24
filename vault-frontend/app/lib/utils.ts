import { months } from '@/app/lib/constants';
import { SelectOption, Bill, ResidenceBill } from '@/app/lib/definitions';

export function formatDollarAmount(amount: number): string {
  return '$' + amount.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

export function validDollarAmount(amount: number): boolean {
  if (amount === 0) return true;

  const numberString = String(amount);

  if (!numberString.length || (numberString.charAt(0) === '0' && numberString.charAt(1) !== '.')) return false;

  let count = 0;
  for (let i = numberString.length - 1; i >= 0; i--) {
    if (numberString.charAt(i) === '.') {
      return i != 0 && count <= 2;
    }
    count++;
  }

  return true;
}

export function getCurrentDate(): number { // YYYYMMDD
  const today = new Date();
  const month = today.getMonth() + 1;
  const currMonth = month < 10 ? `0${month}` : month;
  const date = today.getDate();
  const currDate = date < 10 ? `0${date}` : date;
  return Number(`${today.getFullYear()}${currMonth}${currDate}`);
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

export function getMonthFromDate(date: number): number { // YYYYMMDD --> YYYYMM
  return Number(String(date).substring(0, 6));
}

export function formatMonth(month: number): string {  // YYYYMM --> Mmm Yyyy
  const monthString = String(month);
  return `${months[Number(monthString.substring(4))]} ${monthString.substring(0, 4)}`;
}

export function formatDate(date: number): string { // YYYYMMDD --> Mmm Dd, Yyyy
  const dateString = String(date);
  return `${months[Number(dateString.substring(4, 6))]} ${Number(dateString.substring(6))}, ${dateString.substring(0, 4)}`;
}

export function formatMonthName(month: number): string { // YYYYMM --> Mmm
  return `${months[Number(String(month).substring(4))]}`;
}

export function unformatDate(dateString: string): number { // Date object string --> YYYYMMDD
  const dateObject = new Date(dateString);
  const month = dateObject.getUTCMonth() + 1;
  const currMonth = month < 10 ? `0${month}` : month;
  const date = dateObject.getUTCDate();
  const currDate = date < 10 ? `0${date}` : date;
  return Number(`${dateObject.getUTCFullYear()}${currMonth}${currDate}`);
}

export function reformatDate(dateNumber: number): string { // YYYYMMDD --> Date object string
  const dateString = String(dateNumber);
  const year = Number(dateString.substring(0, 4));
  const month = Number(dateString.substring(4, 6)) - 1;
  const date = Number(dateString.substring(6));
  return (new Date(year, month, date)).toISOString().substring(0, 10);
}

export function getNumberOfMonthsAgo(numMonthsAgo: number): number { // x --> YYYYMM - x
  const today = new Date();
  const month = today.getMonth() + 1 - numMonthsAgo;
  let currMonth;
  let year = today.getFullYear();
  if (month <= 0) {
    year--;
    currMonth = 12 + month;
  } else currMonth = month < 10 ? `0${month}` : month;
  return Number(`${year}${currMonth}`);
}

export function isBill(bill: Bill | ResidenceBill): boolean {
  return 'user_id' in bill;
}

// export function formatTime(dateTime: number): string {
//   const dateTimeString = String(dateTime);
//   const time = dateTimeString.substring(8);
//   let hour = '';
//   if (Number(time.substring(0, 2)) >= 13) hour = `${Number(time.substring(0, 2)) - 12}`;
//   else hour = time.substring(0, 2);

//   return `${hour}:${time.substring(2)} on ${formatDate(Number(dateTimeString.substring(0, 8)))}`
// }