interface IProps {
    friendEmailInput: string;
    loading: boolean;
    handleAddFriend: (e: React.FormEvent) => Promise<void>;
    setFriendEmailInput: (state: string) => void;
}

export default function FriendsAddTab({
    friendEmailInput,
    loading,
    handleAddFriend,
    setFriendEmailInput,
}: IProps) {
    return (
        <div className="flex-1 space-y-6 p-6">
            <div className="space-y-1">
                <h2 className="text-sm font-bold tracking-wider text-white uppercase">
                    Добавить в друзья
                </h2>
                <p className="text-xs text-[#949ba4]">
                    Вы можете добавить друга, введя его уникальный идентификатор пользователя (ID).
                </p>
            </div>

            <form
                onSubmit={handleAddFriend}
                className="relative flex items-center rounded-lg border border-black/40 bg-[#1e1f22] px-4 py-3"
            >
                <input
                    type="text"
                    value={friendEmailInput}
                    onChange={(e) => setFriendEmailInput(e.target.value)}
                    placeholder="Введите ID пользователя (например: cmrkuqkbf0000p9sb53f0e5ea)"
                    className="w-full bg-transparent text-sm text-[#dbdee1] placeholder-[#4e5058] focus:outline-none"
                    disabled={loading}
                />
                <button
                    type="submit"
                    disabled={loading || !friendEmailInput.trim()}
                    className="absolute right-2 cursor-pointer rounded bg-[#5865f2] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#4752c4] disabled:opacity-40"
                >
                    {loading ? 'Отправка...' : 'Отправить запрос'}
                </button>
            </form>
        </div>
    );
}
