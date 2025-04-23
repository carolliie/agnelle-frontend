"use client"

import * as React from "react"
import {
  BookOpen,
  ShoppingBag,
  Command,
  PlusIcon,
  SquareTerminal,
  Tags
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavMidias } from "./nav-midias"
import { NavCategories } from "./nav-categories"

const data = {
  teams: [
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Admin Panel",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Análise geral",
          url: "/dashboard",
        },
        {
          title: "Usuários",
          url: "#",
        },
      ],
    },
    {
      title: "Produtos",
      url: "/dashboard/produtos",
      icon: ShoppingBag,
      items: [
        {
          title: "Novo produto",
          icon: PlusIcon,
          url: "/dashboard/produtos/novo-produto",
        },
        {
          title: "Todos os produtos",
          url: "/dashboard/produtos",
        },
        {
          title: "Categorias",
          url: "/dashboard/categorias",
        },
      ],
    },
  ],
  categorias: [
    {
      title: "Categorias",
      url: "/dashboard/categorias",
      icon: Tags,
      items: [
        {
          title: "Nova categoria",
          icon: PlusIcon,
          url: "/dashboard/categorias/adicionar-categoria",
        },
        {
          title: "Todas as categorias",
          url: "/dashboard/categorias",
        },
      ],
    },
  ],
  midias: [
    {
      title: "Biblioteca de mídia",
      url: "/dashboard/midias",
      icon: BookOpen,
      items: [
        {
          title: "Adicionar mídia",
          icon: PlusIcon,
          url: "/dashboard/midias/adicionar-midia",
        },
        {
          title: "Todas as mídias",
          url: "/dashboard/midias",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavCategories categories={data.categorias}/>
        <NavMidias midias={data.midias}/>
      </SidebarContent>
      <SidebarFooter>
        <NavUser/>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
