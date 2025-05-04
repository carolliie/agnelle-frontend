"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";

export default function BibliotecaMidias() {
    const [midias, setMidias] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [imageToDelete, setImageToDelete] = useState<string | null>(null);

    useEffect(() => {
        async function fetchMidias() {
            try {
                const token = localStorage.getItem("authToken");
    
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/images`,
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                        },
                    }
                );
    
                setMidias(response.data);
            } catch (err) {
                console.error("Erro ao carregar imagens:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }
    
        fetchMidias();
    }, []);
    
    console.log(imageToDelete);

    const handleDelete = async (mediaUrl: string) => {
        try {
            const token = localStorage.getItem("authToken");
            
            let imageName = mediaUrl;
            const basePath = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/images/`;

            if (imageName.startsWith(basePath)) {
                imageName = mediaUrl.replace(basePath, '');
            }

            const encodedImageName = encodeURIComponent(imageName);

            await axios.delete(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/images/delete/${encodedImageName}`,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    }
                }
            );

            setMidias((prevMidias) => prevMidias.filter((media) => media !== mediaUrl));

            toast({
                title: "✅ Imagem excluída com sucesso!",
                description: "A imagem foi removida da biblioteca.",
            });
            setImageToDelete(null);

        } catch (error) {
            console.error("Erro ao excluir imagem:", error);
            toast({
                title: "❌ Erro ao excluir imagem.",
                description: "Tente novamente mais tarde.",
            });
        }
    };

    const cancelDelete = () => {
        setImageToDelete(null);
        toast({
            title: "❌ Exclusão cancelada.",
            description: "A imagem não foi removida.",
        });
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center gap-4">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="w-72 h-8 rounded-lg" />
                ))}
            </div>
        );
    }

    if (error) {
        return <p className="text-red-500 text-center">Erro ao carregar as imagens. Tente novamente mais tarde.</p>;
    }

    return (
        <div>
            <Link href={"/dashboard/midias/adicionar-midia"}>
                <Button className="mb-4">Adicionar imagem</Button>
            </Link>

            <div className="grid grid-cols-3 gap-4">
                {midias.length > 0 ? (
                    midias.map((media, index) => (
                        <div
                            key={index}
                            className="relative w-full h-48 bg-gray-200 rounded-lg shadow-md overflow-hidden"
                        >
                            <Image
                                src={media}
                                alt={`Imagem ${index}`}
                                width={400}
                                height={400}
                                className="object-cover w-full h-full"
                            />
                            <Button
                                onClick={() => {
                                    setImageToDelete(media);
                                    toast({
                                        title: "❌ Você deseja excluir esta imagem?",
                                        description: (
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-4 p-3 bg-gray-900 rounded-lg">
                                                    {media ? (
                                                        <Image
                                                            src={media}
                                                            alt="Preview do produto"
                                                            width={80}
                                                            height={80}
                                                            className="rounded-lg object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center">
                                                            <span className="text-white">Sem imagem</span>
                                                        </div>
                                                    )}
                                                    <div className="w-[300px]">
                                                        <h3 className="text-lg font-semibold text-white">
                                                            {media}
                                                        </h3>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between py-4">
                                                    <Button
                                                        className="bg-red-600 text-white hover:text-black"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDelete(media);
                                                        }}
                                                    >
                                                        Sim, desejo excluir
                                                    </Button>
                                                    <Button
                                                        className="bg-blue-900 text-white hover:text-black"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            cancelDelete();
                                                        }}
                                                    >
                                                        Não, prefiro cancelar
                                                    </Button>
                                                </div>
                                            </div>
                                        ),
                                        duration: Infinity,
                                    });
                                }}
                                className="absolute top-2 right-2"
                            >
                                Excluir
                            </Button>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">Nenhuma imagem encontrada.</p>
                )}
            </div>
        </div>
    );
}