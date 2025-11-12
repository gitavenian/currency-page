import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const from_currency = searchParams.get("currency");

  if (!from_currency) {
    return NextResponse.json(
      { error: "Missing currency query parameter." },
      { status: 400 }
    );
  }

  const apiUrl = `https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=${from_currency.toUpperCase()}&to_symbol=USD&outputsize=full&apikey=${API_KEY}`;

  try {
    const response = await fetch(apiUrl, { next: { revalidate: 604800 } });
    const data = await response.json();

    if (data["Error Message"] || data["Note"]) {
      const errorMsg =
        data["Error Message"] || data["Note"] || "Unknown API error.";
      if (
        errorMsg.includes("API call frequency") ||
        errorMsg.includes("25 requests per day")
      ) {
        return NextResponse.json(
          { error: "Alpha Vantage API rate limit exceeded. Try later." },
          { status: 429 }
        );
      }
      return NextResponse.json(
        { error: `API request failed: ${errorMsg}` },
        { status: 400 }
      );
    }

    const timeSeriesKey = Object.keys(data).find((key) =>
      key.includes("Time Series FX")
    ) as string;
    const timeSeries = data[timeSeriesKey];

    if (!timeSeries) {
      return NextResponse.json(
        { error: `Historical data for '${from_currency}' not found.` },
        { status: 404 }
      );
    }

    const historicalRates = Object.entries(timeSeries).map(
      ([date, values]: [string, any]) => ({
        date,
        rate: parseFloat(values["4. close"]).toFixed(6),
      })
    );

    return NextResponse.json({
      currencyCode: from_currency,
      rates: historicalRates,
    });
  } catch (error) {
    console.error("Historical API route error:", error);
    return NextResponse.json(
      { error: "Internal server error during historical data fetch." },
      { status: 500 }
    );
  }
}
