"use client"

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import EditCategoryForm from "@/components/edit-category-form";

interface Categoria {
    name: string;
    image: string;
    categorySlug: string;
    date: Date;
}

export default function EditarCategoriaPagina() {
    const params = useParams();
    const slug = params?.slug as string;
    const [category, setCategory] = useState<Categoria>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function fetchCategory() {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories/${slug}`);
                setCategory(response.data);
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }
        fetchCategory();
    }, [slug]);

    if (loading) return <Skeleton className="w-[100px] h-[20px] rounded-full" />;
    if (error) return <p>Erro ao carregar a publicação.</p>

    return (
        <div>
            <EditCategoryForm categorySlug={slug} />
        </div>
    )
}
