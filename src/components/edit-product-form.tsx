"use client";

import { useCallback, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { Checkbox } from "./ui/checkbox";
import BibliotecaMidias from "./midia-library";

const FormSchema = z.object({
    name: z.string().min(2, {
        message: "Título deve possuir pelo menos 2 caracteres.",
    }),
    size: z.string().min(2, {
        message: "Tamanho deve possuir pelo menos 2 caracteres.",
    }),
    price: z.string().min(2, {
        message: "Preço deve possuir pelo menos 2 caracteres.",
    }),
    images: z.array(z.string()).nonempty({
        message: "Deve existir pelo menos uma imagem.",
    }),
    categories: z.array(z.string())
});

export function EditProductForm({ productSlug }: { productSlug: any }) {
    const [categories, setCategories] = useState<{ id: string; name: string; categorySlug: string }[]>([]);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            size: "",
            price: "",
            images: [],
            categories: [],
        },
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories`);
                setCategories(response.data);
            } catch (error) {
                console.error("Erro ao buscar categorias:", error);
                toast({
                    title: "❌ Erro ao carregar categorias",
                    description: "Não foi possível carregar as categorias disponíveis.",
                });
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/${productSlug}`);
                const product = response.data;

                form.setValue("name", product.name);
                form.setValue("size", product.size);
                form.setValue("price", product.price);
                form.setValue("images", product.images);
                form.setValue("categories", product.categories.map((category: any) => category.categorySlug));

                setSelectedImages(product.images);
            } catch (error) {
                console.error("Erro ao carregar produto:", error);
                toast({
                    title: "❌ Erro ao carregar o produto",
                    description: "Não foi possível carregar o produto para edição.",
                });
            }
        };
        fetchProduct();
    }, [productSlug, form]);

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        const formattedCategories = data.categories.map((slug: string) => {
            return slug;
          });
          

        try {
            const productData = {
                name: data.name,
                size: data.size,
                price: parseFloat(data.price),
                images: selectedImages.map(img => encodeURI(img)),
                categories: formattedCategories,
            };

            const token = localStorage.getItem("authToken");

            await axios.patch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/edit/${productSlug}`,
                productData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                }
            );

            toast({
                title: "✅ Produto atualizado com sucesso!",
                description: `O produto foi atualizado com as categorias: ${data.categories.join(", ")}`,
            });

            form.reset();
            setSelectedImages([]);
        } catch (error) {
            console.error("Erro ao enviar produto:", error);
            toast({
                title: "❌ Erro ao atualizar produto.",
                description: "Tente novamente mais tarde.",
            });
        }
    };

    const handleImageSelect = useCallback((images: string[]) => {
        setSelectedImages(images);
        form.setValue('images', images as [string, ...string[]]);
    }, [form]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-fit space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Título</FormLabel>
                            <FormControl>
                                <Input placeholder="Digite um título..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="size"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tamanho</FormLabel>
                            <FormControl>
                                <Input placeholder="Digite o tamanho..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Preço</FormLabel>
                            <FormControl>
                                <Input placeholder="Digite o preço..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Imagens do Produto</FormLabel>
                            <FormControl>
                                <BibliotecaMidias onImageSelect={handleImageSelect} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="categories"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Categorias</FormLabel>
                            <FormDescription>Selecione as categorias para o produto</FormDescription>
                            <div className="space-y-2">
                                {categories.map((category, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value?.includes(category.categorySlug)}
                                                onCheckedChange={(checked) => {
                                                    const currentValues = field.value || [];
                                                    if (checked) {
                                                        field.onChange([...currentValues, category.categorySlug]);
                                                    } else {
                                                        field.onChange(currentValues.filter((value) => value !== category.categorySlug));
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                        <FormLabel className="text-sm font-medium leading-none">
                                            {category.name}
                                        </FormLabel>
                                    </div>
                                ))}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit">Publicar</Button>
            </form>
        </Form>
    );
}
