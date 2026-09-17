'use client';

export default function TypingIndicator({ names }: { names: string[] }) {
    if (names.length === 0) return <div className="h-6" />;

    let text = '';
    if (names.length === 1) {
        text = `${names[0]} печатает...`;
    } else if (names.length === 2) {
        text = `${names[0]} и ${names[1]} печатают...`;
    } else {
        text = 'Несколько человек печатают...';
    }

    return (
        <div className="animate-in fade-in flex items-center gap-1.5 px-4 py-1 text-xs text-[#b5bac1] duration-150 select-none">
            <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#b5bac1] [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#b5bac1] [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#b5bac1]" />
            </div>
            <span className="font-medium text-[#dbdee1]">{text}</span>
        </div>
    );
}
