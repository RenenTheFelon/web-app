import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home/Home.jsx'
import Learn from '../pages/Learn/Learn.jsx'
import Products from '../pages/Products/Products.jsx'
import PersonalFinance from '../pages/PersonalFinance/PersonalFinance.jsx'

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/learn" element={<Learn />} />
      <Route path="/Products" element={<Products />} />
      <Route path="/PersonalFinance" element={<PersonalFinance />} />
    </Routes>
  )
}

export default AppRouter
