'use client'

import dynamic from 'next/dynamic'

const BannerDesconto = dynamic(() => import('@/app/home/BannerDesconto'), { ssr: false })

export default function BannerWrapper() {
    return <BannerDesconto />
}
