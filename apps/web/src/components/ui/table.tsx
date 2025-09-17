import * as React from "react";

export function Table({ children, className }: React.PropsWithChildren<{ className?: string }>)
{
    return (
        <div className={"w-full overflow-x-auto " + (className ?? "")}>
            <table className="w-full text-sm text-left border-collapse">{children}</table>
        </div>
    );
}

export function THead({ children }: React.PropsWithChildren)
{
    return <thead className="bg-muted/50 text-muted-foreground">{children}</thead>;
}

export function TBody({ children }: React.PropsWithChildren)
{
    return <tbody className="divide-y">{children}</tbody>;
}

export function TR({ children }: React.PropsWithChildren)
{
    return <tr className="hover:bg-muted/30">{children}</tr>;
}

export function TH({ children }: React.PropsWithChildren)
{
    return <th className="px-3 py-2 font-medium">{children}</th>;
}

export function TD({ children }: React.PropsWithChildren)
{
    return <td className="px-3 py-2">{children}</td>;
}
