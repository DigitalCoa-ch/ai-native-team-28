export interface NewsItem {
  id: string;
  source: string;
  sourceLogo: string;
  title: string;
  summary: string;
  url: string;
  publishedAt: string;
  sentiment: "bullish" | "bearish" | "neutral";
  sentimentScore: number; // -100 to +100
  tags: string[];
  relevanceScore: number; // 0-100, how market-relevant
}

export interface MarketPrediction {
  id: string;
  timestamp: string;
  direction: "bullish" | "bearish" | "neutral" | "volatile";
  confidence: number; // 0-100
  headline: string;
  reasoning: string;
  affectedAssets: string[]; // e.g. ["/NQ", "/ES", "USD/CAD"]
  timeframe: "intraday" | "swing" | "positional";
  newsSources: string[];
  sectorImpact: {
    sector: string;
    impact: "positive" | "negative" | "mixed";
    description: string;
  }[];
}

export interface NewsApiResponse {
  news: NewsItem[];
  predictions: MarketPrediction[];
  fetchedAt: string;
  sources: {
    name: string;
    status: "ok" | "error" | "partial";
    itemCount: number;
  }[];
}