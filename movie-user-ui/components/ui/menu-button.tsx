'use client';
import React from 'react';
import { motion, useCycle } from 'framer-motion';
import { cn } from '@/lib/utils';

type PathProps = React.ComponentPropsWithoutRef<typeof motion.path>;

const Path = (props: PathProps) => (
    <motion.path fill="transparent" strokeWidth="3" stroke="hsl(0, 0%, 18%)" strokeLinecap="round" {...props} />
);

type Props = {
    className?: string;
};

function MenuButton({ className }: Props) {
    const [isOpen, toggleOpen] = useCycle('closed', 'open');
    return (
        <motion.button
            initial={false}
            animate={isOpen}
            className={cn('cursor-pointer border-none outline-none', {
                [className as string]: className,
            })}
            onClick={() => toggleOpen()}
        >
            <svg className="flex flex-col items-center justify-center" width="23" height="23" viewBox="0 0 23 23">
                <Path
                    variants={{
                        closed: { d: 'M 2 2.5 L 20 2.5' },
                        open: { d: 'M 3 16.5 L 17 2.5' },
                    }}
                />
                <Path
                    d="M 2 9.423 L 20 9.423"
                    variants={{
                        closed: { opacity: 1 },
                        open: { opacity: 0 },
                    }}
                    transition={{ duration: 0.1 }}
                />
                <Path
                    variants={{
                        closed: { d: 'M 2 16.346 L 20 16.346' },
                        open: { d: 'M 3 2.5 L 17 16.346' },
                    }}
                />
            </svg>
        </motion.button>
    );
}

export default MenuButton;
