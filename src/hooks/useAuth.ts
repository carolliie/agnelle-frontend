"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface User {
    id: number;
    username: string;
    email: string;
    role: string;
    profilePicture: string;
    slug: string;
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("authToken");
            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    withCredentials: true
                });
                setUser(response.data);
            } catch (error) {
                console.error("Erro ao verificar autenticação:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
                { email, password },
                { withCredentials: true }
            );

            const token = response.data.token;
            localStorage.setItem("authToken", token);
            router.push("/dashboard");
        } catch (error) {
            console.error("Erro ao fazer login", error);
        }
    };

    const logout = async () => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`, {}, { withCredentials: true });
            localStorage.removeItem("authToken");
            setUser(null);
            router.push("/login");
        } catch (error) {
            console.error("Erro ao sair", error);
        }
    };

    return { user, loading, login, logout };
}
