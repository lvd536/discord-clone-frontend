'use client';

import { useSyncExternalStore } from 'react';

import { createPortal } from 'react-dom';

const emptySubscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export default function VoiceStatusPortal({ children }: { children: React.ReactNode }) {
    const isMounted = useSyncExternalStore(emptySubscribe, clientSnapshot, serverSnapshot);

    if (!isMounted) return null;

    const target = document.getElementById('voice-status-sidebar-target');
    if (!target) return null;

    return createPortal(children, target);
}
