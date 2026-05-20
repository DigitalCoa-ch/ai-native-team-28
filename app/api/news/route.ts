import { NextResponse } from "next/server";
import type { NewsItem, MarketPrediction, NewsApiResponse } from "@/types/news";

const NEWS_SOURCES = [
  { name: "Reuters Business",    url: "https://feeds.reuters.com/reuters/businessNews",                        logo: "Reuters",  tags: ["markets","economy","finance"] },
  { name: "CNBC",                url: "https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=100003114", logo: "CNBC",      tags: ["markets","economy","trading"] },
  { name: "Bloomberg Markets",  url: "https://feeds.bloomberg.com/markets/news.rss",                          logo: "Bloomberg",tags: ["markets","economy","stocks"] },
  { name: "Financial Times",     url: "https://www.ft.com/rss/markets",                                        logo: "FT",        tags: ["markets","economy","global"] },
  { name: "BBC Business",        url: "https://feeds.bbci.co.uk/news/business/rss.xml",                      logo: "BBC",       tags: ["economy","global","policy"] },
  { name: "Wall Street Journal", url: "https://feeds.a.dj.com/rss/RSSMarketsMain.xml",                       logo: "WSJ",       tags: ["markets","economy","stocks"] },
  { name: "MarketWatch",         url: "https://feeds.marketwatch.com/marketwatch/topstories/",              logo: "MarketWatch",tags:["markets","stocks","trading"] },
  { name: "Investopedia",        url: "https://www.investopedia.com/feedbuilder/feed/getfeed?feedName=rss_headline", logo: "Inv", tags: ["education","markets","analysis"] },
];

const BULLISH_KW = ["surge","rally","gain","soar","jump","rise","growth","optimism","beat","exceed","strong","up","bullish","record high","breakout","upgrade","buy","support","stimulus","cut","rate cut","fed dovish","jobs","revenue","acquisition","deal","merger","expansion","profit","dividend"];
const BEARISH_KW = ["fall","drop","decline","plunge","tumble","crash","loss","bearish","recession","down","underperform","downgrade","sell","resistance","concern","warning","risk","tension","inflation","hike","rate hike","fed hawkish","layoffs","bankruptcy","default","slowdown","weak","miss","guidance cut","profit warning","tariff","trade war"];
const NEUTRAL_KW = ["volatile","uncertain","mixed","unchanged","stable","steady","hold","neutral","caution","monitor"];

const SECTOR_KW: Record<string,string[]> = {
  "Technology":   ["tech","ai","semiconductor","software","cloud","apple","google","microsoft","nvidia","meta","amazon","openai"],
  "Financials":   ["bank","jpmorgan","ubs","goldman","morgan","credit","loan","mortgage","finance","fintech"],
  "Energy":       ["oil","gas","energy","petroleum","opec","crude","natural gas","renewable","solar","wind"],
  "Healthcare":   ["health","pharma","drug","fda","biotech","hospital","medical","vaccine","pfizer","moderna"],
  "Consumer":     ["consumer","retail","shop","spending","sales","walmart","target","discretionary"],
  "Industrials":  ["industrial","manufacturing","defense","aerospace","construction","caterpillar"],
  "Materials":    ["gold","silver","copper","mining","commodities","materials","steel"],
  "Real Estate":  ["real estate","housing","mortgage","reit","property","home"],
};

const ASSET_KW: Record<string,string[]> = {
  "/NQ":   ["nasdaq","tech","nvidia","apple","meta","google","semiconductor","qqq"],
  "/ES":   ["s&p","sp500","equity","index","rally","broad market"],
  "USD/CAD":["canada","cad","loonie","oil","bank of canada","boc","boc"],
  "EUR/USD":["europe","euro","ecb","germany","france","european"],
  "GBP/USD":["uk","pound","boe","bank of england","london","sterling"],
  "Gold":  ["gold","xau","safe haven","inflation hedge","goldman"],
  "Oil":   ["oil","crude","opec","energy","petroleum","brent","wti"],
};

function sentiment(text: string): { sentiment: "bullish"|"bearish"|"neutral"; score: number } {
  const lower = text.toLowerCase();
  let score = 0;
  for (const kw of BULLISH_KW) if (lower.includes(kw)) score += 8;
  for (const kw of BEARISH_KW) if (lower.includes(kw)) score -= 8;
  for (const kw of NEUTRAL_KW) if (lower.includes(kw)) score += 1;
  score = Math.max(-100, Math.min(100, score));
  return score > 10 ? { sentiment: "bullish", score }
    : score < -10 ? { sentiment: "bearish", score }
    : { sentiment: "neutral", score };
}

function detectAssets(text: string): string[] {
  const lower = text.toLowerCase();
  const found: string[] = [];
  for (const [asset, kws] of Object.entries(ASSET_KW)) {
    if (kws.some(kw => lower.includes(kw))) found.push(asset);
  }
  return found.length ? found : ["/ES","/NQ"];
}

function detectSectors(text: string) {
  const lower = text.toLowerCase();
  return Object.entries(SECTOR_KW)
    .filter(([_, kws]) => kws.some(kw => lower.includes(kw)))
    .map(([sector]) => sector);
}

function parseRSS(xml: string, sourceName: string): NewsItem[] {
  const items: NewsItem[] = [];
  const itemRe = /<item>([\s\S]*?)<\/item>/gi;
  let m;
  let i = 0;
  while ((m = itemRe.exec(xml)) !== null && i < 8) {
    const body = m[1];
    const rawTitle = (body.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "").replace(/<!\[CDATA\[|\]\]>/g,"").trim();
    const rawDesc  = (body.match(/<description[^>]*>([\s\S]*?)<\/description>/i)?.[1] || body.match(/<content:encoded[^>]*>([\s\S]*?)<\/content:encoded>/i)?.[1] || "").replace(/<!\[CDATA\[|\]\]>/g,"").replace(/<[^>]+>/g,"").trim();
    const link    = (body.match(/<link>([\s\S]*?)<\/link>/i)?.[1] || body.match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1] || "").replace(/<!\[CDATA\[|\]\]>/g,"").trim();
    const pubDate = (body.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i)?.[1] || "").trim();

    if (!rawTitle) continue;
    const text = rawTitle + " " + rawDesc;
    const { sentiment: sent, score } = sentiment(text);
    const tags = Object.entries(SECTOR_KW)
      .filter(([_, kws]) => kws.some(kw => text.toLowerCase().includes(kw)))
      .map(([t]) => t);

    items.push({
      id: `news-${sourceName.replace(/\s/g,"")}-${Date.now()}-${i++}`,
      source: sourceName,
      sourceLogo: sourceName.split(" ")[0].slice(0,3).toUpperCase(),
      title: rawTitle.slice(0, 200),
      summary: rawDesc.slice(0, 300) || rawTitle.slice(0, 200),
      url: link || "#",
      publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
      sentiment: sent,
      sentimentScore: score,
      tags: tags.length ? tags : ["general"],
      relevanceScore: Math.max(20, 50 + Math.abs(score) * 0.5),
    });
  }
  return items;
}

async function fetchSource(src: typeof NEWS_SOURCES[0]): Promise<{ news: NewsItem[]; status: "ok"|"error"|"partial" }> {
  try {
    const res = await fetch(src.url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; MarketBot/1.0)", "Accept": "application/rss+xml, */*" },
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error(`${res.status}`);
    const xml = await res.text();
    const news = parseRSS(xml, src.name);
    return { news, status: news.length > 0 ? "ok" : "partial" };
  } catch (e) {
    console.error(`[${src.name}] fetch error:`, e);
    return { news: [], status: "error" };
  }
}

function buildPrediction(news: NewsItem[]): MarketPrediction {
  const avg  = news.reduce((s, n) => s + n.sentimentScore, 0) / news.length;
  const hi   = news.filter(n => n.relevanceScore > 65);
  const bulls = news.filter(n => n.sentiment === "bullish").length;
  const bears = news.filter(n => n.sentiment === "bearish").length;

  let direction: MarketPrediction["direction"];
  let headline: string;
  let reasoning: string;

  if (avg > 15 && bulls > bears * 1.5) {
    direction = "bullish";
    headline = "Bullish Bias Building — Risk Assets Look Firm";
    reasoning = `${hi.length} high-conviction stories with net bullish lean (avg sentiment ${avg.toFixed(0)}). Sector themes: ${[...new Set(hi.slice(0,4).flatMap(n=>n.tags))].join(", ")}. Market participants pricing in optimism.`;
  } else if (avg < -15 && bears > bulls * 1.5) {
    direction = "bearish";
    headline = "Bearish Pressure Mounting — Risk-Off Likely";
    reasoning = `Aggregate sentiment ${avg.toFixed(0)}, with ${bears} bearish vs ${bulls} bullish stories. Dominant themes: ${[...new Set(news.filter(n=>n.sentiment==="bearish").slice(0,3).flatMap(n=>n.tags))].join(", ")}. Expect selling pressure near resistance.`;
  } else if (Math.abs(avg) < 10) {
    direction = "neutral";
    headline = "Market in Equilibrium — Awaiting Catalyst";
    reasoning = `Sentiment balanced (${avg.toFixed(0)}). ${bulls} bullish / ${bears} bearish / ${news.length - bulls - bears} neutral. No strong directional edge; hold ranges, prepare for breakout.`;
  } else {
    direction = "volatile";
    headline = "Elevated Uncertainty — Volatility Expected";
    reasoning = "Mixed signals with conflicting sector themes. Watch for breakout above/below key levels. Range-bound chop likely before next catalyst.";
  }

  return {
    id: `pred-${Date.now()}`,
    timestamp: new Date().toISOString(),
    direction,
    confidence: Math.min(92, 45 + Math.abs(avg) * 0.7 + hi.length * 4),
    headline,
    reasoning,
    affectedAssets: detectAssets(news.map(n => n.title + " " + n.summary).join(" ")),
    timeframe: Math.abs(avg) > 25 ? "swing" : "intraday",
    newsSources: [...new Set(hi.slice(0,5).map(n => n.source))],
    sectorImpact: detectSectors(news.map(n => n.title + " " + n.summary).join(" ")).map(s => ({
      sector: s,
      impact: news.some(n => n.tags.includes(s) && n.sentiment === "bullish") ? "positive"
             : news.some(n => n.tags.includes(s) && n.sentiment === "bearish") ? "negative"
             : "mixed",
      description: `Sector sentiment driven by recent ${s.toLowerCase()} news flow`,
    })),
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(80, parseInt(searchParams.get("limit") || "40", 10));

  const results = await Promise.allSettled(NEWS_SOURCES.map(fetchSource));

  const allNews: NewsItem[] = [];
  const srcStatuses: NewsApiResponse["sources"] = [];

  results.forEach((r, i) => {
    const src = NEWS_SOURCES[i];
    if (r.status === "fulfilled") {
      allNews.push(...r.value.news);
      srcStatuses.push({ name: src.name, status: r.value.status, itemCount: r.value.news.length });
    } else {
      srcStatuses.push({ name: src.name, status: "error", itemCount: 0 });
    }
  });

  allNews.sort((a, b) => {
    if (b.relevanceScore !== a.relevanceScore) return b.relevanceScore - a.relevanceScore;
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  const predictions: MarketPrediction[] = allNews.length > 0 ? [buildPrediction(allNews)] : [];

  const response: NewsApiResponse = {
    news: allNews.slice(0, limit),
    predictions,
    fetchedAt: new Date().toISOString(),
    sources: srcStatuses,
  };

  return NextResponse.json(response, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
  });
}