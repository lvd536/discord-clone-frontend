'use client';

import { useSyncExternalStore } from 'react';

import { createPortal } from 'react-dom';

const emptySubscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export default function UserVoiceControlsPortal({ children }: { children: React.ReactNode }) {
    const isMounted = useSyncExternalStore(emptySubscribe, clientSnapshot, serverSnapshot);

    if (!isMounted) return null;

    const target = document.getElementById('voice-controls-target');
    if (!target) return null;

    return createPortal(children, target);
}
