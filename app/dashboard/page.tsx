import PortfolioBalance from '@/components/PortfolioBalance';

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <PortfolioBalance />
        </div>
        {/* Other dashboard components */}
      </div>
    </div>
  );
}
