"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from "axios"
import { useState, useCallback, useEffect } from "react"
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
import { useParams, useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"

interface CategoryData {
  id: string
  name: string
  image: string
  categorySlug: string
}

export default function EditCategoryForm({ categorySlug }: { categorySlug: string }) {
  const [selectedImage, setSelectedImage] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const form = useForm({
    defaultValues: {
      name: "",
    }
  })

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const token = localStorage.getItem("authToken")
        const response = await axios.get<CategoryData>(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories/${categorySlug}`,
          {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          }
        )

        form.reset({
          name: response.data.name
        })
        setSelectedImage(response.data.image)
      } catch (err) {
        console.error("Erro ao carregar categoria:", err)
        toast({
          title: "❌ Erro",
          description: "Não foi possível carregar os dados da categoria.",
        })
        router.push("/dashboard/categories")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategory()
  }, [categorySlug, form, router])

  const handleImageSelect = useCallback((images: string[]) => {
    if (images.length > 0) {
      setSelectedImage(images[0])
    } else {
      setSelectedImage("")
    }
  }, [])

  const onSubmit = async (data: { name: string }) => {
    setIsSubmitting(true)

    try {
      const token = localStorage.getItem("authToken")
      const formData = new FormData()
      formData.append("name", data.name)
      formData.append("image", selectedImage)

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories/edit/${categorySlug}`,
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
          description: "Categoria atualizada com sucesso!",
        })
        router.push("/dashboard/categories")
      }
    } catch (err) {
      console.error("Erro ao atualizar categoria:", err)
      toast({
        title: "❌ Erro ao atualizar categoria.",
        description: "Ocorreu um erro ao atualizar a categoria. Tente novamente.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="w-fit mx-auto space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-64 w-full" />
        </div>
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  return (
    <div className="w-fit mx-auto">
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
                <p className="text-sm text-muted-foreground">Imagem atual:</p>
                <img 
                  src={selectedImage} 
                  alt="Preview da categoria" 
                  className="mt-1 h-20 w-20 object-cover rounded-md"
                />
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </Button>
            <Button 
              variant="outline" 
              type="button"
              onClick={() => router.push("/dashboard/categories")}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
