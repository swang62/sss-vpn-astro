import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

export interface StepProps {
  idx?: number;
  skip?: boolean;
  title: React.JSX.Element | string;
  content: React.JSX.Element | string;
}

function Step({ content, idx = 0, title }: StepProps) {
  return (
    <Card
      x-chunk="Step"
      id={`${idx}`}
      className="relative mb-6 ml-4 rounded-lg border-transparent border-l-primary/30 pb-4 dark:border-l-2"
    >
      <Badge className="absolute top-5 -left-4 flex size-8 items-center justify-center border-secondary/30 bg-secondary">
        <span className="font-bold font-mono text-xs">{idx + 1}</span>
      </Badge>
      <CardTitle className="ml-8 font-heading text-lg">{title}</CardTitle>
      <CardContent className="flex flex-col gap-4 whitespace-break-spaces text-wrap px-8">
        {content}
      </CardContent>
    </Card>
  );
}

export default Step;
