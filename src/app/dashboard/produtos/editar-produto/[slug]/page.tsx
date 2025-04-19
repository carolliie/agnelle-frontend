"use client"

import { useEffect, useState } from "react";
import axios from "axios";
import { EditProductForm } from "@/components/edit-product-form";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

interface Product {
    name: string;
    size: string;
    price: string;
    images: string[];
    categories: string[];
    slug: string;
}

export default function EditarProduct() {
    const params = useParams();
    const slug = params?.slug ?? "";
    const [product, setProduct] = useState<Product>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {

        async function fetchProduct() {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/${slug}`);
                setProduct(response.data);
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }
        fetchProduct();
    }, [slug]);

    if (loading) return <Skeleton className="w-[100px] h-[20px] rounded-full" />;
    if (error) return <p>Erro ao carregar a publicação.</p>


    return (
        <div>
            <EditProductForm productSlug={slug} />
        </div>
    )
}