export type MoodType = 'happy' | 'sad' | 'irritated' | 'energetic' | 'tired' | 'romantic';

export type SymptomType = 'cramps' | 'headache' | 'bloating' | 'tender_breasts' | 'acne' | 'fatigue' | 'nausea';

export type FlowType = 'light' | 'medium' | 'heavy';

export type MucousType = 'dry' | 'sticky' | 'creamy' | 'watery' | 'egg_white' | 'unusual';

export type DayType = 'normal' | 'period' | 'fertile' | 'ovulation';

export interface CalendarDay {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  type: DayType;
  log?: {
    mood?: MoodType;
    symptoms: SymptomType[];
    mucous?: MucousType;
    notes?: string;
    isPeriodDay: boolean;
    flow?: FlowType;
  };
}

export interface CycleStats {
  averageCycleLength: number;
  averagePeriodLength: number;
  cyclesTracked: number;
  lastPeriodStart?: Date;
  nextPeriodPrediction?: Date;
  currentCycleDay: number;
}
