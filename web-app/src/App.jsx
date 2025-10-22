import AppRouter from './routes/AppRouter.jsx'
import Navbar from './components/layout/Navbar.jsx'
import MainLayout from './layouts/MainLayout.jsx'

function App() {
  return (
    <MainLayout>
      <AppRouter />
    </MainLayout>
  )
}

export default App



