export default function Footer() {
    return (
        <footer className="mt-auto flex shrink-0 flex-col items-center justify-between gap-4 border-t border-[#1f2023]/60 bg-[#1e1f22] px-6 py-8 text-center text-xs text-[#949ba4] select-none sm:flex-row md:px-16">
            <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-[#5865f2] text-white">
                    <span className="text-xs font-black">L</span>
                </div>
                <span className="font-bold text-white">LvdCord</span>
            </div>
            <span>
                © 2026 LvdCord. Все права защищены. Разработано с использованием LiveKit SFU.
            </span>
        </footer>
    );
}
