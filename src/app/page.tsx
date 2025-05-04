import BannerWrapper from "./home/BannerWrapper";
import Categorias from "./home/Categorias";
import Encomendar from "./home/Encomendar";
import FooterWrapper from "./home/FooterWrapper";
import Hero from "./home/Hero";
import Navbar from "./home/Navbar";
import SecaoProdutos from "./home/SecaoProdutos";
import Sobre from "./home/Sobre";

export const revalidate = 0;

export default function Home() {
  return (
    <main>
      <Navbar/>
      <Hero/>
      <Categorias/>
      <Encomendar/>
      <SecaoProdutos/>
      <Sobre/>
      <BannerWrapper/>
      <FooterWrapper/>
    </main>
  );
}
