"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  GalleryVerticalEnd,
  Settings2,
  SquareTerminal,
  ComputerIcon
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
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
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
      icon: Bot,
      items: [
        {
          title: "Todos os produtos",
          url: "/dashboard/produtos",
        },
        {
          title: "Novo produto",
          url: "/dashboard/produtos/novo-produto",
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
      icon: BookOpen,
      items: [
        {
          title: "Todas as categorias",
          url: "/dashboard/categorias",
        },
        {
          title: "Adicionar categoria",
          url: "/dashboard/categorias/adicionar-categoria",
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
        <NavMidias midias={data.midias}/>
        <NavCategories categories={data.categorias}/>
      </SidebarContent>
      <SidebarFooter>
        <NavUser/>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
