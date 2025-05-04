import Image from "next/image";
import addImage from "@/public/assets/adicionar imagem.webp"
import { Button } from "./ui/button";
import { ImagePlus } from "lucide-react";
import Link from "next/link";

export default function AddImageBlock() {
    return (
        <div className="flex flex-col items-center justify-center">
            <Image
            src={addImage}
            alt="Adicione uma imagem"
            className="w-full h-[380px] object-cover opacity-90"
            />
    
            <Button className="absolute translate-y-36">
                <Link href="/dashboard/midias/adicionar-midia" className="flex justify-center items-center gap-2">
                    Adicionar imagem
                    <ImagePlus color="black"/>
                </Link>
            </Button>   
        </div>
    )
}