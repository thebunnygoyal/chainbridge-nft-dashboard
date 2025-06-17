/**
 * ChainBridge SDK - Advanced Usage Example
 * Demonstrates advanced features including streaming, webhooks, and batch operations
 */

import { 
  ChainBridge, 
  Asset, 
  BridgeRoute, 
  GasPrediction,
  ChainBridgeError,
  RateLimitError,
  Chains,
  BridgeUrgency
} from '@chainbridge/sdk'

// Initialize client with advanced configuration
const client = new ChainBridge({
  apiKey: process.env.CHAINBRIDGE_API_KEY!,
  network: 'mainnet',
  timeout: 30000,
  retries: 3,
  cache: {
    enabled: true,
    ttl: 300000 // 5 minutes
  },
  interceptors: {
    request: (config) => {
      console.log(`[${new Date().toISOString()}] ${config.method} ${config.url}`)
      return config
    },
    response: (response) => {
      console.log(`[${new Date().toISOString()}] Response: ${response.status}`)
      return response
    },
    error: (error) => {
      console.error(`[${new Date().toISOString()}] Error:`, error.message)
      return Promise.reject(error)
    }
  }
})

async function main() {
  console.log('=== ChainBridge SDK Advanced Usage Example ===')
  
  // 1. Batch Operations
  await demonstrateBatchOperations()
  
  // 2. Real-time Streaming
  await demonstrateStreaming()
  
  // 3. Webhook Management
  await demonstrateWebhooks()
  
  // 4. Advanced Error Handling
  await demonstrateErrorHandling()
  
  // 5. Custom Plugins
  demonstratePlugins()
}

/**
 * Demonstrate batch operations for efficiency
 */
async function demonstrateBatchOperations() {
  console.log('\n1. Batch Operations Example')
  
  const addresses = [
    '0x742d35Cc6634C0532925a3b844Bc9e7595f6E123',
    '0x1234567890123456789012345678901234567890',
    '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd'
  ]
  
  // Batch portfolio fetching
  console.log('\nFetching portfolios for multiple addresses...')
  const portfolios = await client.batchGetPortfolios(addresses)
  
  portfolios.forEach((portfolio, index) => {
    console.log(`\nAddress ${index + 1}: ${addresses[index].slice(0, 10)}...`)
    console.log(`  Total assets: ${portfolio.totalAssets}`)
    console.log(`  Total value: $${portfolio.totalValueUSD.toFixed(2)}`)
    console.log(`  Chains: ${portfolio.chains.join(', ')}`)
  })
  
  // Batch route finding
  console.log('\n\nBatch route finding...')
  const routeRequests = [
    {
      fromChain: Chains.Ethereum,
      toChain: Chains.Polygon,
      asset: {
        contract: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
        tokenId: '1234'
      },
      urgency: 'low' as BridgeUrgency
    },
    {
      fromChain: Chains.Ethereum,
      toChain: Chains.Arbitrum,
      asset: {
        contract: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
        tokenId: '5678'
      },
      urgency: 'high' as BridgeUrgency
    }
  ]
  
  const batchRoutes = await client.batchFindRoutes(routeRequests)
  batchRoutes.forEach((routes, index) => {
    const req = routeRequests[index]
    console.log(`\nRoute ${index + 1}: Chain ${req.fromChain} → ${req.toChain}`)
    console.log(`  Best route: ${routes[0].protocol}`)
    console.log(`  Cost: $${routes[0].currentCostUSD.toFixed(2)}`)
    console.log(`  Time: ${routes[0].estimatedTime}`)
  })
}

/**
 * Demonstrate real-time streaming capabilities
 */
async function demonstrateStreaming() {
  console.log('\n\n2. Real-time Streaming Example')
  
  const testAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f6E123'
  
  // Stream asset updates
  console.log('\nStarting asset update stream...')
  const assetStream = client.streamAssets(testAddress, {
    chains: [Chains.Ethereum, Chains.Polygon],
    events: ['transfer', 'bridge', 'mint', 'burn']
  })
  
  // Set up event handlers
  assetStream.on('update', (update) => {
    console.log(`\n[Asset Update] ${new Date().toISOString()}`)
    console.log(`  Event: ${update.event}`)
    console.log(`  Asset: ${update.asset.name} #${update.tokenId}`)
    console.log(`  Chain: ${update.chainName}`)
    console.log(`  Transaction: ${update.transactionHash}`)
  })
  
  assetStream.on('error', (error) => {
    console.error('[Asset Stream Error]:', error.message)
  })
  
  // Stream gas prices
  console.log('\nStarting gas price stream...')
  const gasStream = client.streamGasPrices([Chains.Ethereum, Chains.Polygon, Chains.Arbitrum])
  
  let updateCount = 0
  gasStream.on('update', (prices) => {
    updateCount++
    console.log(`\n[Gas Update ${updateCount}] ${new Date().toISOString()}`)
    prices.forEach(price => {
      console.log(`  ${price.chainName}: ${price.gasPrice} Gwei (${price.usdCost} USD)`)
    })
    
    // Stop after 3 updates for demo
    if (updateCount >= 3) {
      console.log('\nStopping streams...')
      assetStream.close()
      gasStream.close()
    }
  })
  
  // Wait for streams to complete
  await new Promise(resolve => setTimeout(resolve, 10000))
}

/**
 * Demonstrate webhook management
 */
async function demonstrateWebhooks() {
  console.log('\n\n3. Webhook Management Example')
  
  try {
    // Create webhook
    console.log('\nCreating webhook...')
    const webhook = await client.webhooks.create({
      url: 'https://your-server.com/chainbridge-webhook',
      events: ['bridge.completed', 'gas.optimal', 'price.alert'],
      secret: 'your-webhook-secret-key',
      filters: {
        chains: [Chains.Ethereum, Chains.Polygon],
        minValue: 100 // Only notify for bridges over $100
      }
    })
    
    console.log(`Webhook created with ID: ${webhook.id}`)
    console.log(`Endpoint: ${webhook.url}`)
    console.log(`Events: ${webhook.events.join(', ')}`)
    
    // List all webhooks
    console.log('\nListing all webhooks...')
    const webhooks = await client.webhooks.list()
    console.log(`Total webhooks: ${webhooks.length}`)
    
    // Update webhook
    console.log('\nUpdating webhook events...')
    await client.webhooks.update(webhook.id, {
      events: ['bridge.completed', 'gas.optimal', 'price.alert', 'bridge.failed']
    })
    console.log('Webhook updated successfully')
    
    // Verify webhook signature (server-side example)
    const samplePayload = {
      event: 'bridge.completed',
      timestamp: new Date().toISOString(),
      data: {
        bridgeId: 'bridge_123456',
        fromChain: 1,
        toChain: 137,
        asset: {
          contract: '0x...',
          tokenId: '1234'
        },
        costUSD: 22.50,
        savingsUSD: 45.30
      }
    }
    
    const signature = client.webhooks.generateSignature(samplePayload, webhook.secret)
    const isValid = client.webhooks.verifySignature(samplePayload, signature, webhook.secret)
    console.log(`\nWebhook signature validation: ${isValid ? 'PASSED' : 'FAILED'}`)
    
    // Clean up - delete webhook
    console.log('\nDeleting webhook...')
    await client.webhooks.delete(webhook.id)
    console.log('Webhook deleted successfully')
    
  } catch (error) {
    console.error('Webhook error:', error)
  }
}

/**
 * Demonstrate advanced error handling
 */
async function demonstrateErrorHandling() {
  console.log('\n\n4. Advanced Error Handling Example')
  
  // Test various error scenarios
  const errorScenarios = [
    {
      name: 'Invalid Address',
      fn: () => client.getAssets('invalid-address-format')
    },
    {
      name: 'Non-existent Asset',
      fn: () => client.getAsset(999999, '0x0000000000000000000000000000000000000000', '1')
    },
    {
      name: 'Rate Limit Simulation',
      fn: async () => {
        // Simulate rate limit by making many requests
        const promises = Array(10).fill(0).map(() => 
          client.getCurrentGas([1, 137, 42161])
        )
        await Promise.all(promises)
      }
    }
  ]
  
  for (const scenario of errorScenarios) {
    console.log(`\nTesting: ${scenario.name}`)
    try {
      await scenario.fn()
      console.log('  ✓ No error (unexpected)')
    } catch (error) {
      if (error instanceof RateLimitError) {
        console.log('  ✗ Rate Limited')
        console.log(`    Retry after: ${error.retryAfter} seconds`)
        console.log(`    Limit: ${error.limit} requests per ${error.window}`)
      } else if (error instanceof ChainBridgeError) {
        console.log(`  ✗ API Error: ${error.code}`)
        console.log(`    Message: ${error.message}`)
        if (error.details) {
          console.log(`    Details:`, error.details)
        }
      } else {
        console.log(`  ✗ Unexpected Error: ${error.constructor.name}`)
        console.log(`    Message: ${error.message}`)
      }
    }
  }
}

/**
 * Demonstrate custom plugin system
 */
function demonstratePlugins() {
  console.log('\n\n5. Custom Plugin Example')
  
  // Performance monitoring plugin
  class PerformancePlugin {
    private metrics: Map<string, number[]> = new Map()
    
    install(client: ChainBridge) {
      // Monitor all API calls
      client.interceptors.request.use((config) => {
        config.metadata = { startTime: Date.now() }
        return config
      })
      
      client.interceptors.response.use((response) => {
        const duration = Date.now() - response.config.metadata.startTime
        const endpoint = response.config.url
        
        if (!this.metrics.has(endpoint)) {
          this.metrics.set(endpoint, [])
        }
        this.metrics.get(endpoint)!.push(duration)
        
        // Log slow requests
        if (duration > 1000) {
          console.log(`[SLOW REQUEST] ${endpoint} took ${duration}ms`)
        }
        
        return response
      })
    }
    
    getMetrics() {
      const summary: Record<string, any> = {}
      
      this.metrics.forEach((durations, endpoint) => {
        const sorted = [...durations].sort((a, b) => a - b)
        summary[endpoint] = {
          count: durations.length,
          avg: durations.reduce((a, b) => a + b, 0) / durations.length,
          p50: sorted[Math.floor(sorted.length * 0.5)],
          p95: sorted[Math.floor(sorted.length * 0.95)],
          p99: sorted[Math.floor(sorted.length * 0.99)]
        }
      })
      
      return summary
    }
  }
  
  // Retry plugin with exponential backoff
  class SmartRetryPlugin {
    install(client: ChainBridge) {
      client.interceptors.response.use(
        response => response,
        async (error) => {
          const config = error.config
          
          // Check if we should retry
          if (!config || !this.shouldRetry(error) || config.retryCount >= 3) {
            return Promise.reject(error)
          }
          
          config.retryCount = (config.retryCount || 0) + 1
          
          // Exponential backoff
          const delay = Math.min(1000 * Math.pow(2, config.retryCount - 1), 10000)
          console.log(`[Retry ${config.retryCount}] Waiting ${delay}ms...`)
          
          await new Promise(resolve => setTimeout(resolve, delay))
          
          return client.request(config)
        }
      )
    }
    
    private shouldRetry(error: any): boolean {
      // Retry on network errors or 5xx status codes
      return !error.response || error.response.status >= 500
    }
  }
  
  // Install plugins
  const perfPlugin = new PerformancePlugin()
  const retryPlugin = new SmartRetryPlugin()
  
  client.use(perfPlugin)
  client.use(retryPlugin)
  
  console.log('Plugins installed:')
  console.log('  ✓ Performance monitoring')
  console.log('  ✓ Smart retry with exponential backoff')
  
  // After some API calls, check metrics
  setTimeout(() => {
    console.log('\nPerformance Metrics:')
    console.log(JSON.stringify(perfPlugin.getMetrics(), null, 2))
  }, 5000)
}

// Custom type guard
function isChainBridgeError(error: any): error is ChainBridgeError {
  return error instanceof ChainBridgeError
}

// Run the example
main().catch(error => {
  console.error('\nFatal error:', error)
  process.exit(1)
})