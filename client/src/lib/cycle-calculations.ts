import { addDays, differenceInDays, format, startOfDay, isAfter, isBefore, isEqual } from 'date-fns';
import { Cycle, DailyLog, Settings } from '@shared/schema';
import { CyclePrediction, DayType, CalendarDay } from '@/types/cycle';

export class CycleCalculator {
  private cycles: Cycle[];
  private settings: Settings;

  constructor(cycles: Cycle[], settings: Settings) {
    this.cycles = cycles.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    this.settings = settings;
  }

  // Get current cycle prediction
  getCurrentPrediction(): CyclePrediction | null {
    const lastCompleteCycle = this.getLastCompleteCycle();
    const currentCycle = this.getCurrentCycle();
    
    if (!lastCompleteCycle && !currentCycle) {
      return null;
    }

    const referenceDate = currentCycle ? new Date(currentCycle.startDate) : new Date(lastCompleteCycle!.endDate!);
    const avgCycleLength = this.getAverageCycleLength();
    const today = startOfDay(new Date());

    let currentCycleStart: Date;
    let currentCycleDay: number;

    if (currentCycle) {
      currentCycleStart = new Date(currentCycle.startDate);
      currentCycleDay = differenceInDays(today, currentCycleStart) + 1;
    } else {
      // Predict next cycle start
      currentCycleStart = addDays(new Date(lastCompleteCycle!.startDate), avgCycleLength);
      currentCycleDay = differenceInDays(today, currentCycleStart) + 1;
      
      // If we're past the predicted start, adjust
      if (currentCycleDay > avgCycleLength) {
        const cyclesPassed = Math.floor(currentCycleDay / avgCycleLength);
        currentCycleStart = addDays(currentCycleStart, cyclesPassed * avgCycleLength);
        currentCycleDay = differenceInDays(today, currentCycleStart) + 1;
      }
    }

    const nextPeriodDate = addDays(currentCycleStart, avgCycleLength);
    const ovulationDate = addDays(currentCycleStart, avgCycleLength - this.settings.lutealPhaseLength);
    const fertileWindowStart = addDays(ovulationDate, -5);
    const fertileWindowEnd = addDays(ovulationDate, 1);

    return {
      nextPeriodDate,
      fertileWindowStart,
      fertileWindowEnd,
      ovulationDate,
      currentCycleDay: Math.max(1, currentCycleDay),
      currentCycleLength: avgCycleLength,
    };
  }

  // Get day type for calendar
  getDayType(date: Date, dailyLogs: DailyLog[]): DayType {
    const dateString = format(date, 'yyyy-MM-dd');
    const log = dailyLogs.find(l => l.date === dateString);
    
    if (log?.isPeriodDay) {
      return 'period';
    }

    const prediction = this.getCurrentPrediction();
    if (!prediction) {
      return 'normal';
    }

    const dayStart = startOfDay(date);
    
    if (isEqual(dayStart, startOfDay(prediction.ovulationDate))) {
      return 'ovulation';
    }

    if (
      (isAfter(dayStart, startOfDay(prediction.fertileWindowStart)) || isEqual(dayStart, startOfDay(prediction.fertileWindowStart))) &&
      (isBefore(dayStart, startOfDay(prediction.fertileWindowEnd)) || isEqual(dayStart, startOfDay(prediction.fertileWindowEnd)))
    ) {
      return 'fertile';
    }

    return 'normal';
  }

  // Generate calendar days for a month
  generateCalendarDays(year: number, month: number, dailyLogs: DailyLog[]): CalendarDay[] {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay()); // Start from Sunday
    
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay())); // End on Saturday
    
    const days: CalendarDay[] = [];
    const current = new Date(startDate);
    const today = startOfDay(new Date());

    while (current <= endDate) {
      const dateString = format(current, 'yyyy-MM-dd');
      const log = dailyLogs.find(l => l.date === dateString);
      
      days.push({
        date: new Date(current),
        dayNumber: current.getDate(),
        isCurrentMonth: current.getMonth() === month,
        isToday: isEqual(startOfDay(current), today),
        type: this.getDayType(current, dailyLogs),
        log: log ? {
          mood: log.mood,
          symptoms: log.symptoms,
          mucous: log.mucous,
          notes: log.notes,
          isPeriodDay: log.isPeriodDay,
        } : undefined,
      });
      
      current.setDate(current.getDate() + 1);
    }

    return days;
  }

  // Calculate statistics
  getStats(): {
    averageCycleLength: number;
    averagePeriodLength: number;
    cyclesTracked: number;
    lastPeriodStart?: Date;
  } {
    const completeCycles = this.cycles.filter(c => c.endDate);
    const averageCycleLength = completeCycles.length > 0 
      ? Math.round(completeCycles.reduce((sum, c) => sum + (c.length || 0), 0) / completeCycles.length)
      : this.settings.averageCycleLength;

    const averagePeriodLength = completeCycles.length > 0
      ? Math.round(completeCycles.reduce((sum, c) => sum + (c.periodLength || 0), 0) / completeCycles.length)
      : this.settings.averagePeriodLength;

    const lastCycle = this.cycles[this.cycles.length - 1];
    const lastPeriodStart = lastCycle ? new Date(lastCycle.startDate) : undefined;

    return {
      averageCycleLength,
      averagePeriodLength,
      cyclesTracked: this.cycles.length,
      lastPeriodStart,
    };
  }

  private getLastCompleteCycle(): Cycle | null {
    const completeCycles = this.cycles.filter(c => c.endDate);
    return completeCycles[completeCycles.length - 1] || null;
  }

  private getCurrentCycle(): Cycle | null {
    const incompleteCycles = this.cycles.filter(c => !c.endDate);
    return incompleteCycles[incompleteCycles.length - 1] || null;
  }

  private getAverageCycleLength(): number {
    const completeCycles = this.cycles.filter(c => c.length);
    if (completeCycles.length === 0) {
      return this.settings.averageCycleLength;
    }
    
    const totalLength = completeCycles.reduce((sum, cycle) => sum + (cycle.length || 0), 0);
    return Math.round(totalLength / completeCycles.length);
  }
}
