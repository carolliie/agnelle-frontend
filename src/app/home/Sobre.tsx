"use client"

import React, { useEffect } from 'react';

const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry: IntersectionObserverEntry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.5 }); 

export default function Sobre() {
    useEffect(() => {
        const sobreElement = document.querySelector('.sobre');
        if (sobreElement) {
            observer.observe(sobreElement);
        }

        return () => {
            if (sobreElement) {
                observer.unobserve(sobreElement);
            }
        };
    }, []);

    return (
        <div className="sobre h-full" id="sobre">
            <div className="p-[20px] lg:p-[40px] lg:w-[80%]">
                <h1 className="bloom text-[40px] lg:text-[50px] text-[#11589A]">SOBRE</h1>
                <p className="text-black text-[15px] lg:text-[20px]">
                    A <strong className="text-[#11589A]">Agnelle</strong> nasceu do amor pelo crochê e do desejo de compartilhar essa paixão com o mundo. Aqui, acreditamos que cada ponto é uma oportunidade de transformar linhas simples em peças únicas, que agregam charme e funcionalidade ao seu dia a dia.
                </p>
                <br />
                <br />
                <p className="text-black text-[15px] lg:text-[20px] lg:translate-x-20">
                    Somos uma <strong className="text-black">loja online</strong> especializada em produtos de <strong className="text-black">crochê feitos à mão</strong>, criados com cuidado para transmitir aconchego, elegância e afeto. Nossas coleções incluem bolsas exclusivas e acessórios delicados, como chaveiros, perfeitos para quem aprecia artesanato com estilo.
                </p>
            </div>
        </div>
    );
}
