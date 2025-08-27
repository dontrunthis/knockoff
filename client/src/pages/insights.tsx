import { useState } from 'react';
import { TrendingUp, Calendar, Clock, Activity } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { useCycleData } from '@/hooks/use-cycle-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function InsightsPage() {
  const { getCycleStats, dailyLogs, cycles, getCurrentPrediction } = useCycleData();
  const [selectedPeriod, setSelectedPeriod] = useState('3months');
  
  const stats = getCycleStats();
  const prediction = getCurrentPrediction();

  // Calculate symptom frequency
  const symptomCounts = dailyLogs.reduce((acc, log) => {
    log.symptoms.forEach(symptom => {
      acc[symptom] = (acc[symptom] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const topSymptoms = Object.entries(symptomCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  // Calculate mood frequency
  const moodCounts = dailyLogs.reduce((acc, log) => {
    if (log.mood) {
      acc[log.mood] = (acc[log.mood] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const topMoods = Object.entries(moodCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  // Calculate cycle regularity
  const completedCycles = cycles.filter(c => c.length);
  const cycleLengths = completedCycles.map(c => c.length!);
  const avgLength = cycleLengths.length > 0 ? Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length) : 28;
  const variance = cycleLengths.length > 0 ? Math.sqrt(cycleLengths.reduce((acc, length) => acc + Math.pow(length - avgLength, 2), 0) / cycleLengths.length) : 0;
  const regularity = Math.max(0, 100 - (variance * 10));

  return (
    <div className="max-w-6xl mx-auto px-4 pb-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Cycle Insights</h1>
        <p className="text-muted-foreground">
          Understanding your patterns and trends over time
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Cycle Overview */}
        <Card className="lg:col-span-2 organic-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 text-primary mr-2" />
              Cycle Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/30 rounded-lg flowing-border">
                <div className="text-2xl font-bold text-primary" data-testid="text-avg-cycle-insight">
                  {stats.averageCycleLength}
                </div>
                <div className="text-sm text-muted-foreground">Average Cycle</div>
                <div className="text-xs text-muted-foreground">days</div>
              </div>
              
              <div className="text-center p-4 bg-muted/30 rounded-lg flowing-border">
                <div className="text-2xl font-bold text-secondary" data-testid="text-period-length-insight">
                  {stats.averagePeriodLength}
                </div>
                <div className="text-sm text-muted-foreground">Period Length</div>
                <div className="text-xs text-muted-foreground">days</div>
              </div>
              
              <div className="text-center p-4 bg-muted/30 rounded-lg flowing-border">
                <div className="text-2xl font-bold text-accent" data-testid="text-cycles-tracked-insight">
                  {stats.cyclesTracked}
                </div>
                <div className="text-sm text-muted-foreground">Cycles Tracked</div>
                <div className="text-xs text-muted-foreground">total</div>
              </div>
            </div>

            {prediction && (
              <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
                <h4 className="font-semibold mb-2">Next Predictions</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Next Period:</span>
                    <div className="font-medium" data-testid="text-prediction-period">
                      {format(prediction.nextPeriodDate, 'MMM dd, yyyy')}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Ovulation:</span>
                    <div className="font-medium" data-testid="text-prediction-ovulation">
                      {format(prediction.ovulationDate, 'MMM dd, yyyy')}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cycle Regularity */}
        <Card className="organic-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 text-secondary mr-2" />
              Regularity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <div className="text-3xl font-bold" data-testid="text-regularity-score">
                {Math.round(regularity)}%
              </div>
              <div className="text-sm text-muted-foreground">Regularity Score</div>
            </div>
            
            <Progress value={regularity} className="mb-4" />
            
            <div className="text-xs text-muted-foreground text-center">
              {regularity >= 80 ? 'Very Regular' : 
               regularity >= 60 ? 'Mostly Regular' : 
               regularity >= 40 ? 'Somewhat Irregular' : 
               'Irregular'}
            </div>
            
            {cycleLengths.length >= 3 && (
              <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                <div className="text-xs text-muted-foreground">Cycle Range</div>
                <div className="text-sm font-medium">
                  {Math.min(...cycleLengths)} - {Math.max(...cycleLengths)} days
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Symptoms */}
        <Card className="organic-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 text-accent mr-2" />
              Common Symptoms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topSymptoms.length > 0 ? (
                topSymptoms.map(([symptom, count]) => (
                  <div key={symptom} className="flex items-center justify-between">
                    <span className="text-sm capitalize" data-testid={`text-symptom-${symptom}`}>
                      {symptom.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-muted-foreground" data-testid={`text-symptom-count-${symptom}`}>
                      {count}x
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No symptoms tracked yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Mood Trends */}
        <Card className="organic-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 text-primary mr-2" />
              Mood Patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topMoods.length > 0 ? (
                topMoods.map(([mood, count]) => (
                  <div key={mood} className="flex items-center justify-between">
                    <span className="text-sm capitalize" data-testid={`text-mood-${mood}`}>
                      {mood}
                    </span>
                    <span className="text-xs text-muted-foreground" data-testid={`text-mood-count-${mood}`}>
                      {count}x
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No moods tracked yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Data Summary */}
        <Card className="organic-shadow">
          <CardHeader>
            <CardTitle>Data Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Log Entries</span>
                <span className="text-sm font-medium" data-testid="text-total-logs">
                  {dailyLogs.length}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Period Days Logged</span>
                <span className="text-sm font-medium" data-testid="text-period-days">
                  {dailyLogs.filter(log => log.isPeriodDay).length}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Days with Symptoms</span>
                <span className="text-sm font-medium" data-testid="text-symptom-days">
                  {dailyLogs.filter(log => log.symptoms.length > 0).length}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Days with Mood</span>
                <span className="text-sm font-medium" data-testid="text-mood-days">
                  {dailyLogs.filter(log => log.mood).length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
