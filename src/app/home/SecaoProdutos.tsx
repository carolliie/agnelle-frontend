import { ProductsCarousel } from "@/components/products-carousel";

export default function SecaoProdutos() {
    return (
        <div className="flex flex-col place-items-center p-[20px] lg:p-20 bg-white">
            <h1 className="bloom text-[#11589A] text-[38px] lg:text-[48px]">Produtos Agnelle</h1>
            <ProductsCarousel/>
        </div>
    )
}