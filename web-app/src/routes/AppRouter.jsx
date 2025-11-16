import { Routes, Route, Navigate } from 'react-router-dom'
import Home from '../pages/Home/Home.jsx'
import Learn from '../pages/Learn/Learn.jsx'
import Products from '../pages/Products/Products.jsx'
import Watchlist from '../pages/Products/Watchlist.jsx'
import Charts from '../pages/Products/Charts.jsx'
import PersonalFinance from '../pages/PersonalFinance/PersonalFinance.jsx'
import TradingJournal from '../pages/TradingJournal/TradingJournal.jsx'


const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/learn" element={<Learn />} />

      {/* Nested Products routes */}
      <Route path="/products" element={<Products />}>
        <Route index element={<Navigate to="/products/watchlist" />} />
        <Route path="watchlist" element={<Watchlist />} />
        <Route path="charts" element={<Charts />} />
      </Route>

      <Route path="/personal-finance" element={<PersonalFinance />} />
      <Route path="/trading-journal" element={<TradingJournal />} />
    </Routes>
  )
}

export default AppRouter
