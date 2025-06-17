#!/usr/bin/env python3
"""
ChainBridge SDK - Data Analysis Example
Demonstrates using ChainBridge SDK for NFT portfolio analysis and optimization
"""

import os
import asyncio
from datetime import datetime, timedelta
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from chainbridge import ChainBridge, ChainBridgeError

# Initialize client
client = ChainBridge(
    api_key=os.getenv('CHAINBRIDGE_API_KEY', 'your_api_key'),
    network='mainnet'
)


class PortfolioAnalyzer:
    """Analyze NFT portfolios and bridge opportunities"""
    
    def __init__(self, client: ChainBridge):
        self.client = client
        self.chain_names = {
            1: 'Ethereum',
            137: 'Polygon',
            42161: 'Arbitrum',
            10: 'Optimism',
            8453: 'Base'
        }
    
    async def analyze_portfolio(self, address: str):
        """Comprehensive portfolio analysis"""
        print(f"\n=== Portfolio Analysis for {address[:10]}... ===")
        
        # Fetch portfolio data
        portfolio = await self.client.get_portfolio(address)
        assets = await self.client.get_assets(address)
        
        # Basic statistics
        print(f"\nPortfolio Overview:")
        print(f"  Total NFTs: {portfolio['total_assets']}")
        print(f"  Total Value: ${portfolio['total_value_usd']:,.2f}")
        print(f"  Chains: {len(portfolio['chains'])}")
        
        # Create DataFrame for analysis
        df = pd.DataFrame([
            {
                'name': asset['name'],
                'chain': self.chain_names.get(asset['chain_id'], f"Chain {asset['chain_id']}"),
                'chain_id': asset['chain_id'],
                'value_usd': asset['floor_price_usd'],
                'last_sale': asset.get('last_sale_usd', 0),
                'bridgeable_chains': len(asset['bridgeable_to'])
            }
            for asset in assets
        ])
        
        # Chain distribution
        chain_dist = df.groupby('chain').agg({
            'name': 'count',
            'value_usd': 'sum'
        }).rename(columns={'name': 'count'})
        
        print("\nChain Distribution:")
        for chain, row in chain_dist.iterrows():
            pct = (row['count'] / len(df)) * 100
            print(f"  {chain}: {row['count']} NFTs (${row['value_usd']:,.2f}) - {pct:.1f}%")
        
        # Bridge opportunities
        bridgeable = df[df['bridgeable_chains'] > 0]
        print(f"\nBridge Opportunities:")
        print(f"  Bridgeable NFTs: {len(bridgeable)} ({len(bridgeable)/len(df)*100:.1f}%)")
        print(f"  Total bridgeable value: ${bridgeable['value_usd'].sum():,.2f}")
        
        # Visualizations
        await self._create_visualizations(df, chain_dist)
        
        return df
    
    async def analyze_bridge_savings(self, address: str, sample_size: int = 5):
        """Analyze potential savings from optimal bridging"""
        print(f"\n=== Bridge Savings Analysis ===")
        
        assets = await self.client.get_assets(address)
        bridgeable = [a for a in assets if len(a['bridgeable_to']) > 0]
        
        if not bridgeable:
            print("No bridgeable assets found")
            return
        
        # Sample assets for analysis
        sample = bridgeable[:sample_size]
        total_current_cost = 0
        total_optimal_cost = 0
        savings_data = []
        
        for asset in sample:
            print(f"\nAnalyzing: {asset['name']} #{asset['token_id']}")
            
            for target_chain in asset['bridgeable_to'][:1]:  # First bridge option
                # Get routes
                routes = await self.client.find_bridge_routes(
                    from_chain=asset['chain_id'],
                    to_chain=target_chain,
                    contract=asset['contract_address'],
                    token_id=asset['token_id'],
                    urgency='low'
                )
                
                if routes:
                    current_cost = routes[0]['current_cost_usd']
                    
                    # Get AI recommendation
                    if routes[0].get('ai_recommendation'):
                        optimal_cost = current_cost * (1 - routes[0]['ai_recommendation']['expected_savings_percent'])
                        wait_time = routes[0]['ai_recommendation']['wait_time']
                    else:
                        optimal_cost = current_cost * 0.7  # Assume 30% savings
                        wait_time = '4 hours'
                    
                    savings = current_cost - optimal_cost
                    savings_pct = (savings / current_cost) * 100
                    
                    print(f"  Route: {self.chain_names[asset['chain_id']]} → {self.chain_names[target_chain]}")
                    print(f"  Current cost: ${current_cost:.2f}")
                    print(f"  Optimal cost: ${optimal_cost:.2f} (wait {wait_time})")
                    print(f"  Savings: ${savings:.2f} ({savings_pct:.1f}%)")
                    
                    total_current_cost += current_cost
                    total_optimal_cost += optimal_cost
                    
                    savings_data.append({
                        'asset': asset['name'],
                        'route': f"{self.chain_names[asset['chain_id']]} → {self.chain_names[target_chain]}",
                        'current_cost': current_cost,
                        'optimal_cost': optimal_cost,
                        'savings': savings,
                        'savings_pct': savings_pct
                    })
        
        # Summary
        if savings_data:
            total_savings = total_current_cost - total_optimal_cost
            avg_savings_pct = (total_savings / total_current_cost) * 100
            
            print(f"\n=== Savings Summary ===")
            print(f"Total current cost: ${total_current_cost:.2f}")
            print(f"Total optimal cost: ${total_optimal_cost:.2f}")
            print(f"Total savings: ${total_savings:.2f} ({avg_savings_pct:.1f}%)")
            
            # Create savings visualization
            self._plot_savings(pd.DataFrame(savings_data))
    
    async def analyze_gas_patterns(self, chain_id: int = 1):
        """Analyze gas price patterns for optimal bridging times"""
        print(f"\n=== Gas Pattern Analysis for {self.chain_names.get(chain_id, f'Chain {chain_id}')} ===")
        
        # Get predictions
        predictions = await self.client.get_gas_predictions(chain_id, hours=48)
        
        # Current gas
        print(f"\nCurrent gas price: {predictions['current_gas_price']} Gwei")
        print(f"Model accuracy (7d): {predictions['model_accuracy']*100:.1f}%")
        
        # Convert predictions to DataFrame
        df = pd.DataFrame(predictions['predictions'])
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        df['hour'] = df['timestamp'].dt.hour
        df['day_of_week'] = df['timestamp'].dt.day_name()
        
        # Hourly patterns
        hourly_avg = df.groupby('hour')['predicted_gas_price'].mean()
        
        print("\nBest hours for bridging (average gas):")
        best_hours = hourly_avg.nsmallest(5)
        for hour, gas in best_hours.items():
            print(f"  {hour:02d}:00 - {gas:.1f} Gwei")
        
        # Optimal windows
        print("\nOptimal windows in next 48h:")
        for i, window in enumerate(predictions['optimal_windows'][:5]):
            start = datetime.fromisoformat(window['start'].replace('Z', '+00:00'))
            savings = window['savings_percent'] * 100
            print(f"  {i+1}. {start.strftime('%a %H:%M')} - {window['average_gas_price']} Gwei ({savings:.0f}% savings)")
        
        # Create visualizations
        self._plot_gas_patterns(df, hourly_avg)
    
    def _create_visualizations(self, df: pd.DataFrame, chain_dist: pd.DataFrame):
        """Create portfolio visualizations"""
        fig, axes = plt.subplots(2, 2, figsize=(12, 10))
        
        # 1. Chain distribution pie chart
        ax1 = axes[0, 0]
        chain_dist['count'].plot(kind='pie', ax=ax1, autopct='%1.1f%%')
        ax1.set_title('NFT Distribution by Chain')
        ax1.set_ylabel('')
        
        # 2. Value distribution by chain
        ax2 = axes[0, 1]
        chain_dist['value_usd'].plot(kind='bar', ax=ax2)
        ax2.set_title('Total Value by Chain')
        ax2.set_xlabel('Chain')
        ax2.set_ylabel('Value (USD)')
        ax2.tick_params(axis='x', rotation=45)
        
        # 3. Value distribution histogram
        ax3 = axes[1, 0]
        df['value_usd'].hist(bins=20, ax=ax3)
        ax3.set_title('NFT Value Distribution')
        ax3.set_xlabel('Value (USD)')
        ax3.set_ylabel('Count')
        ax3.set_yscale('log')
        
        # 4. Bridge opportunities
        ax4 = axes[1, 1]
        bridge_data = df.groupby('bridgeable_chains')['name'].count()
        bridge_data.plot(kind='bar', ax=ax4)
        ax4.set_title('Bridge Options per NFT')
        ax4.set_xlabel('Number of Bridgeable Chains')
        ax4.set_ylabel('NFT Count')
        
        plt.tight_layout()
        plt.savefig('portfolio_analysis.png', dpi=300, bbox_inches='tight')
        print("\nVisualization saved as 'portfolio_analysis.png'")
    
    def _plot_savings(self, df: pd.DataFrame):
        """Plot bridge savings analysis"""
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
        
        # Savings by asset
        ax1.bar(range(len(df)), df['savings'])
        ax1.set_xticks(range(len(df)))
        ax1.set_xticklabels([a[:20] + '...' if len(a) > 20 else a for a in df['asset']], rotation=45)
        ax1.set_title('Savings by Asset')
        ax1.set_ylabel('Savings (USD)')
        
        # Cost comparison
        x = range(len(df))
        width = 0.35
        ax2.bar([i - width/2 for i in x], df['current_cost'], width, label='Current')
        ax2.bar([i + width/2 for i in x], df['optimal_cost'], width, label='Optimal')
        ax2.set_xticks(x)
        ax2.set_xticklabels([f"Asset {i+1}" for i in range(len(df))])
        ax2.set_title('Cost Comparison')
        ax2.set_ylabel('Cost (USD)')
        ax2.legend()
        
        plt.tight_layout()
        plt.savefig('bridge_savings.png', dpi=300, bbox_inches='tight')
        print("\nSavings visualization saved as 'bridge_savings.png'")
    
    def _plot_gas_patterns(self, df: pd.DataFrame, hourly_avg: pd.Series):
        """Plot gas price patterns"""
        fig, (ax1, ax2, ax3) = plt.subplots(3, 1, figsize=(12, 10))
        
        # 48-hour prediction
        ax1.plot(df['timestamp'], df['predicted_gas_price'], label='Predicted')
        ax1.axhline(y=df['predicted_gas_price'].mean(), color='r', linestyle='--', label='Average')
        ax1.set_title('48-Hour Gas Price Prediction')
        ax1.set_xlabel('Time')
        ax1.set_ylabel('Gas Price (Gwei)')
        ax1.legend()
        ax1.grid(True, alpha=0.3)
        
        # Hourly pattern
        ax2.bar(hourly_avg.index, hourly_avg.values)
        ax2.set_title('Average Gas Price by Hour of Day')
        ax2.set_xlabel('Hour')
        ax2.set_ylabel('Average Gas Price (Gwei)')
        ax2.set_xticks(range(0, 24, 2))
        
        # Savings heatmap
        savings_matrix = df.pivot_table(
            values='savings_vs_current',
            index=df['timestamp'].dt.hour,
            columns=df['timestamp'].dt.day_name(),
            aggfunc='mean'
        )
        sns.heatmap(savings_matrix, cmap='RdYlGn', center=0, ax=ax3, cbar_kws={'label': 'Savings %'})
        ax3.set_title('Average Savings by Hour and Day')
        ax3.set_xlabel('Day of Week')
        ax3.set_ylabel('Hour of Day')
        
        plt.tight_layout()
        plt.savefig('gas_patterns.png', dpi=300, bbox_inches='tight')
        print("\nGas pattern visualization saved as 'gas_patterns.png'")


async def main():
    """Run portfolio analysis examples"""
    analyzer = PortfolioAnalyzer(client)
    
    # Example wallet (replace with actual address)
    wallet_address = '0x742d35Cc6634C0532925a3b844Bc9e7595f6E123'
    
    try:
        # 1. Portfolio analysis
        portfolio_df = await analyzer.analyze_portfolio(wallet_address)
        
        # 2. Bridge savings analysis
        await analyzer.analyze_bridge_savings(wallet_address, sample_size=5)
        
        # 3. Gas pattern analysis
        await analyzer.analyze_gas_patterns(chain_id=1)  # Ethereum
        
        print("\n=== Analysis Complete ===")
        print("Generated visualizations:")
        print("  - portfolio_analysis.png")
        print("  - bridge_savings.png")
        print("  - gas_patterns.png")
        
    except ChainBridgeError as e:
        print(f"\nAPI Error: {e.code} - {e.message}")
    except Exception as e:
        print(f"\nUnexpected error: {e}")


if __name__ == '__main__':
    # Run async main function
    asyncio.run(main())
