import { Link, useNavigate } from "react-router-dom";
import {
  Play,
  Calendar,
  Dumbbell,
  Clock,
  ChevronRight,
  Book,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  useGetActiveWorkoutQuery,
  useStartWorkoutMutation,
} from "@/store/api/activeWorkoutApi";
import { useGetWorkoutHistoryQuery } from "@/store/api/historyApi";
import IronTurtleLogo from "/iron_turtle_logo.png";
export default function Dashboard() {
  const navigate = useNavigate();
  const { data: activeWorkout } = useGetActiveWorkoutQuery();
  const { data: workoutHistory = [] } = useGetWorkoutHistoryQuery({ limit: 5 });
  const [startWorkout] = useStartWorkoutMutation();

  const handleStartEmptyWorkout = async () => {
    await startWorkout({ name: "New Workout" });
    navigate("/workout/active");
  };

  const isActive = !!activeWorkout;

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 space-y-6 max-w-lg mx-auto pb-24">
        {/* Header */}
        <header className="pt-6">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center"
              style={{ borderRadius: "var(--radius)" }}
            >
              <img
                src={IronTurtleLogo}
                alt="Iron Turtle Logo"
                className="w-8 h-8 invert"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Iron Turtle</h1>
              <p className="text-sm text-muted-foreground">
                Train. Track. Transform.
              </p>
            </div>
          </div>
        </header>

        {/* Quick Start */}
        <section>
          {isActive ? (
            <Link to="/workout/active">
              <div className="stat-card bg-primary/5 border-primary/20 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-primary font-semibold uppercase tracking-wide mb-1">
                      Workout in Progress
                    </p>
                    <p className="text-lg font-semibold">
                      {activeWorkout.name}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                    <Play className="w-5 h-5 text-primary-foreground ml-0.5" />
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  size="lg"
                  className="w-full h-14 text-lg font-semibold"
                  style={{ borderRadius: "var(--radius)" }}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Workout
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[40vh]">
                <SheetHeader>
                  <SheetTitle>Start New Workout</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-4 mt-6">
                  <Link to="/templates">
                    <Button variant="default" size="lg" className="w-full">
                      Start from Template
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={handleStartEmptyWorkout}
                  >
                    Start Empty Workout
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </section>

        {/* Quick Links */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
          <div className="space-y-2">
            <Link to="/templates">
              <div className="stat-card flex items-center justify-between hover:bg-accent/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg bg-chart-3/20 flex items-center justify-center"
                    style={{ borderRadius: "var(--radius)" }}
                  >
                    <Dumbbell className="w-5 h-5 text-chart-3" />
                  </div>
                  <div>
                    <p className="font-medium">Workout Templates</p>
                    <p className="text-sm text-muted-foreground">
                      Start from a template
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </Link>

            <Link to="/exercises">
              <div className="stat-card flex items-center justify-between hover:bg-accent/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"
                    style={{ borderRadius: "var(--radius)" }}
                  >
                    <Book className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Exercise Library</p>
                    <p className="text-sm text-muted-foreground">
                      Browse all exercises
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </Link>
          </div>
        </section>

        {/* Recent Workouts */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Recent History</h2>

          {workoutHistory.length === 0 ? (
            <div className="stat-card text-center py-8">
              <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                <Calendar className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-2">No workouts yet</p>
              <p className="text-sm text-muted-foreground">
                Start your first workout to see your history
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {workoutHistory.map((workout) => (
                <div key={workout.id} className="stat-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{workout.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(workout.started_at).toLocaleDateString()} ·{" "}
                        {workout.exercises.length} exercises
                      </p>
                    </div>
                    <Clock className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
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
        <Link to="/" className="nav-link-active flex-1">
          <Dumbbell className="w-5 h-5" />
          <span className="text-xs font-medium">Home</span>
        </Link>
        <Link to="/templates" className="nav-link flex-1">
          <Calendar className="w-5 h-5" />
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
