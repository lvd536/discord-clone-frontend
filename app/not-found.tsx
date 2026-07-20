import { redirect } from 'next/navigation';

import { ROUTES } from '@/constants/route.constants';

export default function NotFoundPage() {
    return redirect(ROUTES.DASHBOARD.BASE);
}
