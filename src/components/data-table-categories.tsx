"use client"

import * as React from "react"
import Link from "next/link"
import axios from "axios"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { MoreHorizontal, PlusIcon, TrashIcon } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export type Category = {
  id: string
  name: string
  categorySlug: string
  date: string
  image: string
}

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "categorySlug",
    header: "Slug",
    cell: ({ row }) => <div>{row.getValue("categorySlug")}</div>,
  },
  {
    accessorKey: "date",
    header: "Data de Criação",
    cell: ({ row }) => {
      const date = row.getValue("date") as string
      const formattedDate = date
        ? format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
        : "Data inválida"
      return <div className="text-left font-medium">{formattedDate}</div>
    },
  },
  {
    accessorKey: "image",
    header: "Imagem",
    cell: ({ row }) => {
      const imageUrl = row.getValue("image") as string
      return (
        <div className="w-16 h-16 relative">
          <Image
            src={imageUrl || "/placeholder-image.jpg"}
            alt={`Imagem da categoria ${row.getValue("name")}`}
            fill
            className="object-cover rounded-md"
            sizes="(max-width: 64px)"
            unoptimized={true}
          />
        </div>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const category = row.original
      const router = useRouter()

      const handleDeleteCategory = async () => {
        const token = localStorage.getItem("authToken")
        try {
          await axios.delete(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories/delete/${category.id}`,
            {
              headers: {
                "Authorization": `Bearer ${token}`
              }
            }
          )
          toast({
            title: "✅ Categoria excluída com sucesso!",
            description: `A categoria "${category.name}" foi removida.`,
          })
          router.refresh()
        } catch {
          toast({
            title: "❌ Erro ao deletar categoria.",
            description: "Tente novamente mais tarde.",
          })
        }
      }

      function dismiss(): void {
        throw new Error("Function not implemented.")
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(category.categorySlug)}
            >
              Copiar Slug
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`/dashboard/categorias/editar-categoria/${category.categorySlug}`}>
                Editar Categoria
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
                          onClick={() => {
                            toast({
                              title: "❌ Você deseja excluir este Produto?",
                              description: (
                                <div className="flex flex-col">
                                  <div className="flex items-center gap-4 p-3 bg-gray-900 rounded-lg">
                                    {category.image ? (
                                      <Image
                                        src={category.image}
                                        alt="Preview do produto"
                                        width={80}
                                        height={80}
                                        className="rounded-lg object-cover"
                                        unoptimized={true}
                                      />
                                    ) : (
                                      <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center">
                                        <span className="text-white">Sem imagem</span>
                                      </div>
                                    )}
                                    <div className="w-[300px]">
                                      <h3 className="text-lg font-semibold text-white">
                                        {category.name}
                                      </h3>
                                    </div>
                                  </div>
                                  <div className="flex justify-between py-4">
                                    <Button
                                      className="bg-red-600 text-white hover:text-black"
                                      onClick={() => {
                                        handleDeleteCategory();
                                      }}
                                    >
                                      Sim, desejo excluir
                                    </Button>
                                    <Button
                                      className="bg-blue-900 text-white hover:text-black"
                                      onClick={() => dismiss()}
                                    >
                                      Não, prefiro cancelar
                                    </Button>
                                  </div>
                                </div>
                              ),
                              duration: Infinity,
                            });
                          }}
                        >
                          Excluir produto <TrashIcon color="red" />
                        </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function CategoriesTable() {
  const [categories, setCategories] = React.useState<Category[]>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories`)
        setCategories(response.data)
      } catch (error) {
        console.error("Erro ao buscar categorias", error)
        toast({
          title: "❌ Erro",
          description: "Não foi possível carregar as categorias",
        })
      }
    }
    fetchCategories()
  }, [])

  const table = useReactTable({
    data: categories,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar categorias..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Button variant="outline" className="ml-auto">
          <Link href="/dashboard/categorias/adicionar-categoria" className="flex items-center">
            Nova Categoria <PlusIcon className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Nenhuma categoria encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Próxima
        </Button>
      </div>
    </div>
  )
}