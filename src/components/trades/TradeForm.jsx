import React, { useState, useEffect } from "react";
import { X, Upload, Trash2, Calculator, Plus } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import {
  FOREX_PAIRS,
  CRYPTO_ASSETS,
  DIRECTIONS,
  OUTCOMES,
  STRATEGIES,
  EMOTIONAL_STATES,
  TRADE_TAGS,
} from "../../utils/constants";
import { useTradeContext } from "../../context/TradeContext";

const getInitialFormData = (tradeData) => ({
  date: tradeData?.date
    ? new Date(tradeData.date).toISOString().slice(0, 16)
    : new Date().toISOString().slice(0, 16),
  asset: tradeData?.asset || "",
  direction: tradeData?.direction || "Long",
  entryPrice: tradeData?.entryPrice || "",
  exitPrice: tradeData?.exitPrice || "",
  positionSize: tradeData?.positionSize || "",
  stopLoss: tradeData?.stopLoss || "",
  exits: tradeData?.exits || [{ price: "", percentage: 100 }],
  outcome: tradeData?.outcome || "Breakeven",
  strategy: tradeData?.strategy || "",
  pnl: tradeData?.pnl || "",
  riskReward: tradeData?.riskReward || "",
  emotionalState: tradeData?.emotionalState || "Neutral",
  notes: tradeData?.notes || "",
  screenshots: tradeData?.screenshots || [],
  tags: tradeData?.tags || [],
});

const TradeForm = ({ isOpen, onClose, trade = null }) => {
  const { addTrade, updateTrade, customPairs, addCustomPair, selectedAccount } =
    useTradeContext();

  const [formData, setFormData] = useState(getInitialFormData(trade));
  const [showCustomPairInput, setShowCustomPairInput] = useState(false);
  const [customPairValue, setCustomPairValue] = useState("");
  const [errors, setErrors] = useState({});

  // Calculator state
  const [showCalculator, setShowCalculator] = useState(false);
  const [riskPercent, setRiskPercent] = useState(1);
  const [accountBalance, setAccountBalance] = useState(
    selectedAccount?.currentBalance || 10000,
  );

  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormData(trade));
      setErrors({});
      if (selectedAccount) setAccountBalance(selectedAccount.currentBalance);
    }
  }, [trade, isOpen, selectedAccount]);

  const allPairs = [...FOREX_PAIRS, ...CRYPTO_ASSETS, ...customPairs];

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleExitChange = (index, field, value) => {
    const newExits = [...formData.exits];
    newExits[index] = { ...newExits[index], [field]: value };
    setFormData((prev) => ({ ...prev, exits: newExits }));
  };

  const addExit = () => {
    setFormData((prev) => ({
      ...prev,
      exits: [...prev.exits, { price: "", percentage: "" }],
    }));
  };

  const removeExit = (index) => {
    if (formData.exits.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      exits: prev.exits.filter((_, i) => i !== index),
    }));
  };

  const toggleTag = (tag) => {
    setFormData((prev) => {
      const tags = prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag];
      return { ...prev, tags };
    });
  };

  const calculatePositionSize = () => {
    const entry = parseFloat(formData.entryPrice);
    const sl = parseFloat(formData.stopLoss);
    if (isNaN(entry) || isNaN(sl) || entry === sl) {
      alert("Please provide valid Entry and Stop Loss prices for calculation.");
      return;
    }

    const riskAmount = accountBalance * (riskPercent / 100);
    const priceDiff = Math.abs(entry - sl);
    const size = riskAmount / priceDiff;

    setFormData((prev) => ({ ...prev, positionSize: size.toFixed(4) }));
    setShowCalculator(false);
  };

  const handleAddCustomPair = () => {
    if (customPairValue.trim()) {
      const upperPair = customPairValue.trim().toUpperCase();
      addCustomPair(upperPair);
      setFormData((prev) => ({ ...prev, asset: upperPair }));
      setCustomPairValue("");
      setShowCustomPairInput(false);
    }
  };

  const handleScreenshotUpload = (e) => {
    const files = Array.from(e.target.files);
    // Note: In a production app, you would upload these to a cloud storage
    // For this prototype, we're creating local blobs for preview
    const fileUrls = files.map((f) => URL.createObjectURL(f));
    setFormData((prev) => ({
      ...prev,
      screenshots: [...prev.screenshots, ...fileUrls],
    }));
  };

  const handleAddScreenshotUrl = () => {
    const url = prompt("Enter chart image URL:");
    if (url) {
      setFormData((prev) => ({
        ...prev,
        screenshots: [...prev.screenshots, url],
      }));
    }
  };

  const removeScreenshot = (index) => {
    setFormData((prev) => ({
      ...prev,
      screenshots: prev.screenshots.filter((_, i) => i !== index),
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.asset) newErrors.asset = "Asset is required";
    if (!formData.entryPrice) newErrors.entryPrice = "Entry price is required";
    if (!formData.positionSize)
      newErrors.positionSize = "Position size is required";
    if (!formData.outcome) newErrors.outcome = "Outcome is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const tradeData = {
      ...formData,
      date: new Date(formData.date).toISOString(),
      entryPrice: parseFloat(formData.entryPrice),
      exitPrice: formData.exitPrice ? parseFloat(formData.exitPrice) : null,
      positionSize: parseFloat(formData.positionSize),
      stopLoss: formData.stopLoss ? parseFloat(formData.stopLoss) : null,
      exits: formData.exits
        .map((ex) => ({
          price: parseFloat(ex.price) || null,
          percentage: parseFloat(ex.percentage) || 0,
        }))
        .filter((ex) => ex.price !== null),
    };

    if (trade) {
      updateTrade(trade.id, tradeData);
    } else {
      addTrade(tradeData);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[100] p-4 overflow-y-auto"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.85)" }}
    >
      <div
        className="w-full max-w-4xl my-auto rounded-xl border shadow-2xl overflow-hidden"
        style={{
          backgroundColor: "var(--bg-secondary)",
          borderColor: "var(--border-primary)",
        }}
      >
        {/* Header */}
        <div
          className="border-b p-5 flex items-center justify-between"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: "var(--border-secondary)",
          }}
        >
          <div>
            <h2 className="text-xl font-bold text-white">
              {trade ? "Edit Trade Record" : "Log New Trade"}
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Fill in the details of your execution
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Main Details */}
            <div className="space-y-6">
              <div className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">
                Trade Setup
              </div>

              <Input
                label="Date & Time"
                type="datetime-local"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
                required
              />

              <div className="space-y-2">
                {!showCustomPairInput ? (
                  <Select
                    label="Trading Pair / Asset"
                    value={formData.asset}
                    onChange={(e) => {
                      if (e.target.value === "CUSTOM")
                        setShowCustomPairInput(true);
                      else handleChange("asset", e.target.value);
                    }}
                    options={[
                      ...allPairs,
                      { value: "CUSTOM", label: "+ Add Custom Asset" },
                    ]}
                    required
                    error={errors.asset}
                  />
                ) : (
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-400">
                      Custom Asset
                    </label>
                    <div className="flex gap-2">
                      <input
                        className="input flex-1"
                        value={customPairValue}
                        onChange={(e) => setCustomPairValue(e.target.value)}
                        placeholder="e.g., XAUUSD"
                        autoFocus
                      />
                      <Button
                        type="button"
                        onClick={handleAddCustomPair}
                        size="sm"
                      >
                        Add
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setShowCustomPairInput(false)}
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Direction"
                  value={formData.direction}
                  onChange={(e) => handleChange("direction", e.target.value)}
                  options={DIRECTIONS}
                />
                <Select
                  label="Execution Strategy"
                  value={formData.strategy}
                  onChange={(e) => handleChange("strategy", e.target.value)}
                  options={STRATEGIES}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Entry Price"
                  type="number"
                  step="any"
                  value={formData.entryPrice}
                  onChange={(e) => handleChange("entryPrice", e.target.value)}
                  required
                />
                <Input
                  label="Stop Loss (SL)"
                  type="number"
                  step="any"
                  value={formData.stopLoss}
                  onChange={(e) => handleChange("stopLoss", e.target.value)}
                />
              </div>

              {/* Position Sizing with Calculator */}
              <div className="p-4 rounded-lg bg-black/20 border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-400 uppercase">
                    Position Size
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowCalculator(!showCalculator)}
                    className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <Calculator size={14} />
                    {showCalculator ? "Hide Calculator" : "Risk Calculator"}
                  </button>
                </div>

                {showCalculator && (
                  <div className="grid grid-cols-2 gap-4 p-3 rounded bg-white/5 border border-white/10 animate-in fade-in slide-in-from-top-2 duration-200">
                    <Input
                      label="Risk %"
                      type="number"
                      value={riskPercent}
                      onChange={(e) => setRiskPercent(e.target.value)}
                      step="0.1"
                    />
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={calculatePositionSize}
                        className="w-full h-[42px] bg-blue-600 hover:bg-blue-500 text-white rounded font-medium text-sm transition-colors"
                      >
                        Apply Size
                      </button>
                    </div>
                    <div className="col-span-2 text-[10px] text-gray-500">
                      Calculation based on current account balance ($
                      {accountBalance.toLocaleString()}) and SL distance.
                    </div>
                  </div>
                )}

                <Input
                  type="number"
                  step="any"
                  value={formData.positionSize}
                  onChange={(e) => handleChange("positionSize", e.target.value)}
                  placeholder="Lots / Units / Quantity"
                  required
                />
              </div>
            </div>

            {/* Outcome and Analysis */}
            <div className="space-y-6">
              <div className="text-xs font-bold uppercase tracking-widest text-green-400 mb-2">
                Trade Outcome
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-400 uppercase">
                    Take Profit Levels
                  </label>
                  <button
                    type="button"
                    onClick={addExit}
                    className="p-1 rounded hover:bg-white/10 text-blue-400"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="max-h-[160px] overflow-y-auto space-y-2 pr-1">
                  {formData.exits.map((exit, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <div className="flex-1">
                        <input
                          type="number"
                          step="any"
                          className="input w-full text-sm h-10"
                          placeholder={`TP ${index + 1} Price`}
                          value={exit.price}
                          onChange={(e) =>
                            handleExitChange(index, "price", e.target.value)
                          }
                        />
                      </div>
                      <div className="w-24">
                        <input
                          type="number"
                          className="input w-full text-sm h-10"
                          placeholder="Vol %"
                          value={exit.percentage}
                          onChange={(e) =>
                            handleExitChange(
                              index,
                              "percentage",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      {formData.exits.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeExit(index)}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Final Exit Price"
                  type="number"
                  step="any"
                  value={formData.exitPrice}
                  onChange={(e) => handleChange("exitPrice", e.target.value)}
                />
                <Select
                  label="Result"
                  value={formData.outcome}
                  onChange={(e) => handleChange("outcome", e.target.value)}
                  options={OUTCOMES}
                  required
                />
              </div>

              {/* Behavior Tags */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-gray-400 uppercase">
                  Behavior Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {TRADE_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded text-[11px] font-bold uppercase tracking-wider transition-all border ${
                        formData.tags.includes(tag)
                          ? "bg-blue-600/20 border-blue-500 text-blue-300"
                          : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <Select
                label="Mindset During Trade"
                value={formData.emotionalState}
                onChange={(e) => handleChange("emotionalState", e.target.value)}
                options={EMOTIONAL_STATES}
              />
            </div>
          </div>

          {/* Notes and Media */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t border-white/10">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase">
                Trade Review & Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="What was the setup? Did you follow your rules? What could be improved?"
                rows={6}
                className="input w-full resize-none text-sm p-4 h-[180px]"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-400 uppercase">
                  Chart Screenshots
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={handleAddScreenshotUrl}
                    className="text-xs text-blue-400 hover:underline"
                  >
                    Link URL
                  </button>
                  <label className="text-xs text-blue-400 hover:underline cursor-pointer">
                    Upload Files
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleScreenshotUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 h-[180px] overflow-y-auto pr-2 custom-scrollbar">
                {formData.screenshots.map((src, index) => (
                  <div
                    key={index}
                    className="group relative aspect-video rounded-lg overflow-hidden border border-white/10 bg-black/40"
                  >
                    <img
                      src={src}
                      alt={`Chart ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeScreenshot(index)}
                        className="p-2 bg-red-500/80 rounded-full text-white hover:bg-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-lg hover:border-white/20 hover:bg-white/5 transition-all cursor-pointer text-gray-500">
                  <Plus size={24} />
                  <span className="text-[10px] mt-1 font-bold uppercase">
                    Add Chart
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleScreenshotUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Submission */}
          <div className="flex gap-4 pt-6 border-t border-white/10">
            <button
              type="submit"
              className="flex-1 h-12 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold uppercase tracking-widest text-sm shadow-lg shadow-blue-900/20 transition-all transform active:scale-[0.98]"
            >
              {trade ? "Update Trade Log" : "Log Trade Execution"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-8 h-12 bg-white/5 hover:bg-white/10 text-white rounded-lg font-bold uppercase tracking-widest text-xs transition-all border border-white/10"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TradeForm;
