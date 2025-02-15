import { Module } from '@nestjs/common'
import { QualScheduleController } from './qual-schedule.controller'
import { QualScheduleService } from './qual-schedule.service'
import { StorageModule } from '../../../utils/storage/storage.module'
import { PublishModule } from '../../../utils/publish/publish.module'
import { PrismaService } from 'src/utils/prisma/prisma.service'
import { QualScheduleRepo } from './qual-schedule.repo'
import { QualSchedulePublisher } from './qual-schedule.publisher'

@Module({
  imports: [StorageModule, PublishModule],
  controllers: [QualScheduleController],
  providers: [QualScheduleService, QualScheduleService, PrismaService, QualScheduleRepo, QualSchedulePublisher]
})
export class QualScheduleModule {}
