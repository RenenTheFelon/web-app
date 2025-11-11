import Sidebar from "../components/layout/Sidebar.jsx"

const MainLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  )
}

export default MainLayout
