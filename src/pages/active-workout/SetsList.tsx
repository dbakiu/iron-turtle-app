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

  const handleEdit = (setId: string | null) => {
    setEditingSetId(setId);
  };

  return (
    <div className="space-y-3">
      {exercise.sets.map((set, index) => (
        <ActiveSetCard
          key={set.id}
          set={set}
          exerciseId={exercise.id}
          setIndex={index}
          isFuture={currentSetIndex !== -1 && index > currentSetIndex}
          onEdit={() => handleEdit(set.id)}
          onClose={() => handleEdit(null)}
          isOpen={
            editingSetId === set.id ||
            (editingSetId === null &&
              (currentSetIndex === index ||
                (currentSetIndex === -1 && !set.is_completed)))
          }
        />
      ))}

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
