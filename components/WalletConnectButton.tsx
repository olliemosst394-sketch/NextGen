























// components/WalletConnectButton.tsx
'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default function WalletConnectButton() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div className="flex items-center gap-3">
            {!connected ? (
              <Button
                onClick={openConnectModal}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-6 py-2.5 rounded-xl"
              >
                Connect Wallet
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                {/* Chain Switcher */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openChainModal}
                  className="flex items-center gap-2 border-gray-700 hover:bg-gray-800"
                >
                  {chain?.hasIcon && chain.iconUrl && (
                    <img
                      src={chain.iconUrl}
                      alt={chain.name ?? 'Chain'}
                      className="w-4 h-4"
                    />
                  )}
                  <span className="hidden sm:inline">{chain?.name}</span>
                </Button>

                {/* Account Button */}
                <Button
                  onClick={openAccountModal}
                  className="font-mono text-sm bg-gray-900 hover:bg-gray-800 border border-gray-700"
                >
                  {account.displayBalance
                    ? `${account.displayBalance}`
                    : ''}
                  {' '}
                  {account.displayName}
                </Button>

                {/* Disconnect Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {/* wagmi disconnect can be added via useDisconnect */}}
                  className="text-red-400 hover:text-red-500"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
