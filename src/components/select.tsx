import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SelectDemo() {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Selecione uma categoria" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Categorias</SelectLabel>
          <SelectItem value="tecnologia">Tecnologia</SelectItem>
          <SelectItem value="negocios">Negócios</SelectItem>
          <SelectItem value="design">Design</SelectItem>
          <SelectItem value="social">Social</SelectItem>
          <SelectItem value="curiosidade">Curiosidade</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
