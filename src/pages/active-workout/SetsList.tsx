import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActiveSetCard } from "@/components/ActiveSetCard";
import type { WorkoutExercise } from "@/types/workout";
import { useState } from "react";
interface Props {
  exercise: WorkoutExercise;
  currentSetIndex: number;
  onAddSet: () => void;
}

export function SetsList({ exercise, currentSetIndex, onAddSet }: Props) {
  const [editingSetId, setEditingSetId] = useState<string | null>(null);

  const handleEdit = (setId: string | null) => setEditingSetId(setId);

  const currentSetId = exercise.sets[currentSetIndex]?.id;

  const orderedSets = [...exercise.sets].sort((a, b) => {
    if (a.id === currentSetId) return -1;
    if (b.id === currentSetId) return 1;
    if (!a.is_completed && b.is_completed) return -1;
    if (a.is_completed && !b.is_completed) return 1;
    return 0;
  });

  return (
    <div className="space-y-3">
      {orderedSets.map((set, index) => {
        const isActive = set.id === currentSetId;
        const isOpen =
          editingSetId === set.id || (editingSetId === null && isActive);
        const isFuture = !isActive && !set.is_completed;

        return (
          <ActiveSetCard
            key={set.id}
            set={set}
            exerciseId={exercise.id}
            setIndex={index}
            isFuture={isFuture}
            onEdit={() => handleEdit(set.id)}
            onClose={() => handleEdit(null)}
            isOpen={isOpen}
          />
        );
      })}

      <Button
        variant="outline"
        className="w-full border-dashed"
        onClick={onAddSet}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Set
      </Button>
    </div>
  );
}
