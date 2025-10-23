import { useState } from "react"
import TradingViewWidget from "../../components/charts/TradingViewWidget.jsx"
import StockOverview from "../../components/stocks/StockOverview.jsx"

const Charts = () => {
  const [symbol, setSymbol] = useState("NASDAQ:AAPL")

  // Alpha Vantage only needs the raw ticker (AAPL instead of NASDAQ:AAPL)
  const getCleanSymbol = (input) => input.split(":").pop()

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Charts</h2>
      <p className="mb-4 text-gray-600">
        Search for any stock and view its live TradingView chart.
      </p>

      {/* Search box + Overview aligned side-by-side */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Enter symbol (e.g. NASDAQ:TSLA)"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          className="w-full md:w-1/2 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <StockOverview symbol={getCleanSymbol(symbol)} />
      </div>

      {/* TradingView Chart */}
      <TradingViewWidget symbol={symbol} />
    </section>
  )
}

export default Charts
