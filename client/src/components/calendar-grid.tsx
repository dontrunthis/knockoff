import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths } from 'date-fns';
import { CalendarDay } from '@/types/cycle';
import { useCycleData } from '@/hooks/use-cycle-data';

interface CalendarGridProps {
  onDayClick?: (day: CalendarDay) => void;
}

export default function CalendarGrid({ onDayClick }: CalendarGridProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { getCalendarDays } = useCycleData();
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const days = getCalendarDays(year, month);

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1));
  };

  const getDayClassName = (day: CalendarDay) => {
    const baseClasses = 'cycle-day';
    const classes = [baseClasses];
    
    if (!day.isCurrentMonth) {
      classes.push('text-muted-foreground/50');
    }
    
    if (day.isToday) {
      classes.push('today');
    }
    
    switch (day.type) {
      case 'period':
        classes.push('period-day');
        break;
      case 'fertile':
        classes.push('fertile-day');
        break;
      case 'ovulation':
        classes.push('ovulation-day');
        break;
    }
    
    return classes.join(' ');
  };

  return (
    <div className="bg-card organic-shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold" data-testid="text-current-month">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex space-x-2">
          <button
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            onClick={() => navigateMonth('prev')}
            data-testid="button-prev-month"
          >
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <button
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            onClick={() => navigateMonth('next')}
            data-testid="button-next-month"
          >
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Calendar Header */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {weekdays.map(day => (
          <div
            key={day}
            className="text-center text-sm font-medium text-muted-foreground py-2"
            data-testid={`text-weekday-${day.toLowerCase()}`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => (
          <button
            key={`${day.date.getTime()}-${index}`}
            className={getDayClassName(day)}
            onClick={() => onDayClick?.(day)}
            data-testid={`button-day-${day.dayNumber}`}
          >
            {day.dayNumber}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 justify-center text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 period-day rounded-full" data-testid="legend-period"></div>
          <span>Period</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 fertile-day rounded-full" data-testid="legend-fertile"></div>
          <span>Fertile</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 ovulation-day rounded-full" data-testid="legend-ovulation"></div>
          <span>Ovulation</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-primary rounded-full" data-testid="legend-today"></div>
          <span>Today</span>
        </div>
      </div>
    </div>
  );
}
