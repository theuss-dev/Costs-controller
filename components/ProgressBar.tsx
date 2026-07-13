import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

export default function ProgressBar({ current, total, className }: ProgressBarProps) {
  const percentage = Math.min(Math.max((current / total) * 100, 0), 100);
  
  // Decide a cor baseada na porcentagem gasta
  const isNearLimit = percentage >= 85;
  const isOverLimit = percentage >= 100;

  return (
    <div className={cn("w-full flex flex-col gap-2", className)}>
      <div className="flex justify-between items-end text-sm">
        <div className="flex flex-col">
          <span className="text-neutral-400 text-xs uppercase tracking-wider font-semibold">Gasto Mensal</span>
          <span className="text-white font-bold tracking-tight">R$ {current.toFixed(2).replace('.', ',')}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-neutral-500 text-xs">Teto (R$ 300 cada)</span>
          <span className="text-neutral-400 font-medium tracking-tight">R$ {total.toFixed(2).replace('.', ',')}</span>
        </div>
      </div>
      
      <div className="h-3 w-full bg-neutral-900 rounded-full overflow-hidden border border-white/5">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-1000 ease-out",
            isOverLimit 
              ? "bg-red-500" 
              : isNearLimit 
                ? "bg-gradient-to-r from-orange-500 to-red-500" 
                : "bg-gradient-to-r from-orange-400 to-orange-500"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <div className="flex justify-between items-center text-[11px] font-medium mt-0.5">
        <span className={cn(
          isOverLimit ? "text-red-400" : isNearLimit ? "text-orange-400" : "text-neutral-500"
        )}>
          {percentage.toFixed(0)}% utilizado
        </span>
        <span className="text-neutral-500">
          Restante: R$ {Math.max(total - current, 0).toFixed(2).replace('.', ',')}
        </span>
      </div>
    </div>
  );
}
