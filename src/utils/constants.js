// Trading pairs and assets
export const FOREX_PAIRS = [
  'EURUSD',
  'GBPUSD',
  'USDJPY',
  'USDCAD',
  'AUDUSD',
  'NZDUSD',
  'EURGBP',
  'EURJPY',
  'GBPJPY',
];

export const CRYPTO_ASSETS = ['BTC', 'ETH'];

// Trade options
export const DIRECTIONS = ['Long', 'Short'];

export const OUTCOMES = ['Win', 'Loss', 'Breakeven'];

export const STRATEGIES = [
  'Breakout',
  'Trend Following',
  'Reversal',
  'Scalping',
  'Range Trading',
  'News Trading',
  'Swing Trading',
  'Position Trading',
];

export const EMOTIONAL_STATES = [
  'Confident',
  'Anxious',
  'Calm',
  'FOMO',
  'Revenge Trading',
  'Disciplined',
  'Uncertain',
  'Excited',
  'Frustrated',
  'Neutral',
];

// Local storage keys
export const STORAGE_KEYS = {
  ACCOUNTS: 'trade_journal_accounts',
  TRADES: 'trade_journal_trades',
  CUSTOM_PAIRS: 'trade_journal_custom_pairs',
  SELECTED_ACCOUNT: 'trade_journal_selected_account',
};
