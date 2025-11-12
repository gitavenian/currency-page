import AppContainer from '@/components/AppContainer';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-16 px-4 sm:px-8">
      <h1 className="text-5xl font-extrabold text-center text-gray-900 mb-10 tracking-tight">
        Next.js Currency Viewer
      </h1>

      <AppContainer />
    </main>
  );
}