import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  seconds: number;
  onAddTime: () => void;
  onStop: () => void;
}

export function RestTimer({ seconds, onAddTime, onStop }: Props) {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;

  return (
    <div className="fixed bottom-20 left-0 right-0 z-50 px-4">
      <div className="glass-panel rounded-xl p-4 max-w-lg mx-auto">
        <div className="flex items-center justify-between">
          <span className="uppercase text-sm text-muted-foreground">Rest</span>

          <span
            className={cn(
              "text-3xl font-bold tabular-nums",
              seconds <= 10 && "text-destructive",
            )}
          >
            {minutes}:{remaining.toString().padStart(2, "0")}
          </span>

          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={onAddTime}>
              +15s
            </Button>
            <Button size="sm" variant="destructive" onClick={onStop}>
              Stop
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
