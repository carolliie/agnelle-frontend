"use client";

import { Button } from "@/components/ui/button";
import nuvemInferior from "@/public/assets/nuvem-superior.svg";
import nuvemEsquerda from "@/public/assets/nuvem-esq.svg";
import nuvemDireita from "@/public/assets/nuvem-dir.svg";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <div className="hero flex flex-col justify-center items-center p-[20px] h-[50vh] lg:p-[60px] lg:h-[90vh] relative overflow-hidden bg-[#AAD0F4]">
      <Image
        src="https://agnelles.com.br/images/agnelle.svg"
        alt="agnelle logo"
        className="w-[350px] lg:w-[500px]"
        width={500}
        height={200}
      />
      <p className="font-medium w-[350px] lg:w-full text-center">Crochê que aconchega, encanta e conecta histórias.</p>
      <Button className="my-8 mb-28 px-6 py-5 rounded-full bg-white text-base font-semibold text-[#11589A] hover:bg-[#11589A] hover:text-white transition-all duration-300 ease-in-out">Ver produtos</Button>

      <motion.div
        className="absolute -left-20 lg:-left-4 bottom-0 transform -translate-y-1/2"
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 100 }}
      >
        <Image src={nuvemEsquerda} alt="nuvem esquerda" width={320} height={320} className="h-[200px] lg:h-[380px] lg:w-[380px]"/>
      </motion.div>

      <motion.div
        className="absolute -right-20 lg:-right-4 bottom-0 transform -translate-y-1/2"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 100 }}
      >
        <Image src={nuvemDireita} alt="nuvem direita" width={320} height={320} className="h-[200px] lg:h-[380px] lg:w-[380px]"/>
      </motion.div>

      <motion.div
        className="absolute bottom-0 w-full"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 100 }}
      >
        <Image src={nuvemInferior} alt="nuvem inferior" width={1920} height={100} />
      </motion.div>
    </div>
  );
}
