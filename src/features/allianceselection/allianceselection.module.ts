import { Module } from '@nestjs/common'
import { PrismaService } from '../../utils/prisma/prisma.service';
import { AllianceSelectionService } from './allianceselection.service';
import { AllianceSelectionDatabase } from './repo.service';
import { AllianceSelectionController } from './allianceselection.controller';

@Module({
    providers: [AllianceSelectionService, PrismaService, AllianceSelectionDatabase],
    controllers: [AllianceSelectionController]
})
export class AllianceSelectionModule {}
