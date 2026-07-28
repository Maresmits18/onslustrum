import type { ReactNode } from "react";

interface MemberHeaderProps {
  title: string;
  subtitle?: string;
  /** Optional trailing slot, e.g. the notification bell */
  action?: ReactNode;
  /** Optional leading slot, e.g. the club avatar */
  leading?: ReactNode;
}

/**
 * One header for every bottom-tab destination.
 * Tab roots never show a back arrow — that pattern is reserved for pushed detail views.
 */
const MemberHeader = ({ title, subtitle, action, leading }: MemberHeaderProps) => (
  <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-md border-b border-border safe-area-top">
    <div className="flex items-center justify-between gap-3 px-5 h-14">
      <div className="flex items-center gap-3 min-w-0">
        {leading}
        <div className="min-w-0">
          <h1 className="font-display font-bold text-foreground text-base leading-tight truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[11px] text-muted-foreground truncate">{subtitle}</p>
          )}
        </div>
      </div>
      {action}
    </div>
  </header>
);

export default MemberHeader;