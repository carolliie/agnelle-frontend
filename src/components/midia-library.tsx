"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

interface BibliotecaMidiasProps {
    onImageSelect: (imageUrls: string[]) => void;
    singleSelect?: boolean,
}

export default function BibliotecaMidias({ onImageSelect }: BibliotecaMidiasProps) {
    const [midias, setMidias] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);

    useEffect(() => {
        const fetchMidias = async () => {
            try {
                const token = localStorage.getItem("authToken");

                const response = await axios.get<string[]>(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/images`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
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
        };

        fetchMidias();
    }, []);

    useEffect(() => {
        onImageSelect(selectedImages);
    }, [selectedImages, onImageSelect]);

    const handleToggle = (imageUrl: string) => {
        setSelectedImages((prevSelected) => {
            const updated = prevSelected.includes(imageUrl)
                ? prevSelected.filter((url) => url !== imageUrl)
                : [...prevSelected, imageUrl];

            setTimeout(() => onImageSelect(updated), 0);

            return updated;
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
        return <p className="text-red-500 text-center">Erro ao carregar as imagens.</p>;
    }

    return (
        <div className="grid grid-cols-3 gap-4">
            {midias.length > 0 ? (
                midias.map((media, index) => {
                    const isSelected = selectedImages.includes(media);

                    return (
                        <div
                            key={media}
                            className={`relative w-48 h-48 bg-gray-200 rounded-lg shadow-md overflow-hidden cursor-pointer border-2 ${isSelected ? "border-blue-500" : "border-transparent"
                                }`}
                            onClick={() => handleToggle(media)}
                        >
                            <Image
                                src={media}
                                alt={`Imagem ${index}`}
                                width={200}
                                height={200}
                                className="object-cover w-full h-full"
                            />
                            <div
                                className="absolute top-2 right-2"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Checkbox
                                    checked={isSelected}
                                    onCheckedChange={() => handleToggle(media)}
                                />
                            </div>
                        </div>
                    );
                })
            ) : (
                <p className="text-center text-gray-500 col-span-3">Nenhuma imagem encontrada.</p>
            )}
        </div>
    );
}
