import { InMemoryDBService } from '@nestjs-addons/in-memory-db'
import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/utils/prisma/prisma.service'
import {
  AUTON_WINNER,
  ELEVATION,
  MATCH_ROUND,
  MatchDetails,
  MatchScore,
  MatchScoreInMemory,
  MatchScoreInPrisma,
  MatchScoreInPrismaCreationData,
  QUAL_TEAM_METADATA,
  RecursivePartialMatchScore
} from './matchScore.interface'
import { validateOrReject } from 'class-validator'

@Injectable()
export class MatchScoreDatabase {
  constructor (
    private readonly prisma: PrismaService,
    private readonly cache: InMemoryDBService<MatchScoreInMemory>
  ) {}

  private static populateEmptyMatchScore (
    params: { round: MATCH_ROUND, id: string }): MatchScoreInMemory {
    const baseScore = {
      redScore: {
        goalTriballs: 0,
        zoneTriballs: 0,
        allianceTriballsInGoal: 0,
        allianceTriballsInZone: 0,
        robot1Tier: ELEVATION.NONE,
        robot2Tier: ELEVATION.NONE
      },
      blueScore: {
        goalTriballs: 0,
        zoneTriballs: 0,
        allianceTriballsInGoal: 0,
        allianceTriballsInZone: 0,
        robot1Tier: ELEVATION.NONE,
        robot2Tier: ELEVATION.NONE
      },
      autonWinner: AUTON_WINNER.NONE,
      locked: false
    }
    const elimMetadata: Extract<MatchScoreInMemory, { round: MATCH_ROUND.ELIMINATION }>['metadata'] = {
      red: { disqualified: false },
      blue: { disqualified: false }
    }
    const qualMetadata: Extract<MatchScoreInMemory, { round: MATCH_ROUND.QUALIFICATION }>['metadata'] = {
      red: {
        team1: QUAL_TEAM_METADATA.NONE,
        team2: QUAL_TEAM_METADATA.NONE,
        autonWinPoint: false
      },
      blue: {
        team1: QUAL_TEAM_METADATA.NONE,
        team2: QUAL_TEAM_METADATA.NONE,
        autonWinPoint: false
      }
    }
    const metadata = params.round === MATCH_ROUND.ELIMINATION ? elimMetadata : qualMetadata
    const additional = { round: params.round, id: params.id }
    const out = { metadata, ...additional, ...baseScore }
    return out as MatchScoreInMemory
  }

  /** retrieves most recent match score with matchId */
  public async getFinalMatchScoreInPrisma (
    matchId: number
  ): Promise<MatchScoreInPrisma | null> {
    const rawSavedScore: Omit<MatchScoreInPrisma, 'autonWinner'> & { autonWinner: string } | null = await this.prisma.matchScore.findFirst({
      where: { matchId },
      orderBy: { timeSaved: 'desc' }
    })
    if (rawSavedScore === null) return null
    const savedScore: MatchScoreInPrisma = { ...rawSavedScore, autonWinner: rawSavedScore.autonWinner as AUTON_WINNER }
    return savedScore
  }

  /** retrieves most recent match score with matchId */
  async getFinalSavedMatchScore (matchId: number): Promise<MatchScore | null> {
    const prismaScore = await this.getFinalMatchScoreInPrisma(matchId)
    if (prismaScore === null) return null
    const parsedScore: MatchScore = {
      locked: true,
      redScore: JSON.parse(prismaScore.redScore),
      blueScore: JSON.parse(prismaScore.blueScore),
      metadata: JSON.parse(prismaScore.metadata),
      autonWinner: prismaScore.autonWinner
    }
    return parsedScore
  }

  public async hydrateInMemoryDB (matches: MatchDetails[]): Promise<void> {
    await Promise.all(
      matches.map(async <R extends MATCH_ROUND>({ matchId, round }: { matchId: number, round: R }) => {
        const savedScore = await this.getFinalSavedMatchScore(matchId)
        const params = { id: matchId.toString(), round }
        let data: MatchScoreInMemory
        if (savedScore === null) data = MatchScoreDatabase.populateEmptyMatchScore(params)
        else data = { ...savedScore as Extract<typeof savedScore, Extract<MatchScoreInMemory, { round: R } >>, ...params }
        await this.cache.createAsync(data)
      })
    )
  }

  /** retrieves working score stored in memory */
  getWorkingScore (matchId: number): MatchScoreInMemory {
    return this.cache.get(matchId.toString())
  }

  getLockState (matchId: number): boolean {
    return this.getWorkingScore(matchId).locked
  }

  async updateScore (
    matchId: number,
    partialScore: RecursivePartialMatchScore
  ): Promise<void> {
    await validateOrReject(partialScore, {
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true
    })
    const memScore = this.getWorkingScore(matchId)
    for (const forLoopKey in partialScore) {
      const key: keyof RecursivePartialMatchScore =
        forLoopKey as keyof RecursivePartialMatchScore
      const value = partialScore[key]
      switch (key) {
        case 'redScore':
        case 'blueScore':
          // look at that lodash thing: https://www.geeksforgeeks.org/lodash-_-merge-method/
          memScore[key] = { ...memScore[key], ...partialScore[key] }
          break
        case 'locked':
          if (typeof value === 'boolean') { memScore.locked = value }
          break
        case 'autonWinner':
          if (typeof value === 'string') { memScore.autonWinner = value }

          break
        case 'metadata': {
          const metadata = partialScore.metadata
          if (metadata == null || typeof metadata !== 'object') break
          if (
            memScore.metadata == null ||
            typeof memScore.metadata !== 'object'
          ) break

          if ('red' in metadata) {
            memScore.metadata.red = {
              ...memScore.metadata.red,
              ...metadata.red
            }
          }

          if ('blue' in metadata) {
            memScore.metadata.blue = {
              ...memScore.metadata.blue,
              ...metadata.blue
            }
          }
        }
          break

        default: {
          const _exhaustiveCheck: never = key
          return _exhaustiveCheck
        }
      }
    }
    this.cache.update(memScore)
  }

  async saveScore (matchId: number): Promise<void> {
    const memScore = this.getWorkingScore(matchId)

    // used to validate completeness of fullMemScore
    const score: MatchScoreInPrismaCreationData = {
      redScore: JSON.stringify(memScore.redScore),
      blueScore: JSON.stringify(memScore.blueScore),
      metadata: JSON.stringify(memScore.metadata),
      autonWinner: memScore.autonWinner,
      matchId: Number(memScore.id)
    }
    await this.prisma.matchScore.create({ data: score })
  }

  private async setLockState (
    matchId: number,
    lockState: boolean
  ): Promise<void> {
    await this.updateScore(
      matchId,
      { locked: lockState }
    )
  }

  async lockScore (matchId: number): Promise<void> {
    await this.setLockState(matchId, true)
  }

  async unlockScore (matchId: number): Promise<void> {
    await this.setLockState(matchId, false)
  }
}
