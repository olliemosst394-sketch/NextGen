// components/PortfolioBalance.tsx
'use client';















import { useAccount, useBalance, useReadContracts } from 'wagmi';
import { formatEther, formatUnits } from 'viem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TokenBalance {
  symbol: string;
  balance: string;
  valueUSD: number;
  priceUSD?: number;
}

export default function PortfolioBalance() {
  const { address, isConnected, chain } = useAccount();
  const [totalPortfolioValue, setTotalPortfolioValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Native token balance (ETH, BASE, etc.)
  const { data: nativeBalance, isLoading: nativeLoading } = useBalance({
    address,
    chainId: chain?.id,
    query: { enabled: !!address },
  });

  // Example: Fetch a few common tokens using multicall (you can expand this)
  const { data: tokenBalances } = useReadContracts({
    contracts: [
      // Add more token contracts here as needed
      // Example for USDC on Base
      {
        address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913', // USDC on Base
        abi: [
          {
            name: 'balanceOf',
            type: 'function',
            stateMutability: 'view',
            inputs: [{ name: 'account', type: 'address' }],
            outputs: [{ name: '', type: 'uint256' }],
          },
        ] as const,
        functionName: 'balanceOf',
        args: [address!],
        chainId: chain?.id,
      },
    ],
    query: { enabled: !!address },
  });

  // Simple total value calculation (expand with CoinGecko prices in real app)
  useEffect(() => {
    if (!nativeBalance) {
      setIsLoading(false);
      return;
    }

    const nativeValue = parseFloat(formatEther(nativeBalance.value)) * 2500; // Mock ETH price ~$2500
    setTotalPortfolioValue(nativeValue);
    setIsLoading(false);
  }, [nativeBalance]);

  if (!isConnected) {
    return (
      <Card className="bg-gray-950 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Wallet className="w-5 h-5" />
            Portfolio Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 text-center py-8">
            Connect your wallet to view your portfolio
          </p>
        </CardContent>
      </Card>
    );
  }

  const nativeSymbol = nativeBalance?.symbol || chain?.nativeCurrency.symbol || 'ETH';
  const nativeFormatted = nativeBalance 
    ? parseFloat(formatEther(nativeBalance.value)).toFixed(4)
    : '0.0000';

  return (
    <Card className="bg-gradient-to-br from-gray-950 to-black border border-gray-800 overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl font-semibold">
            <Wallet className="w-5 h-5 text-blue-500" />
            Portfolio Overview
          </CardTitle>
          <div className="text-xs px-3 py-1 bg-green-500/10 text-green-400 rounded-full flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Live
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Total Portfolio Value */}
        <div>
          <p className="text-sm text-gray-400">Total Value</p>
          {isLoading ? (
            <Skeleton className="h-12 w-48 mt-1" />
          ) : (
            <div className="text-4xl font-bold tracking-tight text-white">
              ${totalPortfolioValue.toLocaleString()}
            </div>
          )}
          <p className="text-sm text-emerald-400 mt-1 flex items-center gap-1">
            +2.34% <span className="text-gray-500">(24h)</span>
          </p>
        </div>

        {/* Native Token Balance */}
        <div className="bg-gray-900/50 rounded-2xl p-4 border border-gray-800">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                {nativeSymbol.slice(0, 1)}
              </div>
              <div>
                <p className="font-medium">{nativeSymbol}</p>
                <p className="text-sm text-gray-400">Native Token</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-mono text-lg font-semibold">
                {nativeFormatted}
              </p>
              <p className="text-sm text-gray-400">
                ~${(parseFloat(nativeFormatted) * 2500).toFixed(0)}
              </p>
            </div>
          </div>
        </div>

        {/* Additional Tokens (Placeholder - expand later) */}
        <div>
          <p className="text-sm text-gray-400 mb-3">Other Tokens</p>
          <div className="text-center py-6 text-gray-500 text-sm border border-dashed border-gray-800 rounded-2xl">
            Connect more tokens or integrate CoinGecko for live prices
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
