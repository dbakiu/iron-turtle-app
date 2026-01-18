import { Link, useNavigate } from 'react-router-dom';
import { Plus, ArrowRight, Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGetTemplatesQuery } from '@/store/api/templateApi';
import { useGetActiveWorkoutQuery } from '@/store/api/activeWorkoutApi';
import { TemplateTag, TEMPLATE_TAG_LABELS, WorkoutSet } from '@/types/workout';
import { useAppDispatch, useAppSelector } from '@/store';
import { toggleTemplateTag, setActiveExerciseId, setPendingTemplateId } from '@/store/slices/uiSlice';
import { cn } from '@/lib/utils';

export default function Templates() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { tags: selectedTags } = useAppSelector(state => state.ui.templateFilters);
  const { data: templates = [], isLoading } = useGetTemplatesQuery(
    selectedTags.length > 0 ? { tags: selectedTags } : undefined
  );
  const { data: activeWorkout } = useGetActiveWorkoutQuery();

  const handleStartFromTemplate = async (templateId: string) => {
    dispatch(setPendingTemplateId(templateId));
    navigate('/workout/active');
  };

  const allTags: TemplateTag[] = ['PUSH', 'PULL', 'LEGS', 'UPPER', 'LOWER', 'FULL_BODY', 'ARMS', 'CORE'];

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 space-y-6 max-w-lg mx-auto pb-24">
        {/* Header */}
        <header className="pt-6 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-1">Templates</h1>
            <p className="text-muted-foreground">Start from a saved workout</p>
          </div>
          <Link to="/templates/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create New
            </Button>
          </Link>
        </header>

        {/* Tag Filter Bar */}
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => dispatch(toggleTemplateTag(tag))}
              className={cn(
                selectedTags.includes(tag) ? 'tag-pill-active' : 'tag-pill-inactive'
              )}
            >
              {TEMPLATE_TAG_LABELS[tag]}
            </button>
          ))}
        </div>

        {/* Template List */}
        <section className="space-y-3">
          {isLoading ? (
            <div className="stat-card text-center py-8">
              <p className="text-muted-foreground">Loading templates...</p>
            </div>
          ) : templates.length === 0 ? (
            <div className="stat-card text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                <Dumbbell className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-4">No templates found</p>
              <Link to="/templates/new">
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Template
                </Button>
              </Link>
            </div>
          ) : (
            templates.map((template) => (
              <div key={template.id} className="stat-card overflow-hidden">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{template.name}</h3>
                    {template.description && (
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    )}
                  </div>
                  <Button
                    size="icon"
                    onClick={() => handleStartFromTemplate(template.id)}
                    className="shrink-0"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {template.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 text-xs font-medium bg-accent text-accent-foreground rounded-full uppercase">
                      {TEMPLATE_TAG_LABELS[tag]}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Dumbbell className="w-4 h-4" />
                    <span>{template.exercises.length} exercises</span>
                  </div>
                </div>


              </div>
            ))
          )}
        </section>


      </div>

      {/* Bottom Nav */}
      <BottomNav />
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
          <Dumbbell className="w-5 h-5" />
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