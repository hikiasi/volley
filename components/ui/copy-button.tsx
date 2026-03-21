"use client";

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CopyButton({ textToCopy }: { textToCopy: string }) {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        if (isCopied) return;
        navigator.clipboard.writeText(textToCopy).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    return (
        <button 
            onClick={handleCopy}
            className={cn(
                "w-full text-center py-3 rounded-lg text-sm font-semibold transition-all",
                isCopied 
                    ? "bg-v-green/20 text-v-green" 
                    : "bg-zinc-800 text-white hover:bg-zinc-700"
            )}
            disabled={isCopied}
        >
            <div className='flex items-center justify-center gap-2'>
                {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{isCopied ? "Скопировано!" : "Копировать адрес"}</span>
            </div>
        </button>
    );
}
