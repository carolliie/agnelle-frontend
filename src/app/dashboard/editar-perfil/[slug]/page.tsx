"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { EditProfileForm } from "@/components/edit-profile-form";

export default function EditarPerfil() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const token = localStorage.getItem("authToken");

                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`,
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                        },
                    }
                );

                setProfile(response.data);
            } catch (err) {
                console.error("Erro ao carregar perfil:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center gap-4">
                <Skeleton className="w-48 h-6 rounded-lg" />
                <Skeleton className="w-72 h-8 rounded-lg" />
                <Skeleton className="w-72 h-8 rounded-lg" />
                <Skeleton className="w-72 h-8 rounded-lg" />
            </div>
        );
    }

    if (error) {
        return <p className="text-red-500 text-center">Erro ao carregar o perfil. Tente novamente mais tarde.</p>;
    }

    return (
        <div className="max-w-lg mx-auto">
            {profile ? <EditProfileForm profile={profile} /> : <p>Perfil não encontrado.</p>}
        </div>
    );
}
