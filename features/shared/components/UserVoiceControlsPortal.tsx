'use client';

import { useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';

import { createPortal } from 'react-dom';

export default function UserVoiceControlsPortal({ children }: { children: React.ReactNode }) {
    const [target, setTarget] = useState<HTMLElement | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        const findVisibleTarget = () => {
            const elements = Array.from(document.querySelectorAll('#voice-controls-target'));

            const visibleTarget =
                elements.find((el) => (el as HTMLElement).offsetParent !== null) || elements[0];

            if (visibleTarget && visibleTarget !== target) {
                setTarget(visibleTarget as HTMLElement);
            }
        };

        findVisibleTarget();

        const interval = setInterval(findVisibleTarget, 300);

        return () => clearInterval(interval);
    }, [pathname, target]);

    if (!target) return null;

    return createPortal(children, target);
}
