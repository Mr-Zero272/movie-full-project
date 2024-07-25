import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';

function DropdownMenuSeparator() {
    return <div role="separator" aria-orientation="horizontal" className="-mx-1 my-1 h-px bg-muted"></div>;
}

type DropdownMenuProps = React.PropsWithChildren<{
    className?: string;
    title: string;
    onOutSideClick: () => void;
}>;

function DropdownMenu({ className = '', title, children, onOutSideClick }: DropdownMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);
    const classes = cn(
        'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        { [className]: className },
    );
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onOutSideClick();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div ref={menuRef} role="menu" className={classes} tabIndex={-1} data-orientation="vertical">
            {title && (
                <>
                    <div className="px-2 py-1.5 text-sm font-semibold">{title}</div>
                    <DropdownMenuSeparator />
                </>
            )}

            {children}
        </div>
    );
}

type DropdownMenuItemProps = React.PropsWithChildren<{
    isFocused: boolean;
}>;

function DropdownMenuItem({ isFocused, children }: DropdownMenuItemProps) {
    return (
        <div
            role="menuitem"
            className={cn(
                'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                { 'bg-accent text-accent-foreground': isFocused },
            )}
            tabIndex={-1}
            data-orientation="vertical"
            data-radix-collection-item=""
        >
            {children}
        </div>
    );
}

export { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator };
