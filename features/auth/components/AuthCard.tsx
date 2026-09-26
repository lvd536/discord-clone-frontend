import OAuthProviders from './OAuthProviders';

interface AuthCardProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}

export default function AuthCard({ title, subtitle, children }: AuthCardProps) {
    return (
        <div className="mt-10 w-full max-w-120 rounded-lg border border-[#1f2023]/60 bg-[#313338] p-8 text-white shadow-2xl">
            <div className="mb-6 space-y-1 text-center select-none">
                <h2 className="text-2xl font-bold tracking-tight text-white">{title}</h2>
                {subtitle && <p className="text-sm text-[#949ba4]">{subtitle}</p>}
            </div>

            <OAuthProviders />

            {children}
        </div>
    );
}
