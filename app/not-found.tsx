import { redirect } from 'next/navigation';

import { ROUTES } from '@/features/shared/constants/route.constants';

export default function NotFoundPage() {
    return redirect(ROUTES.DASHBOARD.BASE);
}
