import { Team } from '@prisma/client'

export const mockTeams: Team[] = [
  { number: '1', name: 'Team 1', city: 'Tokyo', state: 'Tokyo', country: 'Japan', ageGroup: 'High School' },
  { number: '127C', name: 'Lemon Bots', city: 'Gilbert', state: 'Arizona', country: 'United States', ageGroup: 'High School' }
]

export function makeMockPrismaList (teams: Team[]): Team[] {
  return teams.map(team => {
    const dbTeam: Team = {
      number: team.number,
      name: team.name,
      city: team.city,
      state: team.state,
      country: team.country,
      ageGroup: team.ageGroup
    }
    return dbTeam
  })
}
