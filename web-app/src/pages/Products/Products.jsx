import { Outlet } from "react-router-dom"

const Products = () => {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      <p className="mb-6 text-gray-600">
        Track your favorite stocks and monitor their performance in real time.
      </p>

      {/* 👇 This renders any nested child route (like /products/charts or /products/watchlist) */}
      <Outlet />
    </section>
  )
}

export default Products

