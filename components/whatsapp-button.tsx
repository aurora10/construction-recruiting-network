import Link from 'next/link';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  compact?: boolean;
}

export default function WhatsAppButton({ phoneNumber = "32465811031", compact = false }: WhatsAppButtonProps) {
  return (
    <Link 
        href={`https://wa.me/${phoneNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 bg-[#e9f7ee] hover:bg-[#d9f0e0] transition-colors px-3.5 py-2 rounded-md border border-transparent"
      >
        {/* WhatsApp Custom SVG Logo (Green Circle + White Phone) */}
        <div className="shrink-0">
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
            <circle cx="12" cy="12" r="12" fill="#25D366" />
            <path d="M12 4C7.58172 4 4 7.58172 4 12C4 13.5935 4.48182 15.078 5.29868 16.3243L3.95255 20.0474L7.67558 18.7013C8.92198 19.5182 10.4065 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4Z" fill="#25D366" />
            <path d="M16.8556 14.382C16.5586 14.233 15.0976 13.515 14.8306 13.401C14.5636 13.287 14.3656 13.248 14.0986 13.515C13.8316 13.782 13.0116 14.456 12.7746 14.642C12.5376 14.828 12.3486 14.858 12.0516 14.708C11.7546 14.558 10.5426 14.108 9.3916 12.86C8.5086 11.907 7.9076 10.747 7.7356 10.45C7.5626 10.153 7.7176 9.999 7.9266 9.85C8.1166 9.715 8.3416 9.45 8.4786 9.262C8.6166 9.075 8.6666 8.956 8.7656 8.75C8.8646 8.544 8.8156 8.371 8.7296 8.222C8.6436 8.073 8.0446 6.605 7.7986 6.06C7.5576 5.525 7.3126 5.609 7.1266 5.599C6.9516 5.591 6.7546 5.59 6.5556 5.59C6.3566 5.59 6.0346 5.664 5.7626 5.931C5.4906 6.198 4.7206 6.934 4.7206 8.434C4.7206 9.934 5.7856 11.391 5.9336 11.59C6.0816 11.789 7.9956 14.79 10.9756 16.077C11.6846 16.383 12.2376 16.566 12.6696 16.702C13.3816 16.929 14.0296 16.897 14.5396 16.82C15.1116 16.735 16.2976 16.101 16.5456 15.407C16.7936 14.713 16.7936 14.118 16.7436 13.994C16.6946 13.87 16.6466 13.882 16.8556 14.382Z" fill="white" />
          </svg>
        </div>

        {/* Text Content */}
        <div className={`flex ${compact ? 'flex-row items-center gap-1.5' : 'flex-col'}`}>
          <span className="text-[14px] leading-[1.1] font-bold text-[#1e1e1e]">
            WhatsApp
          </span>
          {!compact && (
            <span className="flex items-center gap-[3px] text-[10px] leading-[1.1] font-medium text-[#00a65a] mt-0.5">
              <span className="w-[5px] h-[5px] rounded-full bg-[#00a65a] shrink-0"></span>
              Replies in minutes
            </span>
          )}
        </div>
    </Link>
  );
}