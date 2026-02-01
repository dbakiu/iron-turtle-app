import { Button } from "@/components/ui/button";

interface Props {
  allCompleted: boolean;
  hasNext: boolean;
  onNext: () => void;
}

export function ExerciseNavigation({ allCompleted, hasNext, onNext }: Props) {
  if (!allCompleted) return null;

  return (
    <Button
      size="lg"
      className="w-full h-12 text-lg mt-2"
      variant={hasNext ? "default" : "secondary"}
      onClick={onNext}
    >
      {hasNext ? "Next Exercise" : "Back to Overview"}
    </Button>
  );
}
