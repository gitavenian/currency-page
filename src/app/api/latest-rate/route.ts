// src/app/api/latest-rate/route.ts

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

  const TO_CURRENCY = "USD";

  const apiUrl = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${from_currency.toUpperCase()}&to_currency=${TO_CURRENCY}&apikey=${API_KEY}`;

  try {
    const response = await fetch(apiUrl, {
      next: { revalidate: 3600 },
    });
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

    const rateInfo = data["Realtime Currency Exchange Rate"];

    if (!rateInfo) {
      return NextResponse.json(
        { error: `Currency code '${from_currency}' not found or invalid.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      currencyCode: rateInfo["1. From_Currency Code"],
      usdRate: rateInfo["5. Exchange Rate"],
      lastRefreshed: rateInfo["6. Last Refreshed"],
    });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Internal server error during data fetch." },
      { status: 500 }
    );
  }
}
