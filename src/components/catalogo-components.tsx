"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import bannerLoja from "@/public/assets/banner-produtos.webp";
import bannerLojaMobile from "@/public/assets/banner-produtos-mobile.webp";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import React from "react";
import { ArrowBigDown, Search } from "lucide-react";
import { useSearchParams } from "next/navigation"; // Uso de useSearchParams

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

export type Category = {
  id: string;
  name: string;
  categorySlug: string;
  date: string;
  image: string;
  description?: string;
};

export default function CatalogoComponents() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [productsPerPage] = useState<number>(6);
  const [categoria, setCategoria] = useState<string | undefined>("");

  const searchParams = useSearchParams();

  useEffect(() => {
    const slugFromUrl = searchParams.get("categoria");
    setCategoria(slugFromUrl || "");
  }, [searchParams]);

  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        const productsResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products`
        );
        const categoriesResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories`
        );

        setProducts(productsResponse.data);
        setCategories(categoriesResponse.data);
        setFilteredProducts(productsResponse.data);
      } catch (error) {
        console.error("Erro ao buscar produtos e categorias", error);
      }
    };

    fetchProductsAndCategories();
  }, []);

  useEffect(() => {
    if (categoria) {
      const normalizedCategoria = categoria.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const filtered = products.filter((product) =>
        product.categories.some((category) => {
          const normalizedCategory = category.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          return normalizedCategory.toLowerCase() === normalizedCategoria.toLowerCase();
        })
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [categoria, products]);

  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategories(prev =>
      prev.includes(categorySlug)
        ? prev.filter(category => category !== categorySlug)
        : [...prev, categorySlug]
    );
  };

  const handleSearch = useCallback(() => {
    let filtered = [...products];
  
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product =>
        selectedCategories.some(selectedCat =>
          product.categories.some(productCat =>
            productCat.toLowerCase() === selectedCat.toLowerCase()
          )
        ))
      }
  
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(term) ||
        product.categories.some(category =>
          category.toLowerCase().includes(term)
      ))
    }
  
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, searchTerm, selectedCategories]);
  
  useEffect(() => {
    handleSearch();
  }, [handleSearch]);  

  const handlePagination = (page: number) => {
    setCurrentPage(page);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
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

  return (
    <div className="bg-[#C0DFFD] pb-[4vh] lg:pb-[10vh] fade-in-anima">
      <Image
        src={bannerLoja}
        alt="Banner da loja"
        width={1920}
        height={1080}
        className="hero w-full lg:h-[90vh] object-cover hidden lg:block"
      />
      <Image
        src={bannerLojaMobile}
        alt="Banner da loja"
        width={400}
        height={400}
        className="hero w-full object-cover lg:hidden"
      />

      <Link className="flex justify-center p-[16px] lg:p-10 -translate-y-28" href="#produtos">
        <ArrowBigDown className="arrow"/>
      </Link>

      <div className="flex flex-col lg:flex-row gap-4 p-[24px] lg:p-[40px] bg-white m-[14px] lg:m-[40px] rounded-3xl -translate-y-28" id="produtos">
        {/* Categories Container */}
        <div
          id="container-select-categories"
          className="lg:w-[15%] p-4 bg-white rounded-lg shadow-lg"
        >
          <h2 className="font-semibold text-[#11589A] text-lg mb-4">Categorias</h2>
          <div className="space-y-2">
            {categories.map((category, index) => (
              <label key={index} className="flex items-center text-[#11589A] text-sm">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.name)}
                  onChange={() => handleCategoryChange(category.name)}
                  className="mr-2 h-4 w-4 rounded border-gray-300 text-[#11589A] focus:ring-[#11589A]"
                />
                {category.name}
              </label>
            ))}
          </div>
        </div>

        {/* Products Container */}
        <div id="produtos" className="lg:w-[85%]">
          {/* Search Input */}
          <div className="mb-8 flex flex-col lg:flex-row justify-center lg:justify-between items-center w-full">
            <h1 className="bloom text-[32px] lg:text-[40px] text-[#11589A]">Produtos Agnelle</h1>
            <div className="relative lg:w-[300px]"> {/* Container relativo para posicionar o ícone */}
              <input
                type="text"
                placeholder="Pesquisar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 pl-4 pr-10 border rounded-full text-[#11589A] focus:ring-[#11589A] focus:border-[#11589A]"
              />
              <Search 
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                color="#11589A"
                size={20}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-6 place-items-center">
            {currentProducts.length > 0 ? (
              currentProducts.map((product, index) => (
                <div key={index} className="p-2">
                  <Card
                    className={`w-[180px] lg:w-fit overflow-hidden rounded-[20px] ${
                      index % 2 === 0 ? "bg-[#CCE5FC]" : "bg-[#FFEAEF]"
                    }`}
                    id={product.slug}
                  >
                    <div className="relative h-fit w-full">
                      <Carousel
                        plugins={[productImagePlugin.current]}
                        className="w-full h-full"
                        onMouseEnter={productImagePlugin.current.stop}
                        onMouseLeave={productImagePlugin.current.reset}
                      >
                        <CarouselContent className="lg:h-80 lg:w-80">
                          {product.images.map((image, index) => (
                            <CarouselItem key={index} className="h-fit w-fit">
                              <div className="flex gap-2 absolute top-3 right-3 lg:top-6 lg:right-6 z-10">
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
                                className="object-cover h-52 w-52 lg:h-80 lg:w-80 transition-all duration-300 ease-in-out hover:scale-105 p-2 lg:p-4 rounded-[25px]"
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

                    <CardContent className="px-2 lg:px-4 lg:space-y-3">
                      <div className="space-y-1">
                        <h3
                          className={`text-lg font-bold ${
                            index % 2 === 0 ? "text-[#11589A]" : "text-[#E3839C]"
                          }`}
                        >
                          {product.name}
                        </h3>
                        <p
                          className={`text-sm ${
                            index % 2 === 0 ? "text-[#11589A]" : "text-[#E3839C]"
                          }`}
                        >
                          {product.size}
                        </p>
                      </div>

                      <div className="flex flex-col space-y-2">
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
                        <p
                          className={`text-xs -translate-y-2 ${
                            index % 2 === 0 ? "text-[#11589A]" : "text-[#E3839C]"
                          }`}
                        >
                          À vista
                        </p>
                      </div>

                      <Button
                        asChild
                        className={`w-full rounded-xl transition-colors ${
                          index % 2 === 0 ? "bg-[#11589A] hover:bg-[#18344e]" : "bg-[#E3839C] hover:bg-[#a3465f]"
                        }`}
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
              ))
            ) : (
              <div className="text-center py-8 w-full">
                <p className="text-gray-500">Nenhum produto encontrado.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-4">
            {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }).map((_, index) => (
              <Button
                key={index}
                onClick={() => handlePagination(index + 1)}
                className={`mx-1 py-2 px-4 rounded-md ${
                  currentPage === index + 1 ? "bg-[#11589A]" : "bg-[#00376B]"
                } text-white hover:bg-[#00376B]`}
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
