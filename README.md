# ChainBridge - Cross-Chain NFT Asset Bridge Dashboard

![ChainBridge Banner](https://github.com/thebunnygoyal/chainbridge-nft-dashboard/banner.png)

## 🌉 Overview

ChainBridge is the first mobile-optimized cross-chain NFT asset bridge dashboard that solves the fragmented asset problem 67% of Web3 gamers face. Track, manage, and optimize your gaming NFTs across Ethereum, Polygon, Arbitrum, and Solana in one unified interface.

## 🚀 Features

- **🌐 Multi-Chain Support**: Track NFTs across Ethereum, Polygon, Arbitrum, and Solana
- **🤖 AI-Powered Optimization**: Get intelligent bridging recommendations based on gas prices and network congestion
- **📊 Portfolio Analytics**: Real-time valuation and performance tracking
- **💰 Cost Optimization**: Compare bridging costs and find the cheapest routes
- **📱 Mobile-First Design**: Optimized for mobile gaming users
- **⚡ One-Click Bridging**: Execute transfers directly from the dashboard
- **🔔 Smart Alerts**: Get notified about market opportunities

## 🏆 Grant Qualification

ChainBridge is designed to qualify for multiple Web3 gaming grants:

- **Game7 DAO**: $20K-50K (chain selection problem focus)
- **Polygon Community Grants**: 5K-50K POL (consumer crypto track)
- **Arbitrum Gaming Catalyst**: Up to 500K ARB (infrastructure category)
- **Immutable Grants**: Milestone-based IMX rewards

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Web3**: RainbowKit, Wagmi, Ethers.js
- **Styling**: Tailwind CSS
- **APIs**: Covalent (multi-chain data), OpenAI (AI insights)
- **Deployment**: Vercel / Azure Static Web Apps

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/thebunnygoyal/chainbridge-nft-dashboard.git
cd chainbridge-nft-dashboard
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your API keys
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## 🔑 API Keys Required

- **Covalent API**: [Get free key](https://www.covalenthq.com/platform/)
- **WalletConnect**: [Get project ID](https://cloud.walletconnect.com/)
- **Alchemy** (optional): [Get API key](https://www.alchemy.com/)
- **OpenAI** (optional): For AI features

## 🚀 Deployment

### Azure Static Web Apps (Recommended - FREE)

```bash
# Using Azure CLI
az staticwebapp create \
  --name chainbridge-app \
  --resource-group web3-gaming \
  --source https://github.com/YOUR_USERNAME/chainbridge-nft-dashboard \
  --location eastus2 \
  --branch main \
  --token $GITHUB_TOKEN
```

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/thebunnygoyal/chainbridge-nft-dashboard)

## 💡 Usage

1. **Connect Wallet**: Use RainbowKit to connect any Web3 wallet
2. **View Portfolio**: See all your gaming NFTs across chains
3. **Analyze Routes**: Click "Analyze Routes" for AI-powered bridging recommendations
4. **Execute Bridges**: One-click bridging with optimal gas prices
5. **Track Performance**: Monitor your portfolio value over time

## 🏗️ Architecture

```
chainbridge-nft-dashboard/
├── pages/              # Next.js pages
├── components/         # React components
│   ├── Dashboard.tsx   # Main dashboard
│   ├── AssetList.tsx   # NFT asset display
│   ├── BridgeOptimizer.tsx # AI recommendations
│   └── ...
├── lib/                # Utilities
│   ├── api.ts          # API integrations
│   └── wagmi.ts        # Web3 configuration
└── styles/             # Global styles
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Game7 DAO for supporting Web3 gaming infrastructure
- Polygon, Arbitrum, and other chains for grant programs
- The Web3 gaming community for feedback and support

## 📞 Contact

- Twitter: [@chainbridge_io](https://twitter.com/chainbridge_io)
- Discord: [Join our community](https://discord.gg/chainbridge)
- Email: team@chainbridge.io

---

**Built with ❤️ for the Web3 gaming community**
