import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { fetchRevenue, fetchLatestInvoices, fetchCardData } from '../lib/data';
import { Revenue, LatestInvoice } from '../lib/definitions';

export default async function Page() {
  // Add error handling for each database query
  let revenue: Revenue[] = [];
  let latestInvoices: LatestInvoice[] = [];
  let cardData = {
    numberOfInvoices: 0,
    numberOfCustomers: 0,
    totalPaidInvoices: '$0.00',
    totalPendingInvoices: '$0.00',
  };

  try {
    revenue = await fetchRevenue();
  } catch (error) {
    console.error('Error fetching revenue:', error);
    // Continue with empty revenue data
  }

  try {
    latestInvoices = await fetchLatestInvoices();
  } catch (error) {
    console.error('Error fetching latest invoices:', error);
    // Continue with empty invoices data
  }

  try {
    cardData = await fetchCardData();
  } catch (error) {
    console.error('Error fetching card data:', error);
    // Continue with default card data
  }

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Collected" value={cardData.totalPaidInvoices} type="collected" />
        <Card title="Pending" value={cardData.totalPendingInvoices} type="pending" />
        <Card title="Total Invoices" value={cardData.numberOfInvoices} type="invoices" />
        <Card title="Total Customers" value={cardData.numberOfCustomers} type="customers" />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <RevenueChart revenue={revenue} />
        <LatestInvoices latestInvoices={latestInvoices} />
      </div>
    </main>
  );
}