import { ArrowLeft, Users } from 'lucide-react';

export default function WelcomeScreen() {
    return (
        <div className="flex h-full flex-1 flex-col items-center justify-center bg-[#313338] px-4 select-none">
            <div className="flex max-w-110 flex-col items-center text-center">
                <div className="mb-6 flex h-30 w-30 items-center justify-center rounded-full bg-[#2b2d31] text-[#80848e] shadow-inner">
                    <Users className="h-16 w-16 stroke-[1.5]" />
                </div>

                <h3 className="mb-2 text-xl font-bold tracking-wide text-[#f2f3f5]">
                    Здесь пока пусто
                </h3>

                <p className="text-sm leading-relaxed font-medium text-[#949ba4]">
                    Выберите текстовый или голосовой канал на панели слева, чтобы начать общение с
                    друзьями!
                </p>

                <div className="mt-8 flex items-center gap-2 rounded bg-[#2b2d31] px-4 py-2 text-xs font-semibold tracking-wider text-[#b5bac1] uppercase">
                    <ArrowLeft size={16} /> Выберите канал
                </div>
            </div>
        </div>
    );
}
