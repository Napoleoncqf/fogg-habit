import { useEffect } from 'react'
import { useAppStore } from '../stores/useAppStore'
import CampaignMap from '../components/CampaignMap'

export default function MapPage() {
  const { init } = useAppStore()

  useEffect(() => {
    init()
  }, [init])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-[var(--accent-gold)] mb-2">
        战役地图
      </h1>
      <p className="text-[var(--text-secondary)] text-xs mb-4">
        你的征程总览
      </p>
      <CampaignMap />
    </div>
  )
}
