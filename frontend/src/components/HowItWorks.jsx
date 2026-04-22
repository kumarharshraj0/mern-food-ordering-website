import React from 'react';
import { MapPin, UtensilsCrossed, Bike } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';

export function HowItWorks() {
  const steps = [
    {
      id: 1,
      icon: <MapPin className="w-8 h-8 text-orange-600" />,
      title: "Set Location",
      description: "Select your precise location to find restaurants that deliver to your door."
    },
    {
      id: 2,
      icon: <UtensilsCrossed className="w-8 h-8 text-orange-600" />,
      title: "Choose Order",
      description: "Browse hundreds of menus to find the food you like and place your order."
    },
    {
      id: 3,
      icon: <Bike className="w-8 h-8 text-orange-600" />,
      title: "Fast Delivery",
      description: "Track your order in real-time as it makes its way to you at lightning speed."
    }
  ];

  return (
    <Reveal>
      <section className="bg-white py-20 border-y border-stone-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-outfit text-gray-900 tracking-tight mb-4">
            How it Works
          </h2>
          <p className="text-gray-500 font-medium mb-16 max-w-2xl mx-auto font-inter">
            Get your favorite food delivered in three simple steps.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Subtle dotted connecting line (Desktop only) */}
            <div className="hidden md:block absolute top-[45px] left-1/6 right-1/6 h-[2px] bg-gradient-to-r from-transparent via-orange-200 to-transparent z-0 w-2/3 mx-auto border-t-[3px] border-dotted border-orange-200"></div>

            {steps.map((step) => (
              <div key={step.id} className="relative z-10 flex flex-col items-center">
                <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-orange-100 group hover:bg-orange-600 hover:text-white transition-all duration-300 cursor-default">
                  {/* Clone icon to handle color switch on hover via group wrapper */}
                  {React.cloneElement(step.icon, {
                    className: "w-8 h-8 text-orange-600 group-hover:text-white transition-colors duration-300"
                  })}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 font-outfit tracking-tight">
                  {step.title}
                </h3>
                <p className="text-gray-500 font-medium leading-relaxed max-w-xs font-inter text-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Reveal>
  );
}
