import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home/Home.jsx'
import Learn from '../pages/Learn/Learn.jsx'
import Watchlist from '../pages/watchlist/watchlist.jsx'
import Budget from '../pages/budget/budget.jsx'

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/learn" element={<Learn />} />
      <Route path="/watchlist" element={<Watchlist />} />
      <Route path="/budget" element={<Budget />} />
    </Routes>
  )
}

export default AppRouter
