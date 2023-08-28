import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { PublishService } from '../../utils/publish/publish.service'

@Injectable()
export class AllianceSelectionService {
    constructor (
        private readonly publisher: PublishService
    ) { }

    async loadRankings (divisionId: string, teams: string[]): Promise<void> {

    }

    async pick (divisionId: string, team: string): Promise<boolean> {
        return true; 
    }

    async decline (divisionId: string): Promise<void> {

    }

    async accept (divisionId: string): Promise<void> {
        
    }

    async cancel (divisionId: string): Promise<void> {
        
    }

    async undo (divisionId: string): Promise<void> {
        
    }

    async noShow (divisionId: string): Promise<void> {
        
    }
}