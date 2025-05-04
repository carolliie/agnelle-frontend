"use client"

import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default function Banner() {
    const [isVisible, setIsVisible] = useState(false);
    const bannerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                    }
                });
            },
            { threshold: 0.1 }
        );

        const currentRef = bannerRef.current;

        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    return (
        <div className="bg-white pb-[10vh] lg:pb-[24vh]" ref={bannerRef}>
            <div className="p-[20px] lg:p-[60px]">
                <div className={`banner h-[70vh] lg:h-[80vh] p-[30px] ${isVisible ? "pulse" : ""}`}>
                    <Link href="https://wa.me/559392385511?text=Olá!%20Gostaria%20de%20encomendar%20uma%20peça%20com%20o%20desconto%20para%20primeira%20compra.">
                        <Button id="banner-button">ENCOMENDAR COM DESCONTO</Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}