export default function FriendsActivities() {
    return (
        <div className="hidden flex-col border-l border-[#1f2023]/30 bg-[#313338] p-6 md:col-span-1 md:flex">
            <h3 className="mb-4 text-sm font-bold text-white">Активные сейчас</h3>
            <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-[#3f4147]/40 p-4 text-center">
                <p className="mb-1 text-sm font-bold text-[#f2f3f5]">Здесь пока тихо...</p>
                <p className="text-xs text-[#949ba4]">
                    Как только функция будет готова - мы покажем ее тут!
                </p>
            </div>
        </div>
    );
}
