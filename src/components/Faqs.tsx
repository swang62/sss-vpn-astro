import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqData = [
  {
    answer:
      "Our company provides innovative software solutions to help businesses automate their processes and improve operational efficiency.",
    id: "item-1",
    question: "What does your company do?",
  },
  {
    answer:
      "You can contact us by sending an email to support@example.com or by calling our customer service number at +1 123-456-7890.",
    id: "item-2",
    question: "How can I contact your customer service?",
  },
  {
    answer:
      "We are open from Monday to Friday, from 9:00 AM to 5:00 PM. Our customer service is available during these hours to assist you.",
    id: "item-3",
    question: "What are your company's business hours?",
  },
];

export default function FaqSection() {
  return (
    <section id="faqs" className="container max-w-2xl py-8 sm:py-16">
      <div className="py-8">
        <h1 className="text-balance font-heading text-4xl sm:text-5xl md:text-6xl">
          Frequently Asked
          <span className="text-gradient font-extrabold"> Questions</span>
        </h1>

        <Accordion type="single" collapsible className="w-full py-4">
          {faqData.map((faqItem) => (
            <AccordionItem key={faqItem.id} value={faqItem.id}>
              <AccordionTrigger>{faqItem.question}</AccordionTrigger>
              <AccordionContent>{faqItem.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
