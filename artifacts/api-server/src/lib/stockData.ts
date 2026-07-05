// PortfolioPilot mock stock universe with realistic financial data

export interface StockData {
  ticker: string;
  company: string;
  exchange: string;
  sector: string;
  industry: string;
  description: string;
  price: number;
  change1d: number;
  change1dPct: number;
  marketCap: string;
  peRatio: number | null;
  forwardPE: number | null;
  pbRatio: number | null;
  psRatio: number | null;
  pegRatio: number | null;
  dividendYield: number | null;
  dividendGrowth5y: number | null;
  revenueGrowth: number;
  epsGrowth: number;
  roe: number;
  operatingMargin: number;
  freeCashFlow: string;
  beta: number;
  volume: string;
  avgVolume: string;
  week52High: number;
  week52Low: number;
  analystRating: string;
  targetPrice: number | null;
  institutionalOwnership: number;
  insiderOwnership: number;
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  competitors: string[];
  basePrice52w: number;
}

export const STOCK_UNIVERSE: Record<string, StockData> = {
  AAPL: {
    ticker: "AAPL", company: "Apple Inc.", exchange: "NASDAQ", sector: "Technology", industry: "Consumer Electronics",
    description: "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. Apple's ecosystem includes iOS, macOS, watchOS, and the App Store, creating powerful lock-in.",
    price: 213.49, change1d: 2.14, change1dPct: 1.01, marketCap: "3.29T", peRatio: 33.2, forwardPE: 29.8, pbRatio: 47.1, psRatio: 8.4, pegRatio: 2.8,
    dividendYield: 0.45, dividendGrowth5y: 5.8, revenueGrowth: 6.1, epsGrowth: 10.3, roe: 147.3, operatingMargin: 30.8,
    freeCashFlow: "$107B", beta: 1.19, volume: "58.2M", avgVolume: "61.4M", week52High: 237.23, week52Low: 164.08,
    analystRating: "Buy", targetPrice: 240.00, institutionalOwnership: 61.2, insiderOwnership: 0.1,
    swot: {
      strengths: ["Massive brand loyalty and ecosystem lock-in", "Industry-leading margins in consumer hardware", "Services segment growing 15%+ annually", "Strong balance sheet with $162B in cash and equivalents"],
      weaknesses: ["Heavy iPhone concentration (55% of total revenue)", "Slowing growth in China amid geopolitical tensions", "High premium pricing limits total addressable market"],
      opportunities: ["Vision Pro and spatial computing as next platform", "India market expansion — under 5% penetration today", "Healthcare and financial services ecosystem expansion", "AI features across all product lines driving upgrades"],
      threats: ["Antitrust scrutiny on App Store fee policies in US and EU", "Samsung and Chinese OEM competition at lower price points", "EU regulatory pressure on hardware and software bundling", "Consumer spending slowdown affecting premium device sales"],
    },
    competitors: ["MSFT", "GOOGL", "AMZN", "META"], basePrice52w: 168.00,
  },
  MSFT: {
    ticker: "MSFT", company: "Microsoft Corporation", exchange: "NASDAQ", sector: "Technology", industry: "Software—Infrastructure",
    description: "Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide. Azure cloud platform, Office 365, LinkedIn, and Xbox represent key business segments.",
    price: 441.73, change1d: -1.23, change1dPct: -0.28, marketCap: "3.28T", peRatio: 37.4, forwardPE: 32.1, pbRatio: 13.2, psRatio: 13.9, pegRatio: 2.4,
    dividendYield: 0.68, dividendGrowth5y: 10.1, revenueGrowth: 15.7, epsGrowth: 20.1, roe: 35.8, operatingMargin: 44.5,
    freeCashFlow: "$74B", beta: 0.89, volume: "18.7M", avgVolume: "20.1M", week52High: 468.35, week52Low: 309.02,
    analystRating: "Strong Buy", targetPrice: 510.00, institutionalOwnership: 73.4, insiderOwnership: 1.1,
    swot: {
      strengths: ["Azure cloud growing 28% YoY with strong AI tailwinds", "Office 365 monopoly in enterprise productivity globally", "OpenAI partnership gives first-mover advantage in enterprise AI", "Diversified revenue across cloud, gaming, LinkedIn, and search"],
      weaknesses: ["High valuation leaves little room for execution errors", "Gaming division (Xbox) facing intense Sony competition", "Core Windows and Office markets reaching saturation"],
      opportunities: ["Copilot AI monetization across all Microsoft products", "Government and defense cloud contracts (JEDI successor)", "Activision Blizzard integration expanding gaming portfolio", "Healthcare and education cloud vertical expansion"],
      threats: ["Google Workspace and Salesforce competing for enterprise", "EU and US antitrust scrutiny on cloud and AI practices", "Cybersecurity incidents creating enterprise trust issues", "Enterprise IT budget constraints in economic downturns"],
    },
    competitors: ["GOOGL", "AMZN", "CRM", "ORCL"], basePrice52w: 316.00,
  },
  NVDA: {
    ticker: "NVDA", company: "NVIDIA Corporation", exchange: "NASDAQ", sector: "Technology", industry: "Semiconductors",
    description: "NVIDIA Corporation designs GPU accelerators used in AI training, data centers, gaming, and automotive applications. CUDA software ecosystem creates enormous competitive moats.",
    price: 135.72, change1d: 3.87, change1dPct: 2.94, marketCap: "3.33T", peRatio: 47.2, forwardPE: 36.5, pbRatio: 38.4, psRatio: 27.8, pegRatio: 1.1,
    dividendYield: 0.03, dividendGrowth5y: 8.2, revenueGrowth: 122.4, epsGrowth: 462.1, roe: 123.8, operatingMargin: 62.1,
    freeCashFlow: "$37B", beta: 1.71, volume: "312.5M", avgVolume: "287.3M", week52High: 149.77, week52Low: 47.32,
    analystRating: "Strong Buy", targetPrice: 175.00, institutionalOwnership: 65.7, insiderOwnership: 3.8,
    swot: {
      strengths: ["Dominant position in AI GPU market with 80%+ share", "CUDA software ecosystem creates massive switching costs", "Data center revenue growing 400%+ YoY driven by AI demand", "Operating margins expanding dramatically with scale benefits"],
      weaknesses: ["Extreme concentration in AI infrastructure capital spending", "US export restrictions limiting revenue from China market", "Single-source dependency on TSMC for leading-edge manufacturing"],
      opportunities: ["AI inference market in very early innings of growth", "Blackwell architecture unlocking new AI use case categories", "Automotive and robotics GPU market expanding rapidly", "Sovereign AI investments globally creating new demand centers"],
      threats: ["AMD MI300X gaining traction in AI training market", "Custom silicon from Google (TPUs) and Amazon (Trainium) reducing TAM", "Geopolitical risk with Taiwan-based TSMC supply chain", "AI bubble risk if hyperscaler spending slows unexpectedly"],
    },
    competitors: ["AMD", "INTC", "QCOM", "GOOGL"], basePrice52w: 49.00,
  },
  GOOGL: {
    ticker: "GOOGL", company: "Alphabet Inc.", exchange: "NASDAQ", sector: "Technology", industry: "Internet Content & Information",
    description: "Alphabet Inc. provides search, advertising, cloud computing, YouTube, and AI services worldwide. Google Cloud and AI (Gemini) are key growth drivers alongside the dominant search business.",
    price: 183.24, change1d: 0.87, change1dPct: 0.48, marketCap: "2.26T", peRatio: 22.1, forwardPE: 19.8, pbRatio: 7.1, psRatio: 6.5, pegRatio: 1.3,
    dividendYield: null, dividendGrowth5y: null, revenueGrowth: 14.8, epsGrowth: 31.4, roe: 31.7, operatingMargin: 31.6,
    freeCashFlow: "$67B", beta: 1.03, volume: "22.1M", avgVolume: "24.8M", week52High: 201.42, week52Low: 130.67,
    analystRating: "Buy", targetPrice: 220.00, institutionalOwnership: 68.4, insiderOwnership: 5.9,
    swot: {
      strengths: ["Search dominance with 90%+ global market share provides pricing power", "YouTube is the #2 social platform with strong monetization", "Google Cloud growing 28% with expanding AI product portfolio", "Waymo autonomous vehicle technology years ahead of competition"],
      weaknesses: ["Advertising revenue concentration at 77% of total revenue", "DOJ antitrust suit threatens core search distribution agreements", "Gemini AI perception trailing OpenAI/Claude in enterprise mindshare"],
      opportunities: ["AI Overviews monetization within the dominant search product", "Google Cloud accelerating enterprise AI workload adoption", "YouTube Shorts growing as legitimate TikTok competitive threat", "Waymo commercialization scaling in major US metropolitan markets"],
      threats: ["DOJ antitrust ruling could mandate structural changes to search", "ChatGPT and AI search disrupting traditional search behavior patterns", "TikTok competition intensifying for advertising dollars and attention", "Apple potentially developing proprietary search to replace Google on iOS"],
    },
    competitors: ["META", "MSFT", "AMZN", "AAPL"], basePrice52w: 133.00,
  },
  META: {
    ticker: "META", company: "Meta Platforms Inc.", exchange: "NASDAQ", sector: "Technology", industry: "Internet Content & Information",
    description: "Meta Platforms operates Facebook, Instagram, WhatsApp, and Threads — reaching 3.3B+ daily active users. The company is investing heavily in AI and augmented/virtual reality.",
    price: 608.87, change1d: 7.43, change1dPct: 1.24, marketCap: "1.54T", peRatio: 28.7, forwardPE: 23.9, pbRatio: 8.6, psRatio: 9.6, pegRatio: 1.1,
    dividendYield: 0.32, dividendGrowth5y: null, revenueGrowth: 27.3, epsGrowth: 73.1, roe: 37.9, operatingMargin: 42.7,
    freeCashFlow: "$48B", beta: 1.24, volume: "13.4M", avgVolume: "14.2M", week52High: 638.40, week52Low: 348.12,
    analystRating: "Buy", targetPrice: 700.00, institutionalOwnership: 71.2, insiderOwnership: 13.6,
    swot: {
      strengths: ["3.3 billion daily active users across family of apps — unrivaled scale", "Advertising targeting precision unmatched in social media ecosystem", "Llama AI models competitive with OpenAI — reducing AI cost dependency", "Reality Labs positioned for next computing platform in augmented reality"],
      weaknesses: ["Heavy dependence on advertising revenue at 97% of total", "Reality Labs losing $15B+ per year with uncertain ROI timeline", "Declining youth engagement on core Facebook platform"],
      opportunities: ["AI-driven advertising efficiency dramatically improving ROAS for advertisers", "WhatsApp business monetization still in early innings globally", "Threads growing as premium Twitter alternative for public discourse", "AR glasses as next major computing interface category"],
      threats: ["TikTok competition intensifying for engagement and advertising revenue", "Apple ATT privacy changes reducing ad targeting effectiveness", "Regulatory action on youth safety practices across social platforms", "Advertiser boycotts over content moderation policy decisions"],
    },
    competitors: ["GOOGL", "SNAP", "PINS", "NFLX"], basePrice52w: 352.00,
  },
  AMZN: {
    ticker: "AMZN", company: "Amazon.com Inc.", exchange: "NASDAQ", sector: "Consumer Cyclical", industry: "Internet Retail",
    description: "Amazon operates e-commerce marketplaces, Amazon Web Services (AWS) cloud, Prime subscription, and advertising businesses. AWS is the profit engine driving overall company financials.",
    price: 213.67, change1d: 1.02, change1dPct: 0.48, marketCap: "2.28T", peRatio: 43.2, forwardPE: 34.8, pbRatio: 8.4, psRatio: 3.7, pegRatio: 1.9,
    dividendYield: null, dividendGrowth5y: null, revenueGrowth: 12.5, epsGrowth: 94.8, roe: 22.6, operatingMargin: 9.4,
    freeCashFlow: "$53B", beta: 1.14, volume: "46.7M", avgVolume: "42.3M", week52High: 229.26, week52Low: 151.61,
    analystRating: "Strong Buy", targetPrice: 260.00, institutionalOwnership: 62.8, insiderOwnership: 9.3,
    swot: {
      strengths: ["AWS is #1 cloud platform with 30%+ global market share", "Amazon Prime ecosystem with 200M+ paid members worldwide", "Advertising business growing 20%+ annually on $50B+ revenue run rate", "Logistics network rivaling UPS and FedEx with lower unit economics"],
      weaknesses: ["Thin 1-2% margins in core retail business requiring massive operational scale", "AWS growth decelerating from peak post-COVID surge levels", "Capital expenditure requirements for AI infrastructure are accelerating"],
      opportunities: ["AWS AI services with Bedrock platform as enterprise adoption accelerates", "Amazon Pharmacy and Clinic entering massive healthcare market", "International e-commerce markets still significantly underpenetrated", "Advertising revenue compounding as third-party sellers grow on platform"],
      threats: ["Microsoft Azure and Google Cloud steadily gaining cloud market share", "FTC and regulatory scrutiny on retail marketplace practices", "Walmart and Target strengthening omnichannel retail capabilities", "Labor organization movement increasing warehouse operational costs"],
    },
    competitors: ["MSFT", "GOOGL", "WMT", "SHOP"], basePrice52w: 153.00,
  },
  JPM: {
    ticker: "JPM", company: "JPMorgan Chase & Co.", exchange: "NYSE", sector: "Financial Services", industry: "Banks—Diversified",
    description: "JPMorgan Chase is the largest US bank by assets, operating consumer banking, commercial banking, investment banking, and asset management divisions globally.",
    price: 258.43, change1d: -0.87, change1dPct: -0.34, marketCap: "744B", peRatio: 13.1, forwardPE: 12.4, pbRatio: 2.2, psRatio: 3.8, pegRatio: null,
    dividendYield: 2.02, dividendGrowth5y: 9.3, revenueGrowth: 18.2, epsGrowth: 25.7, roe: 18.1, operatingMargin: 37.4,
    freeCashFlow: "$28B", beta: 1.11, volume: "8.2M", avgVolume: "9.1M", week52High: 280.25, week52Low: 183.93,
    analystRating: "Buy", targetPrice: 290.00, institutionalOwnership: 72.4, insiderOwnership: 0.7,
    swot: {
      strengths: ["Best-in-class management under Jamie Dimon with proven track record", "Diversified revenue streams across consumer, commercial, and investment banking", "Fortress balance sheet exceeding all regulatory capital requirements significantly", "Technology investment leading the industry in digital banking transformation"],
      weaknesses: ["Regulatory capital requirements limit return potential and share buybacks", "Commercial real estate exposure creates potential credit quality concerns", "Consumer credit quality softening as rate environment strains borrowers"],
      opportunities: ["Rising interest rate environment supports net interest margin expansion", "Wealth management and private banking growing with high-net-worth clients", "International expansion opportunities in emerging and developed markets", "Fintech acquisition strategy to add digital capabilities"],
      threats: ["Recession scenario significantly increasing loan loss provisions required", "Fintech neobanks disrupting retail banking customer acquisition economics", "Increased bank regulation following SVB crisis raising compliance costs", "Federal Reserve rate cuts compressing net interest margin over time"],
    },
    competitors: ["BAC", "WFC", "GS", "C"], basePrice52w: 185.00,
  },
  JNJ: {
    ticker: "JNJ", company: "Johnson & Johnson", exchange: "NYSE", sector: "Healthcare", industry: "Drug Manufacturers",
    description: "Johnson & Johnson is a diversified healthcare company focused on pharmaceutical drugs (oncology, immunology) and MedTech (surgical robotics, orthopedics) following the Kenvue consumer health spinoff.",
    price: 164.87, change1d: 0.43, change1dPct: 0.26, marketCap: "397B", peRatio: 22.7, forwardPE: 14.8, pbRatio: 5.3, psRatio: 4.6, pegRatio: 2.1,
    dividendYield: 3.17, dividendGrowth5y: 5.8, revenueGrowth: 4.3, epsGrowth: -8.2, roe: 24.8, operatingMargin: 25.3,
    freeCashFlow: "$20B", beta: 0.57, volume: "7.3M", avgVolume: "8.1M", week52High: 175.19, week52Low: 143.13,
    analystRating: "Hold", targetPrice: 180.00, institutionalOwnership: 68.3, insiderOwnership: 0.3,
    swot: {
      strengths: ["62 consecutive years of dividend growth — a true Dividend King", "Darzalex and Stelara driving strong pharmaceutical segment revenue", "MedTech segment provides stable, recurring procedural revenue", "AAA credit rating enables cheap financing for strategic acquisitions"],
      weaknesses: ["Talc litigation overhang creates material balance sheet uncertainty", "Multiple key drug patent expirations threaten revenue in coming years", "Organic pharmaceutical growth slower than pure-play oncology peers"],
      opportunities: ["Oncology pipeline with 10+ potential blockbuster drugs in development", "MedTech expansion into AI-assisted robotic surgery applications", "Biosimilars market entry providing new revenue streams", "Emerging markets healthcare spending growth benefiting medical devices"],
      threats: ["Drug pricing legislation could significantly reduce pharmaceutical margins", "Generic competition accelerating for key revenue-generating drugs", "Talc bankruptcy settlement outcome remains highly uncertain", "Competition intensifying from Pfizer, Merck, and Eli Lilly in oncology"],
    },
    competitors: ["PFE", "ABBV", "LLY", "MRK"], basePrice52w: 144.00,
  },
  V: {
    ticker: "V", company: "Visa Inc.", exchange: "NYSE", sector: "Financial Services", industry: "Credit Services",
    description: "Visa operates the world's largest consumer payment network, facilitating transactions between consumers, merchants, financial institutions, and governments in over 200 countries.",
    price: 296.84, change1d: 1.67, change1dPct: 0.57, marketCap: "612B", peRatio: 31.2, forwardPE: 27.4, pbRatio: 14.8, psRatio: 16.3, pegRatio: 1.8,
    dividendYield: 0.73, dividendGrowth5y: 17.4, revenueGrowth: 9.8, epsGrowth: 13.1, roe: 46.2, operatingMargin: 67.1,
    freeCashFlow: "$20B", beta: 0.97, volume: "5.8M", avgVolume: "6.2M", week52High: 310.60, week52Low: 235.45,
    analystRating: "Buy", targetPrice: 345.00, institutionalOwnership: 87.4, insiderOwnership: 0.5,
    swot: {
      strengths: ["Duopoly with Mastercard in global card payment network infrastructure", "Asset-light business model generating 67% operating margins consistently", "Network effects from 4.3B cards issued across 200+ countries are self-reinforcing", "Zero direct credit risk — purely transaction-based revenue model"],
      weaknesses: ["Revenue growth directly tied to consumer spending economic cycles", "No direct consumer or merchant relationships — entirely bank-dependent", "Foreign currency headwinds when the US dollar strengthens significantly"],
      opportunities: ["Cash-to-digital payment transition in emerging markets (India, SE Asia, Africa)", "B2B payments market worth $150T+ with minimal card penetration today", "Real-time payments infrastructure expansion with VisaNet updates", "Open banking API integrations creating new fintech partnership revenue"],
      threats: ["Government regulation proposing caps on interchange fee revenue", "Central bank digital currencies potentially bypassing card network rails", "PayPal, Stripe, and Block building merchant payment alternatives", "Apple and Amazon creating direct payment bypass relationships with merchants"],
    },
    competitors: ["MA", "AXP", "PYPL", "FIS"], basePrice52w: 237.00,
  },
  LLY: {
    ticker: "LLY", company: "Eli Lilly and Company", exchange: "NYSE", sector: "Healthcare", industry: "Drug Manufacturers",
    description: "Eli Lilly is the world leader in GLP-1 drugs for diabetes and obesity (Mounjaro, Zepbound), with a strong oncology and neuroscience pipeline. The obesity market could exceed $150B annually by 2030.",
    price: 883.24, change1d: 12.47, change1dPct: 1.43, marketCap: "839B", peRatio: 71.4, forwardPE: 38.2, pbRatio: 58.3, psRatio: 22.1, pegRatio: 1.4,
    dividendYield: 0.6, dividendGrowth5y: 14.3, revenueGrowth: 36.1, epsGrowth: 102.4, roe: 89.3, operatingMargin: 31.4,
    freeCashFlow: "$6B", beta: 0.48, volume: "2.8M", avgVolume: "3.1M", week52High: 972.53, week52Low: 485.15,
    analystRating: "Buy", targetPrice: 1100.00, institutionalOwnership: 78.2, insiderOwnership: 0.2,
    swot: {
      strengths: ["Mounjaro and Zepbound dominating the GLP-1 weight loss market globally", "Manufacturing capacity investment accelerating to meet explosive demand", "Donanemab Alzheimer's drug approval adds major pipeline catalyst", "First-mover advantages in the obesity pharmacotherapy market are significant"],
      weaknesses: ["Extreme valuation priced for flawless execution with no margin for error", "Manufacturing supply constraints limiting revenue relative to current demand", "Heavy dependence on GLP-1 franchise for near-term revenue growth"],
      opportunities: ["Obesity drug market projected at $150B+ annually by 2030", "GLP-1 expansion indications: heart disease, kidney disease, sleep apnea, addiction", "Donanemab and Alzheimer's pipeline addressing massive unmet need", "International GLP-1 markets in Europe and Asia still in very early adoption"],
      threats: ["Novo Nordisk Ozempic and Wegovy competition intensifying across all indications", "Patent cliff risk when GLP-1 exclusivity expires in coming decade", "Insurance coverage decisions limiting patient access to GLP-1 drugs", "Manufacturing delays or quality issues could significantly disappoint investors"],
    },
    competitors: ["NVO", "PFE", "ABBV", "JNJ"], basePrice52w: 492.00,
  },
  WMT: {
    ticker: "WMT", company: "Walmart Inc.", exchange: "NYSE", sector: "Consumer Defensive", industry: "Discount Stores",
    description: "Walmart is the world's largest retailer by revenue, operating over 10,500 stores globally including Walmart US, Sam's Club, and Flipkart. Growing advertising and e-commerce businesses are key margin drivers.",
    price: 94.87, change1d: 0.23, change1dPct: 0.24, marketCap: "764B", peRatio: 41.8, forwardPE: 35.2, pbRatio: 8.7, psRatio: 0.98, pegRatio: 3.1,
    dividendYield: 0.94, dividendGrowth5y: 1.9, revenueGrowth: 5.1, epsGrowth: 13.4, roe: 22.1, operatingMargin: 4.2,
    freeCashFlow: "$16B", beta: 0.51, volume: "18.4M", avgVolume: "19.7M", week52High: 100.57, week52Low: 56.36,
    analystRating: "Buy", targetPrice: 110.00, institutionalOwnership: 36.4, insiderOwnership: 47.1,
    swot: {
      strengths: ["World's largest retailer with unmatched everyday low price position", "Sam's Club growing rapidly with strong membership retention metrics", "Walmart Connect advertising platform generating $4B+ in high-margin revenue", "Grocery dominance protects from e-commerce substitution in key categories"],
      weaknesses: ["Retail operating margins remain structurally thin at 4% requiring enormous scale", "Union and labor organization pressure increasing operational costs", "International operations complexity requiring significant management attention"],
      opportunities: ["Walmart+ membership and healthcare clinic expansion driving recurring revenue", "Flipkart in India — 1.4B potential customers still largely unbanked and online", "Third-party fulfillment services creating marketplace flywheel network effects", "Private label and exclusive brand development improving margins"],
      threats: ["Amazon gaining e-commerce share in non-grocery categories", "Dollar General and Dollar Tree competing aggressively in rural markets", "Automated checkout and warehouse investment requiring massive capital allocation", "Tariff-driven product cost increases pressuring thin retail margins"],
    },
    competitors: ["AMZN", "COST", "TGT", "DLTR"], basePrice52w: 57.00,
  },
  XOM: {
    ticker: "XOM", company: "Exxon Mobil Corporation", exchange: "NYSE", sector: "Energy", industry: "Oil & Gas Integrated",
    description: "Exxon Mobil is the largest US oil and gas company, operating exploration, production, refining, and chemical businesses globally. The Pioneer acquisition adds significant Permian Basin low-cost production.",
    price: 108.43, change1d: -0.87, change1dPct: -0.80, marketCap: "460B", peRatio: 14.2, forwardPE: 12.8, pbRatio: 1.9, psRatio: 1.4, pegRatio: null,
    dividendYield: 3.42, dividendGrowth5y: 4.1, revenueGrowth: -2.8, epsGrowth: -9.2, roe: 13.7, operatingMargin: 14.8,
    freeCashFlow: "$31B", beta: 0.81, volume: "17.2M", avgVolume: "18.8M", week52High: 126.34, week52Low: 94.16,
    analystRating: "Hold", targetPrice: 125.00, institutionalOwnership: 61.8, insiderOwnership: 0.1,
    swot: {
      strengths: ["Pioneer acquisition adds 1.4M bbl/day of low-cost Permian Basin production", "Best-in-class Permian Basin cost structure competitive at $35/barrel breakeven", "Carbon capture and low-emission solutions early leadership position", "42 consecutive years of dividend growth — a Dividend Aristocrat"],
      weaknesses: ["Revenue highly dependent on oil price cycles outside management control", "Energy transition creates structural long-term demand headwinds for oil", "Capital intensity requires sustained oil prices above $60 for optimal returns"],
      opportunities: ["LNG export demand growth as Europe diversifies away from Russian gas", "Permian production synergy realization from Pioneer acquisition", "Carbon capture commercial projects creating new revenue streams", "Chemical business expansion with Proxxima thermoset resins"],
      threats: ["Oil demand peak scenario driven by accelerating EV adoption globally", "OPEC+ production decisions affecting global oil supply and price", "Geopolitical risk in key production regions (Middle East, Africa)", "Carbon taxes and emission regulation increasing operational costs"],
    },
    competitors: ["CVX", "COP", "BP", "SHEL"], basePrice52w: 95.00,
  },
  COST: {
    ticker: "COST", company: "Costco Wholesale Corporation", exchange: "NASDAQ", sector: "Consumer Defensive", industry: "Discount Stores",
    description: "Costco operates membership warehouse clubs worldwide, offering curated selection of merchandise at significantly lower prices. The Kirkland Signature private label is the #1 selling national brand.",
    price: 914.12, change1d: 8.43, change1dPct: 0.93, marketCap: "406B", peRatio: 52.1, forwardPE: 46.8, pbRatio: 17.3, psRatio: 1.67, pegRatio: 3.4,
    dividendYield: 0.52, dividendGrowth5y: 12.7, revenueGrowth: 7.8, epsGrowth: 17.2, roe: 32.4, operatingMargin: 3.6,
    freeCashFlow: "$7B", beta: 0.74, volume: "1.9M", avgVolume: "2.1M", week52High: 1007.84, week52Low: 666.23,
    analystRating: "Buy", targetPrice: 1050.00, institutionalOwnership: 71.2, insiderOwnership: 0.3,
    swot: {
      strengths: ["Membership model creates predictable recurring revenue with 93% renewal rates", "Industry-leading NPS score above 80 — exceptional customer loyalty", "Gasoline and pharmacy drive high-frequency store traffic and membership value", "Kirkland Signature private label generates $60B+ in annual sales"],
      weaknesses: ["Thin retail operating margins at 3.6% require flawless operational execution", "Limited SKU selection (4,000 vs 100,000+ at competing retailers)", "E-commerce capabilities lagging omnichannel competitors significantly"],
      opportunities: ["International expansion in Japan, South Korea, Taiwan, Australia underway", "E-commerce infrastructure investment improving digital capabilities", "Costco Travel and financial services adding high-margin revenue streams", "Healthcare and pharmacy expansion leveraging existing warehouse footprint"],
      threats: ["Consumer trade-down to cheaper alternatives during recession scenarios", "Amazon Prime competing directly for household membership wallet share", "Real estate costs for new warehouse site acquisition in dense markets", "CEO succession risk given strong cultural leadership dependence"],
    },
    competitors: ["WMT", "TGT", "AMZN", "BJ"], basePrice52w: 671.00,
  },
  NEE: {
    ticker: "NEE", company: "NextEra Energy Inc.", exchange: "NYSE", sector: "Utilities", industry: "Utilities—Regulated Electric",
    description: "NextEra Energy is the world's largest producer of wind and solar energy, operating Florida Power & Light (FPL) regulated utility and NextEra Energy Resources renewable generation across North America.",
    price: 72.34, change1d: 0.54, change1dPct: 0.75, marketCap: "148B", peRatio: 21.4, forwardPE: 19.8, pbRatio: 2.8, psRatio: 6.1, pegRatio: 2.3,
    dividendYield: 2.73, dividendGrowth5y: 10.4, revenueGrowth: 6.2, epsGrowth: 8.4, roe: 12.7, operatingMargin: 19.8,
    freeCashFlow: "$2B", beta: 0.62, volume: "9.4M", avgVolume: "10.7M", week52High: 85.27, week52Low: 55.53,
    analystRating: "Buy", targetPrice: 92.00, institutionalOwnership: 77.4, insiderOwnership: 0.4,
    swot: {
      strengths: ["World's largest renewable energy producer with unmatched scale advantage", "Florida Power & Light is considered the gold-standard regulated electric utility", "Consistent 10% EPS and dividend growth guidance backed by regulated returns", "AI data center power demand creating substantial new load growth opportunity"],
      weaknesses: ["High debt load from capital-intensive renewable build-out program", "Interest rate sensitivity compresses utility valuations significantly", "Florida hurricane risk creates periodic catastrophic loss events for FPL"],
      opportunities: ["Data center and AI infrastructure power demand growing exponentially", "IRA tax incentives improving economics for new renewable project development", "Nuclear energy revival opportunity with substantial expertise and capital", "Battery storage expansion solving renewable energy intermittency challenges"],
      threats: ["Rising interest rates increase financing costs and compress REIT-like valuations", "Permitting delays slowing renewable project development timelines", "Competing utilities accelerating renewable buildouts reducing NEE advantage", "Regulatory changes in Florida affecting FPL rate structure and returns"],
    },
    competitors: ["D", "SO", "DUK", "AEP"], basePrice52w: 56.00,
  },
  PLD: {
    ticker: "PLD", company: "Prologis Inc.", exchange: "NYSE", sector: "Real Estate", industry: "REIT—Industrial",
    description: "Prologis is the world's largest industrial REIT, owning 1.2 billion square feet of logistics real estate across 19 countries in markets critical to global supply chains.",
    price: 118.47, change1d: -0.63, change1dPct: -0.53, marketCap: "112B", peRatio: 35.8, forwardPE: 31.2, pbRatio: 2.1, psRatio: 14.8, pegRatio: null,
    dividendYield: 3.37, dividendGrowth5y: 12.4, revenueGrowth: 8.4, epsGrowth: 14.2, roe: 6.1, operatingMargin: 38.4,
    freeCashFlow: "$3B", beta: 0.91, volume: "4.1M", avgVolume: "4.8M", week52High: 143.46, week52Low: 97.11,
    analystRating: "Buy", targetPrice: 150.00, institutionalOwnership: 95.4, insiderOwnership: 0.7,
    swot: {
      strengths: ["Best-in-class portfolio of logistics assets in supply-constrained gateway markets", "E-commerce growth driving persistent 3PL and retailer demand for warehouse space", "12% embedded rent growth as below-market leases expire across portfolio", "Data center land bank conversion opportunity in high-demand markets"],
      weaknesses: ["High interest rate sensitivity as a leveraged REIT with significant debt", "E-commerce growth normalizing from post-COVID surge levels", "Tenant concentration risk with Amazon representing 5% of total revenue"],
      opportunities: ["Data center conversion of industrial sites near power infrastructure", "Near-shoring manufacturing trend bringing production to Americas markets", "International expansion in high-barrier European and Asian logistics markets", "Mark-to-market lease rollover generating substantial NOI growth opportunity"],
      threats: ["E-commerce demand normalization reducing 3PL warehouse absorption rates", "Rising interest rates increasing capitalization rates and compressing valuations", "New industrial supply construction increasing vacancy in secondary markets", "Amazon building proprietary logistics reducing third-party warehouse dependence"],
    },
    competitors: ["EQR", "DLR", "O", "WPC"], basePrice52w: 98.00,
  },
  MA: {
    ticker: "MA", company: "Mastercard Incorporated", exchange: "NYSE", sector: "Financial Services", industry: "Credit Services",
    description: "Mastercard is a global payments technology company that processes transactions between consumers, financial institutions, merchants, and governments across 210+ countries.",
    price: 498.73, change1d: 2.87, change1dPct: 0.58, marketCap: "461B", peRatio: 37.8, forwardPE: 32.7, pbRatio: 59.2, psRatio: 19.4, pegRatio: 1.9,
    dividendYield: 0.52, dividendGrowth5y: 14.8, revenueGrowth: 11.4, epsGrowth: 14.7, roe: 177.4, operatingMargin: 57.3,
    freeCashFlow: "$13B", beta: 1.12, volume: "2.4M", avgVolume: "2.7M", week52High: 518.96, week52Low: 382.34,
    analystRating: "Buy", targetPrice: 580.00, institutionalOwnership: 91.2, insiderOwnership: 0.3,
    swot: {
      strengths: ["Duopoly with Visa in global payment network infrastructure is highly defensible", "62% of revenue from cross-border transactions provides natural inflation hedge", "Value-added services (cybersecurity, analytics, open banking) growing 20%+", "Asset-light model with exceptional return on capital metrics"],
      weaknesses: ["Revenue cyclically tied to consumer spending and cross-border travel volumes", "No direct consumer or merchant relationships creates intermediary dependency", "FX headwinds create earnings volatility when US dollar strengthens"],
      opportunities: ["B2B cross-border payment market representing $150T+ annual volume opportunity", "Open banking API monetization as banks modernize payment infrastructure", "Real-time payment network expansion with Mastercard Send and Track", "Fintech partnership portfolio accelerating payment technology innovation"],
      threats: ["Government regulatory proposals to cap interchange fee revenue", "Central bank digital currencies potentially bypassing established card rails", "PayPal and Stripe building direct merchant payment network alternatives", "Buy now, pay later disruption reducing card transaction volume growth"],
    },
    competitors: ["V", "AXP", "PYPL", "FIS"], basePrice52w: 384.00,
  },
  AMD: {
    ticker: "AMD", company: "Advanced Micro Devices Inc.", exchange: "NASDAQ", sector: "Technology", industry: "Semiconductors",
    description: "AMD designs high-performance CPUs and GPUs for data centers, gaming, and embedded applications. Ryzen processors, EPYC server CPUs, and Instinct data center GPUs are key product lines.",
    price: 156.43, change1d: 4.21, change1dPct: 2.77, marketCap: "252B", peRatio: 141.2, forwardPE: 38.4, pbRatio: 3.9, psRatio: 10.8, pegRatio: 1.4,
    dividendYield: null, dividendGrowth5y: null, revenueGrowth: 9.1, epsGrowth: 845.3, roe: 2.8, operatingMargin: 5.9,
    freeCashFlow: "$1.4B", beta: 1.76, volume: "48.7M", avgVolume: "51.2M", week52High: 227.30, week52Low: 116.37,
    analystRating: "Buy", targetPrice: 210.00, institutionalOwnership: 71.4, insiderOwnership: 1.2,
    swot: {
      strengths: ["MI300X GPU gaining significant data center AI training traction vs NVIDIA", "Ryzen processors highly competitive with Intel in PC and laptop market", "EPYC server CPUs taking meaningful share from Intel Xeon in data centers", "Strong engineering execution and roadmap credibility under Lisa Su leadership"],
      weaknesses: ["NVIDIA maintains 5+ year CUDA software ecosystem moat in AI training", "Data center GPU revenue still small fraction of NVIDIA's scale", "Dependence on TSMC for leading-edge manufacturing like all fabless peers"],
      opportunities: ["MI400 next-generation GPU with substantially improved AI performance capabilities", "Data center AI accelerator market expanding with enterprise AI adoption", "Gaming market recovery after extended PC hardware downcycle", "Custom silicon engagements with hyperscalers using ROCm open ecosystem"],
      threats: ["NVIDIA CUDA dominance creates enormous switching friction for AI workloads", "Intel Gaudi and Meteor Lake competing in data center accelerator market", "Custom Google TPU and Amazon Trainium silicon reducing third-party GPU TAM", "Taiwan geopolitical risk affecting TSMC foundry supply security"],
    },
    competitors: ["NVDA", "INTC", "QCOM", "ARM"], basePrice52w: 118.00,
  },
  ABBV: {
    ticker: "ABBV", company: "AbbVie Inc.", exchange: "NYSE", sector: "Healthcare", industry: "Drug Manufacturers",
    description: "AbbVie is a biopharmaceutical company focused on immunology (Skyrizi, Rinvoq), oncology, neuroscience (Vraylar), and aesthetics (Botox/Allergan). Replacing Humira revenue through new portfolio.",
    price: 178.43, change1d: 0.87, change1dPct: 0.49, marketCap: "315B", peRatio: 62.7, forwardPE: 14.8, pbRatio: null, psRatio: 4.9, pegRatio: null,
    dividendYield: 3.35, dividendGrowth5y: 8.9, revenueGrowth: 4.2, epsGrowth: -12.4, roe: -74.3, operatingMargin: 24.8,
    freeCashFlow: "$21B", beta: 0.64, volume: "4.1M", avgVolume: "4.8M", week52High: 199.75, week52Low: 137.89,
    analystRating: "Buy", targetPrice: 215.00, institutionalOwnership: 72.8, insiderOwnership: 0.1,
    swot: {
      strengths: ["Skyrizi and Rinvoq successfully replacing Humira's biosimilar-impacted revenue", "11+ consecutive years of dividend growth with strong free cash flow support", "Allergan aesthetics (Botox) represents recession-resilient recurring revenue", "Vraylar and Qulipta psychiatry drugs growing rapidly in large addressable markets"],
      weaknesses: ["Humila biosimilar competition significantly eroding the former flagship drug", "Negative book equity from heavily leveraged Allergan acquisition financing", "High debt burden creates financial flexibility constraints for capital deployment"],
      opportunities: ["Skyrizi and Rinvoq combined peak sales potential estimated at $25B+", "ImmunoGen oncology acquisition expanding antibody-drug conjugate pipeline", "Aesthetics market recovery accelerating post-pandemic with new indications", "50+ compounds in active clinical trials providing pipeline optionality"],
      threats: ["Biosimilar competition potentially emerging for other key immunology drugs", "Drug pricing legislation targeting high-cost specialty medications", "Clinical trial failures for pipeline compounds could disappoint investors", "Interest rate sensitivity from high leverage ratio constraining buybacks"],
    },
    competitors: ["JNJ", "PFE", "BMY", "MRK"], basePrice52w: 139.00,
  },
  CRM: {
    ticker: "CRM", company: "Salesforce Inc.", exchange: "NYSE", sector: "Technology", industry: "Software—Application",
    description: "Salesforce provides cloud-based enterprise CRM, marketing automation, analytics, and now Agentforce autonomous AI agents for enterprise workflows. The #1 CRM globally with 20%+ market share.",
    price: 287.43, change1d: 1.87, change1dPct: 0.65, marketCap: "278B", peRatio: 42.8, forwardPE: 27.4, pbRatio: 4.2, psRatio: 7.4, pegRatio: 2.1,
    dividendYield: 0.59, dividendGrowth5y: null, revenueGrowth: 11.2, epsGrowth: 141.2, roe: 9.8, operatingMargin: 17.8,
    freeCashFlow: "$10B", beta: 1.32, volume: "5.2M", avgVolume: "5.8M", week52High: 318.71, week52Low: 212.00,
    analystRating: "Buy", targetPrice: 350.00, institutionalOwnership: 81.7, insiderOwnership: 3.8,
    swot: {
      strengths: ["#1 global CRM platform with powerful enterprise lock-in and switching costs", "Agentforce autonomous AI agents could transform enterprise automation economics", "Data Cloud giving competitive advantage in enterprise AI data management", "Einstein AI embedded across all product lines enhancing value delivery"],
      weaknesses: ["Operating margin expansion slower than investors anticipated in guidance", "Enterprise sales cycles elongating as CFOs scrutinize software spending", "MuleSoft and Tableau integration investments underperforming revenue expectations"],
      opportunities: ["Agentforce AI agents for enterprise automation represents massive new TAM", "Government cloud expansion as agencies modernize on Salesforce platform", "Salesforce Health Cloud gaining traction in large healthcare vertical", "International expansion particularly in Japan and EMEA markets still early"],
      threats: ["Microsoft Dynamics CRM combined with Copilot AI competing directly for enterprise", "SAP and Oracle strengthening native CRM capabilities within ERP suites", "Economic slowdown prompting enterprise software budget rationalization", "Activist investor pressure creating organizational distraction and uncertainty"],
    },
    competitors: ["MSFT", "ORCL", "SAP", "HUB"], basePrice52w: 213.00,
  },
  O: {
    ticker: "O", company: "Realty Income Corporation", exchange: "NYSE", sector: "Real Estate", industry: "REIT—Retail",
    description: "Realty Income is The Monthly Dividend Company — a net-lease REIT paying monthly dividends since 1969 with 630+ consecutive payments. Owns 15,000+ commercial properties with investment-grade tenants.",
    price: 56.87, change1d: 0.31, change1dPct: 0.55, marketCap: "50B", peRatio: 43.2, forwardPE: 38.4, pbRatio: 1.4, psRatio: 10.8, pegRatio: null,
    dividendYield: 5.77, dividendGrowth5y: 3.2, revenueGrowth: 21.4, epsGrowth: -2.1, roe: 3.2, operatingMargin: 27.4,
    freeCashFlow: "$3B", beta: 0.91, volume: "6.4M", avgVolume: "7.1M", week52High: 64.88, week52Low: 46.13,
    analystRating: "Buy", targetPrice: 68.00, institutionalOwnership: 79.4, insiderOwnership: 0.3,
    swot: {
      strengths: ["630+ consecutive monthly dividends — the gold standard for income investors", "Investment-grade tenants including 7-Eleven, Dollar General, and Walgreens", "European expansion through Spirit Realty merger doubling addressable market", "Triple-net lease structure fully insulates landlord from tenant operating costs"],
      weaknesses: ["Interest rate sensitivity meaningfully compresses REIT dividend valuations", "Retail sector tenant risk even with high credit quality underwriting", "Slower dividend growth rate than historical average due to size and rates"],
      opportunities: ["European and international expansion still in early innings of development", "Data center and industrial asset diversification beyond traditional retail", "Private credit opportunities through joint venture investment structures", "Embedded rent escalators providing steady cash flow inflation protection"],
      threats: ["Rising interest rates dramatically increase REIT financing costs and cap rates", "E-commerce secular headwinds eroding some retail tenant categories", "Debt refinancing risk at materially higher rates on maturing obligations", "Recession scenario causing tenant bankruptcies in discretionary retail"],
    },
    competitors: ["NNN", "WPC", "ADC", "EPRT"], basePrice52w: 46.50,
  },
};

export const ALL_TICKERS = Object.keys(STOCK_UNIVERSE);

export function getStock(ticker: string): StockData | null {
  return STOCK_UNIVERSE[ticker.toUpperCase()] ?? null;
}

export function searchStocksData(query: string): StockData[] {
  const q = query.toUpperCase().trim();
  if (!q) return [];
  return Object.values(STOCK_UNIVERSE)
    .filter(s =>
      s.ticker.includes(q) ||
      s.company.toUpperCase().includes(q) ||
      s.sector.toUpperCase().includes(q) ||
      s.industry.toUpperCase().includes(q)
    )
    .slice(0, 10);
}

function generatePriceHistory(currentPrice: number, basePrice52w: number, days = 365): Array<{ date: string; price: number }> {
  const history: Array<{ date: string; price: number }> = [];
  const today = new Date();
  const drift = (currentPrice / basePrice52w - 1) / days;

  let seed = Math.round(currentPrice * 1000);
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  let price = basePrice52w;
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const change = (random() - 0.48) * 0.025 + drift;
    price = price * (1 + change);
    history.push({ date: date.toISOString().split("T")[0], price: Math.round(price * 100) / 100 });
  }

  history[history.length - 1].price = currentPrice;
  return history;
}

function generateQuarterlyHistory(latestValue: number, quarterlyGrowthRate: number, quarters = 8): Array<{ period: string; value: number }> {
  const history: Array<{ period: string; value: number }> = [];
  const today = new Date();
  let q = Math.floor(today.getMonth() / 3) + 1;
  let y = today.getFullYear();

  for (let i = quarters - 1; i >= 0; i--) {
    let qn = q - i;
    let yn = y;
    while (qn <= 0) { qn += 4; yn--; }
    const value = latestValue / Math.pow(1 + quarterlyGrowthRate, i);
    history.push({ period: `Q${qn} ${yn}`, value: Math.round(value * 100) / 100 });
  }

  return history;
}

export function getPriceHistory(ticker: string): Array<{ date: string; price: number }> {
  const s = getStock(ticker);
  if (!s) return [];
  return generatePriceHistory(s.price, s.basePrice52w, 365);
}

export function getRevenueHistory(ticker: string): Array<{ period: string; value: number }> {
  const s = getStock(ticker);
  if (!s) return [];
  const latestQRevBillions = s.marketCap.includes("T")
    ? parseFloat(s.marketCap) * 1000 * 0.07
    : parseFloat(s.marketCap) * 0.12;
  return generateQuarterlyHistory(latestQRevBillions, s.revenueGrowth / 400, 8);
}

export function getEpsHistory(ticker: string): Array<{ period: string; value: number }> {
  const s = getStock(ticker);
  if (!s) return [];
  const annualEps = s.peRatio ? s.price / s.peRatio : 5;
  return generateQuarterlyHistory(annualEps / 4, Math.max(s.epsGrowth, -50) / 400, 8);
}

export function getDividendHistory(ticker: string): Array<{ period: string; value: number }> {
  const s = getStock(ticker);
  if (!s || !s.dividendYield) return [];
  const annualDiv = s.price * (s.dividendYield / 100);
  return generateQuarterlyHistory(annualDiv / 4, (s.dividendGrowth5y ?? 0) / 400, 8);
}

export function getStockNews(ticker: string): Array<any> {
  const s = getStock(ticker);
  if (!s) return [];
  const templates = [
    { title: `${s.company} Reports Strong Quarterly Results`, summary: `${s.company} exceeded analyst estimates with solid revenue growth and margin expansion, driven by strength in core business segments.`, sentiment: "positive" },
    { title: `Analysts Raise Price Target for ${s.ticker} Following Strong Performance`, summary: `Multiple Wall Street firms increased their price targets for ${s.company} citing improving fundamentals and favorable market dynamics.`, sentiment: "positive" },
    { title: `${s.company} Announces Strategic Expansion Plans`, summary: `${s.company} outlined plans to expand into new markets and product categories, targeting long-term revenue diversification opportunities.`, sentiment: "positive" },
    { title: `${s.company} Faces Regulatory Review Amid Industry Scrutiny`, summary: `Regulatory authorities are examining business practices at ${s.company}, potentially affecting competitive dynamics in key segments.`, sentiment: "negative" },
  ];
  const sources = ["Reuters", "Bloomberg", "Financial Times", "Wall Street Journal"];
  const today = new Date();
  return templates.map((t, i) => ({
    id: `${ticker}-${i}`, title: t.title, summary: t.summary, source: sources[i % sources.length],
    url: `https://example.com/${ticker}/${i}`,
    publishedAt: new Date(today.getTime() - i * 3 * 86400000).toISOString(),
    sentiment: t.sentiment, tickers: [ticker],
  }));
}
