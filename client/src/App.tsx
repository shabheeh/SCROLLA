import { ThemeProvider } from './components/theme-provider'
import { Hero } from './pages/Hero'

function App() {
  

  return (
    <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
      <Hero />
    </ThemeProvider>
  )
}

export default App
