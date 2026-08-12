import type { ReactNode } from "react";

export function Table({ children }: { 
  children: ReactNode 
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-line bg-surface">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  );
}

export function TableHead({ children }: { 
  children: ReactNode
}) {
  return <thead className="bg-paper text-left text-xs font-medium uppercase text-ink-muted">{children}</thead>;
}

export function TableRow({children, className = "", onClick,}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <tr
      className={`border-t border-line ${className}`}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

export function TableCell({ children, className = "" }: { 
  children: ReactNode; 
  className?: string 
}) {
  return <td className={`px-4 py-3 text-ink-body ${className}`}>{children}</td>;
}

export function TableHeaderCell({ children, className = "" }: { 
  children: ReactNode; 
  className?: string 
}) {
  return <th className={`px-4 py-3 font-medium ${className}`}>{children}</th>;
}
