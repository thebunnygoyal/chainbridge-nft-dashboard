# ChainBridge SDK

**Version**: 1.0.0  
**License**: MIT  
**Documentation**: [docs.chainbridge.xyz/sdk](https://docs.chainbridge.xyz/sdk)

## Overview

The ChainBridge SDK provides programmatic access to cross-chain NFT tracking, AI-powered gas optimization, and bridge route recommendations. Available for JavaScript/TypeScript, Python, Go, and Rust.

## Installation

### JavaScript/TypeScript

```bash
npm install @chainbridge/sdk
# or
yarn add @chainbridge/sdk
# or
pnpm add @chainbridge/sdk
```

### Python

```bash
pip install chainbridge-sdk
```

### Go

```bash
go get github.com/chainbridge/sdk-go
```

### Rust

```toml
[dependencies]
chainbridge-sdk = "1.0.0"
```

## Quick Start

### JavaScript/TypeScript

```typescript
import { ChainBridge } from '@chainbridge/sdk'

// Initialize client
const client = new ChainBridge({
  apiKey: 'your_api_key',
  network: 'mainnet' // or 'testnet'
})

// Get user assets
const assets = await client.getAssets('0x742d35Cc6634C0532925a3b844Bc9e7595f6E123')

// Find optimal bridge route
const routes = await client.findBridgeRoutes({
  fromChain: 1,      // Ethereum
  toChain: 137,      // Polygon
  asset: {
    contract: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
    tokenId: '1234'
  },
  urgency: 'low'     // 'low' | 'medium' | 'high'
})

// Get gas predictions
const predictions = await client.getGasPredictions(1, { hours: 24 })
console.log(`Optimal bridge window: ${predictions.optimalWindows[0].start}`)
```

### Python

```python
from chainbridge import ChainBridge

# Initialize client
client = ChainBridge(api_key="your_api_key")

# Get user assets
assets = client.get_assets("0x742d35Cc6634C0532925a3b844Bc9e7595f6E123")

# Find optimal bridge route
routes = client.find_bridge_routes(
    from_chain=1,
    to_chain=137,
    contract="0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
    token_id="1234",
    urgency="low"
)

# Get gas predictions
predictions = client.get_gas_predictions(chain_id=1, hours=24)
print(f"Optimal window: {predictions['optimal_windows'][0]['start']}")
```

## Core Features

### 1. Asset Management

```typescript
// Get all assets across chains
const portfolio = await client.getPortfolio('0x...')
console.log(`Total value: $${portfolio.totalValueUSD}`)

// Get assets on specific chain
const ethAssets = await client.getAssets('0x...', { chains: [1] })

// Get single asset details
const asset = await client.getAsset(1, '0xcontract', '1234')

// Track asset across chains
const locations = await client.trackAsset('0xcontract', '1234')
locations.forEach(loc => {
  console.log(`Found on ${loc.chainName}: ${loc.owner}`)
})
```

### 2. Bridge Operations

```typescript
// Find all possible routes
const routes = await client.findBridgeRoutes({
  fromChain: 1,
  toChain: 137,
  asset: { contract: '0x...', tokenId: '1' }
})

// Get route details with cost breakdown
const route = routes[0]
console.log(`
  Protocol: ${route.protocol}
  Time: ${route.estimatedTime}
  Cost: $${route.currentCostUSD}
  Steps: ${route.steps.length}
`)

// Simulate bridge transaction
const simulation = await client.simulateBridge({
  routeId: route.id,
  fromAddress: '0x...',
  toAddress: '0x...'
})

// Generate transaction data
const txData = await client.prepareBridgeTransaction({
  routeId: route.id,
  wallet: '0x...'
})
// User signs and sends transaction
```

### 3. Gas Optimization

```typescript
// Get current gas prices
const currentGas = await client.getCurrentGas([
  1,    // Ethereum
  137,  // Polygon
  42161 // Arbitrum
])

// Get AI predictions
const predictions = await client.getGasPredictions(1, {
  hours: 48,
  interval: 'hourly'
})

// Find optimal bridge window
const optimal = predictions.optimalWindows[0]
console.log(`
  Wait ${optimal.hoursFromNow} hours
  Save ${optimal.savingsPercent}%
  Confidence: ${optimal.confidence}
`)

// Subscribe to gas alerts
client.on('gas.optimal', (alert) => {
  console.log(`Gas alert for ${alert.chain}: ${alert.message}`)
})
```

### 4. Analytics

```typescript
// Get user analytics
const analytics = await client.getUserAnalytics('0x...')
console.log(`
  Total bridges: ${analytics.totalBridges}
  Total saved: $${analytics.totalSavedUSD}
  Favorite route: ${analytics.favoriteRoute}
`)

// Get route performance
const routeStats = await client.getRouteAnalytics('polygon-bridge')
console.log(`
  Success rate: ${routeStats.successRate}%
  Avg time: ${routeStats.avgCompletionTime}
  Avg cost: $${routeStats.avgCostUSD}
`)

// Get market insights
const insights = await client.getMarketInsights()
console.log(`
  Most bridged collection: ${insights.topCollection}
  Busiest route: ${insights.busiestRoute}
  Peak hours: ${insights.peakHours}
`)
```

## Advanced Usage

### Custom Configuration

```typescript
const client = new ChainBridge({
  apiKey: 'your_api_key',
  baseURL: 'https://api.chainbridge.xyz/v1',
  timeout: 30000,
  retries: 3,
  cache: {
    enabled: true,
    ttl: 300000 // 5 minutes
  },
  interceptors: {
    request: (config) => {
      console.log(`Request: ${config.method} ${config.url}`)
      return config
    },
    response: (response) => {
      console.log(`Response: ${response.status}`)
      return response
    }
  }
})
```

### Batch Operations

```typescript
// Batch asset queries
const addresses = ['0x...', '0x...', '0x...']
const portfolios = await client.batchGetPortfolios(addresses)

// Batch route finding
const routeRequests = [
  { fromChain: 1, toChain: 137, asset: {...} },
  { fromChain: 1, toChain: 42161, asset: {...} }
]
const routes = await client.batchFindRoutes(routeRequests)

// Batch gas predictions
const chains = [1, 137, 42161, 10, 8453]
const gasPredictions = await client.batchGetGasPredictions(chains)
```

### Webhook Integration

```typescript
// Register webhooks
await client.webhooks.create({
  url: 'https://your-server.com/webhook',
  events: ['bridge.completed', 'gas.optimal'],
  secret: 'your_webhook_secret'
})

// List webhooks
const webhooks = await client.webhooks.list()

// Update webhook
await client.webhooks.update(webhookId, {
  events: ['bridge.completed', 'gas.optimal', 'price.alert']
})

// Delete webhook
await client.webhooks.delete(webhookId)

// Verify webhook signature
const isValid = client.webhooks.verifySignature(
  payload,
  signature,
  secret
)
```

### Error Handling

```typescript
import { 
  ChainBridgeError,
  RateLimitError,
  InvalidAddressError,
  BridgeUnavailableError 
} from '@chainbridge/sdk'

try {
  const assets = await client.getAssets('invalid-address')
} catch (error) {
  if (error instanceof InvalidAddressError) {
    console.error('Invalid address:', error.address)
  } else if (error instanceof RateLimitError) {
    console.error(`Rate limited. Retry after: ${error.retryAfter}s`)
  } else if (error instanceof BridgeUnavailableError) {
    console.error('Bridge temporarily unavailable')
  } else if (error instanceof ChainBridgeError) {
    console.error('API error:', error.code, error.message)
  } else {
    console.error('Unknown error:', error)
  }
}
```

### Streaming Updates

```typescript
// Real-time asset updates
const stream = client.streamAssets('0x...', {
  chains: [1, 137],
  events: ['transfer', 'bridge', 'mint']
})

stream.on('update', (update) => {
  console.log(`Asset ${update.tokenId} ${update.event} on ${update.chain}`)
})

stream.on('error', (error) => {
  console.error('Stream error:', error)
})

// Gas price stream
const gasStream = client.streamGasPrices([1, 137, 42161])
gasStream.on('update', (prices) => {
  console.log('Current gas prices:', prices)
})
```

### Custom Plugins

```typescript
// Create custom plugin
class LoggingPlugin {
  install(client: ChainBridge) {
    client.interceptors.request.use((config) => {
      console.log(`[${new Date().toISOString()}] ${config.method} ${config.url}`)
      return config
    })
  }
}

// Use plugin
client.use(new LoggingPlugin())

// Custom cache plugin
class RedisCachePlugin {
  constructor(private redis: Redis) {}
  
  install(client: ChainBridge) {
    client.cache = {
      get: async (key) => {
        const value = await this.redis.get(key)
        return value ? JSON.parse(value) : null
      },
      set: async (key, value, ttl) => {
        await this.redis.setex(key, ttl, JSON.stringify(value))
      }
    }
  }
}
```

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

```typescript
import type {
  Asset,
  BridgeRoute,
  GasPrediction,
  Portfolio,
  ChainId,
  BridgeUrgency,
  WebhookEvent
} from '@chainbridge/sdk'

// All methods fully typed
const assets: Asset[] = await client.getAssets('0x...')
const route: BridgeRoute = await client.findOptimalRoute({...})
const prediction: GasPrediction = await client.predictGas(1)

// Enums for constants
import { Chains, BridgeProtocols } from '@chainbridge/sdk'

const ethereum = Chains.Ethereum    // 1
const polygon = Chains.Polygon      // 137
const arbitrum = Chains.Arbitrum    // 42161
```

## Testing

```typescript
// Use test network
const testClient = new ChainBridge({
  apiKey: 'test_key',
  network: 'testnet'
})

// Mock client for testing
import { MockChainBridge } from '@chainbridge/sdk/testing'

const mockClient = new MockChainBridge()
mockClient.setAssets('0x...', mockAssets)
mockClient.setRoutes(mockRoutes)

// Test your code
const result = await myFunction(mockClient)
expect(result).toBe(expected)
```

## Performance Tips

1. **Enable Caching**: Reduces API calls
   ```typescript
   const client = new ChainBridge({
     apiKey: 'key',
     cache: { enabled: true, ttl: 300000 }
   })
   ```

2. **Use Batch Operations**: More efficient than individual calls
   ```typescript
   // Good
   const portfolios = await client.batchGetPortfolios(addresses)
   
   // Avoid
   const portfolios = await Promise.all(
     addresses.map(addr => client.getPortfolio(addr))
   )
   ```

3. **Implement Retry Logic**: Handle transient failures
   ```typescript
   const client = new ChainBridge({
     apiKey: 'key',
     retries: 3,
     retryDelay: 1000
   })
   ```

## SDK Reference

### Client Methods

| Method | Description | Returns |
|--------|-------------|--------|
| `getAssets(address, options?)` | Get NFT assets for address | `Asset[]` |
| `getPortfolio(address)` | Get complete portfolio | `Portfolio` |
| `findBridgeRoutes(params)` | Find bridge routes | `BridgeRoute[]` |
| `getGasPredictions(chainId, options?)` | Get gas predictions | `GasPrediction` |
| `getCurrentGas(chainIds)` | Get current gas prices | `GasPrice[]` |
| `getUserAnalytics(address)` | Get user analytics | `UserAnalytics` |
| `streamAssets(address, options?)` | Stream asset updates | `EventEmitter` |
| `streamGasPrices(chainIds)` | Stream gas prices | `EventEmitter` |

### Types

```typescript
interface Asset {
  id: string
  chainId: number
  contractAddress: string
  tokenId: string
  name: string
  description: string
  imageUrl: string
  owner: string
  metadata: Record<string, any>
  floorPriceUSD: number
  lastSaleUSD: number
  bridgeableTo: number[]
}

interface BridgeRoute {
  id: string
  protocol: string
  fromChain: number
  toChain: number
  estimatedTime: string
  currentCostUSD: number
  steps: BridgeStep[]
  confidenceScore: number
}

interface GasPrediction {
  chainId: number
  currentGasPrice: number
  predictions: GasPricePrediction[]
  optimalWindows: OptimalWindow[]
  modelAccuracy: number
}
```

## Support

- **Documentation**: [docs.chainbridge.xyz](https://docs.chainbridge.xyz)
- **Discord**: [discord.gg/chainbridge](https://discord.gg/chainbridge)
- **GitHub Issues**: [github.com/chainbridge/sdk/issues](https://github.com/chainbridge/sdk/issues)
- **Email**: sdk@chainbridge.xyz

## License

MIT License - see [LICENSE](LICENSE) file for details.