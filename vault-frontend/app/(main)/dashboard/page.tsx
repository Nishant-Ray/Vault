import { dmSans } from '@/app/ui/fonts';
import Card from '@/app/ui/card';
import clsx from 'clsx';

export default function Page() {
  const name = 'John';

  const monthlySpending = '$1,522.76';
  const currMonth = 'Dec 2024';
  const prevMonth = 'Nov 2024';
  const percentChange = '↑16.3%';
  const positive = percentChange.charAt(0) === '↓';  // vs ↑

  const currYear = '2024';

  const transactions = [
    {cardName: 'BoFA', date: '12/06/24', amount: '$56.01', description: 'UCLA STORE: THANK YOU FOR SHOPPING!'},
    {cardName: 'Amex', date: '12/02/24', amount: '$1.79', description: 'Amazon.com'},
    {cardName: 'Amex', date: '12/01/24', amount: '$233.34', description: 'In n Out'},
  ];

  return (
    <main>
      <h1 className={`${dmSans.className} antialiased tracking-tighter text-off_black text-2xl font-semibold mb-6`}>Welcome, {name}!</h1>
      
      <div className="flex flex-row flex-wrap items-start gap-8">
        <Card>
          <div className="flex flex-row gap-16">
            <h3 className="text-lg font-medium text-off_black">Monthly Spending</h3>
            <h3 className="text-lg font-normal text-gray-500">{currMonth}</h3>
          </div>
          
          <h2 className={`${dmSans.className} antialiased tracking-tight text-4xl font-semibold my-4`}>{monthlySpending}</h2>
        
          <div className="flex flex-row items-center gap-2">
            <div className={clsx("rounded-3xl flex items-center justify-center px-2 py-1", { "bg-positive": positive, "bg-negative": !positive })}>
              <p className={clsx("text-md font-medium", { "text-positive_text": positive, "text-negative_text": !positive })}>{percentChange}</p>
            </div>
            <h4 className="text-md font-normal text-gray-400">Compared to {prevMonth}</h4>
          </div>
        </Card>

        <Card>
          <div className="flex flex-row gap-72">
            <h3 className="text-lg font-medium text-off_black">Yearly Spending</h3>
            <h3 className="text-lg font-normal text-gray-500">{currYear}</h3>
          </div>
          
          <div className="w-full h-72 mt-4 bg-gray-300"></div>
        </Card>

        <Card>
          <h3 className="text-lg font-medium text-off_black">Recent Transactions</h3>
          
          <div className="mt-2 flex flex-col">
            <div className="flex flex-row items-center gap-16 mt-4">
              <h4 className="w-12 text-gray-400 font-normal text-md">Card</h4>
              <h4 className="w-16 text-gray-400 font-normal text-md">Date</h4>
              <h4 className="w-16 text-gray-400 font-normal text-md">Amount</h4>
              <h4 className="w-32 text-gray-400 font-normal text-md">Description</h4>
            </div>

            {transactions.map((transaction, i) => {
              return (
                <div key={i} className="flex flex-row items-center gap-16 border-t-2 border-gray-200 my-2 pt-4">
                  <h4 className="w-12 text-off_black font-normal text-md">{transaction.cardName}</h4>
                  <h4 className="w-16 text-off_black font-normal text-md">{transaction.date}</h4>
                  <h4 className="w-16 text-off_black font-semibold text-md">{transaction.amount}</h4>
                  <h4 className="w-32 text-off_black font-normal text-md truncate">{transaction.description}</h4>
                </div>
              );
            })}

          </div>
        </Card>
      </div>

    </main>
  );
}
