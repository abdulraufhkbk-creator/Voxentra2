import React from 'react';
import { SocialPlatform } from '../../types/analysis';
import { 
  Instagram, 
  Twitter, 
  Send, 
  Facebook, 
  Youtube, 
  MessageSquare,
  Globe
} from 'lucide-react';

interface PlatformIconProps {
  platform: SocialPlatform | string;
  className?: string;
  size?: number;
}

export const PlatformIcon: React.FC<PlatformIconProps> = ({ platform, className = '', size = 16 }) => {
  const p = platform.toLowerCase();

  if (p === 'instagram') {
    return <Instagram size={size} className={`text-[#8E44AD] shrink-0 ${className}`} />;
  }
  if (p === 'x' || p === 'twitter') {
    return <Twitter size={size} className={`text-[#111111] shrink-0 ${className}`} />;
  }
  if (p === 'telegram') {
    return <Send size={size} className={`text-[#2A86C8] shrink-0 ${className}`} />;
  }
  if (p === 'facebook') {
    return <Facebook size={size} className={`text-[#2F55A4] shrink-0 ${className}`} />;
  }
  if (p === 'youtube') {
    return <Youtube size={size} className={`text-[#C4302B] shrink-0 ${className}`} />;
  }
  if (p === 'reddit') {
    return <MessageSquare size={size} className={`text-[#D35400] shrink-0 ${className}`} />;
  }
  return <Globe size={size} className={`text-[#5E5A54] shrink-0 ${className}`} />;
};

export const getPlatformName = (platform: SocialPlatform | string): string => {
  const p = platform.toLowerCase();
  switch (p) {
    case 'instagram': return 'Instagram';
    case 'x': return 'X (Twitter)';
    case 'telegram': return 'Telegram';
    case 'facebook': return 'Facebook';
    case 'youtube': return 'YouTube';
    case 'reddit': return 'Reddit';
    default: return platform;
  }
};

export const isLiveCapablePlatform = (platform: SocialPlatform | string): boolean => {
  const p = platform.toLowerCase();
  return p === 'x' || p === 'twitter' || p === 'youtube' || p === 'telegram';
};

