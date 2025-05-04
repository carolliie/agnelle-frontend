"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "./ui/button";
import Image from "next/image";

export type Product = {
  id: number;
  name: string;
  slug: string;
  date: string;
  images: string[];
  categories: string[];
  price: string;
  size: string;
  discountPrice?: string;
};

export function ProductsCarousel() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products`
        );

        const sortedProducts = response.data.sort((a: Product, b: Product) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateB.getTime() - dateA.getTime();
        });

        setProducts(sortedProducts);
      } catch (error) {
        console.error("Erro ao buscar produtos", error);
        toast({
          title: "❌ Erro",
          description: "Não foi possível carregar os produtos.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const mainCarouselPlugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  const productImagePlugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  const formatPrice = (price: string | number, index: number) => {
    const priceNumber = typeof price === "string" ? parseFloat(price.replace(",", ".")) : price;
    const formatted = priceNumber.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
    
    const parts = formatted.split(/(\d+,\d{2})/);
    const currencySymbol = parts[0].trim();
    const valueParts = parts[1] ? parts[1].split(",") : ["0", "00"];
    
    return (
      <span className="inline-flex items-baseline">
        <span className={`text-sm font-bold ${index % 2 === 0 ? "text-[#11589A]" : "text-[#E3839C]"}`}>{currencySymbol}</span>
        <span className={`text-2xl font-bold mx-0.5 ${index % 2 === 0 ? "text-[#11589A]" : "text-[#E3839C]"}`}>{valueParts[0]}</span>
        <span className={`text-sm font-bold ${index % 2 === 0 ? "text-[#11589A]" : "text-[#E3839C]"}`}>,{valueParts[1]}</span>
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-8">
      <Carousel
        opts={{ align: "start", loop: true }}
        plugins={[mainCarouselPlugin.current]}
        className="w-full"
      >
        <CarouselContent>
          {products.length > 0 ? (
            products.map((product, index) => (
              <CarouselItem
                key={index}
                className="flex flex-col place-items-center basis-full md:basis-1/2 lg:basis-1/3"
              >
                <div className="p-2">
                  <Card className={`w-fit overflow-hidden rounded-[20px] ${index % 2 === 0 ? "bg-[#CCE5FC]" : "bg-[#FFEAEF]"}`}>
                    <div className="relative h-fit w-full">
                      <Carousel
                        plugins={[productImagePlugin.current]}
                        className="w-full h-full"
                        onMouseEnter={productImagePlugin.current.stop}
                        onMouseLeave={productImagePlugin.current.reset}
                      >
                        <CarouselContent className="h-80 w-80">
                          {product.images.map((image, index) => (
                            <CarouselItem key={index} className="h-fit w-fit">
                              <div className="flex gap-2 absolute top-6 right-6 z-10">
                                {product.categories.map((category, idx) => (
                                  <div
                                    key={idx}
                                    className={`${index % 2 === 0 ? "bg-[#11589A]" : "bg-[#E3839C]"} text-white text-sm px-3 py-1 rounded-full`}
                                  >
                                    {category}
                                  </div>
                                ))}
                              </div>
                              
                              <Image
                                src={image}
                                alt={`${product.name} - Imagem ${index + 1}`}
                                width={300}
                                height={300}
                                className="object-cover h-80 w-80 transition-all duration-300 ease-in-out hover:scale-105 p-4 rounded-[25px]"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                                priority={index === 0}
                              />
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        {product.images.length > 1 && (
                          <>
                            <CarouselPrevious className="left-2 prev-img" />
                            <CarouselNext className="right-2 next-img" />
                          </>
                        )}
                      </Carousel>
                    </div>

                    <CardContent className="px-4 space-y-3">
                      <div className="space-y-1">
                        <h3 className={`text-lg font-bold ${index % 2 === 0 ? "text-[#11589A]" : "text-[#E3839C]"}`}>{product.name}</h3>
                        <p className={`text-sm ${index % 2 === 0 ? "text-[#11589A]" : "text-[#E3839C]"}`}>{product.size}</p>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center gap-2">
                          {product.discountPrice ? (
                            <>
                              {formatPrice(product.discountPrice, index)}
                              <span className="text-sm line-through text-gray-500">
                                {formatPrice(product.price, index)}
                              </span>
                            </>
                          ) : (
                            formatPrice(product.price, index)
                          )}
                        </div>
                        <p className={`text-xs -translate-y-2 ${index % 2 === 0 ? "text-[#11589A]" : "text-[#E3839C]"}`}>À vista</p>
                      </div>

                      <Button
                        asChild
                        className={`w-full rounded-xl transition-colors ${index % 2 === 0 ? "bg-[#11589A] hover:bg-[#18344e]" : "bg-[#E3839C] hover:bg-[#a3465f]"}`}
                        size="lg"
                      >
                        <Link
                          href={`https://wa.me/559392385511?text=Olá!%20Gostaria%20de%20encomendar%20o%20produto:%20*${product.name}*%20por%20R$${product.price}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold"
                        >
                          Encomendar
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))
          ) : (
            <CarouselItem>
              <div className="text-center py-8 w-full">
                <p className="text-gray-500">Nenhum produto disponível no momento.</p>
              </div>
            </CarouselItem>
          )}
        </CarouselContent>
        {products.length > 1 && (
          <>
            <CarouselPrevious className="prev-button left-[14vh] lg:left-[79vh] translate-y-[30vh] lg:translate-y-[44vh] md:flex bg-[#AAD0F4] transition-all duration-300 hover:bg-[#6396c5] border-none" />
            <CarouselNext className="next-button right-[14vh] lg:right-[79vh] translate-y-[30vh]  lg:translate-y-[44vh] md:flex bg-[#AAD0F4] transition-all duration-300 hover:bg-[#6396c5] border-none" />
          </>
        )}
      </Carousel>
    </div>
  );
}
