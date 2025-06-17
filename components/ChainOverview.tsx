interface ChainOverviewProps {
  assets: any[]
}

export default function ChainOverview({ assets }: ChainOverviewProps) {
  const chainData = [
    { name: 'Ethereum', icon: '🔷', color: 'from-blue-500 to-blue-600' },
    { name: 'Polygon', icon: '🟣', color: 'from-purple-500 to-purple-600' },
    { name: 'Arbitrum', icon: '🔵', color: 'from-sky-500 to-sky-600' },
    { name: 'Solana', icon: '🟢', color: 'from-green-500 to-green-600' },
  ]

  const getChainStats = (chainName: string) => {
    const chainAssets = assets.filter(a => a.chain?.toLowerCase() === chainName.toLowerCase())
    const value = chainAssets.reduce((sum, a) => sum + (a.value || 0), 0)
    return {
      count: chainAssets.length,
      value,
      percentage: assets.length > 0 ? (chainAssets.length / assets.length * 100) : 0
    }
  }

  return (
    <div className="bg-dark/50 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6">
      <h3 className="text-2xl font-bold text-white mb-6">Chain Distribution</h3>
      
      <div className="space-y-4">
        {chainData.map((chain) => {
          const stats = getChainStats(chain.name)
          return (
            <div key={chain.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{chain.icon}</span>
                  <span className="text-white font-semibold">{chain.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">{stats.count} NFTs</p>
                  <p className="text-gray-400 text-sm">${stats.value.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className={`bg-gradient-to-r ${chain.color} h-3 rounded-full transition-all duration-500`}
                  style={{ width: `${stats.percentage}%` }}
                ></div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
