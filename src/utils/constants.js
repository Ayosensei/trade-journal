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
  JOURNAL_ENTRIES: 'trade_journal_entries',
  GOALS: 'trade_journal_goals',
  USER_SESSION: 'trade_journal_user_session',
  BACKUP_PREFIX: 'trade_journal_backup_',
  DATA_VERSION: 'trade_journal_data_version',
};

export const DATA_VERSION = '1.0.0';

