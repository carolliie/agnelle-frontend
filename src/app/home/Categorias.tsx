import { CategoriesCarousel } from "@/components/categories-carousel"
import React from "react"

export default function Categorias() {

    return (
        <div className="flex flex-col place-items-center p-[20px] lg:p-[30px] bg-white">
            <h1 className="bloom text-[#11589A] text-[48px]">Categorias</h1>
            <CategoriesCarousel/>
        </div>
    )
}