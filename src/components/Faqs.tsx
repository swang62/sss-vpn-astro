import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TRIAL_TIME } from "@/config/constants";

const data = [
  {
    answer:
      `Once you create an account, you'll get instant access to the VPN and instructions on how to install it. The trial period will last for ${TRIAL_TIME} days. I want to make sure everyone tries out the VPN first.`,
    id: "1",
    question: "How does the trial period work?",
  },
  {
    answer:
      "Don't panic! Sometimes during chinese holidays, there's a much higher chance of VPN throttling and restrictions. If the app is down for more than a day, let me know.",
    id: "2",
    question: "The VPN suddenly stopped working, what should I do?",
  },
  {
    answer:
      "This is a common issue with chinese apps like Taobao/Alipay that are geo-restricted to only work within China. The mobile app can selectively allow certain apps to bypass the VPN.",
    id: "3",
    question: "Why doesn't this app work when the VPN is turned on?",
  },
  {
    answer:
      "Once logged in, click on your avatar, go to manage account and cancel subscription.",
    id: "4",
    question: "How do I unsubscribe?",
  },
];

function Faqs() {
  return (
    <section id="faqs" className="container max-w-2xl py-8 sm:py-16">
      <div className="py-8">
        <h1 className="text-4xl text-balance font-heading sm:text-5xl md:text-6xl">
          Frequently Asked
          <span className="font-extrabold text-gradient"> Questions</span>
        </h1>

        <Accordion type="single" collapsible className="w-full py-4">
          {data.map(item => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger className="text-lg text-left">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-base">{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export default Faqs;
