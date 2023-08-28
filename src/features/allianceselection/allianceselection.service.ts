import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { PublishService } from '../../utils/publish/publish.service'

@Injectable()
export class AllianceSelectionService {
    constructor (
        private readonly publisher: PublishService
    ) { }

    async loadRankings (teams: string[]): Promise<void> {
        
    }
}