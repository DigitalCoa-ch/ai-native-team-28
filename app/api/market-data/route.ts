import { NextResponse } from "next/server";

const FX_BASE = "https://open.er-api.com/v6/latest/USD";

interface MarketData {
  fetchedAt: string;
  forex: Record<string, { rate: number; change24h: number }>;
  crypto: Record<string, { price: number; change24h: number }>;
  commodities: Record<string, { price: number; unit: string }>;
  indices: Record<string, { value: number; change: number }>;
  status: Record<string, "ok" | "error">;
}

async function getJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

export async function GET() {
  const fetchedAt = new Date().toISOString();
  const status: Record<string, "ok" | "error"> = {};

  // ── Forex: exchange-rate-api (free, no key) ──────────────────────────────
  let forex: Record<string, { rate: number; change24h: number }> = {};
  try {
    const fxData = await getJson<{ rates: Record<string, number> }>(FX_BASE);
    if (fxData?.rates) {
      const rates = fxData.rates;
      forex = {
        EUR: { rate: rates.EUR ?? 0, change24h: 0 },
        GBP: { rate: rates.GBP ?? 0, change24h: 0 },
        JPY: { rate: rates.JPY ?? 0, change24h: 0 },
        CAD: { rate: rates.CAD ?? 0, change24h: 0 },
        CHF: { rate: rates.CHF ?? 0, change24h: 0 },
        AUD: { rate: rates.AUD ?? 0, change24h: 0 },
        CNY: { rate: rates.CNH ?? rates.CNY ?? 0, change24h: 0 },
        MXN: { rate: rates.MXN ?? 0, change24h: 0 },
        BRL: { rate: rates.BRL ?? 0, change24h: 0 },
        INR: { rate: rates.INR ?? 0, change24h: 0 },
        BTC: { rate: 1 / (rates.XBT ?? rates.BTC ?? 1), change24h: 0 },
      };
      status.forex = "ok";
    }
  } catch { status.forex = "error"; }

  // ── Crypto: CoinGecko (free, no key) ────────────────────────────────────
  let crypto: Record<string, { price: number; change24h: number }> = {};
  try {
    const cgData = await getJson<Record<string, { usd: number; usd_24h_change?: number }>>(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,ripple,cardano&vs_currencies=usd&include_24hr_change=true"
    );
    if (cgData) {
      crypto = {
        BTC: { price: cgData.bitcoin?.usd ?? 0, change24h: cgData.bitcoin?.usd_24h_change ?? 0 },
        ETH: { price: cgData.ethereum?.usd ?? 0, change24h: cgData.ethereum?.usd_24h_change ?? 0 },
        SOL: { price: cgData.solana?.usd ?? 0, change24h: cgData.solana?.usd_24h_change ?? 0 },
        XRP: { price: cgData.ripple?.usd ?? 0, change24h: cgData.ripple?.usd_24h_change ?? 0 },
        ADA: { price: cgData.cardano?.usd ?? 0, change24h: cgData.cardano?.usd_24h_change ?? 0 },
      };
      status.crypto = "ok";
    }
  } catch { status.crypto = "error"; }

  // ── Crypto: Binance (free, no key) for altcoins ──────────────────────────
  let binanceCrypto: Record<string, { price: number; change24h: number }> = {};
  try {
    const symbols = ["BNBUSDT", "ADAUSDT", "DOGEUSDT", "DOTUSDT", "LINKUSDT"];
    await Promise.all(
      symbols.map(async (sym) => {
        const data = await getJson<{ price: string }>(
          `https://api.binance.com/api/v3/ticker/price?symbol=${sym}`
        );
        if (data?.price) {
          const symbol = sym.replace("USDT", "");
          binanceCrypto[symbol] = { price: parseFloat(data.price), change24h: 0 };
        }
      })
    );
    if (Object.keys(binanceCrypto).length > 0) status.crypto = "ok";
  } catch { /* Binance is best-effort */ }

  // ── Commodities via metals.live ──────────────────────────────────────────
  let commodities: Record<string, { price: number; unit: string }> = {};
  try {
    const metalData = await getJson<Record<string, { price: number }>>(
      "https://api.metals.live/v1/quote/gold,silver,copper"
    );
    if (metalData) {
      commodities = {
        Gold: { price: metalData.gold?.price ?? 0, unit: "oz" },
        Silver: { price: metalData.silver?.price ?? 0, unit: "oz" },
        Copper: { price: metalData.copper?.price ?? 0, unit: "lb" },
      };
      status.commodities = "ok";
    }
  } catch { status.commodities = "error"; }

  // ── Major indices via Stooq CSV (public, no key) ─────────────────────────
  let indices: Record<string, { value: number; change: number }> = {};
  try {
    // Fetch S&P 500 from stooq (public CSV endpoint)
    const spxData = await getJson<string>(
      "https://stooq.com/q/d/l/?s=^spx&i=d"
    );
    if (spxData && spxData.includes(",")) {
      const lines = spxData.trim().split("\n");
      const last = lines[lines.length - 1];
      const prev = lines.length > 1 ? lines[lines.length - 2] : last;
      const vals = last.split(",");
      const prevVals = prev.split(",");
      const price = parseFloat(vals[1]);
      const prevPrice = parseFloat(prevVals[1]);
      if (!isNaN(price)) {
        indices["SPX"] = {
          value: price,
          change: isNaN(prevPrice) ? 0 : ((price - prevPrice) / prevPrice) * 100,
        };
        status.indices = "ok";
      }
    }
  } catch { status.indices = "error"; }

  const data: MarketData = { fetchedAt, forex, crypto: { ...crypto, ...binanceCrypto }, commodities, indices, status };
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
    },
  });
}
