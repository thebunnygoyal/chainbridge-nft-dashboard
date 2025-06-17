import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function Header() {
  return (
    <header className="w-full bg-dark/80 backdrop-blur-sm border-b border-purple-500/20">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h1 className="text-2xl font-bold text-white">ChainBridge</h1>
        </div>
        <ConnectButton />
      </div>
    </header>
  )
}
