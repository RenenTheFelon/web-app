import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center bg-blue-600 text-white p-4 shadow-md">
      <h1 className="text-xl font-bold">WealthWise</h1>
      <div className="space-x-4">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/learn" className="hover:underline">Learn</Link>
        <Link to="/Products" className="hover:underline">Products</Link>
        <Link to="/PersonalFinance" className="hover:underline">Personal Finance</Link>
      </div>
    </nav>
  )
}

export default Navbar
