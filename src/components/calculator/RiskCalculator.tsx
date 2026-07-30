'use client';

import { useState } from 'react';

interface RiskCalculatorProps {
  darkMode: boolean;
}

export default function RiskCalculator({ darkMode }: RiskCalculatorProps) {
  const [assetType, setAssetType] = useState<'FOREX' | 'CRYPTO' | 'EQUITY'>('FOREX');
  const [accountBalance, setAccountBalance] = useState<number>(25000);
  const [riskPercentage, setRiskPercentage] = useState<number>(1);
  const [entryPrice, setEntryPrice] = useState<number>(1.0850);
  const [stopLossPrice, setStopLossPrice] = useState<number>(1.0820);
  const [riskRewardRatio, setRiskRewardRatio] = useState<number>(2);

  // Calculations
  const dollarRisk = accountBalance * (riskPercentage / 100);
  const priceDistance = Math.abs(entryPrice - stopLossPrice);

  // Position sizing logic depending on asset type
  let positionSize = 0;
  if (assetType === 'FOREX') {
    // Standard lot: 1 pip = $10 per standard lot for EUR/USD type pairs
    const pipsRisk = priceDistance * 10000;
    const dollarPerPip = pipsRisk > 0 ? dollarRisk / pipsRisk : 0;
    positionSize = dollarPerPip / 10;
  } else if (assetType === 'CRYPTO') {
    positionSize = priceDistance > 0 ? dollarRisk / priceDistance : 0;
  } else {
    positionSize = priceDistance > 0 ? Math.floor(dollarRisk / priceDistance) : 0;
  }

  const targetProfit = dollarRisk * riskRewardRatio;

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Header Bar */}
      <div
        className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          darkMode ? 'bg-[#1C2541] border-slate-700' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">🧮</span>
          <div>
            <h3 className="text-sm font-bold">Institutional Risk & Position Sizing Engine</h3>
            <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Calculate exact lot sizes, risk thresholds, and payout ratios before execution
            </p>
          </div>
        </div>

        {/* Asset Type Selector */}
        <div className="flex gap-1 bg-[#0B132B] p-1 rounded-lg border border-slate-700">
          {(['FOREX', 'CRYPTO', 'EQUITY'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setAssetType(type)}
              className={`px-3 py-1 rounded-md text-[10px] font-black transition-all ${
                assetType === type
                  ? 'bg-[#3A86FF] text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Inputs vs Outputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input Parameters Box */}
        <div
          className={`p-5 rounded-2xl border space-y-4 ${
            darkMode ? 'bg-[#1C2541]/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <h4 className="text-xs font-black uppercase tracking-wider text-[#3A86FF]">
            ⚙️ Trade Configuration Parameters
          </h4>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`text-[10px] font-bold block mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Account Balance ($)
              </label>
              <input
                type="number"
                value={accountBalance}
                onChange={(e) => setAccountBalance(Number(e.target.value))}
                className={`w-full px-3 py-2 rounded-xl text-xs font-bold border outline-none ${
                  darkMode ? 'bg-[#0B132B] border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>
            <div>
              <label className={`text-[10px] font-bold block mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Risk Tolerance (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={riskPercentage}
                onChange={(e) => setRiskPercentage(Number(e.target.value))}
                className={`w-full px-3 py-2 rounded-xl text-xs font-bold border outline-none ${
                  darkMode ? 'bg-[#0B132B] border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`text-[10px] font-bold block mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Entry Price
              </label>
              <input
                type="number"
                step="0.0001"
                value={entryPrice}
                onChange={(e) => setEntryPrice(Number(e.target.value))}
                className={`w-full px-3 py-2 rounded-xl text-xs font-bold border outline-none ${
                  darkMode ? 'bg-[#0B132B] border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>
            <div>
              <label className={`text-[10px] font-bold block mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Stop Loss Price
              </label>
              <input
                type="number"
                step="0.0001"
                value={stopLossPrice}
                onChange={(e) => setStopLossPrice(Number(e.target.value))}
                className={`w-full px-3 py-2 rounded-xl text-xs font-bold border outline-none ${
                  darkMode ? 'bg-[#0B132B] border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>
          </div>

          <div>
            <label className={`text-[10px] font-bold block mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Target Risk:Reward Ratio (1 : {riskRewardRatio})
            </label>
            <input
              type="range"
              min="1"
              max="5"
              step="0.5"
              value={riskRewardRatio}
              onChange={(e) => setRiskRewardRatio(Number(e.target.value))}
              className="w-full accent-[#3A86FF] cursor-pointer"
            />
          </div>
        </div>

        {/* Output & Risk Summary Box */}
        <div
          className={`p-5 rounded-2xl border flex flex-col justify-between ${
            darkMode ? 'bg-[#1C2541]/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400 mb-4">
              📊 Execution Output & Metrics
            </h4>

            <div className="space-y-3">
              <div className={`p-3 rounded-xl border flex justify-between items-center ${darkMode ? 'bg-[#0B132B]/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <span className="text-xs font-semibold text-slate-400">Max Dollar Risk:</span>
                <span className="text-sm font-black text-rose-400">
                  -${dollarRisk.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className={`p-3 rounded-xl border flex justify-between items-center ${darkMode ? 'bg-[#0B132B]/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <span className="text-xs font-semibold text-slate-400">
                  {assetType === 'FOREX' ? 'Recommended Lot Size:' : assetType === 'CRYPTO' ? 'Asset Units Size:' : 'Shares Quantity:'}
                </span>
                <span className="text-base font-black text-[#3A86FF]">
                  {positionSize.toFixed(assetType === 'FOREX' ? 2 : 4)} {assetType === 'FOREX' ? 'Lots' : 'Units'}
                </span>
              </div>

              <div className={`p-3 rounded-xl border flex justify-between items-center ${darkMode ? 'bg-[#0B132B]/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <span className="text-xs font-semibold text-slate-400">Projected Take Profit Target ({riskRewardRatio}:1):</span>
                <span className="text-sm font-black text-emerald-400">
                  +${targetProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Risk Warning Notice */}
          {riskPercentage > 2 && (
            <div className="mt-4 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-400 font-bold flex items-center gap-2">
              <span>⚠️</span>
              <span>High Risk Warning: Risking over 2% per trade violates institutional drawdown protocols.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
