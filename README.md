# 📊 Trade Journal

A modern, feature-rich trading journal application built with React and TailwindCSS. Track your trades, analyze your performance, and improve your trading psychology with comprehensive metrics and visualizations.

![Trade Journal](https://img.shields.io/badge/React-18.3-blue?logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?logo=vite)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### 📈 Dashboard & Analytics

- **Real-time Metrics**: Track Net P/L, Win Rate, Average R:R, Average Win/Loss, and Total Trades
- **Equity Curve Chart**: Visualize your account growth over time with interactive Recharts
- **Multiple Accounts**: Manage and switch between different trading accounts
- **Account Cards**: View current balance, P/L, and percentage changes at a glance

### 💼 Trade Management

- **Comprehensive Trade Entry**: Log all trade details including:
  - Date & Time
  - Asset/Trading Pair
  - Direction (Long/Short)
  - Entry/Exit Prices
  - Position Size
  - Stop Loss & Take Profit
  - Trade Outcome
  - Strategy Used
  - **Emotional State Tracking** (Confident, Anxious, FOMO, etc.)
  - Notes & Screenshots
- **Custom Trading Pairs**: Add any custom pair (XAUUSD, GBPAUD, etc.) beyond the default forex and crypto pairs
- **Auto-calculations**: Automatic P/L and Risk-Reward ratio calculations
- **Form Validation**: Ensures data integrity with required field validation

### 🎨 Design & UX

- **Premium Dark Theme**: Sleek dark interface with yellow/green accents
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Smooth Animations**: Polished transitions and hover effects
- **Intuitive Navigation**: Easy-to-use tab-based navigation system

### 💾 Data Persistence

- **localStorage Integration**: All data persists locally in your browser
- **No Backend Required**: Fully client-side application
- **Instant Sync**: Changes save automatically

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Ayosensei/trade-journal.git
   cd trade-journal
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173/`

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

## 📖 Usage

### Adding Your First Trade

1. Click the **"+ Add Trade"** button in the header
2. Fill in the trade details:
   - Select the date and time
   - Choose your trading pair (or add a custom one)
   - Enter entry and exit prices
   - Set your position size
   - Add stop loss and take profit levels
   - Select the outcome (Win/Loss/Breakeven)
   - Choose your strategy
   - Record your emotional state
   - Add notes and screenshots (optional)
3. Click **"Add Trade"** to save

### Adding Custom Trading Pairs

1. Open the trade form
2. In the Asset dropdown, select **"+ Add Custom Pair"**
3. Enter your custom pair (e.g., XAUUSD, GBPAUD)
4. Click **"Add"**
5. The pair is now available for all future trades

### Managing Multiple Accounts

1. Use the account dropdown in the header to switch between accounts
2. Each account maintains its own:
   - Balance tracking
   - Trade history
   - Performance metrics

## 🛠️ Tech Stack

- **Frontend Framework**: [React 18.3](https://react.dev/)
- **Build Tool**: [Vite 7.3](https://vite.dev/)
- **Styling**: [TailwindCSS 3.4](https://tailwindcss.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Date Handling**: [date-fns](https://date-fns.org/)
- **State Management**: React Context API
- **Data Persistence**: Browser localStorage

## 📁 Project Structure

```
trade-journal/
├── src/
│   ├── components/
│   │   ├── dashboard/       # Dashboard-specific components
│   │   ├── layout/          # Layout components (Header, Navigation)
│   │   ├── trades/          # Trade-related components
│   │   └── ui/              # Reusable UI components
│   ├── context/             # React Context for state management
│   ├── pages/               # Page components
│   ├── utils/               # Utility functions and constants
│   ├── App.jsx              # Main application component
│   └── index.css            # Global styles and Tailwind config
├── public/                  # Static assets
└── package.json             # Project dependencies
```

## 🎯 Supported Assets

### Forex Pairs

EURUSD, GBPUSD, USDJPY, USDCAD, AUDUSD, NZDUSD, EURGBP, EURJPY, GBPJPY

### Cryptocurrencies

BTC, ETH

### Custom Pairs

Add any trading pair you want!

## 🔮 Roadmap

- [ ] Trade Log table with sorting and filtering
- [ ] Daily Journal for trading notes
- [ ] Advanced Insights and Analytics
- [ ] Performance by strategy breakdown
- [ ] Export trades to CSV/PDF
- [ ] Trade screenshots gallery
- [ ] Win/loss streak tracking
- [ ] Risk management calculator
- [ ] Cloud backup integration
- [ ] Mobile app version

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Design inspiration from modern trading platforms
- Built with ❤️ for traders who want to improve their performance

## 📧 Contact

Project Link: [https://github.com/Ayosensei/trade-journal](https://github.com/Ayosensei/trade-journal)

---

**Happy Trading! 📈**
