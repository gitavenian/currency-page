import AppContainer from '@/components/AppContainer';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 sm:py-20 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-800 mb-4 tracking-tighter leading-tight">
            Next.js Currency Viewer
          </h1>
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto">
            View real-time and historical exchange rates powered by Alpha Vantage API
          </p>
        </div>

        <AppContainer />

        <div className="mt-16 text-center border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-500">
            Data provided by{' '}
            <a 
              href="https://www.alphavantage.co/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 font-medium underline"
            >
              Alpha Vantage
            </a>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            *Please note: API usage is rate-limited to 25 requests per day.
          </p>
        </div>
      </div>
    </main>
  );
}