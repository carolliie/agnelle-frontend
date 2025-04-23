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
import router from "next/router"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import Image from "next/image"

export type Products = {
  id: string
  name: string
  size: string
  price: string
  images: string[]
  categories: string[]
  slug: string
  date: Date
}


export const columns: ColumnDef<Products>[] = [
  {
    accessorKey: "name",
    header: "Título",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "price",
    header: "Preço",
    cell: ({ row }) => <div className="capitalize">{row.getValue("price")}</div>,
  },
  {
    accessorKey: "categories",
    header: "Categorias",
    cell: ({ row }) => {
      const categories = row.getValue("categories") as string[];
      return <div>{Array.isArray(categories.length > 0) ? categories.join(", ") : "Sem categorias"}</div>
    },
  },
  {
    accessorKey: "date",
    header: "Data de Publicação",
    cell: ({ row }) => {
      const date = row.getValue("date") as string;
      const formattedDate = date
        ? format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
        : "Data inválida";
      return <div className="text-left font-medium">{formattedDate}</div>
    },
  },
  {
    accessorKey: "images",
    header: "Imagens",
    cell: ({ row }) => {
      const images = row.getValue("images") as string[];
      if (images && images.length > 0) {
        // Verifica se a URL já inclui o domínio base
        const imageUrl = images[0].startsWith('http') 
          ? images[0] 
          : `${process.env.NEXT_PUBLIC_API_BASE_URL}${images[0]}`;
        
        return (
          <div className="flex items-center justify-start">
            <Image
              src={imageUrl}
              alt="Product image"
              width={64}
              height={64}
              className="w-16 h-16 object-cover rounded-md"
              unoptimized={true}
            />
          </div>
        );
      } else {
        return <div>No Image</div>;
      }
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const product = row.original;

      const handleDeleteProduct = async () => {
        const token = localStorage.getItem("authToken");
        try {
          await axios.delete(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/delete/${product.id}`,
            {
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              }
            }
          );
          toast({
            title: "✅ Produto excluído com sucesso!",
            description: `O Produto "${product.name}" foi removido.`,
          });
          router.push("/dashboard/produtos")
        } catch {
          toast({
            title: "❌ Erro ao deletar Produto.",
            description: "Tente novamente mais tarde.",
          });
        }
      }

      function dismiss(): void {
        throw new Error("Function not implemented.")
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-full p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(`/produtos/${product?.slug}`)}
            >
              Copiar URL do Produto
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem><Link href={`/produtos/${product?.slug}`}>Ver detalhes</Link></DropdownMenuItem>
            <DropdownMenuItem><Link href={`/dashboard/produtos/editar-produto/${product?.slug}`}>Editar Produto</Link></DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                toast({
                  title: "❌ Você deseja excluir este Produto?",
                  description: (
                    <div className="flex flex-col">
                      <div className="flex items-center gap-4 p-3 bg-gray-900 rounded-lg">
                        {product.images && product.images.length > 0 ? (
                          <Image
                            src={product.images[0]}
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
                            {product.name}
                          </h3>
                        </div>
                      </div>
                      <div className="flex justify-between py-4">
                        <Button
                          className="bg-red-600 text-white hover:text-black"
                          onClick={() => {
                            handleDeleteProduct();
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
        </DropdownMenu >
      )
    },
  },
]

export function DataTableDemo() {
  const [products, setProducts] = React.useState<Products[]>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products`);
        setProducts(response.data);
      } catch (error) {
        console.error("Erro ao buscar products", error);
      }
    };
    fetchProducts();
  }, []);

  const table = useReactTable({
    data: products,
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
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar nomes..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-full"
        />
        <Button variant="outline" className="ml-2">
          <Link href="/dashboard/produtos/novo-produto" className="flex items-center">
            Adicionar produto <PlusIcon className="ml-1" />
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
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
