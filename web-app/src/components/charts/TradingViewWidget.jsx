import { useEffect, useRef } from "react"

/**
 * TradingViewWidget
 * Embeds a live TradingView chart dynamically based on the provided symbol.
 *
 * @param {string} symbol - Example: "NASDAQ:AAPL" or "NYSE:IBM"
 */
const TradingViewWidget = ({ symbol = "NASDAQ:AAPL" }) => {
  const container = useRef()

  useEffect(() => {
    if (!container.current) return

    // check here lytie, this Clears the previous chart
    container.current.innerHTML = ""

    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"
    script.type = "text/javascript"
    script.async = true
    script.innerHTML = JSON.stringify({
      width: "100%",
      height: 600,
      symbol: symbol,
      interval: "D",
      timezone: "Etc/UTC",
      theme: "light",
      style: "1",
      locale: "en",
      enable_publishing: false,
      hide_top_toolbar: false,
      hide_legend: false,
      allow_symbol_change: true,
      calendar: true,
      studies: [],
    })

    container.current.appendChild(script)
  }, [symbol])

  return (
    <div className="tradingview-widget-container" ref={container}>
      <div className="tradingview-widget-container__widget"></div>
    </div>
  )
}

export default TradingViewWidget
