import { Check, X } from 'lucide-react';

interface IProps {
    displayName: string;
    acceptRequest: () => void;
    declineOrRemove: () => void;
}

export default function PendingRequest({ displayName, acceptRequest, declineOrRemove }: IProps) {
    return (
        <div className="group flex items-center justify-between rounded p-2.5 transition-all hover:bg-[#35363c]/40">
            <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#5865f2] text-sm font-bold text-white">
                    {displayName.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-white">{displayName}</span>
                    <span className="text-xs text-[#949ba4]">Входящий запрос</span>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={acceptRequest}
                    className="cursor-pointer rounded-full bg-[#2b2d31] p-2 text-[#23a55a] transition-colors hover:bg-[#23a55a] hover:text-white"
                    title="Принять запрос"
                >
                    <Check className="h-4 w-4" />
                </button>
                <button
                    onClick={declineOrRemove}
                    className="cursor-pointer rounded-full bg-[#2b2d31] p-2 text-[#f23f43] transition-colors hover:bg-[#f23f43] hover:text-white"
                    title="Отклонить запрос"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
