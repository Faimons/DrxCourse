// C:\Users\DRX_SIMON\Drx-cours2.0\trading-platform\frontend\src\components\pages\PracticePage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  BarChart3, 
  Play, 
  Pause, 
  RotateCcw,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUp,
  ArrowDown,
  Activity,
  Zap,
  Trophy,
  BookOpen,
  Settings,
  RefreshCw
} from 'lucide-react';

interface TradingPosition {
  id: string;
  symbol: string;
  direction: 'buy' | 'sell';
  entryPrice: number;
  currentPrice: number;
  quantity: number;
  pnl: number;
  pnlPercent: number;
  openTime: string;
  status: 'open' | 'closed';
}

interface TradingAccount {
  balance: number;
  equity: number;
  margin: number;
  freeMargin: number;
  marginLevel: number;
  totalPnL: number;
  totalTrades: number;
  winRate: number;
}

const PracticePage = () => {
  const [account, setAccount] = useState<TradingAccount>({
    balance: 10000,
    equity: 10000,
    margin: 0,
    freeMargin: 10000,
    marginLevel: 0,
    totalPnL: 0,
    totalTrades: 0,
    winRate: 0
  });

  const [positions, setPositions] = useState<TradingPosition[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState('EURUSD');
  const [tradeSize, setTradeSize] = useState(0.1);
  const [simulationActive, setSimulationActive] = useState(false);
  const [currentPrices, setCurrentPrices] = useState<{[key: string]: number}>({
    'EURUSD': 1.0850,
    'GBPUSD': 1.2650,
    'USDJPY': 148.50,
    'USDCHF': 0.9120,
    'AUDUSD': 0.6580
  });

  const tradingPairs = [
    { symbol: 'EURUSD', name: 'Euro/US Dollar', spread: 0.0008 },
    { symbol: 'GBPUSD', name: 'British Pound/US Dollar', spread: 0.0012 },
    { symbol: 'USDJPY', name: 'US Dollar/Japanese Yen', spread: 0.08 },
    { symbol: 'USDCHF', name: 'US Dollar/Swiss Franc', spread: 0.0010 },
    { symbol: 'AUDUSD', name: 'Australian Dollar/US Dollar', spread: 0.0015 },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (simulationActive) {
      interval = setInterval(() => {
        updatePrices();
        updatePositions();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [simulationActive]);

  const updatePrices = () => {
    setCurrentPrices(prev => {
      const newPrices = { ...prev };
      Object.keys(newPrices).forEach(symbol => {
        const change = (Math.random() - 0.5) * 0.001;
        newPrices[symbol] = Math.max(0.1, newPrices[symbol] + change);
      });
      return newPrices;
    });
  };

  const updatePositions = () => {
    setPositions(prev => prev.map(pos => {
      const currentPrice = currentPrices[pos.symbol];
      const priceDiff = pos.direction === 'buy' 
        ? currentPrice - pos.entryPrice
        : pos.entryPrice - currentPrice;
      
      const pnl = priceDiff * pos.quantity * 100000; // Standard lot size
      const pnlPercent = (priceDiff / pos.entryPrice) * 100;
      
      return {
        ...pos,
        currentPrice,
        pnl,
        pnlPercent
      };
    }));
  };

  const openPosition = (direction: 'buy' | 'sell') => {
    const pair = tradingPairs.find(p => p.symbol === selectedSymbol);
    if (!pair) return;

    const entryPrice = direction === 'buy' 
      ? currentPrices[selectedSymbol] + pair.spread/2
      : currentPrices[selectedSymbol] - pair.spread/2;

    const newPosition: TradingPosition = {
      id: Date.now().toString(),
      symbol: selectedSymbol,
      direction,
      entryPrice,
      currentPrice: currentPrices[selectedSymbol],
      quantity: tradeSize,
      pnl: 0,
      pnlPercent: 0,
      openTime: new Date().toLocaleTimeString(),
      status: 'open'
    };

    setPositions(prev => [...prev, newPosition]);
    setAccount(prev => ({
      ...prev,
      totalTrades: prev.totalTrades + 1
    }));
  };

  const closePosition = (positionId: string) => {
    setPositions(prev => prev.filter(pos => pos.id !== positionId));
    // Update account balance based on P&L
    const position = positions.find(pos => pos.id === positionId);
    if (position) {
      setAccount(prev => ({
        ...prev,
        balance: prev.balance + position.pnl,
        totalPnL: prev.totalPnL + position.pnl
      }));
    }
  };

  const resetSimulation = () => {
    setAccount({
      balance: 10000,
      equity: 10000,
      margin: 0,
      freeMargin: 10000,
      marginLevel: 0,
      totalPnL: 0,
      totalTrades: 0,
      winRate: 0
    });
    setPositions([]);
    setSimulationActive(false);
  };

  const totalPnL = positions.reduce((sum, pos) => sum + pos.pnl, 0);
  const currentEquity = account.balance + totalPnL;

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Trading Practice</h1>
              <p className="text-gray-400">Practice trading with virtual money - No real money at risk</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSimulationActive(!simulationActive)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  simulationActive 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {simulationActive ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause Simulation
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Simulation
                  </>
                )}
              </button>
              <button
                onClick={resetSimulation}
                className="flex items-center px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Account Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Account Balance</p>
                <p className="text-2xl font-bold text-white">${account.balance.toFixed(2)}</p>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Current Equity</p>
                <p className="text-2xl font-bold text-white">${currentEquity.toFixed(2)}</p>
              </div>
              <div className="bg-emerald-500/20 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
            <p className={`text-sm mt-2 ${totalPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              P&L: ${totalPnL.toFixed(2)}
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Open Positions</p>
                <p className="text-2xl font-bold text-white">{positions.length}</p>
              </div>
              <div className="bg-yellow-500/20 p-3 rounded-lg">
                <Activity className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Trades</p>
                <p className="text-2xl font-bold text-white">{account.totalTrades}</p>
              </div>
              <div className="bg-purple-500/20 p-3 rounded-lg">
                <BarChart3 className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Trading Panel */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
              <h2 className="text-xl font-bold text-white mb-6">Trading Panel</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Trading Pair</label>
                  <select
                    value={selectedSymbol}
                    onChange={(e) => setSelectedSymbol(e.target.value)}
                    className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:border-emerald-500 focus:outline-none"
                  >
                    {tradingPairs.map(pair => (
                      <option key={pair.symbol} value={pair.symbol}>
                        {pair.symbol} - {pair.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Trade Size (Lots)</label>
                  <input
                    type="number"
                    value={tradeSize}
                    onChange={(e) => setTradeSize(parseFloat(e.target.value))}
                    min="0.01"
                    max="10"
                    step="0.01"
                    className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Current Price</span>
                    <span className="text-white font-bold">{currentPrices[selectedSymbol]?.toFixed(5)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Spread</span>
                    <span className="text-gray-300">
                      {tradingPairs.find(p => p.symbol === selectedSymbol)?.spread}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => openPosition('buy')}
                    disabled={!simulationActive}
                    className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowUp className="h-4 w-4 inline mr-2" />
                    BUY
                  </button>
                  <button
                    onClick={() => openPosition('sell')}
                    disabled={!simulationActive}
                    className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowDown className="h-4 w-4 inline mr-2" />
                    SELL
                  </button>
                </div>
              </div>
            </div>

            {/* Open Positions */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-6">Open Positions</h2>
              
              {positions.length === 0 ? (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No open positions</p>
                  <p className="text-sm text-gray-500 mt-1">Start trading to see your positions here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {positions.map(position => (
                    <div key={position.id} className="bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`px-2 py-1 rounded text-xs font-medium ${
                            position.direction === 'buy' 
                              ? 'bg-emerald-500/20 text-emerald-400' 
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {position.direction.toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-white">{position.symbol}</div>
                            <div className="text-sm text-gray-400">{position.quantity} lots</div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className={`font-bold ${
                            position.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'
                          }`}>
                            ${position.pnl.toFixed(2)}
                          </div>
                          <div className={`text-sm ${
                            position.pnlPercent >= 0 ? 'text-emerald-400' : 'text-red-400'
                          }`}>
                            {position.pnlPercent >= 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%
                          </div>
                        </div>
                        
                        <button
                          onClick={() => closePosition(position.id)}
                          className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors text-sm"
                        >
                          Close
                        </button>
                      </div>
                      
                      <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Entry: </span>
                          <span className="text-white">{position.entryPrice.toFixed(5)}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Current: </span>
                          <span className="text-white">{position.currentPrice.toFixed(5)}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Time: </span>
                          <span className="text-white">{position.openTime}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Market Watch & Tips */}
          <div className="space-y-6">
            
            {/* Market Watch */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-4">Market Watch</h3>
              <div className="space-y-3">
                {tradingPairs.map(pair => (
                  <div key={pair.symbol} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div>
                      <div className="font-medium text-white">{pair.symbol}</div>
                      <div className="text-xs text-gray-400">{pair.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-mono">{currentPrices[pair.symbol]?.toFixed(5)}</div>
                      <div className={`text-xs flex items-center ${
                        Math.random() > 0.5 ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {Math.random() > 0.5 ? (
                          <ArrowUp className="h-3 w-3 mr-1" />
                        ) : (
                          <ArrowDown className="h-3 w-3 mr-1" />
                        )}
                        {(Math.random() * 0.002).toFixed(5)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trading Tips */}
            <div className="bg-gradient-to-r from-emerald-600/20 to-blue-600/20 rounded-xl p-6 border border-emerald-500/30">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <Zap className="h-5 w-5 text-emerald-400 mr-2" />
                Trading Tips
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-emerald-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Start with small position sizes to learn</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-emerald-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Always use stop losses in real trading</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-emerald-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Don't risk more than 2% per trade</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-emerald-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Practice makes perfect - keep trading!</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/app/course"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Back to Lessons
                </Link>
                <Link
                  to="/app/progress"
                  className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center"
                >
                  <Trophy className="h-4 w-4 mr-2" />
                  View Progress
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticePage;