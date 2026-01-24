import { Link } from "wouter";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="text-center space-y-4 p-8">
        <div className="flex justify-center">
          <AlertTriangle className="h-16 w-16 text-destructive" />
        </div>
        <h1 className="text-4xl font-bold font-display text-foreground">404 Page Not Found</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Oops! It looks like you've wandered off the path. Let's get you back to focus.
        </p>
        <Link href="/">
          <Button className="mt-4 rounded-full px-8">Return Home</Button>
        </Link>
      </div>
    </div>
  );
}
