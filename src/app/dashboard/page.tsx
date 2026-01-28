'use client'

import { useEffect, useState } from 'react'
import DashboardContainer from '@/container/DashboardContainer'
import MobileDashboardContainer from '@/container/MobileDashboardContainer'

export default function DashboardPage() {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }
        
        checkMobile()
        window.addEventListener('resize', checkMobile)
        
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    return isMobile ? <MobileDashboardContainer /> : <DashboardContainer />
} 