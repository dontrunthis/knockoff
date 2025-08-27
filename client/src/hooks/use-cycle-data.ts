import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { storage } from '@/lib/storage';
import { CycleCalculator } from '@/lib/cycle-calculations';
import { DailyLog, Cycle, Settings } from '@shared/schema';
import { MoodType, SymptomType, CalendarDay, CycleStats } from '@/types/cycle';
import { useToast } from '@/hooks/use-toast';

export function useCycleData() {
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load data from localStorage
  useEffect(() => {
    try {
      const loadedLogs = storage.getDailyLogs();
      const loadedCycles = storage.getCycles();
      const loadedSettings = storage.getSettings();
      
      setDailyLogs(loadedLogs);
      setCycles(loadedCycles);
      setSettings(loadedSettings);
    } catch (error) {
      toast({
        title: "Error loading data",
        description: "There was an issue loading your cycle data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Save daily log
  const saveDailyLog = useCallback((date: Date, updates: Partial<DailyLog>) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const existingLog = dailyLogs.find(log => log.date === dateString);
    
    const newLog: DailyLog = {
      id: existingLog?.id || crypto.randomUUID(),
      date: dateString,
      symptoms: [],
      isPeriodDay: false,
      ...existingLog,
      ...updates,
    };

    try {
      storage.saveDailyLog(newLog);
      setDailyLogs(prev => {
        const filtered = prev.filter(log => log.date !== dateString);
        return [...filtered, newLog].sort((a, b) => a.date.localeCompare(b.date));
      });

      // Handle period cycle tracking
      if (updates.isPeriodDay !== undefined) {
        handlePeriodToggle(date, updates.isPeriodDay);
      }

      toast({
        title: "Entry saved",
        description: "Your daily log has been updated.",
      });
    } catch (error) {
      toast({
        title: "Error saving entry",
        description: "There was an issue saving your data.",
        variant: "destructive",
      });
    }
  }, [dailyLogs, toast]);

  // Handle period day toggle
  const handlePeriodToggle = useCallback((date: Date, isPeriodDay: boolean) => {
    if (!isPeriodDay) return;

    const dateString = format(date, 'yyyy-MM-dd');
    const currentCycle = cycles.find(c => !c.endDate);
    
    if (!currentCycle) {
      // Start new cycle
      const newCycle: Cycle = {
        id: crypto.randomUUID(),
        startDate: dateString,
      };
      
      setCycles(prev => [...prev, newCycle]);
      storage.saveCycle(newCycle);
    }
  }, [cycles]);

  // End current cycle
  const endCurrentCycle = useCallback((endDate: Date) => {
    const currentCycle = cycles.find(c => !c.endDate);
    if (!currentCycle) return;

    const startDate = new Date(currentCycle.startDate);
    const cycleLength = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Calculate period length
    const periodDays = dailyLogs.filter(log => 
      log.isPeriodDay && 
      log.date >= currentCycle.startDate && 
      log.date <= format(endDate, 'yyyy-MM-dd')
    );

    const updatedCycle: Cycle = {
      ...currentCycle,
      endDate: format(endDate, 'yyyy-MM-dd'),
      length: cycleLength,
      periodLength: periodDays.length,
    };

    setCycles(prev => prev.map(c => c.id === currentCycle.id ? updatedCycle : c));
    storage.saveCycle(updatedCycle);
  }, [cycles, dailyLogs]);

  // Generate calendar days
  const getCalendarDays = useCallback((year: number, month: number): CalendarDay[] => {
    if (!settings) return [];
    
    const calculator = new CycleCalculator(cycles, settings);
    return calculator.generateCalendarDays(year, month, dailyLogs);
  }, [cycles, settings, dailyLogs]);

  // Get cycle statistics
  const getCycleStats = useCallback((): CycleStats => {
    if (!settings) {
      return {
        averageCycleLength: 28,
        averagePeriodLength: 5,
        cyclesTracked: 0,
        currentCycleDay: 1,
      };
    }
    
    const calculator = new CycleCalculator(cycles, settings);
    const stats = calculator.getStats();
    const prediction = calculator.getCurrentPrediction();
    
    return {
      ...stats,
      currentCycleDay: prediction?.currentCycleDay || 1,
      nextPeriodPrediction: prediction?.nextPeriodDate,
    };
  }, [cycles, settings]);

  // Get current prediction
  const getCurrentPrediction = useCallback(() => {
    if (!settings) return null;
    
    const calculator = new CycleCalculator(cycles, settings);
    return calculator.getCurrentPrediction();
  }, [cycles, settings]);

  // Update settings
  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    if (!settings) return;
    
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    storage.saveSettings(updatedSettings);
    
    toast({
      title: "Settings updated",
      description: "Your preferences have been saved.",
    });
  }, [settings, toast]);

  // Export data
  const exportData = useCallback(() => {
    try {
      const data = storage.exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bloom-cycle-data-${format(new Date(), 'yyyy-MM-dd')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Data exported",
        description: "Your cycle data has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an issue exporting your data.",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Import data
  const importData = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result as string;
        storage.importData(data);
        
        // Reload data
        setDailyLogs(storage.getDailyLogs());
        setCycles(storage.getCycles());
        setSettings(storage.getSettings());
        
        toast({
          title: "Data imported",
          description: "Your cycle data has been successfully imported.",
        });
      } catch (error) {
        toast({
          title: "Import failed",
          description: "The file format is invalid or corrupted.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  }, [toast]);

  return {
    dailyLogs,
    cycles,
    settings,
    isLoading,
    saveDailyLog,
    endCurrentCycle,
    getCalendarDays,
    getCycleStats,
    getCurrentPrediction,
    updateSettings,
    exportData,
    importData,
  };
}
