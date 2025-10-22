import { useState } from "react"
import { NavLink } from "react-router-dom"

const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState("")

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? "" : menu)
  }

  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-md transition ${
      isActive ? "bg-blue-500 text-white" : "hover:bg-blue-100"
    }`

  return (
    <aside className="w-64 min-h-screen bg-white border-r shadow-sm">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-blue-700">RenenSomesh</h1>
      </div>
      <nav className="p-4 space-y-2 text-gray-700">
        {/* Home */}
        <NavLink to="/" className={linkClass}>
          Home
        </NavLink>

        {/* Learn */}
        <div>
          <button
            onClick={() => toggleMenu("learn")}
            className="w-full text-left px-4 py-2 rounded-md hover:bg-blue-100 transition font-medium"
          >
            Learn
          </button>
          {openMenu === "learn" && (
            <div className="ml-4 space-y-1">
              <NavLink to="/learn" className={linkClass}>
                Overview
              </NavLink>
            </div>
          )}
        </div>

        {/* Products */}
        <div>
          <button
            onClick={() => toggleMenu("products")}
            className="w-full text-left px-4 py-2 rounded-md hover:bg-blue-100 transition font-medium"
          >
            Products
          </button>
          {openMenu === "products" && (
            <div className="ml-4 space-y-1">
              <NavLink to="/products/watchlist" className={linkClass}>
                Watchlist
              </NavLink>
              <NavLink to="/products/charts" className={linkClass}>
                Charts
              </NavLink>
            </div>
          )}
        </div>

        {/* Personal Finance */}
        <div>
          <button
            onClick={() => toggleMenu("finance")}
            className="w-full text-left px-4 py-2 rounded-md hover:bg-blue-100 transition font-medium"
          >
            Personal Finance
          </button>
          {openMenu === "finance" && (
            <div className="ml-4 space-y-1">
              <NavLink to="/personal-finance" className={linkClass}>
                Overview
              </NavLink>
            </div>
          )}
        </div>
      </nav>
    </aside>
  )
}

export default Sidebar
