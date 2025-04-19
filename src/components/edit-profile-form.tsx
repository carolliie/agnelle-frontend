"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";

const FormSchema = z.object({
    username: z.string().min(2, {
        message: "O nome de usuário deve possuir pelo menos 2 caracteres.",
    }),
    email: z.string().email({
        message: "Insira um e-mail válido.",
    }),
    password: z.string(),
    role: z.string(),
    profilePicture: z.string().url({
        message: "Insira uma URL válida para a imagem.",
    }),
    slug: z.string(),
    bio: z.string(),
});

interface Profile {
    id: number;
    username: string;
    email: string;
    role: string;
    profilePicture: string;
    slug: string;
    bio: string;
}

export function EditProfileForm({ profile }: { profile?: Profile }) {
    const router = useRouter();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: profile?.username || "",
            email: profile?.email || "",
            password: "",
            role: profile?.role || "",
            profilePicture: profile?.profilePicture || "",
            slug: profile?.slug || "",
            bio: profile?.bio || "",
        },
    });

    async function onSubmitForm(values: z.infer<typeof FormSchema>) {
        try {
            const updatedProfile = {
                username: values.username,
                email: values.email,
                password: values.password || undefined,
                role: values.role,
                profilePicture: values.profilePicture,
                slug: values.slug,
                bio: values.bio
            };

            const token = localStorage.getItem("authToken");

            if (!token) {
                toast({
                    title: "❌ Token de autenticação não encontrado.",
                    description: "Por favor, faça login novamente.",
                });
                return;
            }

            await axios.patch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/edit/${profile?.slug}`,
                updatedProfile,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );

            toast({
                title: "✅ Perfil atualizado com sucesso!",
                description: (
                    <div className="flex items-center gap-4 p-3 bg-gray-900 rounded-lg">
                        <Image
                            src={values.profilePicture}
                            alt="Imagem do perfil"
                            width={80}
                            height={80}
                            className="rounded-lg object-cover"
                        />
                        <div className="w-[300px]">
                            <h3 className="text-lg font-semibold text-white">{values.username}</h3>
                            <p className="text-sm text-gray-300">{values.email}</p>
                        </div>
                    </div>
                ),
            });

            router.push("/dashboard");
        } catch (error) {
            console.error(error);
            toast({
                title: "❌ Erro ao atualizar perfil.",
                description: "Tente novamente mais tarde.",
            });
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitForm)} className="w-2/3 space-y-6">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nome de Usuário</FormLabel>
                            <FormControl>
                                <Input placeholder="Digite seu nome de usuário..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>E-mail</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="Digite seu e-mail..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Senha</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="Digite sua nova senha..." {...field} />
                            </FormControl>
                            <FormDescription>
                                Se deseja alterar a senha, digite uma nova. Caso contrário, deixe em branco.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Cargo</FormLabel>
                            <FormControl>
                                <Input placeholder="Digite seu cargo..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="profilePicture"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Foto de Perfil</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Insira a URL da imagem..."
                                    {...field}
                                    onChange={(e) => field.onChange(e.target.value)}
                                />
                            </FormControl>
                            {field.value && (
                                <div className="mt-4">
                                    <Image
                                        src={field.value}
                                        width={200}
                                        height={200}
                                        alt="Imagem do Perfil"
                                        className="rounded-lg border"
                                    />
                                </div>
                            )}
                            <FormDescription>Insira a URL de uma imagem para ser usada como seu avatar.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                                <Input placeholder="Digite sua descrição de perfil..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit">Atualizar Perfil</Button>
            </form>
        </Form>
    );
}
