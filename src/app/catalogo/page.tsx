import CatalogoComponents from "@/components/catalogo-components";
import { Suspense } from "react";

export default function Catalogo() {
  return (
    <Suspense fallback={
      <div>Carregando catálogo...</div>
    }>
      <CatalogoComponents/>
    </Suspense>
  )
}