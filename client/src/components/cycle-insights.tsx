import { TrendingUp } from 'lucide-react';
import { useCycleData } from '@/hooks/use-cycle-data';
import { format } from 'date-fns';

export default function CycleInsights() {
  const { getCycleStats } = useCycleData();
  const stats = getCycleStats();

  return (
    <div className="bg-card organic-shadow p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <TrendingUp className="w-5 h-5 text-secondary mr-3" />
        Cycle Insights
      </h3>
      
      <div className="space-y-4">
        <div className="p-3 bg-muted/30 rounded-lg flowing-border">
          <div className="text-sm text-muted-foreground">Average Cycle Length</div>
          <div className="text-lg font-semibold" data-testid="text-avg-cycle-length">
            {stats.averageCycleLength} days
          </div>
        </div>
        
        <div className="p-3 bg-muted/30 rounded-lg flowing-border">
          <div className="text-sm text-muted-foreground">Period Length</div>
          <div className="text-lg font-semibold" data-testid="text-period-length">
            {stats.averagePeriodLength} days
          </div>
        </div>
        
        <div className="p-3 bg-muted/30 rounded-lg flowing-border">
          <div className="text-sm text-muted-foreground">Cycles Tracked</div>
          <div className="text-lg font-semibold" data-testid="text-cycles-tracked">
            {stats.cyclesTracked} cycles
          </div>
        </div>

        {stats.lastPeriodStart && (
          <div className="p-3 bg-muted/30 rounded-lg flowing-border">
            <div className="text-sm text-muted-foreground">Last Period</div>
            <div className="text-lg font-semibold" data-testid="text-last-period">
              {format(stats.lastPeriodStart, 'MMM dd')}
            </div>
          </div>
        )}

        {stats.nextPeriodPrediction && (
          <div className="p-3 bg-muted/30 rounded-lg flowing-border">
            <div className="text-sm text-muted-foreground">Next Period</div>
            <div className="text-lg font-semibold" data-testid="text-next-period">
              {format(stats.nextPeriodPrediction, 'MMM dd')}
            </div>
          </div>
        )}
      </div>

      <button 
        className="w-full mt-4 text-primary text-sm font-medium hover:underline"
        data-testid="button-detailed-analytics"
      >
        View Detailed Analytics
      </button>
    </div>
  );
}
