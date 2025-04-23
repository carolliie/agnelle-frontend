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
import { InputCodeOTP } from "@/components/code-input";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  email: z.string().email({
    message: "Por favor, insira um e-mail válido.",
  }),
  code: z.string().length(6, {
    message: "O código de confirmação deve ter 6 caracteres.",
  }),
});

export default function EmailInput() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      code: "",
    },
  });

  const [isEmailValid, setIsEmailValid] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const response = await axios.post("/api/send-email", { email: data.email });

      if (response.status === 200) {
        setEmail(data.email);
        setIsEmailValid(true);
        setCodeSent(true);
        toast({
          title: "✅ E-mail enviado!",
          description: "Verifique seu e-mail para o código de confirmação.",
        });
      } else {
        toast({
          title: "❌ E-mail não encontrado.",
          description: "Este e-mail não está cadastrado.",
        });
      }
    } catch (error) {
      console.error("Erro ao enviar e-mail:", error);
      toast({
        title: "❌ Erro ao enviar o código.",
        description: "Tente novamente mais tarde.",
      });
    }
  }

  const handleVerifyCode = async (code: string) => {
    try {
      const response = await axios.post("/api/verify-code", { email, code });

      if (response.status === 200) {
        toast({
          title: "✅ Código verificado!",
          description: "Você pode agora redefinir sua senha.",
        });
        router.push("/redefinir-senha");
      } else {
        toast({
          title: "❌ Código inválido.",
          description: "O código informado é incorreto. Tente novamente.",
        });
      }
    } catch (error) {
      console.error("Erro ao verificar código:", error);
      toast({
        title: "❌ Erro na verificação.",
        description: "Tente novamente mais tarde.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        {!isEmailValid && (
          <>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Insira o e-mail da sua conta</FormLabel>
                  <FormControl>
                    <Input placeholder="email@example.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    Este deve ser o e-mail cadastrado em sua conta.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Enviar código</Button>
          </>
        )}

        {isEmailValid && codeSent && (
          <>
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Insira o código enviado por e-mail</FormLabel>
                  <FormControl>
                    <InputCodeOTP onSubmit={handleVerifyCode} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
      </form>
    </Form>
  );
}
