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
      className="dark:border-l-border relative mb-6 ml-4 rounded-lg border-l border-transparent pb-4"
    >
      <Badge variant="secondary" className="absolute top-5 -left-4 size-8">
        <span className="absolute left-2.5 text-lg">{idx + 1}</span>
      </Badge>
      <CardTitle className="ml-8">{title}</CardTitle>
      <CardContent className="flex flex-col gap-4 px-8 text-wrap whitespace-break-spaces">
        {content}
      </CardContent>
    </Card>
  );
}

export default Step;
