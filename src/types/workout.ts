// Iron Turtle - Type Definitions (Revised Spec)

// High-level muscle grouping for UI display
export type PrimaryMuscleGroup =
  | "LEGS"
  | "CHEST"
  | "BACK"
  | "ARMS"
  | "CORE"
  | "SHOULDERS";

// Detailed muscle for deeper filtering (optional)
export type PrimaryMuscle =
  | "QUADS"
  | "HAMSTRINGS"
  | "GLUTES"
  | "CALVES"
  | "PECS"
  | "LATS"
  | "TRAPS"
  | "RHOMBOIDS"
  | "BICEPS"
  | "TRICEPS"
  | "FOREARMS"
  | "ANTERIOR_DELTS"
  | "LATERAL_DELTS"
  | "REAR_DELTS"
  | "ABS"
  | "OBLIQUES"
  | "LOWER_BACK";

// Movement patterns for swap/replacement logic
export type MovementPattern =
  | "SQUAT"
  | "HINGE"
  | "HORIZONTAL_PUSH"
  | "HORIZONTAL_PULL"
  | "VERTICAL_PUSH"
  | "VERTICAL_PULL"
  | "ISOLATION"
  | "CORE";

// Equipment types - multi-select allowed per exercise
export type Equipment =
  | "BARBELL"
  | "DUMBBELL"
  | "CABLE"
  | "MACHINE"
  | "BODYWEIGHT"
  | "KETTLEBELL"
  | "BANDS"
  | "RACK"
  | "OTHER";

// Set types
export type SetType = "WARMUP" | "WORKING" | "MYOREP" | "FAILURE" | "AMRAP";

// Template tags for categorization
export type TemplateTag =
  | "PUSH"
  | "PULL"
  | "LEGS"
  | "UPPER"
  | "LOWER"
  | "FULL_BODY"
  | "ARMS"
  | "CORE";

// Difficulty scale 1-3
export type Difficulty = 1 | 2 | 3;

// Exercise entity
export interface Exercise {
  id: string;
  name: string;
  primary_muscle_group: PrimaryMuscleGroup;
  primary_muscle?: PrimaryMuscle;
  movement_pattern?: MovementPattern;
  equipment: Equipment[];
  difficulty?: Difficulty;
  notes?: string;
  is_preset?: boolean;
}

// Workout set within an active workout
export interface WorkoutSet {
  id: string;
  temp_id?: string; // Client-side temporary UUID for optimistic updates
  exercise_id: string;
  set_type: SetType;
  weight: number;
  reps?: number;
  duration?: number; // For CORE pattern exercises (seconds)
  is_completed: boolean;
  completed_at?: string;
  sync_status?: "pending" | "synced" | "failed";
}

// Exercise within an active workout (snapshot)
export interface WorkoutExercise {
  id: string;
  exercise: Exercise;
  sets: WorkoutSet[];
  order: number;
}

// Completed workout snapshot
export interface Workout {
  id: string;
  name: string;
  template_id?: string; // Informational reference only
  started_at: string;
  finished_at?: string;
  exercises: WorkoutExercise[];
  notes?: string;
}

// Template definition
export interface WorkoutTemplate {
  id: string;
  name: string;
  description?: string;
  tags: TemplateTag[];
  exercises: TemplateExercise[];
}

// Exercise within a template (with default configuration)
export interface TemplateExercise {
  exercise_id: string;
  exercise: Exercise;
  default_sets: number;
  default_reps?: (number | { min: number; max: number })[]; // Per-set fixed or range
  default_set_types?: SetType[]; // Per-set type configuration
  order: number;
}

// Last session data for exercise (keyed by exerciseId)
export interface LastSessionData {
  exercise_id: string;
  sets: {
    weight: number;
    reps?: number;
    duration?: number;
    set_type: SetType;
  }[];
  performed_at: string;
}

export interface ActiveSet {
  id: string;
  exercise_id: string;
  set_type: SetType;
  weight: number;
  reps?: number;
  duration?: number;
  is_completed: boolean;
}

export interface ActiveSetCreate {
  exercise_id: string;
  set_type: SetType;
  weight: number;
  reps: number;
  duration?: number;
  is_completed: boolean;
}

// Set type display helpers
export const SET_TYPE_LABELS: Record<SetType, string> = {
  WARMUP: "W",
  WORKING: "R",
  MYOREP: "M",
  FAILURE: "F",
  AMRAP: "A",
};

export const SET_TYPE_NAMES: Record<SetType, string> = {
  WARMUP: "Warm-up",
  WORKING: "Working",
  MYOREP: "Myo-rep",
  FAILURE: "Failure",
  AMRAP: "AMRAP",
};

export const PRIMARY_MUSCLE_GROUP_LABELS: Record<PrimaryMuscleGroup, string> = {
  LEGS: "Legs",
  CHEST: "Chest",
  BACK: "Back",
  ARMS: "Arms",
  CORE: "Core",
  SHOULDERS: "Shoulders",
};

export const PRIMARY_MUSCLE_LABELS: Record<PrimaryMuscle, string> = {
  QUADS: "Quads",
  HAMSTRINGS: "Hamstrings",
  GLUTES: "Glutes",
  CALVES: "Calves",
  PECS: "Pecs",
  LATS: "Lats",
  TRAPS: "Traps",
  RHOMBOIDS: "Rhomboids",
  BICEPS: "Biceps",
  TRICEPS: "Triceps",
  FOREARMS: "Forearms",
  ANTERIOR_DELTS: "Front Delts",
  LATERAL_DELTS: "Side Delts",
  REAR_DELTS: "Rear Delts",
  ABS: "Abs",
  OBLIQUES: "Obliques",
  LOWER_BACK: "Lower Back",
};

export const MOVEMENT_PATTERN_LABELS: Record<MovementPattern, string> = {
  SQUAT: "Squat",
  HINGE: "Hinge",
  HORIZONTAL_PUSH: "Horizontal Push",
  HORIZONTAL_PULL: "Horizontal Pull",
  VERTICAL_PUSH: "Vertical Push",
  VERTICAL_PULL: "Vertical Pull",
  ISOLATION: "Isolation",
  CORE: "Core",
};

export const EQUIPMENT_LABELS: Record<Equipment, string> = {
  BARBELL: "Barbell",
  DUMBBELL: "Dumbbell",
  CABLE: "Cable",
  MACHINE: "Machine",
  BODYWEIGHT: "Bodyweight",
  KETTLEBELL: "Kettlebell",
  BANDS: "Bands",
  RACK: "RACK",
  OTHER: "Other",
};

export const TEMPLATE_TAG_LABELS: Record<TemplateTag, string> = {
  PUSH: "Push",
  PULL: "Pull",
  LEGS: "Legs",
  UPPER: "Upper",
  LOWER: "Lower",
  FULL_BODY: "Full Body",
  ARMS: "Arms",
  CORE: "Core",
};

// Helper to check if exercise uses duration instead of reps
export const isIsometricExercise = (exercise: Exercise): boolean => {
  return exercise.movement_pattern === "CORE";
};
