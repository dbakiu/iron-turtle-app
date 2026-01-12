import { useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, Link } from "react-router-dom";
import {
  ChevronLeft,
  Dumbbell,
  Play,
  Plus,
  X,
  GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateTemplateMutation } from "@/store/api/templateApi";
import {
  Exercise,
  WorkoutTemplate,
  TemplateTag,
  TEMPLATE_TAG_LABELS,
  TemplateExercise,
} from "@/types/workout";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ExerciseSelector } from "@/components/selectors/ExerciseSelector";
import { TemplateExerciseConfig } from "@/components/forms/TemplateExerciseConfig";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const templateTags: TemplateTag[] = [
  "PUSH",
  "PULL",
  "LEGS",
  "UPPER",
  "LOWER",
  "FULL_BODY",
  "ARMS",
  "CORE",
];

const templateSchema = z.object({
  name: z.string().min(1, "Template name is required"),
  description: z.string().optional(),
  tags: z.array(z.enum(templateTags)).optional(),
});

type TemplateFormData = z.infer<typeof templateSchema>;

// Sortable wrapper for TemplateExerciseConfig
interface SortableExerciseProps {
  templateEx: TemplateExercise;
  onConfigChange: (config: Partial<TemplateExercise>) => void;
  onRemove: () => void;
}

function SortableExercise({
  templateEx,
  onConfigChange,
  onRemove,
}: SortableExerciseProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: templateEx.exercise_id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 0,
    position: "relative",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(isDragging && "shadow-lg")}
    >
      <div
        className="absolute top-0 left-0 bottom-0 w-8 flex items-center justify-center cursor-grab touch-action-none"
        {...listeners}
        {...attributes}
      >
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="pl-8">
        {" "}
        {/* Add padding to make space for the drag handle */}
        <TemplateExerciseConfig
          exercise={templateEx.exercise}
          initialConfig={templateEx}
          onConfigChange={onConfigChange}
          onRemove={onRemove}
        />
      </div>
    </div>
  );
}

export default function TemplateCreator() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [createTemplate, { isLoading }] = useCreateTemplateMutation();
  const [selectedExercises, setSelectedExercises] = useState<
    TemplateExercise[]
  >([]);
  const [isExerciseSelectorOpen, setIsExerciseSelectorOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      tags: [],
    },
  });

  const onSubmit = async (data: TemplateFormData) => {
    if (selectedExercises.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please add at least one exercise to the template.",
        variant: "destructive",
      });
      return;
    }

    const newTemplate: Omit<WorkoutTemplate, "id" | "exercises"> = {
      ...data,
      tags: data.tags || [],
    };

    try {
      // Ensure exercises have correct order before sending to API
      const exercisesWithOrder = selectedExercises.map((ex, index) => ({
        ...ex,
        order: index,
      }));
      await createTemplate({
        ...newTemplate,
        exercises: exercisesWithOrder,
      }).unwrap();
      toast({
        title: "Template created",
        description: `${data.name} has been added to your templates.`,
      });
      navigate("/templates");
    } catch (error) {
      toast({
        title: "Error creating template",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExerciseSelection = (exercisesFromSelector: Exercise[]) => {
    const updatedExercises: TemplateExercise[] = exercisesFromSelector.map(
      (newEx) => {
        const existingConfig = selectedExercises.find(
          (selEx) => selEx.exercise_id === newEx.id,
        );
        if (existingConfig) {
          return existingConfig;
        }
        return {
          exercise_id: newEx.id,
          exercise: newEx,
          default_sets: 3, // Default values
          default_reps: Array(3).fill(10), // Initialize with an array of 3 sets, each with 10 reps
          default_set_types: Array(3).fill("WORKING"), // Default to three working sets
          order: 0, // Temporarily 0, will be re-indexed after merge
        };
      },
    );

    // Re-index after merge to maintain correct order
    setSelectedExercises(
      updatedExercises.map((ex, index) => ({ ...ex, order: index })),
    );
    setIsExerciseSelectorOpen(false);
  };

  const handleExerciseConfigChange = (
    exerciseId: string,
    config: Partial<TemplateExercise>,
  ) => {
    setSelectedExercises((prev) =>
      prev.map((ex) =>
        ex.exercise_id === exerciseId ? { ...ex, ...config } : ex,
      ),
    );
  };

  const handleRemoveExercise = (exerciseId: string) => {
    setSelectedExercises((prev) =>
      prev
        .filter((ex) => ex.exercise_id !== exerciseId)
        .map((ex, index) => ({ ...ex, order: index })),
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setSelectedExercises((items) => {
        const oldIndex = items.findIndex(
          (item) => item.exercise_id === active.id,
        );
        const newIndex = items.findIndex(
          (item) => item.exercise_id === over?.id,
        );
        const newOrder = arrayMove(items, oldIndex, newIndex);
        return newOrder.map((item, index) => ({ ...item, order: index }));
      });
    }
  };

  const initialSelectedExerciseIds = useMemo(
    () => selectedExercises.map((ex) => ex.exercise_id),
    [selectedExercises],
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 space-y-4 max-w-lg mx-auto pb-24">
        <header className="pt-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Create Template</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/templates")}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name
            </label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => <Input {...field} id="name" />}
            />
            {errors.name && (
              <p className="text-destructive text-sm mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-1"
            >
              Description
            </label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => <Textarea {...field} id="description" />}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <div className="flex flex-wrap gap-2">
              {templateTags.map((tag) => (
                <Controller
                  key={tag}
                  name="tags"
                  control={control}
                  render={({ field }) => (
                    <button
                      type="button"
                      onClick={() => {
                        const newValue = field.value?.includes(tag)
                          ? field.value.filter((value) => value !== tag)
                          : [...(field.value || []), tag];
                        field.onChange(newValue);
                      }}
                      className={cn(
                        field.value?.includes(tag)
                          ? "tag-pill-active"
                          : "tag-pill-inactive",
                      )}
                    >
                      {TEMPLATE_TAG_LABELS[tag]}
                    </button>
                  )}
                />
              ))}
            </div>
          </div>

          {/* Exercises */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Exercises</h3>
            {selectedExercises.length === 0 ? (
              <div className="p-4 border border-dashed rounded-lg text-center text-muted-foreground">
                No exercises selected.
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={selectedExercises.map((ex) => ex.exercise_id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {selectedExercises.map((templateEx) => (
                      <SortableExercise
                        key={templateEx.exercise_id}
                        templateEx={templateEx}
                        onConfigChange={(config) =>
                          handleExerciseConfigChange(
                            templateEx.exercise_id,
                            config,
                          )
                        }
                        onRemove={() =>
                          handleRemoveExercise(templateEx.exercise_id)
                        }
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
            <Button
              type="button"
              variant="outline"
              className="w-full border-dashed mt-3"
              onClick={() => setIsExerciseSelectorOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Exercise
            </Button>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Create Template"}
            </Button>
          </div>
        </form>
      </div>
      <BottomNav />

      {isExerciseSelectorOpen && (
        <ExerciseSelector
          onSelect={handleExerciseSelection}
          onClose={() => setIsExerciseSelectorOpen(false)}
          initialSelectedExerciseIds={initialSelectedExerciseIds}
        />
      )}
    </div>
  );
}

function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass-panel border-t">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        <Link to="/" className="nav-link flex-1">
          <Dumbbell className="w-5 h-5" />
          <span className="text-xs font-medium">Home</span>
        </Link>
        <Link to="/templates" className="nav-link-active flex-1">
          <Dumbbell className="w-5 h-5" />
          <span className="text-xs font-medium">Templates</span>
        </Link>
        <Link to="/workout/active" className="nav-link flex-1">
          <Play className="w-5 h-5" />
          <span className="text-xs font-medium">Workout</span>
        </Link>
        <Link to="/exercises" className="nav-link flex-1">
          <Dumbbell className="w-5 h-5" />
          <span className="text-xs font-medium">Exercises</span>
        </Link>
      </div>
    </nav>
  );
}
