import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function LandingPage() {
  const features = [
    {
      icon: '🌉',
      title: 'Cross-Chain Tracking',
      description: 'Monitor NFTs across Ethereum, Polygon, Arbitrum, and Solana in one place'
    },
    {
      icon: '🤖',
      title: 'AI-Powered Insights',
      description: 'Get intelligent recommendations for optimal bridging routes and timing'
    },
    {
      icon: '💰',
      title: 'Cost Optimization',
      description: 'Compare gas fees and find the cheapest routes for your NFT transfers'
    },
    {
      icon: '📊',
      title: 'Portfolio Analytics',
      description: 'Real-time valuation and performance tracking across all chains'
    },
    {
      icon: '🚀',
      title: 'One-Click Bridging',
      description: 'Execute transfers directly from the dashboard with built-in safety checks'
    },
    {
      icon: '🔔',
      title: 'Smart Alerts',
      description: 'Get notified about market opportunities and gas price drops'
    }
  ]

  const stats = [
    { value: '67%', label: 'of Web3 gamers struggle with multi-chain assets' },
    { value: '$12B', label: 'invested in Web3 gaming since 2020' },
    { value: '4+', label: 'chains supported at launch' },
    { value: '< 30s', label: 'to view your complete portfolio' }
  ]

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-20">
        <h1 className="text-6xl font-bold text-white mb-6">
          Your NFTs. <span className="text-primary">All Chains.</span> One Dashboard.
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          The first mobile-optimized cross-chain NFT asset bridge dashboard. Track, manage, and optimize your gaming NFTs across every major blockchain.
        </p>
        <div className="flex justify-center">
          <ConnectButton.Custom>
            {({ openConnectModal }) => (
              <button
                onClick={openConnectModal}
                className="bg-primary hover:bg-primary/90 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105"
              >
                Connect Wallet & Start
              </button>
            )}
          </ConnectButton.Custom>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
            <div className="text-gray-400">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Features Grid */}
      <section>
        <h2 className="text-4xl font-bold text-white text-center mb-12">
          Everything You Need to Master Multi-Chain Gaming
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div key={i} className="bg-dark/50 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6 hover:border-primary/50 transition-all">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-16 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to Bridge the Gap?
        </h2>
        <p className="text-gray-300 mb-8">
          Join thousands of Web3 gamers managing their assets efficiently
        </p>
        <ConnectButton.Custom>
          {({ openConnectModal }) => (
            <button
              onClick={openConnectModal}
              className="bg-white text-dark font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-all"
            >
              Get Started Free
            </button>
          )}
        </ConnectButton.Custom>
      </section>
    </div>
  )
}
