"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface Profile {
  id: number;
  username: string;
  email: string;
  role: string;
  profilePicture: string | null;
  slug: string;
  bio: string | null;
}

export default function Usuarios() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("authToken");

        if (!token) {
          setError("Token de autenticação não encontrado");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data && Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          setError("Formato de dados inválido");
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
          console.error("Erro ao buscar usuários", error.response);
          if (error.response.status === 403) {
            setError("Acesso negado. Verifique seu token de autenticação.");
          } else {
            setError("Falha ao carregar usuários.");
          }
      
          toast({
            title: "❌ Erro",
            description: error.response.data?.message || "Não foi possível carregar os usuários",
            variant: "destructive",
          });
        } else {
          setError("Erro desconhecido.");
      
          toast({
            title: "❌ Erro",
            description: "Não foi possível carregar os usuários",
            variant: "destructive",
          });
        }
      }
      
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-2">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-3 w-[150px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        {error}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        Nenhum usuário encontrado
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {users.map((user) => (
        <div
          key={user.id}
          className="flex items-center gap-3 p-2 hover:bg-[#ffffff1a] rounded-lg transition-colors"
        >
          <Avatar className="h-10 w-10 rounded-lg border">
            {user.profilePicture ? (
              <AvatarImage
                src={user.profilePicture}
                alt={user.username}
                className="object-cover"
              />
            ) : (
              <AvatarFallback className="rounded-lg bg-gray-200">
                {user.username?.[0]?.toUpperCase() ?? "U"}
              </AvatarFallback>
            )}
          </Avatar>

          <div className="flex-1 min-w-0">
            <p className="truncate font-medium text-sm">
              {user.username || "Usuário sem nome"}
            </p>
            <p className="truncate text-xs text-gray-600">
              {user.email || "Sem email cadastrado"}
            </p>
            {user.role && (
              <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
                {user.role}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
