import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { InspectionService } from './inspection.service';
import { EventPattern } from '@nestjs/microservices';
import { EVENT_STAGE, INSPECTION_STAGE } from '@18x18az/rosetta';

@Controller('inspection')
export class InspectionController {
    constructor(private readonly inspectionService: InspectionService) {
    }

    @EventPattern('teamList')
    handleMessage(message: any) {
        this.inspectionService.loadTeams(message);
    }

    @EventPattern('eventStage')
    handleEventStage(message: any) {
        this.inspectionService.setEventStage(message as EVENT_STAGE);
    }

    @Post(':teamNumber/checkedIn')
    async markCheckedIn(@Param() params: any): Promise<void> {
        await this.inspectionService.markCheckinStage(params.teamNumber, INSPECTION_STAGE.CHECKED_IN);
    }

    @Post(':teamNumber/notHere')
    async markNotHere(@Param() params: any): Promise<void> {
        await this.inspectionService.markCheckinStage(params.teamNumber, INSPECTION_STAGE.NOT_HERE);
    }

    @Post(':teamNumber/noShow')
    async markNoShow(@Param() params: any): Promise<void> {
        await this.inspectionService.markCheckinStage(params.teamNumber, INSPECTION_STAGE.NO_SHOW);
    }

    @Post(':teamNumber/criteria/:criteriaId')
    async markMetOrNot(@Param() params: any, @Query() query: any): Promise<void> {
        await this.inspectionService.markMetOrNot(params.teamNumber, parseInt(params.criteriaId), query.isMet === 'true');
    }

    @Get('checklist')
    async getChecklist() {
        return this.inspectionService.getChecklist();
    }

    @Get(':teamNumber')
    async getTeamProgress(@Param() params: any) {
        return await this.inspectionService.getTeamProgress(params.teamNumber);
    }
}
