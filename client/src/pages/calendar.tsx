import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarHeart, Lightbulb } from 'lucide-react';
import CalendarGrid from '@/components/calendar-grid';
import QuickLog from '@/components/quick-log';
import CycleInsights from '@/components/cycle-insights';
import { useCycleData } from '@/hooks/use-cycle-data';
import { CalendarDay } from '@/types/cycle';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function CalendarPage() {
  const { getCurrentPrediction, getCycleStats, isLoading } = useCycleData();
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  
  const prediction = getCurrentPrediction();
  const stats = getCycleStats();

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 pb-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded mb-4"></div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="h-64 bg-card rounded-lg mb-6"></div>
              <div className="h-96 bg-card rounded-lg"></div>
            </div>
            <div className="space-y-6">
              <div className="h-64 bg-card rounded-lg"></div>
              <div className="h-48 bg-card rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleDayClick = (day: CalendarDay) => {
    setSelectedDay(day);
  };

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Calendar Section */}
          <div className="lg:col-span-2">
            {/* Current Cycle Overview */}
            <div className="bg-card organic-shadow p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <CalendarHeart className="w-5 h-5 text-primary mr-3" />
                Current Cycle - Day <span className="text-primary ml-1" data-testid="text-current-cycle-day">
                  {stats.currentCycleDay}
                </span>
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/30 rounded-lg flowing-border">
                  <div className="text-2xl mb-2">🩸</div>
                  <div className="text-sm text-muted-foreground">Next Period</div>
                  <div className="font-semibold" data-testid="text-next-period-prediction">
                    {prediction?.nextPeriodDate ? format(prediction.nextPeriodDate, 'MMM dd') : 'Calculating...'}
                  </div>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg flowing-border">
                  <div className="text-2xl mb-2">🌸</div>
                  <div className="text-sm text-muted-foreground">Fertile Window</div>
                  <div className="font-semibold" data-testid="text-fertile-window">
                    {prediction?.fertileWindowStart && prediction?.fertileWindowEnd 
                      ? `${format(prediction.fertileWindowStart, 'MMM dd')}-${format(prediction.fertileWindowEnd, 'dd')}`
                      : 'Calculating...'
                    }
                  </div>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg flowing-border">
                  <div className="text-2xl mb-2">🥚</div>
                  <div className="text-sm text-muted-foreground">Ovulation</div>
                  <div className="font-semibold" data-testid="text-ovulation-prediction">
                    {prediction?.ovulationDate ? format(prediction.ovulationDate, 'MMM dd') : 'Calculating...'}
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar Grid */}
            <CalendarGrid onDayClick={handleDayClick} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Log */}
            <div data-testid="quick-log-section">
              <QuickLog />
            </div>

            {/* Cycle Insights */}
            <CycleInsights />

            {/* Educational Tip */}
            <div className="bg-gradient-to-br from-accent/20 to-secondary/20 p-6 rounded-lg flowing-border">
              <h3 className="font-semibold mb-2 flex items-center">
                <Lightbulb className="w-4 h-4 text-accent mr-2" />
                Did you know?
              </h3>
              <p className="text-sm text-muted-foreground">
                Your basal body temperature typically rises by 0.5-1°F after ovulation and stays elevated until your next period.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Day Details Modal */}
      <Dialog open={!!selectedDay} onOpenChange={() => setSelectedDay(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle data-testid="dialog-title-day-details">
              {selectedDay && format(selectedDay.date, 'EEEE, MMMM do')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedDay?.log ? (
              <>
                {selectedDay.log.isPeriodDay && (
                  <div className="flex items-center text-primary">
                    <span className="w-3 h-3 bg-primary rounded-full mr-2"></span>
                    Period day
                  </div>
                )}
                {selectedDay.log.mood && (
                  <div className="flex items-center">
                    <span className="mr-2">Mood:</span>
                    <span className="capitalize">{selectedDay.log.mood}</span>
                  </div>
                )}
                {selectedDay.log.symptoms.length > 0 && (
                  <div>
                    <span className="font-medium">Symptoms:</span>
                    <ul className="mt-1 space-y-1">
                      {selectedDay.log.symptoms.map(symptom => (
                        <li key={symptom} className="text-sm text-muted-foreground capitalize">
                          • {symptom.replace('_', ' ')}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {selectedDay.log.notes && (
                  <div>
                    <span className="font-medium">Notes:</span>
                    <p className="mt-1 text-sm text-muted-foreground">{selectedDay.log.notes}</p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-muted-foreground">No log entry for this day.</p>
            )}
            
            <div className="flex items-center justify-center mt-4">
              <div className={`w-4 h-4 rounded-full mr-2 ${
                selectedDay?.type === 'period' ? 'period-day' :
                selectedDay?.type === 'fertile' ? 'fertile-day' :
                selectedDay?.type === 'ovulation' ? 'ovulation-day' :
                'bg-muted'
              }`}></div>
              <span className="capitalize text-sm">
                {selectedDay?.type === 'normal' ? 'Regular day' : selectedDay?.type}
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
