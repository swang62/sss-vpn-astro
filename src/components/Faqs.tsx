import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqData = [
  {
    answer:
      "Once you create an account, you'll get instant access to the VPN and instructions on how to install it. The trial period will last for 3 days. I wanted to make sure everyone tries out the VPN first, before giving me any money, since this service is mainly for friends and family,",
    id: "1",
    question: "How excatly does the trial period work?",
  },
  {
    answer:
      "Don't panic! Sometimes during chinese holidays, there's a much higher chance of VPN throttling and restrictions. If the app is down for more than a day, let me know.",
    id: "2",
    question: "The VPN suddenly stopped working/connecting.",
  },
  {
    answer:
      "This is a common issue with chinese apps like Douyin/Taobao/Alipay that are geo-restricted to only work within China. Make sure you turn on the per-app proxy in the settings to selectively allow chinese apps to bypass the VPN.",
    id: "3",
    question: "My chinese app doesn't work with the VPN.",
  },
  {
    answer:
      "Everything is managed by Stripe, just log into your account, then click your avatar > Manage Subscription.",
    id: "4",
    question: "How do I unsubscribe?",
  },
];

function Faqs() {
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
              <AccordionTrigger className="text-left">
                {faqItem.question}
              </AccordionTrigger>
              <AccordionContent>{faqItem.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export default Faqs;
