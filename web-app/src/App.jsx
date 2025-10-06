import AppRouter from './routes/AppRouter.jsx'
import Navbar from './components/layout/Navbar.jsx'

function App() {
  return (
    <div className="min-h-screen bg-blue-50 text-gray-800">
      <Navbar />
      <main className="p-6">
        <AppRouter />
      </main>
    </div>
  )
}

export default App



