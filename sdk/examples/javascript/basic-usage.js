/**
 * ChainBridge SDK - Basic Usage Example
 * This example demonstrates core functionality of the ChainBridge SDK
 */

const { ChainBridge } = require('@chainbridge/sdk')

// Initialize the client
const client = new ChainBridge({
  apiKey: process.env.CHAINBRIDGE_API_KEY || 'your_api_key_here',
  network: 'mainnet'
})

async function main() {
  try {
    // Example wallet address
    const walletAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f6E123'
    
    console.log('=== ChainBridge SDK Basic Usage Example ===')
    console.log('\n1. Fetching user assets...')
    
    // Get all assets for a wallet
    const assets = await client.getAssets(walletAddress)
    console.log(`Found ${assets.length} NFTs across all chains`)
    
    // Display first 3 assets
    assets.slice(0, 3).forEach(asset => {
      console.log(`\n- ${asset.name} (${asset.tokenId})`)
      console.log(`  Chain: ${getChainName(asset.chainId)}`)
      console.log(`  Floor Price: $${asset.floorPriceUSD}`)
      console.log(`  Bridgeable to: ${asset.bridgeableTo.map(getChainName).join(', ')}`)
    })
    
    console.log('\n2. Finding optimal bridge route...')
    
    // Find bridge routes for the first bridgeable asset
    const bridgeableAsset = assets.find(a => a.bridgeableTo.length > 0)
    if (bridgeableAsset) {
      const routes = await client.findBridgeRoutes({
        fromChain: bridgeableAsset.chainId,
        toChain: bridgeableAsset.bridgeableTo[0],
        asset: {
          contract: bridgeableAsset.contractAddress,
          tokenId: bridgeableAsset.tokenId
        },
        urgency: 'low' // Optimize for cost
      })
      
      console.log(`\nFound ${routes.length} routes from ${getChainName(bridgeableAsset.chainId)} to ${getChainName(bridgeableAsset.bridgeableTo[0])}`)
      
      // Display best route
      const bestRoute = routes[0]
      console.log(`\nBest Route:`)
      console.log(`  Protocol: ${bestRoute.protocol}`)
      console.log(`  Cost: $${bestRoute.currentCostUSD}`)
      console.log(`  Time: ${bestRoute.estimatedTime}`)
      console.log(`  Confidence: ${(bestRoute.confidenceScore * 100).toFixed(0)}%`)
      
      // Show AI recommendation
      if (bestRoute.aiRecommendation) {
        console.log(`\n  AI Recommendation:`)
        console.log(`  - Wait ${bestRoute.aiRecommendation.waitTime}`)
        console.log(`  - Save ${bestRoute.aiRecommendation.expectedSavings}`)
        console.log(`  - Optimal time: ${new Date(bestRoute.aiRecommendation.optimalWindow).toLocaleString()}`)
      }
    }
    
    console.log('\n3. Getting gas predictions...')
    
    // Get gas predictions for Ethereum
    const predictions = await client.getGasPredictions(1, { hours: 24 })
    console.log(`\nCurrent Ethereum gas: ${predictions.currentGasPrice} Gwei`)
    console.log(`Model accuracy (7d): ${(predictions.modelAccuracy * 100).toFixed(0)}%`)
    
    // Show optimal windows
    console.log('\nOptimal bridge windows in next 24h:')
    predictions.optimalWindows.slice(0, 3).forEach((window, i) => {
      console.log(`\n  Window ${i + 1}:`)
      console.log(`  - Time: ${new Date(window.start).toLocaleString()}`)
      console.log(`  - Expected gas: ${window.averageGasPrice} Gwei`)
      console.log(`  - Savings: ${(window.savingsPercent * 100).toFixed(0)}%`)
      console.log(`  - Confidence: ${(window.confidence * 100).toFixed(0)}%`)
    })
    
    console.log('\n4. Getting user analytics...')
    
    // Get analytics for the wallet
    const analytics = await client.getUserAnalytics(walletAddress)
    console.log(`\nUser Statistics:`)
    console.log(`  Total bridges: ${analytics.totalBridges}`)
    console.log(`  Total saved: $${analytics.totalSavedUSD}`)
    console.log(`  Average savings: ${(analytics.avgSavingsPercent * 100).toFixed(0)}%`)
    console.log(`  Most used route: ${analytics.favoriteRoute}`)
    
  } catch (error) {
    console.error('\nError:', error.message)
    if (error.code) {
      console.error('Error code:', error.code)
    }
  }
}

// Helper function to get chain names
function getChainName(chainId) {
  const chains = {
    1: 'Ethereum',
    137: 'Polygon',
    42161: 'Arbitrum',
    10: 'Optimism',
    8453: 'Base'
  }
  return chains[chainId] || `Chain ${chainId}`
}

// Run the example
main().then(() => {
  console.log('\n=== Example completed ===')
}).catch(error => {
  console.error('Unexpected error:', error)
})