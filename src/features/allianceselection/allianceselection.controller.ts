import { Controller, Get, Param, Post, Query } from '@nestjs/common'
import { EventPattern } from '@nestjs/microservices'
import { AllianceSelectionService } from './allianceselection.service'

@Controller('allianceselection')
export class AllianceSelectionController {
    constructor (private readonly allianceSelectionService: AllianceSelectionService ) {

    }

    @Post(':division/rankings')
    async setRankings (@Param() params: any, @Query() query: any): Promise<void> {
        
    }

    @Post(':division/pick')
    async pick (@Param() params: any): Promise<void> {

    }

    @Post(':division/decline')
    async decline (@Param() params: any): Promise<void> {

    }

    @Post(':division/accept')
    async accept (@Param() params: any): Promise<void> {

    }

    @Post(':division/cancel')
    async cancel (@Param() params: any): Promise<void> {

    }

    @Post(':division/undo')
    async undo (@Param() params: any): Promise<void> {

    }

    @Post(':division/noShow')
    async noShow (@Param() params: any): Promise<void> {

    }

    // get:
    // history
    // pickable
    // alliances
    // picking
    // selected
}