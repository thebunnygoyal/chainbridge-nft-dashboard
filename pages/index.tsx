import { useState, useEffect } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import Dashboard from '../components/Dashboard'
import LandingPage from '../components/LandingPage'
import Header from '../components/Header'

export default function Home() {
  const { address, isConnected } = useAccount()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-slate-900 to-purple-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {isConnected ? (
          <Dashboard address={address!} />
        ) : (
          <LandingPage />
        )}
      </main>
    </div>
  )
}
