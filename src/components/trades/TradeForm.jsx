import React, { useState } from 'react';
import { X, Upload, Trash2 } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { FOREX_PAIRS, CRYPTO_ASSETS, DIRECTIONS, OUTCOMES, STRATEGIES, EMOTIONAL_STATES } from '../../utils/constants';
import { useTradeContext } from '../../context/TradeContext';

const TradeForm = ({ isOpen, onClose, trade = null }) => {
  const { addTrade, updateTrade, customPairs, addCustomPair } = useTradeContext();
  
  const [formData, setFormData] = useState({
    date: trade?.date ? new Date(trade.date).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
    asset: trade?.asset || '',
    assetType: trade?.assetType || 'Forex',
    direction: trade?.direction || 'Long',
    entryPrice: trade?.entryPrice || '',
    exitPrice: trade?.exitPrice || '',
    positionSize: trade?.positionSize || '',
    stopLoss: trade?.stopLoss || '',
    takeProfit: trade?.takeProfit || '',
    outcome: trade?.outcome || '',
    strategy: trade?.strategy || '',
    emotionalState: trade?.emotionalState || '',
    notes: trade?.notes || '',
    screenshots: trade?.screenshots || [],
  });

  const [showCustomPairInput, setShowCustomPairInput] = useState(false);
  const [customPairValue, setCustomPairValue] = useState('');
  const [errors, setErrors] = useState({});

  const allPairs = [...FOREX_PAIRS, ...CRYPTO_ASSETS, ...customPairs];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddCustomPair = () => {
    if (customPairValue.trim()) {
      const upperPair = customPairValue.trim().toUpperCase();
      addCustomPair(upperPair);
      setFormData(prev => ({ ...prev, asset: upperPair }));
      setCustomPairValue('');
      setShowCustomPairInput(false);
    }
  };

  const handleScreenshotUpload = (e) => {
    const files = Array.from(e.target.files);
    // In a real app, you'd upload these to a server or convert to base64
    // For now, we'll just store the file names
    const fileNames = files.map(f => f.name);
    setFormData(prev => ({
      ...prev,
      screenshots: [...prev.screenshots, ...fileNames],
    }));
  };

  const removeScreenshot = (index) => {
    setFormData(prev => ({
      ...prev,
      screenshots: prev.screenshots.filter((_, i) => i !== index),
    }));
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.asset) newErrors.asset = 'Asset is required';
    if (!formData.entryPrice) newErrors.entryPrice = 'Entry price is required';
    if (!formData.exitPrice) newErrors.exitPrice = 'Exit price is required';
    if (!formData.positionSize) newErrors.positionSize = 'Position size is required';
    if (!formData.outcome) newErrors.outcome = 'Outcome is required';
    
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
      exitPrice: parseFloat(formData.exitPrice),
      positionSize: parseFloat(formData.positionSize),
      stopLoss: formData.stopLoss ? parseFloat(formData.stopLoss) : null,
      takeProfit: formData.takeProfit ? parseFloat(formData.takeProfit) : null,
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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a1a] rounded-lg border border-[#333333] w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#1a1a1a] border-b border-[#333333] p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            {trade ? 'Edit Trade' : 'Add New Trade'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors"
          >
            <X size={24} className="text-[#888888]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Date & Time */}
          <Input
            label="Date & Time"
            type="datetime-local"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            required
          />

          {/* Asset Selection */}
          <div className="space-y-2">
            {!showCustomPairInput ? (
              <div className="flex gap-2">
                <Select
                  label="Asset"
                  value={formData.asset}
                  onChange={(e) => {
                    if (e.target.value === 'CUSTOM') {
                      setShowCustomPairInput(true);
                    } else {
                      handleChange('asset', e.target.value);
                    }
                  }}
                  options={[
                    ...allPairs,
                    { value: 'CUSTOM', label: '+ Add Custom Pair' },
                  ]}
                  required
                  error={errors.asset}
                  placeholder="Select a trading pair"
                />
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  label="Custom Pair"
                  value={customPairValue}
                  onChange={(e) => setCustomPairValue(e.target.value)}
                  placeholder="e.g., XAUUSD, GBPAUD"
                />
                <div className="flex gap-2 items-end">
                  <Button type="button" onClick={handleAddCustomPair}>
                    Add
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowCustomPairInput(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Direction */}
          <Select
            label="Direction"
            value={formData.direction}
            onChange={(e) => handleChange('direction', e.target.value)}
            options={DIRECTIONS}
            required
          />

          {/* Price Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Entry Price"
              type="number"
              step="0.00001"
              value={formData.entryPrice}
              onChange={(e) => handleChange('entryPrice', e.target.value)}
              required
              error={errors.entryPrice}
            />
            <Input
              label="Exit Price"
              type="number"
              step="0.00001"
              value={formData.exitPrice}
              onChange={(e) => handleChange('exitPrice', e.target.value)}
              required
              error={errors.exitPrice}
            />
          </div>

          {/* Position Size */}
          <Input
            label="Position Size"
            type="number"
            step="0.01"
            value={formData.positionSize}
            onChange={(e) => handleChange('positionSize', e.target.value)}
            required
            error={errors.positionSize}
          />

          {/* Stop Loss & Take Profit */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Stop Loss"
              type="number"
              step="0.00001"
              value={formData.stopLoss}
              onChange={(e) => handleChange('stopLoss', e.target.value)}
            />
            <Input
              label="Take Profit"
              type="number"
              step="0.00001"
              value={formData.takeProfit}
              onChange={(e) => handleChange('takeProfit', e.target.value)}
            />
          </div>

          {/* Outcome & Strategy */}
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Outcome"
              value={formData.outcome}
              onChange={(e) => handleChange('outcome', e.target.value)}
              options={OUTCOMES}
              required
              error={errors.outcome}
            />
            <Select
              label="Strategy"
              value={formData.strategy}
              onChange={(e) => handleChange('strategy', e.target.value)}
              options={STRATEGIES}
            />
          </div>

          {/* Emotional State */}
          <Select
            label="Emotional State"
            value={formData.emotionalState}
            onChange={(e) => handleChange('emotionalState', e.target.value)}
            options={EMOTIONAL_STATES}
            placeholder="How did you feel during this trade?"
          />

          {/* Notes */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[#888888]">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Add any additional notes about this trade..."
              rows={4}
              className="input resize-none"
            />
          </div>

          {/* Screenshots */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#888888]">Screenshots</label>
            <div className="border-2 border-dashed border-[#333333] rounded-lg p-6 text-center hover:border-[#444444] transition-colors">
              <input
                type="file"
                id="screenshots"
                multiple
                accept="image/*"
                onChange={handleScreenshotUpload}
                className="hidden"
              />
              <label
                htmlFor="screenshots"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Upload size={32} className="text-[#555555]" />
                <span className="text-sm text-[#888888]">
                  Click to upload or drag and drop
                </span>
                <span className="text-xs text-[#555555]">
                  PNG, JPG up to 10MB
                </span>
              </label>
            </div>

            {/* Screenshot Preview */}
            {formData.screenshots.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {formData.screenshots.map((screenshot, index) => (
                  <div
                    key={index}
                    className="relative bg-[#2a2a2a] rounded-lg p-3 flex items-center justify-between"
                  >
                    <span className="text-xs text-[#888888] truncate">
                      {screenshot}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeScreenshot(index)}
                      className="ml-2 p-1 hover:bg-[#333333] rounded transition-colors"
                    >
                      <Trash2 size={14} className="text-[#ff4444]" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" variant="primary" className="flex-1">
              {trade ? 'Update Trade' : 'Add Trade'}
            </Button>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TradeForm;
