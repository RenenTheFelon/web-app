import { useEffect, useState } from "react"
import axios from "axios"

const StockOverview = ({ symbol }) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!symbol) return

    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await axios.get("https://www.alphavantage.co/query", {
          params: {
            function: "GLOBAL_QUOTE",
            symbol: symbol,
            apikey: import.meta.env.VITE_ALPHAVANTAGE_KEY,
          },
        })
        const quote = res.data["Global Quote"]
        setData(quote)
      } catch (err) {
        setError("Failed to fetch data.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [symbol])

  if (loading) return <div className="text-gray-500">Loading...</div>
  if (error) return <div className="text-red-500">{error}</div>
  if (!data || !data["05. price"])
    return <div className="text-gray-500">No data found.</div>

  const price = parseFloat(data["05. price"]).toFixed(2)
  const change = parseFloat(data["09. change"]).toFixed(2)
  const percent = data["10. change percent"]

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100 w-80">
      <h3 className="text-lg font-semibold mb-2">{data["01. symbol"]}</h3>
      <p className="text-2xl font-bold mb-1">${price}</p>
      <p
        className={`text-sm font-medium ${
          change >= 0 ? "text-green-600" : "text-red-600"
        }`}
      >
        {change >= 0 ? "▲" : "▼"} {change} ({percent})
      </p>
      <p className="text-gray-500 text-xs mt-2">
        Last refreshed: {data["07. latest trading day"]}
      </p>
    </div>
  )
}

export default StockOverview
