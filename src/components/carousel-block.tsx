"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Posts } from "./data-table";
import axios from "axios";
import { BookHeart, TimerIcon } from "lucide-react";

export function CarouselBlock() {
  const plugin = React.useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));
  const [posts, setPosts] = React.useState<Posts[]>([]);

  React.useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/posts`);
        const sortedPosts = response.data.sort((a: Posts, b: Posts) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setPosts(sortedPosts.slice(0, 3));
      } catch (error) {
        console.error("Erro ao buscar posts", error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full max-w-2xl"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {posts.length > 0 ? (
          posts.map((post) => (
            <CarouselItem key={post.id}>
              <div className="p-1">
                <Card>
                  <CardContent
                    className="relative flex flex-col items-start justify-end p-6 h-[370px] text-white bg-gray-600 bg-blend-overlay bg-cover bg-center rounded-md overflow-hidden"
                    style={{
                      backgroundImage: post.img ? `url(${post.img})` : "none",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                    <h3 className="relative text-lg font-semibold px-2 py-1 rounded-md">
                      {post.name}
                    </h3>
                    <p className="relative flex justify-between items-center text-sm px-2 py-1 rounded-md">
                      <TimerIcon width={16} className="mr-1" />
                      {new Date(post.date).toLocaleDateString("pt-BR")}
                    </p>
                    <div className="flex justify-end z-10 w-full items-center">
                      <a href={`/blog/${post.slug}`} className="py-1 px-2 text-sm text-white hover:bg-white hover:bg-opacity-5 transition duration-300 ease-in-out flex justify-between items-center border border-white border-opacity-50 rounded-lg">Ver publicação <BookHeart width={14} className="ml-1"/></a>
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
                  <span className="text-lg font-semibold">Nenhum post disponível</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        )}
      </CarouselContent>
    </Carousel>
  );
}
