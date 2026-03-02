import React, { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

const faqs = [
    {
        question: "How do I place an order?",
        answer: "Simply search for your favorite restaurant or cuisine, add items to your cart, and proceed to checkout. You can pay online or choose cash on delivery."
    },
    {
        question: "How long does delivery take?",
        answer: "Delivery time varies depending on your distance from the restaurant and their preparation time. Typically, it takes between 25 to 45 minutes."
    },
    {
        question: "Is there a minimum order value?",
        answer: "Minimum order values are set by individual restaurants. You can see the minimum order requirement on the restaurant's menu page."
    },
    {
        question: "How can I track my order?",
        answer: "Once your order is confirmed, you can track its real-time status in the 'Orders' section of your account."
    },
    {
        question: "Can I cancel my order?",
        answer: "Orders can be cancelled within 2 minutes of placement. After that, the restaurant may have already started preparing your meal."
    }
];

export function FAQ() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-24 px-4 bg-white font-inter">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-orange-600 text-sm font-black mb-4 uppercase tracking-widest shadow-sm">
                        <HelpCircle size={16} /> Help Center
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
                        Common Questions
                    </h2>
                    <p className="text-lg text-gray-600">
                        Everything you need to know about our service
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`border rounded-2xl transition-all duration-300 ${openIndex === index ? 'border-orange-500 bg-orange-50/30' : 'border-gray-100 bg-gray-50/50 hover:bg-gray-100'}`}
                        >
                            <button
                                onClick={() => toggle(index)}
                                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                            >
                                <span className={`text-lg font-bold transition-colors ${openIndex === index ? 'text-orange-600' : 'text-gray-900'}`}>
                                    {faq.question}
                                </span>
                                {openIndex === index ? (
                                    <ChevronUp className="text-orange-600 flex-shrink-0" />
                                ) : (
                                    <ChevronDown className="text-gray-400 flex-shrink-0" />
                                )}
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <div className="px-6 pb-6 text-gray-600 font-medium leading-relaxed">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
