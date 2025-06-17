import { useEffect, useRef } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale)

interface PortfolioChartProps {
  assets: any[]
}

export default function PortfolioChart({ assets }: PortfolioChartProps) {
  const getChainValue = (chain: string) => {
    return assets
      .filter(a => a.chain?.toLowerCase() === chain.toLowerCase())
      .reduce((sum, a) => sum + (a.value || 0), 0)
  }

  const data = {
    labels: ['Ethereum', 'Polygon', 'Arbitrum', 'Solana'],
    datasets: [{
      data: [
        getChainValue('ethereum'),
        getChainValue('polygon'),
        getChainValue('arbitrum'),
        getChainValue('solana')
      ],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(14, 165, 233, 0.8)',
        'rgba(34, 197, 94, 0.8)'
      ],
      borderColor: [
        'rgba(59, 130, 246, 1)',
        'rgba(139, 92, 246, 1)',
        'rgba(14, 165, 233, 1)',
        'rgba(34, 197, 94, 1)'
      ],
      borderWidth: 2
    }]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'white',
          padding: 20,
          font: {
            size: 14
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.parsed || 0
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
            const percentage = ((value / total) * 100).toFixed(1)
            return `${context.label}: $${value.toLocaleString()} (${percentage}%)`
          }
        }
      }
    }
  }

  return (
    <div className="bg-dark/50 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6">
      <h3 className="text-2xl font-bold text-white mb-6">Portfolio Value Distribution</h3>
      <div className="h-64">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  )
}
