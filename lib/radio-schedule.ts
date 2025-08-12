// Radio programming schedule utility
export interface ProgramSchedule {
  start: number
  end: number
  show: string
  description: string
}

export interface RadioShow {
  id: string
  title: string
  host: string
  startTime: string
  endTime: string
  description: string
  genre: string
  isLive?: boolean
}

export interface DaySchedule {
  day: string
  shows: RadioShow[]
}

// Mock schedule data - in a real app this would come from an API
export const weeklySchedule: DaySchedule[] = [
  {
    day: "Monday",
    shows: [
      {
        id: "mon-morning",
        title: "Morning Vibes",
        host: "DJ Alex",
        startTime: "06:00",
        endTime: "10:00",
        description: "Start your week with uplifting music and positive energy",
        genre: "Pop/R&B",
      },
      {
        id: "mon-afternoon",
        title: "Afro Beats Central",
        host: "DJ Kemi",
        startTime: "14:00",
        endTime: "18:00",
        description: "The best of Afrobeat and African contemporary music",
        genre: "Afrobeat",
      },
      {
        id: "mon-evening",
        title: "Late Night Jazz",
        host: "DJ Marcus",
        startTime: "22:00",
        endTime: "02:00",
        description: "Smooth jazz and soul for your evening wind-down",
        genre: "Jazz/Soul",
      },
    ],
  },
  {
    day: "Tuesday",
    shows: [
      {
        id: "tue-morning",
        title: "Country Roads",
        host: "DJ Sarah",
        startTime: "06:00",
        endTime: "10:00",
        description: "Classic and modern country hits to start your day",
        genre: "Country",
      },
      {
        id: "tue-afternoon",
        title: "Pop Culture",
        host: "DJ Ryan",
        startTime: "14:00",
        endTime: "18:00",
        description: "Today's hottest pop tracks and emerging artists",
        genre: "Pop",
      },
    ],
  },
  // Add more days as needed
]

export const programSchedule: ProgramSchedule[] = [
  { start: 5, end: 7, show: "Afrobeat Mix", description: "African rhythms and contemporary sounds" },
  { start: 7, end: 9, show: "Country Mix", description: "Modern and alternative country storytelling" },
  { start: 9, end: 11, show: "R&B Mix", description: "Soulful R&B with modern sophistication" },
  { start: 11, end: 13, show: "Pop Mix", description: "Contemporary pop with cutting-edge production" },
  { start: 13, end: 15, show: "Afrobeat Mix", description: "African rhythms and contemporary sounds" },
  { start: 15, end: 17, show: "Country Mix", description: "Modern and alternative country storytelling" },
  { start: 17, end: 19, show: "R&B Mix", description: "Soulful R&B with modern sophistication" },
  { start: 19, end: 21, show: "Pop Mix", description: "Contemporary pop with cutting-edge production" },
  { start: 21, end: 24, show: "Afrobeat", description: "Pure African beats and global fusion" },
  { start: 0, end: 5, show: "Variety Mix", description: "Eclectic mix from all our collections" },
]

export const getCurrentProgram = (hour?: number): ProgramSchedule => {
  // Get current time in Los Angeles timezone
  const now = new Date()
  const laTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }))
  const currentHour = hour ?? laTime.getHours()

  for (const program of programSchedule) {
    if (program.start < program.end) {
      // Normal time range (e.g., 5am - 7am)
      if (currentHour >= program.start && currentHour < program.end) {
        return program
      }
    } else {
      // Overnight range (e.g., 12am - 5am)
      if (currentHour >= program.start || currentHour < program.end) {
        return program
      }
    }
  }

  // Fallback
  return { start: 0, end: 24, show: "Variety Mix", description: "Eclectic mix from all our collections" }
}

export const getNextProgram = (): ProgramSchedule => {
  const now = new Date()
  const laTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }))
  const currentHour = laTime.getHours()

  // Find the next program
  for (const program of programSchedule) {
    if (program.start > currentHour) {
      return program
    }
  }

  // If no program found for today, return the first program of tomorrow
  return programSchedule[0]
}

export const formatTime = (hour: number): string => {
  if (hour === 0) return "12am"
  if (hour === 12) return "12pm"
  if (hour < 12) return `${hour.toString().padStart(2, "0")}am`
  return `${(hour - 12).toString().padStart(2, "0")}pm`
}

export const formatTimeRange = (start: number, end: number): string => {
  return `${formatTime(start)} - ${formatTime(end)}`
}

export function getCurrentShow(): RadioShow | null {
  const now = new Date()
  const currentDay = now.toLocaleDateString("en-US", { weekday: "long" })
  const currentTime = now.toTimeString().slice(0, 5) // HH:MM format

  const todaySchedule = weeklySchedule.find((schedule) => schedule.day === currentDay)
  if (!todaySchedule) return null

  const currentShow = todaySchedule.shows.find((show) => {
    return currentTime >= show.startTime && currentTime < show.endTime
  })

  return currentShow ? { ...currentShow, isLive: true } : null
}

export function getUpcomingShow(): RadioShow | null {
  const now = new Date()
  const currentDay = now.toLocaleDateString("en-US", { weekday: "long" })
  const currentTime = now.toTimeString().slice(0, 5)

  const todaySchedule = weeklySchedule.find((schedule) => schedule.day === currentDay)
  if (!todaySchedule) return null

  const upcomingShow = todaySchedule.shows.find((show) => {
    return currentTime < show.startTime
  })

  return upcomingShow || null
}
