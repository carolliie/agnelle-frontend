"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Products } from "./data-table";
import axios from "axios";
import { BookHeart, TimerIcon } from "lucide-react";
import Link from "next/link";

export function CarouselBlock() {
  const plugin = React.useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));
  const [products, setProducts] = React.useState<Products[]>([]);

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products`);
        const sortedProducts = response.data.sort((a: Products, b: Products) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setProducts(sortedProducts.slice(0, 3));
      } catch (error) {
        console.error("Erro ao buscar produtos", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full max-w-2xl"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {products.length > 0 ? (
          products.map((product, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardContent
                    className="relative flex flex-col items-start justify-end p-6 h-[370px] text-white bg-gray-600 bg-blend-overlay bg-cover bg-center rounded-md overflow-hidden"
                    style={{
                      backgroundImage: product.images[0] ? `url(${product.images[0]})` : "none",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                    <h3 className="relative text-lg font-semibold px-2 py-1 rounded-md">
                      {product.name}
                    </h3>
                    <p className="relative flex justify-between items-center text-sm px-2 py-1 rounded-md">
                      <TimerIcon width={16} className="mr-1" />
                      {new Date(product.date).toLocaleDateString("pt-BR")}
                    </p>
                    <div className="flex justify-end z-10 w-full items-center">
                      <Link href={`/catalogo/#${product.slug}`} className="py-1 px-2 text-sm text-white hover:bg-white hover:bg-opacity-5 transition duration-300 ease-in-out flex justify-between items-center border border-white border-opacity-50 rounded-lg">Ver publicação <BookHeart width={14} className="ml-1"/></Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))
        ) : (
          <CarouselItem>
            <div className="p-1">
              <Card>
                <CardContent className="flex items-center justify-center p-6 h-[370px]">
                  <span className="text-lg font-semibold">Nenhum produto disponível</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        )}
      </CarouselContent>
    </Carousel>
  );
}
