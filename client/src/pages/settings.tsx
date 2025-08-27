import { useState, useRef } from 'react';
import { Shield, Download, Upload, Trash2, Bell, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useCycleData } from '@/hooks/use-cycle-data';
import { storage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const { settings, updateSettings, exportData, importData } = useCycleData();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [localSettings, setLocalSettings] = useState(settings);

  if (!settings || !localSettings) {
    return <div>Loading...</div>;
  }

  const handleSettingChange = (key: string, value: any) => {
    const updatedSettings = { ...localSettings };
    
    if (key.includes('.')) {
      const [parent, child] = key.split('.');
      updatedSettings[parent as keyof typeof updatedSettings] = {
        ...updatedSettings[parent as keyof typeof updatedSettings],
        [child]: value,
      };
    } else {
      (updatedSettings as any)[key] = value;
    }
    
    setLocalSettings(updatedSettings);
    updateSettings(updatedSettings);
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importData(file);
      // Reset the input
      event.target.value = '';
    }
  };

  const handleClearData = () => {
    storage.clearAllData();
    window.location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Customize your cycle tracking experience
        </p>
      </div>

      <div className="space-y-6">
        {/* Cycle Settings */}
        <Card className="organic-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 text-primary mr-2" />
              Cycle Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="avg-cycle-length">Average Cycle Length (days)</Label>
                <Input
                  id="avg-cycle-length"
                  type="number"
                  min="21"
                  max="35"
                  value={localSettings.averageCycleLength}
                  onChange={(e) => handleSettingChange('averageCycleLength', parseInt(e.target.value))}
                  data-testid="input-avg-cycle-length"
                />
                <p className="text-xs text-muted-foreground">
                  Typical range: 21-35 days
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="avg-period-length">Average Period Length (days)</Label>
                <Input
                  id="avg-period-length"
                  type="number"
                  min="3"
                  max="7"
                  value={localSettings.averagePeriodLength}
                  onChange={(e) => handleSettingChange('averagePeriodLength', parseInt(e.target.value))}
                  data-testid="input-avg-period-length"
                />
                <p className="text-xs text-muted-foreground">
                  Typical range: 3-7 days
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="luteal-phase">Luteal Phase Length (days)</Label>
              <Input
                id="luteal-phase"
                type="number"
                min="10"
                max="16"
                value={localSettings.lutealPhaseLength}
                onChange={(e) => handleSettingChange('lutealPhaseLength', parseInt(e.target.value))}
                data-testid="input-luteal-phase-length"
              />
              <p className="text-xs text-muted-foreground">
                The time between ovulation and your next period. Usually 12-14 days.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="organic-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="w-5 h-5 text-secondary mr-2" />
              Reminders
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="period-reminder">Period Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified before your predicted period
                </p>
              </div>
              <Switch
                id="period-reminder"
                checked={localSettings.reminders.periodReminder}
                onCheckedChange={(checked) => handleSettingChange('reminders.periodReminder', checked)}
                data-testid="switch-period-reminder"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="ovulation-reminder">Ovulation Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified during your fertile window
                </p>
              </div>
              <Switch
                id="ovulation-reminder"
                checked={localSettings.reminders.ovulationReminder}
                onCheckedChange={(checked) => handleSettingChange('reminders.ovulationReminder', checked)}
                data-testid="switch-ovulation-reminder"
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="organic-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 text-accent mr-2" />
              Data & Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center space-x-2"
                onClick={exportData}
                data-testid="button-export-data"
              >
                <Download className="w-4 h-4" />
                <span>Export Data</span>
              </Button>

              <Button
                variant="outline"
                className="w-full flex items-center justify-center space-x-2"
                onClick={handleImport}
                data-testid="button-import-data"
              >
                <Upload className="w-4 h-4" />
                <span>Import Data</span>
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
              data-testid="input-file-import"
            />

            <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg">
              <div className="flex items-center text-green-700 dark:text-green-300">
                <Shield className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">100% Private</span>
              </div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                All data is stored locally on your device. Nothing is sent to external servers.
              </p>
            </div>

            <div className="pt-4 border-t">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="w-full flex items-center justify-center space-x-2"
                    data-testid="button-clear-data"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Clear All Data</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete all your
                      cycle data, logs, and settings from this device.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel data-testid="button-cancel-clear">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleClearData}
                      data-testid="button-confirm-clear"
                    >
                      Delete Everything
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>

        {/* App Information */}
        <Card className="organic-shadow">
          <CardHeader>
            <CardTitle>About Bloom</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Version</span>
                <span data-testid="text-app-version">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Data Storage</span>
                <span data-testid="text-storage-type">Local Browser Storage</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Privacy</span>
                <span className="text-green-600 dark:text-green-400" data-testid="text-privacy-status">
                  Completely Private
                </span>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground">
                Bloom is designed with privacy as the top priority. Your personal health data
                never leaves your device and is not shared with any third parties.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
