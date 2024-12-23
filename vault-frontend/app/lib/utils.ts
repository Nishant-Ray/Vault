import { months } from "@/app/lib/constants";

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

export function getCurrentMonth(): number {
  const today = new Date();
  const month = today.getMonth() + 1;
  const currMonth = month < 10 ? `0${month}` : month;
  return Number(`${today.getFullYear()}${currMonth}`);
}

export function getPreviousMonth(): number {
  const today = new Date();
  const prevMonthDate = new Date(today.getFullYear(), today.getMonth() - 1);
  const month = prevMonthDate.getMonth() + 1;
  const prevMonth = month < 10 ? `0${month}` : month;
  return Number(`${prevMonthDate.getFullYear()}${prevMonth}`);
}

export function getCurrentYear(): number {
  return (new Date()).getFullYear();
}

export function formatMonth(month: number): string {
  const monthString = String(month);
  return `${months[Number(monthString.substring(4))]} ${monthString.substring(0, 4)}`;
}

export function formatDate(date: number): string { // 20241203
  const dateString = String(date);
  return `${months[Number(dateString.substring(4, 6))]} ${Number(dateString.substring(6))}, ${dateString.substring(0, 4)}`;
}

export function formatMonthName(month: number): string {
  return `${months[Number(String(month).substring(4))]}`;
}