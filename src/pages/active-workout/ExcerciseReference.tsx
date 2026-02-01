import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Exercise } from "@/types/workout";

type Tab = "none" | "notes" | "history" | "alternatives";

interface Props {
  exercise: Exercise;
}

export function ExerciseReference({ exercise }: Props) {
  const [tab, setTab] = useState<Tab>("none");

  const toggle = (next: Tab) =>
    setTab((current) => (current === next ? "none" : next));

  return (
    <Card className="p-4 shadow-none">
      <div className="flex gap-2">
        <Button
          className="flex-1"
          variant="outline"
          onClick={() => toggle("notes")}
        >
          Notes
        </Button>
        <Button
          className="flex-1"
          variant="outline"
          onClick={() => toggle("history")}
        >
          History
        </Button>
        <Button
          className="flex-1"
          variant="outline"
          onClick={() => toggle("alternatives")}
        >
          Alternatives
        </Button>
      </div>

      {tab !== "none" && (
        <div className="mt-4 p-3 border rounded-lg bg-muted/20 text-sm text-muted-foreground">
          {tab === "notes" && (exercise.notes ?? "No notes available.")}
          {tab === "history" && "Workout history coming soon."}
          {tab === "alternatives" && "Alternative exercises coming soon."}
        </div>
      )}
    </Card>
  );
}
