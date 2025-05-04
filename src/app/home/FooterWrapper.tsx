'use client'

import dynamic from 'next/dynamic'

const Footer = dynamic(() => import('@/app/home/Footer'), { ssr: false })

export default function FooterWrapper() {
    return <Footer />
}
