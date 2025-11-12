import AppContainer from '@/components/AppContainer';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-blue-50 py-16 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Next.js Currency Viewer
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            View real-time and historical exchange rates powered by Alpha Vantage API
          </p>
        </div>

        {/* Main App Container */}
        <AppContainer />

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Data provided by{' '}
            <a 
              href="https://www.alphavantage.co/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              Alpha Vantage
            </a>
            {' '}• Rate limited to 25 requests per day
          </p>
        </div>
      </div>
    </main>
  );
}