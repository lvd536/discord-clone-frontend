import AppPreview from '@/features/home/components/AppPreview';
import Footer from '@/features/home/components/Footer';
import HomeHeader from '@/features/home/components/HomeHeader';
import YourCompany from '@/features/home/components/YourCompany';
import YourSpace from '@/features/home/components/YourSpace';

export default function Home() {
    return (
        <div className="flex min-h-screen w-full flex-col overflow-x-hidden bg-[#1e1f22] font-sans text-[#dbdee1] selection:bg-[#5865f2]/30">
            <HomeHeader />

            <YourSpace />

            <AppPreview />

            <YourCompany />

            <Footer />
        </div>
    );
}
