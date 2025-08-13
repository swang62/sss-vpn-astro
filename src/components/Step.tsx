import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

export interface StepProps {
  idx?: number;
  title: React.JSX.Element | string;
  content: React.JSX.Element | string;
}

function Step({ content, idx = 0, title }: StepProps) {
  return (
    <Card x-chunk="Step" className="relative pt-6 pb-4 mb-6 ml-4 border-l border-transparent rounded-none border-l-border">
      <Badge variant="secondary" className="absolute top-0 w-8 h-8 -left-4">
        <span className="absolute font-mono text-lg left-2.5">{idx + 1}</span>
      </Badge>
      <CardTitle className="mb-2 ml-8">
        {title}
      </CardTitle>
      <CardContent className="flex flex-col gap-4 px-8 py-4 whitespace-break-spaces text-wrap">
        {content}
      </CardContent>
    </Card>
  );
}

export default Step;
