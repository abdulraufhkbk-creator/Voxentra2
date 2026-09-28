import React from 'react';
import { RiskLevel } from '../../types/analysis';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  className = '',
  showIcon = true,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 font-bold tracking-wider uppercase',
    md: 'text-xs px-2.5 py-1 font-bold tracking-wider uppercase',
    lg: 'text-xs px-3.5 py-1.5 font-extrabold tracking-widest uppercase',
  };

  const iconSizes = {
    sm: 11,
    md: 13,
    lg: 15,
  };

  if (level === 'HIGH') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border border-[#111111]/20 bg-[#111111] text-[#F8F5EF] shadow-sm ${sizeClasses[size]} ${className}`}
      >
        {showIcon && <ShieldAlert size={iconSizes[size]} className="text-[#F8F5EF] shrink-0" />}
        <span>RISK · HIGH</span>
      </span>
    );
  }

  if (level === 'CAUTION') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border border-[#9A6B2F]/40 bg-[#FAF3E8] text-[#845318] shadow-sm ${sizeClasses[size]} ${className}`}
      >
        {showIcon && <AlertTriangle size={iconSizes[size]} className="text-[#9A6B2F] shrink-0" />}
        <span>RISK · CAUTION</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-[#2D6A4F]/30 bg-[#EDF6F1] text-[#1B4332] shadow-sm ${sizeClasses[size]} ${className}`}
    >
      {showIcon && <ShieldCheck size={iconSizes[size]} className="text-[#2D6A4F] shrink-0" />}
      <span>RISK · LOW</span>
    </span>
  );
};
