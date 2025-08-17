import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

export interface StepProps {
  idx?: number;
  title: React.JSX.Element | string;
  content: React.JSX.Element | string;
}

function Step({ content, idx = 0, title }: StepProps) {
  return (
    <Card x-chunk="Step" className="relative pb-4 mb-6 ml-4 border-l border-transparent rounded-lg dark:border-l-border">
      <Badge variant="secondary" className="absolute top-5 size-8 -left-4">
        <span className="absolute text-lg left-2.5">{idx + 1}</span>
      </Badge>
      <CardTitle className="ml-8">
        {title}
      </CardTitle>
      <CardContent className="flex flex-col gap-4 px-8 whitespace-break-spaces text-wrap">
        {content}
      </CardContent>
    </Card>
  );
}

export default Step;
