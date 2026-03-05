import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Tent, Copy, Users, ArrowRight, Share2 } from 'lucide-react';

interface TentManagerProps {
  tentId: string | null;
  memberCount: number;
  connected: boolean;
  onCreateTent: () => void;
  onJoinTent: (id: string) => void;
  onClose: () => void;
}

export default function TentManager({ tentId, memberCount, connected, onCreateTent, onJoinTent, onClose }: TentManagerProps) {
  const [joinInput, setJoinInput] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!tentId) return;
    const url = `${window.location.origin}?tentId=${tentId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (!tentId) return;
    const url = `${window.location.origin}?tentId=${tentId}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join my Safety Tent',
          text: 'Join my secure safety network to receive emergency alerts.',
          url: url
        });
      } catch (e) {
        console.log('Share failed', e);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-[80] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-zinc-900 rounded-3xl border border-zinc-800 p-6 space-y-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
              <Tent size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Safety Tent</h2>
              <p className="text-xs text-zinc-400">Local Safety Network</p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white">Close</button>
        </div>

        {tentId ? (
          <div className="space-y-6">
            <div className="bg-zinc-950 rounded-2xl p-6 text-center space-y-2 border border-zinc-800">
              <p className="text-zinc-500 text-sm uppercase tracking-wider font-bold">Current Tent ID</p>
              <div className="text-4xl font-mono font-bold text-white tracking-widest">{tentId}</div>
              <div className="flex items-center justify-center gap-2 text-emerald-500 text-sm mt-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {connected ? 'Connected' : 'Connecting...'}
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={handleCopy}
                className="flex-1 py-3 bg-zinc-800 rounded-xl font-medium text-white flex items-center justify-center gap-2 hover:bg-zinc-700 transition-colors"
              >
                {copied ? <span className="text-emerald-500">Copied!</span> : <><Copy size={18} /> Copy Link</>}
              </button>
              <button 
                onClick={handleShare}
                className="flex-1 py-3 bg-emerald-600 rounded-xl font-medium text-white flex items-center justify-center gap-2 hover:bg-emerald-500 transition-colors"
              >
                <Share2 size={18} /> Share
              </button>
            </div>

            <div className="bg-zinc-800/50 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users size={20} className="text-zinc-400" />
                <span className="text-zinc-300">Active Members</span>
              </div>
              <span className="text-xl font-bold text-white">{memberCount}</span>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <button 
              onClick={onCreateTent}
              className="w-full py-4 bg-emerald-600 rounded-2xl font-bold text-white text-lg hover:bg-emerald-500 transition-colors flex items-center justify-center gap-2"
            >
              <Tent size={24} />
              Create New Tent
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-zinc-900 text-zinc-500">Or join existing</span>
              </div>
            </div>

            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Enter Tent ID" 
                value={joinInput}
                onChange={(e) => setJoinInput(e.target.value.toUpperCase())}
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 text-white placeholder-zinc-600 outline-none focus:border-emerald-500 transition-colors font-mono"
              />
              <button 
                onClick={() => onJoinTent(joinInput)}
                disabled={!joinInput}
                className="w-12 bg-zinc-800 rounded-xl flex items-center justify-center text-white hover:bg-zinc-700 disabled:opacity-50 transition-colors"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
