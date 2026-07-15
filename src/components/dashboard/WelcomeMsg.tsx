import { Sparkles } from "lucide-react";

interface Props {
  name: string;
}

function WelcomeMsg({ name }: Props) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-secondary/20 bg-secondary/5 p-4">
      <Sparkles className="mt-0.5 size-5 shrink-0 text-secondary" />
      <p className="text-foreground/80 text-sm leading-relaxed">
        Welcome{name ? ` ${name}` : ""}! Looks like it's your first time here.
        The main dashboard page contains important information about your
        current plan like data usage and subscription status. To get started,
        head over to the{" "}
        <a
          href="/dashboard/install"
          className="font-medium text-secondary-link underline underline-offset-2 transition-colors hover:text-primary-link"
        >
          installation guide
        </a>
        .
      </p>
    </div>
  );
}

export default WelcomeMsg;
