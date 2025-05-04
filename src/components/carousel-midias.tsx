"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import axios from "axios";
import { BookHeart, TimerIcon } from "lucide-react";
import Link from "next/link";

// Definindo o tipo para as imagens
type MediaItem = {
  id: string;
  title: string;
  date: string;
  images: string[]; // Array de URLs das imagens
  // Adicione outros campos conforme necessário
};

export function CarouselMidias() {
  const plugin = React.useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));
  const [mediaItems, setMediaItems] = React.useState<MediaItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/images`);
        
        if (response.data && Array.isArray(response.data)) {
          const itemsWithImages = (response.data as MediaItem[]).filter(
            (item) => item.images && item.images.length > 0
          );
          setMediaItems(itemsWithImages);
        }        
      } catch (error) {
        console.error("Erro ao buscar mídias", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-2xl h-[370px] flex items-center justify-center">
        <p>Carregando mídias...</p>
      </div>
    );
  }

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full max-w-2xl"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {mediaItems.length > 0 ? (
          mediaItems.map((item, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardContent
                    className="relative flex flex-col items-start justify-end p-6 h-[370px] text-white bg-gray-600 bg-blend-overlay bg-cover bg-center rounded-md overflow-hidden"
                    style={{
                      backgroundImage: item.images && item.images.length > 0 
                        ? `url(${item.images[0]})` 
                        : "none",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                    <div className="relative z-10 space-y-2">
                      <h3 className="text-lg font-semibold px-2 py-1 rounded-md">
                        {item.title || "Título não disponível"}
                      </h3>
                      <p className="flex items-center text-sm px-2 py-1 rounded-md">
                        <TimerIcon width={16} className="mr-1" />
                        {new Date(item.date).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <div className="flex justify-end z-10 w-full items-center mt-4">
                      <Link 
                        href="/midias/adicionar-midia" 
                        className="py-1 px-2 text-sm text-white hover:bg-white hover:bg-opacity-5 transition duration-300 ease-in-out flex justify-between items-center border border-white border-opacity-50 rounded-lg"
                      >
                        Adicionar imagem <BookHeart width={14} className="ml-1"/>
                      </Link>
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
                <CardContent className="flex flex-col items-center justify-center p-6 h-[370px] space-y-4">
                  <span className="text-lg font-semibold">Nenhuma mídia disponível</span>
                  <Link 
                    href="/midias/adicionar-midia" 
                    className="py-2 px-4 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out flex items-center"
                  >
                    Adicionar primeira imagem <BookHeart width={16} className="ml-2"/>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        )}
      </CarouselContent>
    </Carousel>
  );
}