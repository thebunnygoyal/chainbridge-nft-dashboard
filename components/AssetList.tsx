interface Asset {
  id: string
  name: string
  image: string
  chain: string
  collection: string
  value: number
  lastTransfer: string
  rarity?: string
}

interface AssetListProps {
  assets: Asset[]
  loading: boolean
}

export default function AssetList({ assets, loading }: AssetListProps) {
  if (loading) {
    return (
      <div className="bg-dark/50 backdrop-blur-sm border border-purple-500/20 rounded-lg p-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-gray-700/50 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-dark/50 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6">
      <h3 className="text-2xl font-bold text-white mb-6">Your NFT Assets</h3>
      
      <div className="space-y-4">
        {assets.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No NFTs found. Try a different chain filter.</p>
        ) : (
          assets.map((asset) => (
            <div key={asset.id} className="bg-dark/30 rounded-lg p-4 flex items-center gap-4 hover:bg-dark/50 transition-all">
              <img 
                src={asset.image || '/api/placeholder/80/80'} 
                alt={asset.name}
                className="w-20 h-20 rounded-lg object-cover"
              />
              
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-white">{asset.name}</h4>
                <p className="text-gray-400 text-sm">{asset.collection}</p>
                <div className="flex gap-4 mt-2 text-sm">
                  <span className="text-primary">{asset.chain}</span>
                  {asset.rarity && <span className="text-secondary">{asset.rarity}</span>}
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-xl font-bold text-white">${asset.value?.toLocaleString() || '0'}</p>
                <p className="text-sm text-gray-400">Last: {asset.lastTransfer}</p>
              </div>
              
              <button className="bg-primary/20 hover:bg-primary/30 text-primary px-4 py-2 rounded-lg transition-all">
                Bridge
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
