# ChainBridge API Documentation

**Version**: 1.0.0  
**Base URL**: `https://api.chainbridge.xyz/v1`  
**Authentication**: API Key (request at [developer.chainbridge.xyz](https://developer.chainbridge.xyz))

## Table of Contents

1. [Authentication](#authentication)
2. [Rate Limits](#rate-limits)
3. [Endpoints](#endpoints)
   - [Assets](#assets)
   - [Bridges](#bridges)
   - [Gas Optimization](#gas-optimization)
   - [Analytics](#analytics)
4. [Webhooks](#webhooks)
5. [Error Handling](#error-handling)
6. [SDK Examples](#sdk-examples)

---

## Authentication

All API requests require authentication via API key in the header:

```bash
curl -H "X-API-Key: your_api_key_here" \
     https://api.chainbridge.xyz/v1/assets/0x...
```

### API Key Tiers

| Tier | Rate Limit | Features | Price |
|------|------------|----------|-------|
| Free | 100/hour | Basic endpoints | $0 |
| Pro | 1,000/hour | All endpoints | $99/mo |
| Enterprise | 10,000/hour | All + webhooks | $499/mo |

---

## Rate Limits

Rate limits are enforced per API key:

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1623456789
```

Exceeding rate limits returns:
```json
{
  "error": "rate_limit_exceeded",
  "message": "Too many requests",
  "retry_after": 3600
}
```

---

## Endpoints

### Assets

#### Get User Assets

Retrieve all NFT assets for a wallet address across supported chains.

```http
GET /assets/:address
```

**Parameters:**
- `address` (required): Wallet address
- `chains` (optional): Comma-separated chain IDs (default: all)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 50, max: 100)

**Example Request:**
```bash
curl -H "X-API-Key: your_api_key" \
     "https://api.chainbridge.xyz/v1/assets/0x742d35Cc6634C0532925a3b844Bc9e7595f6E123?chains=1,137,42161"
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f6E123",
    "total_assets": 156,
    "total_value_usd": 45678.90,
    "assets": [
      {
        "id": "eth-0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d-1234",
        "chain_id": 1,
        "chain_name": "ethereum",
        "contract_address": "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
        "token_id": "1234",
        "name": "Bored Ape #1234",
        "description": "BAYC #1234",
        "image_url": "https://...",
        "metadata": {
          "attributes": [
            {"trait_type": "Background", "value": "Blue"},
            {"trait_type": "Fur", "value": "Golden"}
          ]
        },
        "floor_price_usd": 35000.00,
        "last_sale_usd": 42000.00,
        "bridgeable_to": [137, 42161],
        "bridge_cost_estimates": {
          "137": {"min": 15.20, "avg": 22.50, "max": 45.00},
          "42161": {"min": 8.40, "avg": 12.30, "max": 25.00}
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total_pages": 4,
      "has_next": true
    }
  }
}
```

#### Get Single Asset

```http
GET /assets/:chain_id/:contract/:token_id
```

**Example Request:**
```bash
curl -H "X-API-Key: your_api_key" \
     "https://api.chainbridge.xyz/v1/assets/1/0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D/1234"
```

---

### Bridges

#### Get Bridge Routes

Find available bridge routes for an asset.

```http
POST /bridges/routes
```

**Request Body:**
```json
{
  "from_chain": 1,
  "to_chain": 137,
  "contract_address": "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
  "token_id": "1234",
  "urgency": "low" // low, medium, high
}
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "routes": [
      {
        "id": "optimized-route-1",
        "protocol": "polygon-bridge",
        "estimated_time": "15-30 minutes",
        "current_cost_usd": 22.50,
        "steps": [
          {
            "action": "approve",
            "contract": "0x...",
            "gas_estimate": "50000"
          },
          {
            "action": "deposit",
            "contract": "0x...",
            "gas_estimate": "200000"
          }
        ],
        "confidence_score": 0.95
      },
      {
        "id": "fast-route-1",
        "protocol": "hop-protocol",
        "estimated_time": "5-10 minutes",
        "current_cost_usd": 35.80,
        "steps": [...],
        "confidence_score": 0.88
      }
    ],
    "recommended_route": "optimized-route-1",
    "ai_recommendation": {
      "wait_time": "3 hours",
      "expected_savings": "65%",
      "optimal_window": "2025-06-17T14:00:00Z",
      "confidence": 0.87
    }
  }
}
```

#### Execute Bridge

```http
POST /bridges/execute
```

**Request Body:**
```json
{
  "route_id": "optimized-route-1",
  "wallet_address": "0x...",
  "slippage_tolerance": 0.5
}
```

**Note:** This returns transaction data to be signed by the user's wallet.

---

### Gas Optimization

#### Get Gas Predictions

Get AI-powered gas price predictions.

```http
GET /gas/predictions/:chain_id
```

**Parameters:**
- `chain_id` (required): Blockchain ID
- `hours` (optional): Prediction window (default: 24, max: 48)

**Example Response:**
```json
{
  "success": true,
  "data": {
    "chain_id": 1,
    "current_gas_price": 45,
    "predictions": [
      {
        "timestamp": "2025-06-17T12:00:00Z",
        "predicted_gas_price": 38,
        "confidence": 0.89,
        "savings_vs_current": "15.6%"
      },
      {
        "timestamp": "2025-06-17T13:00:00Z",
        "predicted_gas_price": 35,
        "confidence": 0.92,
        "savings_vs_current": "22.2%"
      }
    ],
    "optimal_windows": [
      {
        "start": "2025-06-17T14:00:00Z",
        "end": "2025-06-17T16:00:00Z",
        "average_gas_price": 28,
        "confidence": 0.85,
        "reason": "Post-Europe trading hours"
      }
    ],
    "model_accuracy_7d": 0.86
  }
}
```

#### Get Historical Gas Data

```http
GET /gas/history/:chain_id
```

**Parameters:**
- `chain_id` (required): Blockchain ID
- `start_date` (required): ISO 8601 date
- `end_date` (required): ISO 8601 date
- `interval` (optional): hour, day (default: hour)

---

### Analytics

#### Get Bridge Analytics

```http
GET /analytics/bridges
```

**Parameters:**
- `start_date` (required): ISO 8601 date
- `end_date` (required): ISO 8601 date
- `group_by` (optional): chain, protocol, hour, day

**Example Response:**
```json
{
  "success": true,
  "data": {
    "total_bridges": 15234,
    "total_volume_usd": 45678900,
    "average_cost_usd": 32.50,
    "total_saved_usd": 892340,
    "by_chain": [
      {
        "chain_id": 1,
        "chain_name": "ethereum",
        "bridge_count": 5678,
        "volume_usd": 23456789,
        "average_cost": 45.60
      }
    ],
    "by_protocol": [
      {
        "protocol": "polygon-bridge",
        "bridge_count": 8901,
        "volume_usd": 12345678,
        "average_time": "25 minutes"
      }
    ]
  }
}
```

#### Get User Analytics

```http
GET /analytics/users/:address
```

---

## Webhooks

### Available Events

- `bridge.initiated` - Bridge transaction started
- `bridge.completed` - Bridge transaction confirmed
- `gas.optimal_window` - Optimal gas window detected
- `price.alert` - Asset price threshold reached

### Webhook Setup

```http
POST /webhooks
```

**Request Body:**
```json
{
  "url": "https://your-server.com/webhook",
  "events": ["bridge.completed", "gas.optimal_window"],
  "secret": "your_webhook_secret"
}
```

### Webhook Payload

```json
{
  "event": "bridge.completed",
  "timestamp": "2025-06-17T12:00:00Z",
  "data": {
    "bridge_id": "bridge_123456",
    "from_chain": 1,
    "to_chain": 137,
    "asset": {
      "contract": "0x...",
      "token_id": "1234"
    },
    "transaction_hash": "0x...",
    "cost_usd": 22.50,
    "savings_usd": 45.30
  },
  "signature": "sha256_hmac_signature"
}
```

---

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "invalid_address",
    "message": "The provided address is not a valid Ethereum address",
    "details": {
      "address": "0xinvalid",
      "expected_format": "0x[40 hex characters]"
    }
  },
  "request_id": "req_123456789"
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `invalid_api_key` | 401 | Invalid or missing API key |
| `rate_limit_exceeded` | 429 | Too many requests |
| `invalid_address` | 400 | Invalid blockchain address |
| `chain_not_supported` | 400 | Unsupported blockchain |
| `asset_not_found` | 404 | Asset not found |
| `bridge_unavailable` | 503 | Bridge temporarily unavailable |
| `internal_error` | 500 | Server error |

---

## SDK Examples

### JavaScript/TypeScript

```typescript
import { ChainBridge } from '@chainbridge/sdk';

const client = new ChainBridge({
  apiKey: 'your_api_key',
  network: 'mainnet' // or 'testnet'
});

// Get user assets
const assets = await client.getAssets('0x...');

// Find bridge routes
const routes = await client.findBridgeRoutes({
  fromChain: 1,
  toChain: 137,
  asset: {
    contract: '0x...',
    tokenId: '1234'
  }
});

// Get gas predictions
const predictions = await client.getGasPredictions(1, { hours: 24 });

// Subscribe to webhooks
client.on('bridge.completed', (event) => {
  console.log('Bridge completed:', event);
});
```

### Python

```python
from chainbridge import ChainBridge

client = ChainBridge(api_key="your_api_key")

# Get user assets
assets = client.get_assets("0x...")

# Find bridge routes
routes = client.find_bridge_routes(
    from_chain=1,
    to_chain=137,
    contract="0x...",
    token_id="1234"
)

# Get gas predictions
predictions = client.get_gas_predictions(chain_id=1, hours=24)
```

### Go

```go
import "github.com/chainbridge/sdk-go"

client := chainbridge.NewClient("your_api_key")

// Get user assets
assets, err := client.GetAssets("0x...")

// Find bridge routes
routes, err := client.FindBridgeRoutes(&chainbridge.RouteParams{
    FromChain: 1,
    ToChain: 137,
    Contract: "0x...",
    TokenID: "1234",
})
```

---

## Testing

### Test Environment

**Base URL**: `https://api-testnet.chainbridge.xyz/v1`

**Test API Key**: `test_key_123456789`

**Test Addresses**:
- Ethereum: `0x742d35Cc6634C0532925a3b844Bc9e7595f6E123`
- Polygon: `0x742d35Cc6634C0532925a3b844Bc9e7595f6E456`

### Postman Collection

Download our [Postman collection](https://api.chainbridge.xyz/docs/chainbridge-api.postman_collection.json) for easy testing.

---

## Changelog

### v1.0.0 (2025-06-17)
- Initial API release
- Support for Ethereum, Polygon, Arbitrum, Optimism, Solana
- AI gas predictions
- Bridge route optimization
- Webhook support

---

## Support

- **Documentation**: [docs.chainbridge.xyz](https://docs.chainbridge.xyz)
- **Discord**: [discord.gg/chainbridge](https://discord.gg/chainbridge)
- **Email**: support@chainbridge.xyz
- **Status Page**: [status.chainbridge.xyz](https://status.chainbridge.xyz)

---

## Rate Limits by Endpoint

| Endpoint | Free | Pro | Enterprise |
|----------|------|-----|------------|
| `/assets/*` | 100/hour | 1,000/hour | 10,000/hour |
| `/bridges/*` | 50/hour | 500/hour | 5,000/hour |
| `/gas/*` | 200/hour | 2,000/hour | 20,000/hour |
| `/analytics/*` | 20/hour | 200/hour | 2,000/hour |
| Webhooks | ❌ | ✅ 10 events | ✅ Unlimited |

---

**Last Updated**: June 17, 2025  
**API Version**: 1.0.0