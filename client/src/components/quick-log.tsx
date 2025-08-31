import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { PlusCircle, Droplet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useCycleData } from '@/hooks/use-cycle-data';
import { MoodType, SymptomType, MucousType } from '@/types/cycle';

const moodOptions: { value: MoodType; emoji: string; label: string; color: string }[] = [
  { value: 'happy', emoji: '😊', label: 'Happy', color: 'bg-yellow-100 text-yellow-600' },
  { value: 'sad', emoji: '😢', label: 'Sad', color: 'bg-blue-100 text-blue-600' },
  { value: 'irritated', emoji: '😤', label: 'Irritated', color: 'bg-red-100 text-red-600' },
  { value: 'energetic', emoji: '⚡', label: 'Energetic', color: 'bg-green-100 text-green-600' },
  { value: 'tired', emoji: '😴', label: 'Tired', color: 'bg-purple-100 text-purple-600' },
  { value: 'romantic', emoji: '💕', label: 'Romantic', color: 'bg-pink-100 text-pink-600' },
];

const symptomOptions: { value: SymptomType; label: string }[] = [
  { value: 'cramps', label: 'Cramps' },
  { value: 'headache', label: 'Headache' },
  { value: 'bloating', label: 'Bloating' },
  { value: 'tender_breasts', label: 'Tender breasts' },
  { value: 'acne', label: 'Acne' },
  { value: 'fatigue', label: 'Fatigue' },
  { value: 'nausea', label: 'Nausea' },
];

const mucousOptions: { value: MucousType; label: string; description: string }[] = [
  { value: 'dry', label: 'Dry', description: 'No noticeable discharge' },
  { value: 'sticky', label: 'Sticky', description: 'Thick, tacky texture' },
  { value: 'creamy', label: 'Creamy', description: 'Smooth, lotion-like' },
  { value: 'watery', label: 'Watery', description: 'Thin, watery consistency' },
  { value: 'egg_white', label: 'Egg White', description: 'Clear, stretchy (fertile)' },
  { value: 'unusual', label: 'Unusual', description: 'Different color/smell' },
];

export default function QuickLog() {
  const { dailyLogs, saveDailyLog } = useCycleData();
  const [selectedDate] = useState(new Date());
  const [isPeriodDay, setIsPeriodDay] = useState(false);
  const [selectedMood, setSelectedMood] = useState<MoodType | undefined>();
  const [selectedSymptoms, setSelectedSymptoms] = useState<SymptomType[]>([]);
  const [selectedMucous, setSelectedMucous] = useState<MucousType | undefined>();
  const [notes, setNotes] = useState('');

  const today = format(selectedDate, 'yyyy-MM-dd');
  const todayLog = dailyLogs.find(log => log.date === today);

  // Load existing data for today
  useEffect(() => {
    if (todayLog) {
      setIsPeriodDay(todayLog.isPeriodDay);
      setSelectedMood(todayLog.mood);
      setSelectedSymptoms(todayLog.symptoms);
      setSelectedMucous(todayLog.mucous);
      setNotes(todayLog.notes || '');
    } else {
      setIsPeriodDay(false);
      setSelectedMood(undefined);
      setSelectedSymptoms([]);
      setSelectedMucous(undefined);
      setNotes('');
    }
  }, [todayLog]);

  const handleMoodSelect = (mood: MoodType) => {
    setSelectedMood(selectedMood === mood ? undefined : mood);
  };

  const handleSymptomToggle = (symptom: SymptomType) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSave = () => {
    saveDailyLog(selectedDate, {
      isPeriodDay,
      mood: selectedMood,
      symptoms: selectedSymptoms,
      mucous: selectedMucous,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <div className="bg-card organic-shadow p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <PlusCircle className="w-5 h-5 text-primary mr-3" />
        Quick Log
      </h3>
      
      {/* Period Toggle */}
      <div className="mb-4">
        <label className="flex items-center justify-between p-3 bg-muted/30 rounded-lg flowing-border cursor-pointer">
          <span className="flex items-center">
            <Droplet className="w-4 h-4 text-primary mr-2" />
            Period Today
          </span>
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only"
              checked={isPeriodDay}
              onChange={(e) => setIsPeriodDay(e.target.checked)}
              data-testid="checkbox-period-today"
            />
            <div className={`w-12 h-6 rounded-full transition-colors ${
              isPeriodDay ? 'bg-primary' : 'bg-muted'
            }`}>
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                isPeriodDay ? 'translate-x-6' : 'translate-x-0.5'
              }`}></div>
            </div>
          </div>
        </label>
      </div>

      {/* Mood Tracking */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">How are you feeling?</label>
        <div className="flex flex-wrap gap-2 justify-center">
          {moodOptions.map((mood) => (
            <button
              key={mood.value}
              className={`mood-icon ${mood.color} ${
                selectedMood === mood.value ? 'ring-2 ring-primary' : ''
              }`}
              title={mood.label}
              onClick={() => handleMoodSelect(mood.value)}
              data-testid={`button-mood-${mood.value}`}
            >
              {mood.emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Symptoms */}
      <div className="mb-4">
        <label className="block text-base font-medium mb-2">Symptoms</label>
        <div className="grid grid-cols-2 gap-2">
          {symptomOptions.map((symptom) => (
            <button
              key={symptom.value}
              className={`p-3 text-left rounded-lg border transition-colors ${
                selectedSymptoms.includes(symptom.value)
                  ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                  : 'border-border bg-muted/30 hover:bg-muted/50'
              }`}
              onClick={() => handleSymptomToggle(symptom.value)}
              data-testid={`button-symptom-${symptom.value}`}
            >
              <div className="font-medium text-sm">{symptom.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Cervical Mucous */}
      <div className="mb-4">
        <label className="block text-base font-medium mb-2">Cervical Mucous</label>
        <div className="grid grid-cols-2 gap-2">
          {mucousOptions.map((mucous) => (
            <button
              key={mucous.value}
              className={`p-3 text-left rounded-lg border transition-colors ${
                selectedMucous === mucous.value
                  ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                  : 'border-border bg-muted/30 hover:bg-muted/50'
              }`}
              onClick={() => setSelectedMucous(selectedMucous === mucous.value ? undefined : mucous.value)}
              data-testid={`button-mucous-${mucous.value}`}
            >
              <div className="font-medium text-sm">{mucous.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{mucous.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="mb-4">
        <label className="block text-base font-medium mb-2">Notes</label>
        <Textarea
          className="w-full p-3 border border-input rounded-lg flowing-border resize-none"
          rows={3}
          placeholder="Any notes about today..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          data-testid="textarea-notes"
        />
      </div>

      <Button
        className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg flowing-border hover:bg-primary/90 transition-colors"
        onClick={handleSave}
        data-testid="button-save-entry"
      >
        Save Entry
      </Button>
    </div>
  );
}
