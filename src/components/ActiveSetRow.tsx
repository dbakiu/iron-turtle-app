import { useState, useEffect } from 'react';
import { Check, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { WorkoutSet, SetType } from '@/types/workout';
import { useUpdateSetMutation, useCompleteSetMutation, useRemoveSetMutation } from '@/store/api/activeWorkoutApi';

interface ActiveSetRowProps {
  set: WorkoutSet;
  exerciseId: string;
  setIndex: number;
}

const setTypes: SetType[] = ['WARMUP', 'WORKING', 'MYOREP', 'FAILURE'];

export function ActiveSetRow({ set, exerciseId, setIndex }: ActiveSetRowProps) {
  const [weight, setWeight] = useState(set.weight.toString());
  const [reps, setReps] = useState((set.reps || set.duration || 0).toString());
  const [setType, setSetType] = useState(set.set_type);

  const [updateSet] = useUpdateSetMutation();
  const [completeSet] = useCompleteSetMutation();
  const [removeSet] = useRemoveSetMutation();

  useEffect(() => {
    setWeight(set.weight.toString());
    setReps((set.reps || set.duration || 0).toString());
    setSetType(set.set_type);
  }, [set]);

  const handleUpdate = () => {
    const isDuration = set.duration !== undefined;
    const updates: Partial<WorkoutSet> = {
      weight: parseFloat(weight) || 0,
      [isDuration ? 'duration' : 'reps']: parseInt(reps, 10) || 0,
      set_type: setType,
    };
    updateSet({ exerciseId, setId: set.id, updates });
  };

  const handleComplete = () => {
    // First, save any pending changes
    handleUpdate();
    // Then, mark as complete
    completeSet({ exerciseId, setId: set.id });
  };
  
  const handleRemove = () => {
    removeSet({ exerciseId, setId: set.id });
  };

  return (
    <div
      className={cn(
        'flex items-center gap-2 p-2 rounded-lg',
        set.is_completed ? 'bg-primary/10' : 'bg-muted/50'
      )}
    >
      <span className="w-6 text-center text-sm text-muted-foreground">{setIndex + 1}</span>
      
      <Select value={setType} onValueChange={(value: SetType) => setSetType(value)}>
        <SelectTrigger className={cn(
          'w-12 h-10 p-0 border-0 focus:ring-0 focus:ring-offset-0',
          'set-badge',
          setType === 'WARMUP' && 'set-badge-warmup',
          setType === 'WORKING' && 'set-badge-working',
          setType === 'MYOREP' && 'set-badge-myorep',
          setType === 'FAILURE' && 'set-badge-failure',
        )}>
          <SelectValue>
            {setType === 'WARMUP' ? 'W' : setType === 'WORKING' ? 'R' : setType === 'MYOREP' ? 'M' : 'F'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {setTypes.map(type => (
            <SelectItem key={type} value={type}>{type}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        type="number"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        onBlur={handleUpdate}
        className="numeric-input h-10 w-20"
        aria-label="Weight"
      />
      <span className="text-sm text-muted-foreground">kg</span>
      
      <Input
        type="number"
        value={reps}
        onChange={(e) => setReps(e.target.value)}
        onBlur={handleUpdate}
        className="numeric-input h-10 w-20"
        aria-label={set.duration !== undefined ? 'Duration (seconds)' : 'Reps'}
      />
      <span className="text-sm text-muted-foreground">{set.duration !== undefined ? 'secs' : 'reps'}</span>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleComplete}
        className={cn(
          'ml-auto w-10 h-10 rounded-lg',
          set.is_completed ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-muted hover:bg-muted-foreground/20'
        )}
        aria-label="Complete Set"
      >
        <Check className="w-5 h-5" />
      </Button>
      <Button variant="ghost" size="icon" onClick={handleRemove} className="text-muted-foreground hover:text-destructive w-10 h-10">
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
