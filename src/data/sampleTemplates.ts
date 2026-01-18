import { WorkoutTemplate } from '@/types/workout';
import { presetExercises } from './presetExercises';

const getExerciseById = (id: string) => presetExercises.find(e => e.id === id)!;

const templates: Omit<WorkoutTemplate, 'exercises'> & { exercises: { exercise_id: string, default_sets: number, default_reps: any, order: number }[] }[] = [
  {
    "id": "template-fb-full-body-1",
    "name": "FB: Full Body #1",
    "description": "Full Body #1 workout",
    "tags": [
      "FULL_BODY"
    ],
    "exercises": [
      {
        "exercise_id": "preset-cross-body-lat-pull-around",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          }
        ],
        "order": 0
      },
      {
        "exercise_id": "preset-low-incline-smith-machine-press",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 8,
            "max": 10
          },
          {
            "min": 8,
            "max": 10
          },
          {
            "min": 8,
            "max": 10
          }
        ],
        "order": 1
      },
      {
        "exercise_id": "preset-machine-hip-adduction",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          }
        ],
        "order": 2
      },
      {
        "exercise_id": "preset-leg-press",
        "default_sets": 3,
        "default_reps": [
          8,
          8,
          8
        ],
        "order": 3
      },
      {
        "exercise_id": "preset-lying-paused-rope-face-pull",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          }
        ],
        "order": 4
      }
    ]
  },
  {
    "id": "template-fb-full-body-2",
    "name": "FB: Full Body #2",
    "description": "Full Body #2 workout",
    "tags": [
      "FULL_BODY"
    ],
    "exercises": [
      {
        "exercise_id": "preset-seated-db-shoulder-press",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          }
        ],
        "order": 0
      },
      {
        "exercise_id": "preset-assisted-pull-up",
        "default_sets": 4,
        "default_reps": [
          {
            "min": 8,
            "max": 10
          },
          {
            "min": 8,
            "max": 10
          },
          {
            "min": 8,
            "max": 10
          },
          {
            "min": 8,
            "max": 10
          }
        ],
        "order": 1
      },
      {
        "exercise_id": "preset-lying-leg-curl",
        "default_sets": 2,
        "default_reps": [
          {
            "min": 8,
            "max": 10
          },
          {
            "min": 8,
            "max": 10
          }
        ],
        "order": 2
      },
      {
        "exercise_id": "preset-chest-supported-machine-row",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          }
        ],
        "order": 3
      },
      {
        "exercise_id": "preset-slow-eccentric-db-curl",
        "default_sets": 2,
        "default_reps": [
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          }
        ],
        "order": 4
      }
    ]
  },
  {
    "id": "template-fb-full-body-3",
    "name": "FB: Full Body #3",
    "description": "Full Body #3 workout",
    "tags": [
      "FULL_BODY"
    ],
    "exercises": [
      {
        "exercise_id": "preset-neutral-grip-pullup",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 8,
            "max": 10
          },
          {
            "min": 8,
            "max": 10
          },
          {
            "min": 8,
            "max": 10
          }
        ],
        "order": 0
      },
      {
        "exercise_id": "preset-low-incline-db-press",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          }
        ],
        "order": 1
      },
      {
        "exercise_id": "preset-copenhagen-hip-adduction",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          }
        ],
        "order": 2
      },
      {
        "exercise_id": "preset-high-bar-back-squat",
        "default_sets": 3,
        "default_reps": [
          8,
          8,
          8
        ],
        "order": 3
      },
      {
        "exercise_id": "preset-bent-over-reverse-db-flye",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 12,
            "max": 15
          },
          {
            "min": 12,
            "max": 15
          },
          {
            "min": 12,
            "max": 15
          }
        ],
        "order": 4
      },
      {
        "exercise_id": "preset-plate-weighted-crunch",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          }
        ],
        "order": 5
      }
    ]
  },
  {
    "id": "template-fb-arms-weak-points",
    "name": "FB: Arms & Weak Points",
    "description": "Arms & Weak Points workout",
    "tags": [
      "ARMS"
    ],
    "exercises": [
      {
        "exercise_id": "preset-seated-db-shoulder-press",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 8,
            "max": 12
          },
          {
            "min": 8,
            "max": 12
          },
          {
            "min": 8,
            "max": 12
          }
        ],
        "order": 0
      },
      {
        "exercise_id": "preset-bent-over-reverse-db-flye",
        "default_sets": 2,
        "default_reps": [
          {
            "min": 8,
            "max": 12
          },
          {
            "min": 8,
            "max": 12
          }
        ],
        "order": 1
      },
      {
        "exercise_id": "preset-ez-bar-skull-crusher",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 8,
            "max": 10
          },
          {
            "min": 8,
            "max": 10
          },
          {
            "min": 8,
            "max": 10
          }
        ],
        "order": 2
      },
      {
        "exercise_id": "preset-concentration-curl",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          }
        ],
        "order": 3
      },
      {
        "exercise_id": "preset-triceps-pressdown-rope-",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 12,
            "max": 15
          },
          {
            "min": 12,
            "max": 15
          },
          {
            "min": 12,
            "max": 15
          }
        ],
        "order": 4
      },
      {
        "exercise_id": "preset-hammer-curl",
        "default_sets": 2,
        "default_reps": [
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          }
        ],
        "order": 5
      }
    ]
  },
  {
    "id": "template-mnmx4-lower-1",
    "name": "MNMX4: Lower #1",
    "description": "Lower #1 workout",
    "tags": [
      "LEGS",
      "LOWER"
    ],
    "exercises": [
      {
        "exercise_id": "preset-nordic-ham-curl",
        "default_sets": 2,
        "default_reps": [
          {
            "min": 6,
            "max": 10
          },
          {
            "min": 6,
            "max": 10
          }
        ],
        "order": 0
      },
      {
        "exercise_id": "preset-leg-press",
        "default_sets": 2,
        "default_reps": [
          {
            "min": 8,
            "max": 10
          },
          {
            "min": 8,
            "max": 10
          }
        ],
        "order": 1
      }
    ]
  },
  {
    "id": "template-mnmx4-upper-1",
    "name": "MNMX4: Upper #1",
    "description": "Upper #1 workout",
    "tags": [
      "UPPER"
    ],
    "exercises": [
      {
        "exercise_id": "preset-db-incline-press",
        "default_sets": 2,
        "default_reps": [
          {
            "min": 8,
            "max": 10
          },
          {
            "min": 8,
            "max": 10
          }
        ],
        "order": 0
      },
      {
        "exercise_id": "preset-machine-lateral-raise",
        "default_sets": 2,
        "default_reps": [
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          }
        ],
        "order": 1
      },
      {
        "exercise_id": "preset-1-arm-cable-pulldown",
        "default_sets": 2,
        "default_reps": [
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          }
        ],
        "order": 2
      }
    ]
  },
  {
    "id": "template-mnmx4-lower-2",
    "name": "MNMX4: Lower #2",
    "description": "Lower #2 workout",
    "tags": [
      "LEGS",
      "LOWER"
    ],
    "exercises": [
      {
        "exercise_id": "preset-seated-leg-curl",
        "default_sets": 2,
        "default_reps": [
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          }
        ],
        "order": 0
      }
    ]
  },
  {
    "id": "template-mnmx4-upper-2",
    "name": "MNMX4: Upper #2",
    "description": "Upper #2 workout",
    "tags": [
      "UPPER"
    ],
    "exercises": [
      {
        "exercise_id": "preset-smith-machine-incline-press",
        "default_sets": 2,
        "default_reps": [
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          }
        ],
        "order": 0
      },
      {
        "exercise_id": "preset-cable-y-raise",
        "default_sets": 2,
        "default_reps": [
          {
            "min": 12,
            "max": 15
          },
          {
            "min": 12,
            "max": 15
          }
        ],
        "order": 1
      },
      {
        "exercise_id": "preset-lat-pulldown-wide-grip-",
        "default_sets": 2,
        "default_reps": [
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          }
        ],
        "order": 2
      }
    ]
  },
  {
    "id": "template-mnmx4-arms",
    "name": "MNMX4: Arms",
    "description": "Arms workout",
    "tags": [
      "ARMS"
    ],
    "exercises": [
      {
        "exercise_id": "preset-standing-db-curl",
        "default_sets": 2,
        "default_reps": [
          {
            "min": 8,
            "max": 10
          },
          {
            "min": 8,
            "max": 10
          }
        ],
        "order": 0
      },
      {
        "exercise_id": "preset-skull-crusher",
        "default_sets": 2,
        "default_reps": [
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          }
        ],
        "order": 1
      }
    ]
  },
  {
    "id": "template-mnmx5-full-body-1",
    "name": "MNMX5: Full Body #1",
    "description": "Full Body #1 workout",
    "tags": [
      "FULL_BODY"
    ],
    "exercises": [
      {
        "exercise_id": "preset-1-arm-cable-pulldown",
        "default_sets": 2,
        "default_reps": [
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          }
        ],
        "order": 0
      },
      {
        "exercise_id": "preset-chest-supported-db-row",
        "default_sets": 2,
        "default_reps": [
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          }
        ],
        "order": 1
      },
      {
        "exercise_id": "preset-db-bench-press",
        "default_sets": 2,
        "default_reps": [
          {
            "min": 8,
            "max": 10
          },
          {
            "min": 8,
            "max": 10
          }
        ],
        "order": 2
      },
      {
        "exercise_id": "preset-machine-lateral-raise",
        "default_sets": 2,
        "default_reps": [
          {
            "min": 12,
            "max": 15
          },
          {
            "min": 12,
            "max": 15
          }
        ],
        "order": 3
      },
      {
        "exercise_id": "preset-machine-crunch",
        "default_sets": 2,
        "default_reps": [
          {
            "min": 12,
            "max": 15
          },
          {
            "min": 12,
            "max": 15
          }
        ],
        "order": 4
      }
    ]
  },
  {
    "id": "template-mnmx5-full-body-2",
    "name": "MNMX5: Full Body #2",
    "description": "Full Body #2 workout",
    "tags": [
      "FULL_BODY"
    ],
    "exercises": [
      {
        "exercise_id": "preset-close-grip-pull-up",
        "default_sets": 2,
        "default_reps": [
          {
            "min": 8,
            "max": 10
          },
          {
            "min": 8,
            "max": 10
          }
        ],
        "order": 0
      },
      {
        "exercise_id": "preset-chest-supported-machine-row",
        "default_sets": 2,
        "default_reps": [
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          }
        ],
        "order": 1
      },
      {
        "exercise_id": "preset-smith-machine-bench-press",
        "default_sets": 2,
        "default_reps": [
          {
            "min": 8,
            "max": 10
          },
          {
            "min": 8,
            "max": 10
          }
        ],
        "order": 2
      },
      {
        "exercise_id": "preset-db-lateral-raise",
        "default_sets": 2,
        "default_reps": [
          {
            "min": 12,
            "max": 15
          },
          {
            "min": 12,
            "max": 15
          }
        ],
        "order": 3
      },
      {
        "exercise_id": "preset-weighted-crunch",
        "default_sets": 2,
        "default_reps": [
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          }
        ],
        "order": 4
      }
    ]
  },
  {
    "id": "template-ppl-pull-1-lat-focused-",
    "name": "PPL: Pull #1 (Lat Focused)",
    "description": "Pull #1 (Lat Focused) workout",
    "tags": [
      "PULL"
    ],
    "exercises": [
      {
        "exercise_id": "preset-cross-body-lat-pull-around",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          }
        ],
        "order": 0
      },
      {
        "exercise_id": "preset-snatch-grip-rdl",
        "default_sets": 2,
        "default_reps": [
          8,
          8
        ],
        "order": 1
      },
      {
        "exercise_id": "preset-chest-supported-machine-row",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 8,
            "max": 10
          },
          {
            "min": 8,
            "max": 10
          },
          {
            "min": 8,
            "max": 10
          }
        ],
        "order": 2
      },
      {
        "exercise_id": "preset-straight-bar-lat-prayer",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 12,
            "max": 15
          },
          {
            "min": 12,
            "max": 15
          },
          {
            "min": 12,
            "max": 15
          }
        ],
        "order": 3
      },
      {
        "exercise_id": "preset-hammer-preacher-curl",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          }
        ],
        "order": 4
      },
      {
        "exercise_id": "preset-lying-paused-rope-face-pull",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          }
        ],
        "order": 5
      }
    ]
  },
  {
    "id": "template-ppl-push-1",
    "name": "PPL: Push #1",
    "description": "Push #1 workout",
    "tags": [
      "PUSH"
    ],
    "exercises": [
      {
        "exercise_id": "preset-cuffed-behind-the-back-lateral-raise",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          }
        ],
        "order": 0
      },
      {
        "exercise_id": "preset-low-incline-smith-machine-press",
        "default_sets": 4,
        "default_reps": [
          {
            "min": 8,
            "max": 10
          },
          {
            "min": 8,
            "max": 10
          },
          {
            "min": 8,
            "max": 10
          },
          {
            "min": 8,
            "max": 10
          }
        ],
        "order": 1
      },
      {
        "exercise_id": "preset-pec-deck-w-integrated-partials-",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 12,
            "max": 15
          },
          {
            "min": 12,
            "max": 15
          },
          {
            "min": 12,
            "max": 15
          }
        ],
        "order": 2
      },
      {
        "exercise_id": "preset-overhead-cable-triceps-extension-bar-",
        "default_sets": 3,
        "default_reps": [
          8,
          8,
          8
        ],
        "order": 3
      },
      {
        "exercise_id": "preset-triceps-pressdown-bar-",
        "default_sets": 2,
        "default_reps": [
          {
            "min": 8,
            "max": 10
          },
          {
            "min": 8,
            "max": 10
          }
        ],
        "order": 4
      },
      {
        "exercise_id": "preset-cable-crunch",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          }
        ],
        "order": 5
      }
    ]
  },
  {
    "id": "template-ppl-legs-1",
    "name": "PPL: Legs #1",
    "description": "Legs #1 workout",
    "tags": [
      "LEGS"
    ],
    "exercises": [
      {
        "exercise_id": "preset-seated-leg-curl",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 8,
            "max": 10
          },
          {
            "min": 8,
            "max": 10
          },
          {
            "min": 8,
            "max": 10
          }
        ],
        "order": 0
      },
      {
        "exercise_id": "preset-machine-hip-adduction",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          }
        ],
        "order": 1
      },
      {
        "exercise_id": "preset-hack-squat",
        "default_sets": 3,
        "default_reps": [
          [
            4,
            6,
            8
          ],
          [
            4,
            6,
            8
          ],
          [
            4,
            6,
            8
          ]
        ],
        "order": 2
      },
      {
        "exercise_id": "preset-leg-extension",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          }
        ],
        "order": 3
      },
      {
        "exercise_id": "preset-leg-press-calf-press",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 12,
            "max": 15
          },
          {
            "min": 12,
            "max": 15
          },
          {
            "min": 12,
            "max": 15
          }
        ],
        "order": 4
      }
    ]
  },
  {
    "id": "template-ppl-arms-weak-points-1",
    "name": "PPL: Arms & Weak Points #1",
    "description": "Arms & Weak Points #1 workout",
    "tags": [
      "ARMS"
    ],
    "exercises": [
      {
        "exercise_id": "preset-seated-db-shoulder-press",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 8,
            "max": 12
          },
          {
            "min": 8,
            "max": 12
          },
          {
            "min": 8,
            "max": 12
          }
        ],
        "order": 0
      },
      {
        "exercise_id": "preset-bent-over-reverse-db-flye",
        "default_sets": 2,
        "default_reps": [
          {
            "min": 8,
            "max": 12
          },
          {
            "min": 8,
            "max": 12
          }
        ],
        "order": 1
      },
      {
        "exercise_id": "preset-bayesian-cable-curl",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          }
        ],
        "order": 2
      },
      {
        "exercise_id": "preset-seated-db-french-press",
        "default_sets": 3,
        "default_reps": [
          10,
          10,
          10
        ],
        "order": 3
      },
      {
        "exercise_id": "preset-bottom-2-3-constant-tension-preacher-curl",
        "default_sets": 2,
        "default_reps": [
          {
            "min": 12,
            "max": 15
          },
          {
            "min": 12,
            "max": 15
          }
        ],
        "order": 4
      },
      {
        "exercise_id": "preset-cable-triceps-kickback",
        "default_sets": 2,
        "default_reps": [
          {
            "min": 12,
            "max": 15
          },
          {
            "min": 12,
            "max": 15
          }
        ],
        "order": 5
      },
      {
        "exercise_id": "preset-roman-chair-leg-raise",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 10,
            "max": 20
          },
          {
            "min": 10,
            "max": 20
          },
          {
            "min": 10,
            "max": 20
          }
        ],
        "order": 6
      }
    ]
  },
  {
    "id": "template-ppl-pull-2-mid-back-focused-",
    "name": "PPL: Pull #2 (Mid-Back Focused)",
    "description": "Pull #2 (Mid-Back Focused) workout",
    "tags": [
      "PULL"
    ],
    "exercises": [
      {
        "exercise_id": "preset-super-rom-overhand-cable-row",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          }
        ],
        "order": 0
      },
      {
        "exercise_id": "preset-arms-extended-45-hyperextension",
        "default_sets": 2,
        "default_reps": [
          {
            "min": 10,
            "max": 20
          },
          {
            "min": 10,
            "max": 20
          }
        ],
        "order": 1
      },
      {
        "exercise_id": "preset-lean-back-lat-pulldown",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          }
        ],
        "order": 2
      },
      {
        "exercise_id": "preset-inverse-db-zottman-curl",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          }
        ],
        "order": 3
      },
      {
        "exercise_id": "preset-cable-reverse-flye-mechanical-dropset-",
        "default_sets": 3,
        "default_reps": [
          null,
          null,
          null
        ],
        "order": 4
      },
      {
        "exercise_id": "preset-cable-paused-shrug-in",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          }
        ],
        "order": 5
      }
    ]
  },
  {
    "id": "template-ppl-push-2",
    "name": "PPL: Push #2",
    "description": "Push #2 workout",
    "tags": [
      "PUSH"
    ],
    "exercises": [
      {
        "exercise_id": "preset-seated-db-shoulder-press",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          }
        ],
        "order": 0
      },
      {
        "exercise_id": "preset-db-lateral-raise",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          }
        ],
        "order": 1
      },
      {
        "exercise_id": "preset-decline-barbell-press",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 8,
            "max": 10
          },
          {
            "min": 8,
            "max": 10
          },
          {
            "min": 8,
            "max": 10
          }
        ],
        "order": 2
      },
      {
        "exercise_id": "preset-pec-deck",
        "default_sets": 2,
        "default_reps": [
          {
            "min": 15,
            "max": 20
          },
          {
            "min": 15,
            "max": 20
          }
        ],
        "order": 3
      },
      {
        "exercise_id": "preset-db-french-press",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          }
        ],
        "order": 4
      },
      {
        "exercise_id": "preset-llpt-plank",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 10,
            "max": 20
          },
          {
            "min": 10,
            "max": 20
          },
          {
            "min": 10,
            "max": 20
          }
        ],
        "order": 5
      }
    ]
  },
  {
    "id": "template-ul-upper-1",
    "name": "UL: Upper #1",
    "description": "Upper #1 workout",
    "tags": [
      "UPPER"
    ],
    "exercises": [
      {
        "exercise_id": "preset-cuffed-behind-the-back-lateral-raise",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          }
        ],
        "order": 0
      },
      {
        "exercise_id": "preset-cross-body-lat-pull-around",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          }
        ],
        "order": 1
      },
      {
        "exercise_id": "preset-low-incline-smith-machine-press",
        "default_sets": 4,
        "default_reps": [
          {
            "min": 8,
            "max": 10
          },
          {
            "min": 8,
            "max": 10
          },
          {
            "min": 8,
            "max": 10
          },
          {
            "min": 8,
            "max": 10
          }
        ],
        "order": 2
      },
      {
        "exercise_id": "preset-chest-supported-machine-row",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 8,
            "max": 10
          },
          {
            "min": 8,
            "max": 10
          },
          {
            "min": 8,
            "max": 10
          }
        ],
        "order": 3
      },
      {
        "exercise_id": "preset-overhead-cable-triceps-extension-bar-",
        "default_sets": 2,
        "default_reps": [
          {
            "min": 8,
            "max": 10
          },
          {
            "min": 8,
            "max": 10
          }
        ],
        "order": 4
      },
      {
        "exercise_id": "preset-straight-bar-lat-prayer",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 12,
            "max": 15
          },
          {
            "min": 12,
            "max": 15
          },
          {
            "min": 12,
            "max": 15
          }
        ],
        "order": 5
      },
      {
        "exercise_id": "preset-pec-deck-w-integrated-partials-",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 12,
            "max": 15
          },
          {
            "min": 12,
            "max": 15
          },
          {
            "min": 12,
            "max": 15
          }
        ],
        "order": 6
      }
    ]
  },
  {
    "id": "template-ul-lower-1",
    "name": "UL: Lower #1",
    "description": "Lower #1 workout",
    "tags": [
      "LEGS",
      "LOWER"
    ],
    "exercises": [
      {
        "exercise_id": "preset-seated-leg-curl",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 8,
            "max": 10
          },
          {
            "min": 8,
            "max": 10
          },
          {
            "min": 8,
            "max": 10
          }
        ],
        "order": 0
      },
      {
        "exercise_id": "preset-machine-hip-adduction",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          }
        ],
        "order": 1
      },
      {
        "exercise_id": "preset-hack-squat",
        "default_sets": 3,
        "default_reps": [
          [
            4,
            6,
            8
          ],
          [
            4,
            6,
            8
          ],
          [
            4,
            6,
            8
          ]
        ],
        "order": 2
      },
      {
        "exercise_id": "preset-leg-extension",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          }
        ],
        "order": 3
      },
      {
        "exercise_id": "preset-leg-press-calf-press",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 12,
            "max": 15
          },
          {
            "min": 12,
            "max": 15
          },
          {
            "min": 12,
            "max": 15
          }
        ],
        "order": 4
      }
    ]
  },
  {
    "id": "template-ul-upper-2",
    "name": "UL: Upper #2",
    "description": "Upper #2 workout",
    "tags": [
      "UPPER"
    ],
    "exercises": [
      {
        "exercise_id": "preset-super-rom-overhand-cable-row",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          }
        ],
        "order": 0
      },
      {
        "exercise_id": "preset-machine-shoulder-press",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          }
        ],
        "order": 1
      },
      {
        "exercise_id": "preset-assisted-pull-up",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 8,
            "max": 10
          },
          {
            "min": 8,
            "max": 10
          },
          {
            "min": 8,
            "max": 10
          }
        ],
        "order": 2
      },
      {
        "exercise_id": "preset-paused-assisted-dip",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 8,
            "max": 10
          },
          {
            "min": 8,
            "max": 10
          },
          {
            "min": 8,
            "max": 10
          }
        ],
        "order": 3
      },
      {
        "exercise_id": "preset-inverse-db-zottman-curl",
        "default_sets": 2,
        "default_reps": [
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          }
        ],
        "order": 4
      },
      {
        "exercise_id": "preset-super-rom-db-lateral-raise",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 12,
            "max": 15
          },
          {
            "min": 12,
            "max": 15
          },
          {
            "min": 12,
            "max": 15
          }
        ],
        "order": 5
      },
      {
        "exercise_id": "preset-cable-reverse-flye-mechanical-dropset-",
        "default_sets": 3,
        "default_reps": [
          null,
          null,
          null
        ],
        "order": 6
      }
    ]
  },
  {
    "id": "template-ul-lower-2",
    "name": "UL: Lower #2",
    "description": "Lower #2 workout",
    "tags": [
      "LEGS",
      "LOWER"
    ],
    "exercises": [
      {
        "exercise_id": "preset-lying-leg-curl",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 8,
            "max": 10
          },
          {
            "min": 8,
            "max": 10
          },
          {
            "min": 8,
            "max": 10
          }
        ],
        "order": 0
      },
      {
        "exercise_id": "preset-leg-press",
        "default_sets": 3,
        "default_reps": [
          8,
          8,
          8
        ],
        "order": 1
      },
      {
        "exercise_id": "preset-paused-barbell-rdl",
        "default_sets": 2,
        "default_reps": [
          8,
          8
        ],
        "order": 2
      },
      {
        "exercise_id": "preset-machine-hip-adduction",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          }
        ],
        "order": 3
      },
      {
        "exercise_id": "preset-sissy-squat",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          }
        ],
        "order": 4
      },
      {
        "exercise_id": "preset-standing-calf-raise",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          }
        ],
        "order": 5
      }
    ]
  },
  {
    "id": "template-ul-arms-weak-points",
    "name": "UL: Arms & Weak Points",
    "description": "Arms & Weak Points workout",
    "tags": [
      "ARMS"
    ],
    "exercises": [
      {
        "exercise_id": "preset-seated-db-shoulder-press",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 8,
            "max": 12
          },
          {
            "min": 8,
            "max": 12
          },
          {
            "min": 8,
            "max": 12
          }
        ],
        "order": 0
      },
      {
        "exercise_id": "preset-bent-over-reverse-db-flye",
        "default_sets": 2,
        "default_reps": [
          {
            "min": 8,
            "max": 12
          },
          {
            "min": 8,
            "max": 12
          }
        ],
        "order": 1
      },
      {
        "exercise_id": "preset-bayesian-cable-curl",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          }
        ],
        "order": 2
      },
      {
        "exercise_id": "preset-seated-db-press",
        "default_sets": 3,
        "default_reps": [
          10,
          10,
          10
        ],
        "order": 3
      },
      {
        "exercise_id": "preset-bottom-2-3-ct-preacher-curl",
        "default_sets": 2,
        "default_reps": [
          {
            "min": 12,
            "max": 15
          },
          {
            "min": 12,
            "max": 15
          }
        ],
        "order": 4
      },
      {
        "exercise_id": "preset-cable-triceps-kickback",
        "default_sets": 2,
        "default_reps": [
          {
            "min": 12,
            "max": 15
          },
          {
            "min": 12,
            "max": 15
          }
        ],
        "order": 5
      },
      {
        "exercise_id": "preset-cable-crunch",
        "default_sets": 3,
        "default_reps": [
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          },
          {
            "min": 10,
            "max": 12
          }
        ],
        "order": 6
      }
    ]
  }
]

export const sampleTemplates: WorkoutTemplate[] = templates.map(template => ({
    ...template,
    exercises: template.exercises.map(exercise => ({
        ...exercise,
        exercise: getExerciseById(exercise.exercise_id),
    })),
}));
