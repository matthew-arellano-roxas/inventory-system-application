import { prisma } from '@root/lib/prisma';

export class SystemSettingsService {
  private static instance: SystemSettingsService;
  private inMemorySystemSettings: Map<string, string>;

  constructor() {
    this.inMemorySystemSettings = new Map<string, string>();
  }

  public async loadSystemSettings() {
    const systemSettings = await prisma.systemSettings.findMany();
    for (const setting of systemSettings) {
      this.inMemorySystemSettings.set(setting.key, setting.value);
    }
  }

  public async setSystemSettings(existingKey: string, value: string) {
    return await prisma.systemSettings.updateMany({
      data: {
        key: existingKey,
        value,
      },
    });
  }

  public async getSystemSettings() {
    return await prisma.systemSettings.findMany();
  }

  public static getInstance() {
    if (!SystemSettingsService.instance) {
      SystemSettingsService.instance = new SystemSettingsService();
    }
    return SystemSettingsService.instance;
  }

  public async getSystemSettingByKey(key: string) {
    return await prisma.systemSettings.findFirst({
      where: { key },
    });
  }

  public async createSystemSetting(key: string, value: string) {
    return await prisma.systemSettings.create({
      data: {
        key,
        value,
      },
    });
  }
}

export default SystemSettingsService.getInstance();
