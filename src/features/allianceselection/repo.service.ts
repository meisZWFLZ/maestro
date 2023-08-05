import { Inject, Injectable } from '@nestjs/common'
import { PrismaService } from '../../utils/prisma/prisma.service'

@Injectable()
export class AllianceSelectionDatabase {
    constructor (private readonly prisma: PrismaService) {}

    // initialize status (?)

    // update alliance selection status

    // reset alliance selection

    // undo action
}