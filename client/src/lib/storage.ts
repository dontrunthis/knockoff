import { DailyLog, Cycle, Settings, PeriodEntry } from "@shared/schema";

const STORAGE_KEYS = {
  DAILY_LOGS: 'bloom_daily_logs',
  CYCLES: 'bloom_cycles',
  SETTINGS: 'bloom_settings',
  PERIOD_ENTRIES: 'bloom_period_entries',
} as const;

class LocalStorage {
  // Daily logs
  getDailyLogs(): DailyLog[] {
    const data = localStorage.getItem(STORAGE_KEYS.DAILY_LOGS);
    return data ? JSON.parse(data) : [];
  }

  saveDailyLog(log: DailyLog): void {
    const logs = this.getDailyLogs();
    const existingIndex = logs.findIndex(l => l.date === log.date);
    
    if (existingIndex >= 0) {
      logs[existingIndex] = log;
    } else {
      logs.push(log);
    }
    
    localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(logs));
  }

  deleteDailyLog(date: string): void {
    const logs = this.getDailyLogs().filter(l => l.date !== date);
    localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(logs));
  }

  // Cycles
  getCycles(): Cycle[] {
    const data = localStorage.getItem(STORAGE_KEYS.CYCLES);
    return data ? JSON.parse(data) : [];
  }

  saveCycle(cycle: Cycle): void {
    const cycles = this.getCycles();
    const existingIndex = cycles.findIndex(c => c.id === cycle.id);
    
    if (existingIndex >= 0) {
      cycles[existingIndex] = cycle;
    } else {
      cycles.push(cycle);
    }
    
    localStorage.setItem(STORAGE_KEYS.CYCLES, JSON.stringify(cycles));
  }

  deleteCycle(id: string): void {
    const cycles = this.getCycles().filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CYCLES, JSON.stringify(cycles));
  }

  // Period entries
  getPeriodEntries(): PeriodEntry[] {
    const data = localStorage.getItem(STORAGE_KEYS.PERIOD_ENTRIES);
    return data ? JSON.parse(data) : [];
  }

  savePeriodEntry(entry: PeriodEntry): void {
    const entries = this.getPeriodEntries();
    const existingIndex = entries.findIndex(e => e.date === entry.date);
    
    if (existingIndex >= 0) {
      entries[existingIndex] = entry;
    } else {
      entries.push(entry);
    }
    
    localStorage.setItem(STORAGE_KEYS.PERIOD_ENTRIES, JSON.stringify(entries));
  }

  deletePeriodEntry(date: string): void {
    const entries = this.getPeriodEntries().filter(e => e.date !== date);
    localStorage.setItem(STORAGE_KEYS.PERIOD_ENTRIES, JSON.stringify(entries));
  }

  // Settings
  getSettings(): Settings {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    const defaultSettings: Settings = {
      averageCycleLength: 28,
      averagePeriodLength: 5,
      lutealPhaseLength: 14,
      reminders: {
        periodReminder: true,
        ovulationReminder: true,
      },
    };
    
    return data ? { ...defaultSettings, ...JSON.parse(data) } : defaultSettings;
  }

  saveSettings(settings: Settings): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }

  // Data export/import
  exportData(): string {
    const data = {
      dailyLogs: this.getDailyLogs(),
      cycles: this.getCycles(),
      periodEntries: this.getPeriodEntries(),
      settings: this.getSettings(),
      exportDate: new Date().toISOString(),
      version: '1.0',
    };
    
    return JSON.stringify(data, null, 2);
  }

  importData(jsonData: string): void {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.dailyLogs) {
        localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(data.dailyLogs));
      }
      
      if (data.cycles) {
        localStorage.setItem(STORAGE_KEYS.CYCLES, JSON.stringify(data.cycles));
      }
      
      if (data.periodEntries) {
        localStorage.setItem(STORAGE_KEYS.PERIOD_ENTRIES, JSON.stringify(data.periodEntries));
      }
      
      if (data.settings) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
      }
    } catch (error) {
      throw new Error('Invalid data format');
    }
  }

  // Clear all data
  clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}

export const storage = new LocalStorage();
