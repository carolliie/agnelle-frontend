"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from "axios"
import { useState, useCallback } from "react"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import BibliotecaMidias from "@/components/midia-library"
import { useForm } from "react-hook-form"
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form"

export default function AdicionarCategoria() {
  const [selectedImage, setSelectedImage] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    defaultValues: {
      name: "",
    }
  })

  const handleImageSelect = useCallback((images: string[]) => {
    if (images.length > 0) {
      setSelectedImage(images[0])
    }
  }, [])

  const onSubmit = async (data: { name: string }) => {
    setIsSubmitting(true)

    if (!selectedImage) {
      toast({
        title: "❌ Erro",
        description: "Por favor, selecione uma imagem para a categoria.",
      })
      setIsSubmitting(false)
      return
    }

    try {
      const token = localStorage.getItem("authToken")
      const formData = new FormData()
      formData.append("name", data.name)
      formData.append("image", selectedImage)

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories`,
        formData,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }
      )

      if (response.data) {
        toast({
          title: "✅ Sucesso",
          description: "Categoria adicionada com sucesso!",
        })
        form.reset()
        setSelectedImage("")
      }
    } catch (err) {
      console.error("Erro ao adicionar categoria:", err)
      toast({
        title: "❌ Erro ao adicionar categoria.",
        description: "Ocorreu um erro ao adicionar categoria. Tente novamente.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <Label>Nome da categoria</Label>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid w-full items-center gap-1.5">
            <Label>Imagem de destaque</Label>
            <BibliotecaMidias 
              onImageSelect={handleImageSelect}
              singleSelect={true}
            />
            {selectedImage && (
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">Imagem selecionada:</p>
                <img 
                  src={selectedImage} 
                  alt="Preview da categoria" 
                  className="mt-1 h-20 w-20 object-cover rounded-md"
                />
              </div>
            )}
          </div>

          <div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Adicionar"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}