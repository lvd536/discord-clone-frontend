"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api/api";

export default function TokenVerify() {
    const params = useParams();
    const router = useRouter();
    const token = params?.token as string;

    const [status, setStatus] = useState<"loading" | "success" | "error">(
        "loading",
    );
    const [message, setMessage] = useState("Проверяем ваш токен...");

    useEffect(() => {
        if (!token) return;

        const verifyEmail = async () => {
            try {
                const response = await api.post(`/auth/verify?token=${token}`);

                const data = await response.data;

                setStatus("success");
                setMessage(data.message || "Аккаунт успешно подтвержден!");
                setTimeout(() => {
                    router.push("/auth/login");
                }, 5000);
            } catch (err) {
                setStatus("error");
                setMessage("Произошла ошибка при соединении с сервером.");
                console.log(err);
            }
        };

        verifyEmail();
    }, [token, router]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 font-sans text-gray-900">
            <div className="w-full max-width-[450px] max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
                <div className="mb-6 text-2xl font-bold text-indigo-600">
                    ⚡️ LvdAuth
                </div>

                <div className="mb-6 flex justify-center">
                    {status === "loading" && (
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
                    )}
                    {status === "success" && (
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
                            <svg
                                className="h-8 w-8"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2.5}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                    )}
                    {status === "error" && (
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
                            <svg
                                className="h-8 w-8"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2.5}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </div>
                    )}
                </div>

                <h1 className="text-xl font-semibold text-gray-900 mb-2">
                    {status === "loading" && "Подтверждение почты"}
                    {status === "success" && "Успешно!"}
                    {status === "error" && "Ошибка верификации"}
                </h1>

                <p className="text-sm text-gray-500 leading-relaxed mb-6">
                    {message}
                </p>

                {status === "success" && (
                    <p className="text-xs text-gray-400 animate-pulse">
                        Перенаправление на страницу входа...
                    </p>
                )}

                {status === "error" && (
                    <button
                        onClick={() => router.push("/auth/register")}
                        className="inline-block w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-100 hover:bg-indigo-700 transition"
                    >
                        Вернуться к регистрации
                    </button>
                )}
            </div>
        </div>
    );
}
