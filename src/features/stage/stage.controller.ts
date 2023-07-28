import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { StageService } from './stage.service';

@Controller('stage')
export class StageController {

    constructor(private readonly stageService: StageService) { }

    @EventPattern('teamList')
    handleMessage(message: any) {
        this.stageService.receivedTeams()
    }
}
