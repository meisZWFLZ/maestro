import { Inject, Injectable } from '@nestjs/common'
import { PrismaService } from '../../utils/prisma/prisma.service'

@Injectable()
export class AllianceSelectionDatabase {
    constructor (private readonly prisma: PrismaService) {} // TODO cache?

    // load teams
    async addQualRanking (division: number, team: string, ranking: number) {
        //this.prisma.QualRankings.upsert
    }

    // initialize status (?)

    // update alliance selection status

    // reset alliance selection

    // undo action
}