# ChainBridge User Guide

## Welcome to ChainBridge! 🌉

ChainBridge is your all-in-one solution for managing NFT assets across multiple blockchains. This guide will help you get started and make the most of our platform.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Connecting Your Wallet](#connecting-your-wallet)
3. [Viewing Your NFTs](#viewing-your-nfts)
4. [Bridging NFTs](#bridging-nfts)
5. [AI Optimization](#ai-optimization)
6. [Mobile App](#mobile-app)
7. [Advanced Features](#advanced-features)
8. [Troubleshooting](#troubleshooting)
9. [FAQs](#faqs)

---

## Getting Started

### What You'll Need

- A Web3 wallet (MetaMask, Rainbow, Coinbase Wallet, etc.)
- NFTs on any supported blockchain
- Some ETH/MATIC/ARB for gas fees
- 5 minutes to save hours of time and money!

### Supported Blockchains

| Blockchain | Network | Status |
|------------|---------|--------|
| Ethereum | Mainnet | ✅ Live |
| Polygon | PoS | ✅ Live |
| Arbitrum | One | ✅ Live |
| Solana | Mainnet | ✅ Live |
| Optimism | Mainnet | 🔜 Coming Soon |
| Base | Mainnet | 🔜 Coming Soon |

### First Time Setup

1. **Visit ChainBridge**: Go to [https://chainbridge.xyz](https://chainbridge.xyz)
2. **Connect Wallet**: Click "Connect Wallet" in the top right
3. **Select Network**: Choose your primary blockchain
4. **Authorize**: Approve the connection in your wallet
5. **Success!** You're ready to bridge

---

## Connecting Your Wallet

### Desktop Wallets

#### MetaMask
1. Click "Connect Wallet"
2. Select "MetaMask" 
3. Approve in MetaMask popup
4. Select accounts to connect

#### WalletConnect
1. Click "Connect Wallet"
2. Select "WalletConnect"
3. Scan QR code with mobile wallet
4. Approve connection

### Mobile Wallets

1. Open ChainBridge in your wallet's browser
2. Tap "Connect Wallet"
3. Select "Connect with [Wallet Name]"
4. Connection is automatic!

### Multi-Wallet Support

You can connect multiple wallets to track all your NFTs:

1. After connecting first wallet
2. Click your address → "Add Wallet"
3. Connect additional wallet
4. Switch between wallets anytime

---

## Viewing Your NFTs

### Dashboard Overview

![Dashboard Overview](./images/dashboard.png)

**Key Features:**
- **Portfolio Value**: Total value across all chains
- **Chain Breakdown**: NFTs organized by blockchain
- **Quick Actions**: Bridge, sell, or transfer
- **Recent Activity**: Your bridge history

### Filtering & Sorting

**Filter Options:**
- By Chain: Show only specific blockchains
- By Collection: Focus on specific projects
- By Value: High value items first
- By Recent: Recently acquired

**Sort Options:**
- Name (A-Z)
- Value (High to Low)
- Recent Activity
- Chain

### NFT Details

Click any NFT to see:
- Full metadata and attributes
- Current floor price
- Transfer history
- Bridge options
- Similar items

---

## Bridging NFTs

### Quick Bridge (Recommended)

1. **Select NFT**: Click the NFT you want to bridge
2. **Choose Destination**: Select target blockchain
3. **AI Optimization**: Our AI automatically finds the best route
4. **Review & Confirm**: Check savings and approve
5. **Track Progress**: Real-time updates

### Manual Bridge

For advanced users who want control:

1. Click "Manual Bridge" 
2. Select source and destination chains
3. Choose bridge protocol
4. Set gas price and slippage
5. Execute transaction

### Batch Bridging

Save even more with batch transfers:

1. Select multiple NFTs (up to 50)
2. Click "Batch Bridge"
3. Choose destination chain
4. AI groups for optimal gas
5. Execute all at once

### Bridge Tracking

**Real-time Status Updates:**
- 🟡 **Initiating**: Transaction submitted
- 🟠 **Locking**: NFT locked on source chain
- 🔵 **Bridging**: Cross-chain transfer in progress
- 🟢 **Minting**: NFT being minted on destination
- ✅ **Complete**: NFT available on new chain!

---

## AI Optimization

### How It Works

Our AI analyzes multiple factors to save you money:

1. **Gas Price Prediction**: Forecasts prices up to 24 hours
2. **Route Optimization**: Finds cheapest path
3. **Timing Recommendations**: Suggests optimal windows
4. **Batch Grouping**: Combines similar transfers

### Understanding Predictions

**Confidence Levels:**
- 🟢 **High (>85%)**: Very reliable prediction
- 🟡 **Medium (70-85%)**: Good prediction
- 🟠 **Low (<70%)**: Use with caution

**Savings Indicators:**
- 💰 **Excellent (>70%)**: Bridge now!
- 💵 **Good (50-70%)**: Good opportunity
- 💸 **Fair (30-50%)**: Average savings
- ⏰ **Wait**: Better time coming soon

### Smart Alerts

Set up alerts for optimal bridging:

1. Go to Settings → Alerts
2. Choose chains to monitor
3. Set savings threshold (e.g., >60%)
4. Select notification method
5. Get notified of opportunities!

---

## Mobile App

### Installation

**iOS:**
1. Visit chainbridge.xyz on Safari
2. Tap Share → "Add to Home Screen"
3. Name it "ChainBridge"
4. Access from home screen!

**Android:**
1. Visit chainbridge.xyz on Chrome
2. Tap Menu → "Install App"
3. Follow prompts
4. Launch from app drawer!

### Mobile Features

- **Swipe Navigation**: Swipe between chains
- **Touch ID/Face ID**: Secure access
- **Push Notifications**: Bridge alerts
- **Offline Mode**: View cached data
- **QR Scanner**: Quick wallet connection

### Mobile-Specific Tips

1. **Save Battery**: Enable "Low Power Mode" in settings
2. **Quick Actions**: Long-press NFT for options
3. **Gesture Controls**: Pinch to zoom collections
4. **Widgets**: Add portfolio widget to home screen

---

## Advanced Features

### API Access (Pro/Enterprise)

```javascript
// Example: Get optimal bridge route
const chainbridge = new ChainBridge({ apiKey: 'your-api-key' })

const route = await chainbridge.getOptimalRoute({
  from: { chain: 'ethereum', token: '0x...', tokenId: '123' },
  to: { chain: 'polygon' }
})

console.log(`Save ${route.savings}% by bridging now!`)
```

### Custom Integrations

**Webhook Events:**
- `bridge.completed`: Bridge successful
- `price.alert`: Gas price opportunity
- `nft.received`: New NFT detected

**Example Webhook:**
```json
{
  "event": "bridge.completed",
  "data": {
    "nft": "CoolApe #123",
    "from": "ethereum",
    "to": "polygon",
    "saved": "0.05 ETH",
    "txHash": "0x..."
  }
}
```

### Power User Settings

**Gas Strategies:**
- **Aggressive**: Always lowest price (may be slow)
- **Balanced**: Good mix of speed and cost
- **Fast**: Priority execution (higher cost)
- **Custom**: Set your own gas prices

**Bridge Preferences:**
- Preferred protocols
- Maximum slippage
- Timeout settings
- Fallback options

---

## Troubleshooting

### Common Issues

#### "Transaction Failed"
**Causes:**
- Insufficient gas
- Network congestion
- Slippage too low

**Solutions:**
1. Increase gas limit by 20%
2. Wait for less congestion
3. Increase slippage to 1-2%
4. Try alternative route

#### "NFT Not Showing"
**Causes:**
- Indexing delay
- Unsupported contract
- Network issues

**Solutions:**
1. Click "Refresh" button
2. Wait 5-10 minutes
3. Check contract compatibility
4. Contact support with details

#### "Bridge Taking Too Long"
**Normal Times:**
- Ethereum → Polygon: 15-30 min
- Polygon → Arbitrum: 10-20 min
- Arbitrum → Ethereum: 1-7 days

**If Delayed:**
1. Check explorer links
2. Verify gas was sufficient
3. Wait for network confirmation
4. Contact support after 2x normal time

### Error Codes

| Code | Meaning | Solution |
|------|---------|----------|
| E001 | Network error | Check connection |
| E002 | Insufficient funds | Add more gas |
| E003 | Contract error | Try different route |
| E004 | Timeout | Retry transaction |
| E005 | Rate limited | Wait 1 minute |

---

## FAQs

### General Questions

**Q: Is ChainBridge safe?**
A: Yes! We never hold your NFTs or private keys. All bridges use audited protocols.

**Q: What does it cost?**
A: ChainBridge is free! You only pay network gas fees, which we help minimize.

**Q: How much can I save?**
A: Users save 70% on average, with some saving over 90% on gas fees.

**Q: Which wallets work?**
A: Any Web3 wallet! MetaMask, Rainbow, Coinbase Wallet, Trust Wallet, etc.

### Bridging Questions

**Q: Can I cancel a bridge?**
A: Once initiated, bridges cannot be cancelled. Always double-check before confirming.

**Q: What if my NFT gets stuck?**
A: Rare, but we'll help recover it. Contact support with your transaction hash.

**Q: Do attributes transfer?**
A: Yes! All metadata and attributes are preserved during bridging.

**Q: Can I bridge to multiple chains?**
A: Yes, but you need to bridge to each chain separately.

### Technical Questions

**Q: How does the AI work?**
A: Our AI analyzes historical gas patterns, network congestion, and bridge liquidity to predict optimal times.

**Q: Is the API rate limited?**
A: Free tier: 100 req/hour. Pro: 1,000 req/hour. Enterprise: Unlimited.

**Q: Can I self-host ChainBridge?**
A: The code is open source! Check our GitHub for deployment instructions.

**Q: What's the max batch size?**
A: 50 NFTs per batch for optimal gas efficiency.

---

## Getting Help

### Support Channels

**Discord Community**
- Instant help from community
- Team members active daily
- Join: [discord.gg/chainbridge](https://discord.gg/chainbridge)

**Email Support**
- For account issues: support@chainbridge.xyz
- For technical issues: tech@chainbridge.xyz
- Response time: <24 hours

**Twitter**
- Follow [@chainbridge_xyz](https://twitter.com/chainbridge_xyz)
- DMs open for quick questions
- Updates and tips

### Useful Resources

- **Video Tutorials**: [YouTube Channel](https://youtube.com/chainbridge)
- **Developer Docs**: [docs.chainbridge.xyz](https://docs.chainbridge.xyz)
- **Blog**: [blog.chainbridge.xyz](https://blog.chainbridge.xyz)
- **Status Page**: [status.chainbridge.xyz](https://status.chainbridge.xyz)

---

## Pro Tips

### Save Maximum Gas

1. **Bridge at Night**: Gas is often 50% cheaper at 2-4 AM EST
2. **Use Weekends**: Saturday/Sunday typically have lower fees
3. **Batch Similar NFTs**: Group by collection for efficiency
4. **Set Alerts**: Get notified when gas drops below your threshold
5. **Plan Ahead**: Our AI shows best times up to 24 hours out

### Security Best Practices

1. **Verify URLs**: Always check you're on chainbridge.xyz
2. **Check Transactions**: Review all details before signing
3. **Use Hardware Wallets**: For high-value NFTs
4. **Enable 2FA**: On your wallet and email
5. **Report Suspicious Activity**: We take security seriously

### Power User Shortcuts

| Shortcut | Action |
|----------|--------|
| `Space` | Quick search |
| `B` | Bridge selected NFT |
| `R` | Refresh data |
| `1-4` | Switch chains |
| `?` | Show shortcuts |

---

## Conclusion

ChainBridge makes cross-chain NFT management simple, fast, and affordable. Whether you're a casual collector or power trader, our platform saves you time and money.

**Remember:**
- 🤖 Let AI optimize your bridges
- 💰 Save 70% on average
- 📱 Access anywhere with mobile
- 🛡️ Your keys, your NFTs, always

**Happy Bridging!** 🌉

---

*Last updated: June 2025*
*Version: 1.2.0*