import React, { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { TradeProvider, useTradeContext } from "./context/TradeContext";
import Header from "./components/layout/Header";
import Navigation from "./components/layout/Navigation";
import Footer from "./components/layout/Footer";
import Dashboard from "./pages/Dashboard";
import DailyJournal from "./pages/DailyJournal";
import TradeLog from "./pages/TradeLog";
import Analysis from "./pages/Analysis";
import Goals from "./pages/Goals";
import Settings from "./pages/Settings";
import TradeForm from "./components/trades/TradeForm";

function AppContent() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isTradeFormOpen, setIsTradeFormOpen] = useState(false);
  const [editingTrade, setEditingTrade] = useState(null);
  const { selectedAccount, accounts, switchAccount } = useTradeContext();

  const handleAddTrade = () => {
    setEditingTrade(null);
    setIsTradeFormOpen(true);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Avoid triggering shortcuts when user is typing in form fields
      if (
        e.target.tagName === "INPUT" ||
        e.target.tagName === "TEXTAREA" ||
        e.target.isContentEditable
      ) {
        return;
      }

      // Shortcut: 'N' for New Trade
      if (e.key.toLowerCase() === "n") {
        e.preventDefault();
        handleAddTrade();
      }
      // Shortcut: 'J' for Journal
      if (e.key.toLowerCase() === "j") {
        e.preventDefault();
        setActiveTab("journal");
      }
      // Shortcut: 'L' for Trade Log
      if (e.key.toLowerCase() === "l") {
        e.preventDefault();
        setActiveTab("trades");
      }
      // Shortcut: 'D' for Dashboard
      if (e.key.toLowerCase() === "d") {
        e.preventDefault();
        setActiveTab("dashboard");
      }
      // Shortcut: 'A' for Analysis
      if (e.key.toLowerCase() === "a") {
        e.preventDefault();
        setActiveTab("analysis");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleEditTrade = (trade) => {
    setEditingTrade(trade);
    setIsTradeFormOpen(true);
  };

  const handleCloseTradeForm = () => {
    setIsTradeFormOpen(false);
    setEditingTrade(null);
  };

  const handleAccountChange = (accountId) => {
    switchAccount(accountId);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "daily-journal":
        return <DailyJournal />;
      case "trade-log":
        return <TradeLog onEditTrade={handleEditTrade} />;
      case "insights":
        return (
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="card text-center py-12">
              <h2
                className="text-xl font-bold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                Insights
              </h2>
              <p style={{ color: "var(--text-secondary)" }}>Coming soon...</p>
            </div>
          </div>
        );
      case "analysis":
        return <Analysis />;
      case "trading-lab":
        return (
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="card text-center py-12">
              <h2
                className="text-xl font-bold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                Trading Lab
              </h2>
              <p style={{ color: "var(--text-secondary)" }}>Coming soon...</p>
            </div>
          </div>
        );
      case "goals":
        return <Goals />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#0f172a",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)",
            fontSize: "12px",
            fontWeight: "600",
            borderRadius: "10px",
            padding: "12px 16px",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#f43f5e",
              secondary: "#fff",
            },
          },
        }}
      />
      <Header
        onAddTrade={handleAddTrade}
        selectedAccount={selectedAccount}
        accounts={accounts}
        onAccountChange={handleAccountChange}
      />

      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1">{renderContent()}</main>

      <Footer />

      <TradeForm
        isOpen={isTradeFormOpen}
        onClose={handleCloseTradeForm}
        trade={editingTrade}
      />
    </div>
  );
}

function App() {
  return (
    <TradeProvider>
      <AppContent />
    </TradeProvider>
  );
}

export default App;
