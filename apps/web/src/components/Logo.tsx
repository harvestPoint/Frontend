interface LogoProps {
  size?: number;
  showText?: boolean;
  textColor?: string;
  className?: string;
}

export default function Logo({ size = 36, showText = true, textColor, className }: LogoProps) {
  return (
    <div className={className} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
      {/* Ícone Vetorial HarvestPoint: Folha de Safra + Ponto Radar IoT */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0, borderRadius: '12px' }}
      >
        <rect width="40" height="40" rx="12" fill="#E7EFE7" />
        {/* Folha principal */}
        <path
          d="M20 10C20 10 27 12 27 20C27 25 23 29 20 30C17 29 13 25 13 20C13 12 20 10 20 10Z"
          fill="#6B8F71"
        />
        {/* Nervura central / haste */}
        <path
          d="M20 14V27"
          stroke="#E7EFE7"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        {/* Ponto de precisão / radar de telemetria IoT */}
        <circle cx="20" cy="18" r="2.2" fill="#FFFFFF" />
        <circle cx="20" cy="18" r="4.2" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.6" strokeDasharray="2 2" />
        {/* Pequeno broto lateral de crescimento */}
        <path
          d="M20 22C22.5 20.5 24 19 24 19"
          stroke="#B9D0BC"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>

      {showText && (
        <div style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: size > 32 ? '17px' : '15px', fontWeight: 800, letterSpacing: '-.02em', lineHeight: 1.1 }}>
          <span style={{ color: textColor || 'var(--hp-text)' }}>Harvest</span>
          <span style={{ color: '#6B8F71' }}>Point</span>
        </div>
      )}
    </div>
  );
}
