import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../utils/prisma/prisma.service'
import { DisplayConfig } from './displays.interface'

@Injectable()
export class DisplaysDatabase {
  constructor (
    private readonly prisma: PrismaService
  ) {}

  /** @throws {RecordNotFound} Will throw if display with {@link uuid} is not found */
  async setDisplayName (uuid: string, name: string): Promise<void> {
    await this.prisma.display.update({
      data: { name },
      where: { uuid }
    })
  }

  /** @throws {RecordNotFound} Will throw if display with {@link uuid} is not found */
  async setFieldId (uuid: string, fieldId: string): Promise<void> {
    await this.prisma.display.update({
      data: { fieldId },
      where: { uuid }
    })
  }

  /** @throws Will throw if an entry with {@link uuid} already exists */
  async createDisplay (uuid: string): Promise<void> {
    await this.prisma.display.create({
      data: { uuid, name: 'unnamed' }
    })
  }

  async getDisplay (uuid: string): Promise<DisplayConfig | null> {
    return await this.prisma.display.findUnique({ where: { uuid } })
  }

  async getAllDisplays (): Promise<DisplayConfig[]> {
    return await this.prisma.display.findMany()
  }

  async getFieldId (uuid: string): Promise<string | undefined | null> {
    return (await this.getDisplay(uuid))?.fieldId
  }

  async getName (uuid: string): Promise<string | undefined> {
    return (await this.getDisplay(uuid))?.name
  }
}
