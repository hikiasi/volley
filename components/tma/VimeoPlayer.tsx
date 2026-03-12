"use client";

import { useEffect, useRef } from "react";
import Player from "@vimeo/player";

interface VimeoPlayerProps {
  videoId: string;
  onProgress?: (data: { percent: number; seconds: number; duration: number }) => void;
  onEnded?: () => void;
}

export function VimeoPlayer({ videoId, onProgress, onEnded }: VimeoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const player = new Player(containerRef.current, {
      id: parseInt(videoId),
      responsive: true,
      dnt: true, // Do Not Track
    });

    playerRef.current = player;

    player.on("timeupdate", (data) => {
      onProgress?.(data);
    });

    player.on("ended", () => {
      onEnded?.();
    });

    return () => {
      player.destroy();
    };
  }, [videoId, onProgress, onEnded]);

  return (
    <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/5">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}
