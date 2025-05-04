"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const FormSchema = z.object({
  password: z.string().min(6, {
    message: "A senha deve ter pelo menos 6 caracteres.",
  }),
  confirmPassword: z.string().min(6, {
    message: "A confirmação da senha deve ter pelo menos 6 caracteres.",
  }),
});

export default function InputFormNewPassword() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [code, setCode] = useState<string>("");

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (data.password !== data.confirmPassword) {
      toast({
        title: "❌ Senhas não coincidem.",
        description: "A senha e a confirmação da senha devem ser iguais.",
      });
      return;
    }

    try {
      const response = await axios.post("/api/reset-password", {
        email,
        code,
        password: data.password,
      });

      if (response.status === 200) {
        toast({
          title: "✅ Senha alterada com sucesso!",
          description: "Agora você pode fazer login com sua nova senha.",
        });
        setEmail(email)
        setCode(code)
        router.push("/login");
      } else {
        toast({
          title: "❌ Erro ao alterar a senha.",
          description: "Tente novamente mais tarde.",
        });
      }
    } catch (error) {
      console.error("Erro ao alterar a senha:", error);
      toast({
        title: "❌ Erro ao alterar a senha.",
        description: "Tente novamente mais tarde.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nova Senha</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Digite sua nova senha" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar Nova Senha</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Confirme sua nova senha" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Alterar Senha</Button>
      </form>
    </Form>
  );
}
