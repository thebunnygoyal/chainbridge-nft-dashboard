import axios from 'axios'

const COVALENT_API_KEY = process.env.NEXT_PUBLIC_COVALENT_API_KEY || 'demo'
const CHAINS = [
  { id: 1, name: 'ethereum' },
  { id: 137, name: 'polygon' },
  { id: 42161, name: 'arbitrum' },
]

// Mock data generator for demo
function generateMockAssets(address: string) {
  const collections = [
    { name: 'Axie Infinity', prefix: 'Axie' },
    { name: 'Gods Unchained', prefix: 'Card' },
    { name: 'The Sandbox', prefix: 'LAND' },
    { name: 'Decentraland', prefix: 'Estate' },
    { name: 'Illuvium', prefix: 'Illuvial' },
  ]
  
  const chains = ['ethereum', 'polygon', 'arbitrum', 'solana']
  const assets = []
  
  for (let i = 0; i < 15; i++) {
    const collection = collections[Math.floor(Math.random() * collections.length)]
    const chain = chains[Math.floor(Math.random() * chains.length)]
    
    assets.push({
      id: `${chain}-${i}-${Date.now()}`,
      name: `${collection.prefix} #${Math.floor(Math.random() * 9999)}`,
      collection: collection.name,
      chain,
      image: `https://picsum.photos/seed/${i}/400/400`,
      value: Math.floor(Math.random() * 5000) + 100,
      lastTransfer: `${Math.floor(Math.random() * 30) + 1}d ago`,
      rarity: Math.random() > 0.7 ? 'Rare' : Math.random() > 0.9 ? 'Legendary' : undefined
    })
  }
  
  return assets
}

export async function fetchMultiChainAssets(address: string) {
  // For demo, return mock data
  if (!COVALENT_API_KEY || COVALENT_API_KEY === 'demo') {
    return generateMockAssets(address)
  }
  
  try {
    const allAssets = []
    
    // Fetch from each EVM chain
    for (const chain of CHAINS) {
      const response = await axios.get(
        `https://api.covalenthq.com/v1/${chain.id}/address/${address}/balances_nft/`,
        {
          headers: {
            'Authorization': `Bearer ${COVALENT_API_KEY}`
          }
        }
      )
      
      if (response.data?.data?.items) {
        const chainAssets = response.data.data.items.map((item: any) => ({
          id: `${chain.name}-${item.contract_address}-${item.token_id}`,
          name: item.contract_name || 'Unknown NFT',
          collection: item.contract_ticker_symbol || 'Unknown',
          chain: chain.name,
          image: item.logo_url || item.external_data?.image || '/api/placeholder/400/400',
          value: item.quote || 0,
          lastTransfer: 'N/A',
          tokenId: item.token_id,
          contractAddress: item.contract_address
        }))
        
        allAssets.push(...chainAssets)
      }
    }
    
    // Add mock Solana data (Covalent doesn't support Solana)
    const solanaMockAssets = generateMockAssets(address)
      .filter(a => a.chain === 'solana')
      .slice(0, 5)
    
    allAssets.push(...solanaMockAssets)
    
    return allAssets
  } catch (error) {
    console.error('Error fetching assets:', error)
    // Return mock data on error
    return generateMockAssets(address)
  }
}

export async function getBridgeQuote(fromChain: string, toChain: string, tokenAddress: string) {
  // Mock bridge quote API
  const baseFee = Math.random() * 20 + 5
  const gasFee = Math.random() * 30 + 10
  
  return {
    estimatedFee: baseFee + gasFee,
    estimatedTime: Math.floor(Math.random() * 20) + 5,
    route: `${fromChain} → Bridge → ${toChain}`,
    savings: Math.floor(Math.random() * 20)
  }
}
