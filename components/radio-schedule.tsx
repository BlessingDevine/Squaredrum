"use client"

import { useState, useEffect } from "react"
import { Clock, User, Music } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { getCurrentShow, getUpcomingShow, weeklySchedule, type RadioShow } from "@/lib/radio-schedule"

export default function RadioSchedule() {
  const [currentShow, setCurrentShow] = useState<RadioShow | null>(null)
  const [upcomingShow, setUpcomingShow] = useState<RadioShow | null>(null)

  useEffect(() => {
    const updateShows = () => {
      setCurrentShow(getCurrentShow())
      setUpcomingShow(getUpcomingShow())
    }

    updateShows()
    const interval = setInterval(updateShows, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-4">
      {/* Current Show */}
      {currentShow && (
        <Card className="bg-gradient-to-r from-red-900/20 to-red-800/20 border-red-500/30 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <Badge variant="outline" className="text-red-400 border-red-500/50">
              LIVE NOW
            </Badge>
          </div>
          <h3 className="font-semibold text-white mb-1">{currentShow.title}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-300 mb-2">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{currentShow.host}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>
                {currentShow.startTime} - {currentShow.endTime}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Music className="h-3 w-3" />
              <span>{currentShow.genre}</span>
            </div>
          </div>
          <p className="text-sm text-gray-400">{currentShow.description}</p>
        </Card>
      )}

      {/* Upcoming Show */}
      {upcomingShow && (
        <Card className="bg-gradient-to-r from-blue-900/20 to-blue-800/20 border-blue-500/30 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-blue-400 border-blue-500/50">
              UP NEXT
            </Badge>
          </div>
          <h3 className="font-semibold text-white mb-1">{upcomingShow.title}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-300 mb-2">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{upcomingShow.host}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>
                {upcomingShow.startTime} - {upcomingShow.endTime}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Music className="h-3 w-3" />
              <span>{upcomingShow.genre}</span>
            </div>
          </div>
          <p className="text-sm text-gray-400">{upcomingShow.description}</p>
        </Card>
      )}

      {/* Today's Full Schedule */}
      <Card className="bg-zinc-900/50 border-zinc-700 p-4">
        <h3 className="font-semibold text-white mb-3">Today's Schedule</h3>
        <div className="space-y-3">
          {weeklySchedule[0]?.shows.map((show) => (
            <div
              key={show.id}
              className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-b-0"
            >
              <div>
                <div className="font-medium text-white text-sm">{show.title}</div>
                <div className="text-xs text-gray-400">{show.host}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-300">
                  {show.startTime} - {show.endTime}
                </div>
                <div className="text-xs text-gray-500">{show.genre}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
