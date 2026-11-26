import { cn } from '@/lib/utils'

/** TalentBridge mark: three rising bars, recreated from the brand logo as SVG. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 56"
      className={cn('h-7 w-auto', className)}
      aria-hidden="true"
      focusable="false"
    >
      <g strokeLinecap="round" strokeWidth="7.5">
        <line x1="8" y1="38" x2="14" y2="24" className="stroke-brand-sage" />
        <line x1="18" y1="44" x2="29" y2="8" className="stroke-brand-deep" />
        <line x1="28" y1="50" x2="36" y2="30" className="stroke-brand-sage" />
      </g>
    </svg>
  )
}

export function Logo({
  className,
  inverted = false,
}: {
  className?: string
  inverted?: boolean
}) {
  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      <LogoMark />
      <span
        className={cn(
          'font-display text-xl font-bold tracking-tight',
          inverted ? 'text-white' : 'text-brand-deep',
        )}
      >
        Talent<span className="text-brand-sage">Bridge</span>
      </span>
    </span>
  )
}
