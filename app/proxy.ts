import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const response = NextResponse.next();

    const accessToken = request.cookies.get('access_token')?.value;
    const hasRefreshToken = request.cookies.get('refresh_token')?.value;

    const isAuthRoute = pathname.startsWith('/auth');
    const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/profile');

    if (isProtectedRoute && !accessToken && !hasRefreshToken) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
    if (hasRefreshToken && accessToken && isAuthRoute) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (!accessToken && hasRefreshToken) {
        try {
            const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Cookie: `refresh_token=${hasRefreshToken}`,
                },
            });

            if (!refreshRes.ok) {
                throw new Error('Не удалось обновить токен в proxy');
            }

            const refreshData = await refreshRes.json();

            const setCookieHeader = refreshRes.headers.get('set-cookie');
            if (setCookieHeader) {
                response.headers.append('Set-Cookie', setCookieHeader);
            }

            const newAccessToken = refreshData.access_token;
            if (newAccessToken) {
                const requestHeaders = new Headers(request.headers);
                let cookieHeader = requestHeaders.get('cookie') || '';
                cookieHeader = `access_token=${newAccessToken}; ${cookieHeader}`;
                requestHeaders.set('cookie', cookieHeader);

                const responseWithHeaders = NextResponse.next({
                    request: {
                        headers: requestHeaders,
                    },
                });

                responseWithHeaders.cookies.set('access_token', newAccessToken, {
                    path: '/',
                    maxAge: 15 * 60,
                    sameSite: 'lax',
                });

                const setCookieHeader = refreshRes.headers.get('set-cookie');
                if (setCookieHeader) {
                    responseWithHeaders.headers.append('Set-Cookie', setCookieHeader);
                }

                return responseWithHeaders;
            }

            return response;
        } catch (error) {
            const loginResponse = NextResponse.redirect(new URL('/login', request.url));
            loginResponse.cookies.delete('access_token');
            loginResponse.cookies.delete('refresh_token');
            return loginResponse;
        }
    }

    return response;
}

export const config = {
    matcher: [
        '/auth/:path*',
        '/dashboard/:path*',
        '/profile/:path*',
        '/((?!_next/static|_next/image|favicon.ico|api).*)',
    ],
};
