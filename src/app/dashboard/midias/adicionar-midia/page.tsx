"use client"

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useState } from "react";
import { toast } from "@/hooks/use-toast"; 
import { Button } from "@/components/ui/button";

export default function AdicionarMidia() {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [error, setError] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            setSelectedImage(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedImage) {
            setError(true);
            toast({
                title: "❌ Erro",
                description: "Por favor, selecione uma imagem para enviar.",
            });
            return;
        }

        try {
            const token = localStorage.getItem("authToken");
            const formData = new FormData();
            formData.append("file", selectedImage);

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/images/upload`,
                formData,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.data) {
                toast({
                    title: "✅ Sucesso",
                    description: "Imagem carregada com sucesso!",
                });
            }
        } catch (err) {
            console.error("Erro ao enviar imagem:", err);
            toast({
                title: "❌ Erro ao enviar imagem",
                description: "Esta imagem já existe. Tente novamente.",
            });
            setError(true);
        }
    };

    return (
        <div className="w-fit mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="picture">Selecione a Imagem</Label>
                    <Input
                        id="picture"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>
                {error && !selectedImage && (
                    <p className="text-red-500 text-sm">Por favor, selecione uma imagem.</p>
                )}
                <div>
                    <Button type="submit">Enviar Imagem</Button>
                </div>
            </form>
        </div>
    );
}
