"use client";

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export function LocationActions({ address, mapUrl }: { address: string, mapUrl: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(address).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="space-y-3">
            <button
                onClick={handleCopy}
                className="w-full text-center py-3 bg-zinc-800 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2"
            >
                {copied ? <Check className="w-4 h-4 text-v-green" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Скопировано!' : 'Копировать адрес'}</span>
            </button>
            <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="block w-full text-center py-3 bg-zinc-800 rounded-lg text-sm font-semibold text-v-green">
                Открыть в Maps
            </a>
        </div>
    );
}
