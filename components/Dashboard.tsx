import { useState, useEffect } from 'react'
import AssetList from './AssetList'
import ChainOverview from './ChainOverview'
import BridgeOptimizer from './BridgeOptimizer'
import PortfolioChart from './PortfolioChart'
import { fetchMultiChainAssets } from '../lib/api'
import toast from 'react-hot-toast'

interface DashboardProps {
  address: string
}

export default function Dashboard({ address }: DashboardProps) {
  const [assets, setAssets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedChain, setSelectedChain] = useState<string>('all')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    loadAssets()
  }, [address, refreshKey])

  const loadAssets = async () => {
    try {
      setLoading(true)
      const data = await fetchMultiChainAssets(address)
      setAssets(data)
      toast.success('Assets loaded successfully')
    } catch (error) {
      console.error('Error loading assets:', error)
      toast.error('Failed to load assets')
    } finally {
      setLoading(false)
    }
  }

  const filteredAssets = selectedChain === 'all' 
    ? assets 
    : assets.filter(asset => asset.chain === selectedChain)

  const totalValue = assets.reduce((sum, asset) => sum + (asset.value || 0), 0)

  return (
    <div className="space-y-8">
      {/* Portfolio Summary */}
      <div className="bg-dark/50 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Portfolio Overview</h2>
            <p className="text-gray-400">Total Value: <span className="text-2xl font-bold text-primary">${totalValue.toLocaleString()}</span></p>
          </div>
          <button
            onClick={() => setRefreshKey(k => k + 1)}
            className="bg-primary/20 hover:bg-primary/30 text-primary px-4 py-2 rounded-lg transition-all"
          >
            Refresh
          </button>
        </div>
        
        {/* Chain Filter */}
        <div className="flex gap-2 mb-6">
          {['all', 'ethereum', 'polygon', 'arbitrum', 'solana'].map(chain => (
            <button
              key={chain}
              onClick={() => setSelectedChain(chain)}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedChain === chain
                  ? 'bg-primary text-white'
                  : 'bg-dark/50 text-gray-400 hover:bg-dark/70'
              }`}
            >
              {chain.charAt(0).toUpperCase() + chain.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        <ChainOverview assets={assets} />
        <PortfolioChart assets={assets} />
      </div>

      {/* Bridge Optimizer */}
      <BridgeOptimizer assets={filteredAssets} />

      {/* Asset List */}
      <AssetList assets={filteredAssets} loading={loading} />
    </div>
  )
}
