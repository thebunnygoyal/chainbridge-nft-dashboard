import { useState } from 'react'
import toast from 'react-hot-toast'

interface BridgeOptimizerProps {
  assets: any[]
}

export default function BridgeOptimizer({ assets }: BridgeOptimizerProps) {
  const [analyzing, setAnalyzing] = useState(false)
  const [recommendations, setRecommendations] = useState<any[]>([])

  const analyzeOptimalRoutes = async () => {
    setAnalyzing(true)
    
    // Simulate AI analysis
    setTimeout(() => {
      const mockRecommendations = [
        {
          from: 'Ethereum',
          to: 'Polygon',
          assets: 3,
          currentCost: '$45',
          optimalCost: '$12',
          savings: '$33',
          timing: 'Next 2 hours',
          reason: 'Gas prices expected to drop 70% during off-peak hours'
        },
        {
          from: 'Solana',
          to: 'Arbitrum',
          assets: 2,
          currentCost: '$8',
          optimalCost: '$3',
          savings: '$5',
          timing: 'Tomorrow 3 AM UTC',
          reason: 'Historical data shows lowest congestion at this time'
        }
      ]
      
      setRecommendations(mockRecommendations)
      setAnalyzing(false)
      toast.success('Analysis complete! Found optimization opportunities.')
    }, 2000)
  }

  return (
    <div className="bg-dark/50 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-white">AI Bridge Optimizer</h3>
        <button
          onClick={analyzeOptimalRoutes}
          disabled={analyzing}
          className="bg-primary hover:bg-primary/90 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg transition-all flex items-center gap-2"
        >
          {analyzing ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              Analyzing...
            </>
          ) : (
            <>
              🤖 Analyze Routes
            </>
          )}
        </button>
      </div>

      {recommendations.length > 0 ? (
        <div className="space-y-4">
          {recommendations.map((rec, i) => (
            <div key={i} className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-lg font-semibold text-white">
                    {rec.from} → {rec.to}
                  </h4>
                  <p className="text-gray-400 text-sm">{rec.assets} assets eligible</p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-bold text-lg">Save {rec.savings}</p>
                  <p className="text-gray-400 text-sm">{rec.currentCost} → {rec.optimalCost}</p>
                </div>
              </div>
              
              <div className="bg-dark/30 rounded p-3 mb-3">
                <p className="text-gray-300 text-sm">
                  <span className="text-primary font-semibold">Optimal Time:</span> {rec.timing}
                </p>
                <p className="text-gray-300 text-sm mt-1">
                  <span className="text-primary font-semibold">Reason:</span> {rec.reason}
                </p>
              </div>
              
              <button className="w-full bg-primary/20 hover:bg-primary/30 text-primary font-semibold py-2 rounded transition-all">
                Execute Bridge
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400">
          <p className="mb-2">No optimization analysis yet</p>
          <p className="text-sm">Click "Analyze Routes" to find the best bridging opportunities</p>
        </div>
      )}
    </div>
  )
}
