import { Card, CardContent, CardTitle } from "@/components/ui/card";

import { Badge } from "./ui/badge";

export interface StepProps {
  step?: number;
  title: string;
  content: JSX.Element;
}

function StepInstructions({ content, step, title }: StepProps) {
  return (
    <Card x-chunk="Step" className="relative w-full mx-4 border-transparent border-l-border">
      <Badge variant="secondary" className="absolute w-8 h-8 -top-1 -left-4">
        <span className="absolute font-mono text-xl left-2.5">{step}</span>
      </Badge>
      <CardTitle className="mb-2 ml-8">
        {title}
      </CardTitle>
      <CardContent className="flex flex-col gap-4 px-8 py-4">
        {content}
      </CardContent>
    </Card>
  );
}

export default StepInstructions;
