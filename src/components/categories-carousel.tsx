"use client";

import * as React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import bolsaMask from "@/public/assets/bolsa.png"; 

export type Category = {
  id: string;
  name: string;
  categorySlug: string;
  date: string;
  image: string;
  description?: string;
};

export function CategoriesCarousel() {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(true);

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories`
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Erro ao buscar categorias", error);
        toast({
          title: "❌ Erro",
          description: "Não foi possível carregar as categorias",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <Carousel
          opts={{ align: "start", loop: true }}
          plugins={[plugin.current]}
          className="w-full"
        >
          <CarouselContent>
            {categories.length > 0 ? (
              categories.map((category) => (
                <CarouselItem key={category.id} className="flex flex-col place-items-center sm:basis-1/2 lg:basis-1/3">
                  <div className="p-2">
                    <Link
                      href={`/catalogo?categoria=${category.categorySlug}`}
                      className="block group"
                    >
                      <div className="flex flex-col place-items-center relative h-full rounded-xl overflow-hidden transition-all duration-300">
                        {category.image && (
                            <Image
                              src={category.image}
                              alt={category.name}
                              width={180}
                              height={180}
                              className="h-48 w-48 object-cover transition-all duration-300 ease-in-out hover:scale-105"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                              style={{
                                maskImage: `url(${bolsaMask.src})`,
                                WebkitMaskImage: `url(${bolsaMask.src})`,
                                maskPosition: 'center',
                                maskRepeat: 'no-repeat',
                                maskSize: '180px',
                              }}
                            />
                        )}

                        <div className="relative h-full flex flex-col justify-center text-center p-6">
                          <h3 className="text-2xl font-bold text-[#11589A] mb-2">
                            {category.name}
                          </h3>
                          <span className="inline-block text-[#11589A] border border-[#11589A] px-4 py-2 rounded-full text-sm font-medium transition-all group-hover:bg-[#11589A] group-hover:text-white">
                            Ver produtos
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                </CarouselItem>
              ))
            ) : (
              <CarouselItem>
                <div className="text-center py-8 w-full">
                  <p className="text-gray-500">Nenhuma categoria disponível no momento.</p>
                </div>
              </CarouselItem>
            )}
          </CarouselContent>
          {categories.length > 1 && (
            <>
              <CarouselPrevious className="prev-button left-2 md:flex bg-[#AAD0F4] transition-all duration-300 hover:bg-[#6396c5] border-none" />
              <CarouselNext className="next-button right-2 md:flex bg-[#AAD0F4] transition-all duration-300 hover:bg-[#6396c5] border-none" />
            </>
          )}
        </Carousel>
      </div>
    </div>
  );
}
