import { useState, useEffect } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Exercise, TemplateExercise, SetType, SET_TYPE_NAMES } from '@/types/workout';
import { cn } from '@/lib/utils';

interface TemplateExerciseConfigProps {
  exercise: Exercise;
  initialConfig: Partial<TemplateExercise>;
  onConfigChange: (config: Partial<TemplateExercise>) => void;
  onRemove: () => void;
}

const allSetTypes: SetType[] = ['WARMUP', 'WORKING', 'MYOREP', 'FAILURE'];

export function TemplateExerciseConfig({
  exercise,
  initialConfig,
  onConfigChange,
  onRemove,
}: TemplateExerciseConfigProps) {
  const [defaultSets, setDefaultSets] = useState(initialConfig.default_sets || 3);
  const [defaultReps, setDefaultReps] = useState<string>(
    initialConfig.default_reps ? initialConfig.default_reps.toString() : '10'
  );
  const [defaultSetTypes, setDefaultSetTypes] = useState<SetType[]>(initialConfig.default_set_types || ['WORKING']);

  useEffect(() => {
    onConfigChange({
      default_sets: defaultSets,
      default_reps: parseInt(defaultReps) || 0, // Simplified for now, handle ranges later
      default_set_types: defaultSetTypes,
    });
  }, [defaultSets, defaultReps, defaultSetTypes]);

  const handleRepsChange = (value: string) => {
    // Basic validation for numbers
    if (value === '' || /^\d+$/.test(value)) {
      setDefaultReps(value);
    }
  };

  const handleSetTypeChange = (index: number, newType: SetType) => {
    const newSetTypes = [...defaultSetTypes];
    newSetTypes[index] = newType;
    setDefaultSetTypes(newSetTypes);
  };

  const addSet = () => {
    setDefaultSetTypes(prev => [...prev, 'WORKING']);
    setDefaultSets(prev => prev + 1);
  };

  const removeSet = (index: number) => {
    if (defaultSets > 1) {
      setDefaultSetTypes(prev => prev.filter((_, i) => i !== index));
      setDefaultSets(prev => prev - 1);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-card">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold">{exercise.name}</h4>
        <Button variant="ghost" size="icon" onClick={onRemove}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-3">
        {Array.from({ length: defaultSets }).map((_, setIndex) => (
          <div key={setIndex} className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground w-6">{setIndex + 1}</span>
            
            <Select
              value={defaultSetTypes[setIndex] || 'WORKING'}
              onValueChange={(value: SetType) => handleSetTypeChange(setIndex, value)}
            >
              <SelectTrigger className="w-28">
                <SelectValue placeholder="Set Type" />
              </SelectTrigger>
              <SelectContent>
                {allSetTypes.map((type) => (
                  <SelectItem key={type} value={type}>{SET_TYPE_NAMES[type]}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="number"
              value={defaultReps}
              onChange={(e) => handleRepsChange(e.target.value)}
              className="w-20"
              placeholder="Reps"
            />
            <span className="text-sm text-muted-foreground">reps</span>
            
            <Button type="button" variant="ghost" size="icon" onClick={() => removeSet(setIndex)} disabled={defaultSets === 1}>
              <Minus className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" className="w-full border-dashed" onClick={addSet}>
          <Plus className="w-4 h-4 mr-2" />
          Add Set Configuration
        </Button>
      </div>
    </div>
  );
}