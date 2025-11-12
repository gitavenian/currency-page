# Next.js Currency Viewer

A modern web application built with Next.js that displays real-time and historical currency exchange rates using the Alpha Vantage API. Features include intelligent caching, date range filtering, and a clean, responsive interface.

## Features

- 🔍 **Real-time Exchange Rates** - Search for latest currency rates against USD
- 📊 **Historical Data** - View exchange rates over custom date ranges
- 💾 **Smart Caching** - Reduces API calls by caching previous searches
- 🎨 **Modern UI** - Clean, responsive design with TailwindCSS
- ⚡ **Fast Performance** - Optimized with Next.js server-side caching
- 🛡️ **Error Handling** - Comprehensive error management and user feedback

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Alpha Vantage API key (free tier available)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/gitavenian/currency-page
cd currency-page
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure Environment Variables

1. Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

2. Get your free API key from [Alpha Vantage](https://www.alphavantage.co/support/#api-key)

3. Add your API key to `.env.local`:

```
ALPHA_VANTAGE_API_KEY=your_actual_api_key_here
```

**Important:** Never commit `.env.local` to version control!

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## Usage

### Latest Exchange Rate Search

1. Click "Latest Rate Search" tab
2. Enter a 3-letter currency code (e.g., EUR, GBP, JPY)
3. Click "Search" to view the current rate against USD

### Historical Data Search

1. Click "Historical Range Search" tab
2. Enter a currency code
3. Select start and end dates
4. Click "Get Historical Data" to view rates in the date range

## API Rate Limits

- **Free Tier:** 25 requests per day
- The app implements caching to minimize API calls
- Historical data is cached for 7 days
- Latest rates are cached for 1 hour

## Technology Stack

- **Framework:** Next.js 16
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **API:** Alpha Vantage Currency Exchange API

## Project Structure

currency-page/
├── src/
│ ├── app/
│ │ ├── api/
│ │ │ ├── latest-rate/
│ │ │ │ └── route.ts # Latest rate API endpoint
│ │ │ └── historical-rate/
│ │ │ └── route.ts # Historical data API endpoint
│ │ ├── layout.tsx # Root layout
│ │ ├── page.tsx # Home page
│ │ └── globals.css # Global styles
│ ├── components/
│ │ ├── AppContainer.tsx # Main container with tab navigation
│ │ ├── CurrencySearch.tsx # Latest rate search component
│ │ ├── DateSearch.tsx # Historical search component
│ │ └── HistoricalDataTable.tsx # Table for displaying historical data
│ ├── hooks/
│ │ ├── useLatestRate.ts # Hook for fetching and caching latest rates
│ │ └── useHistoricalData.ts # Hook for fetching and caching historical data
│ └── types/
│ └── currency.ts # Type definitions for currency data
├── .env.example # Environment variables template
├── package.json
└── README.md

## Troubleshooting

### API Rate Limit Exceeded

If you see "API rate limit exceeded", you've hit the 25 requests/day limit. Wait 24 hours or upgrade to a paid plan.

### Invalid Currency Code

Ensure you're using valid 3-letter ISO currency codes (e.g., USD, EUR, GBP).

### No Historical Data

Some currency pairs may have limited historical data. Try a major currency like EUR or GBP.

## License

This project is created for educational purposes.

## Contact

For issues or questions, please open a GitHub issue.
