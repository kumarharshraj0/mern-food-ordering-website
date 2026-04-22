import { Clock, Leaf, Award, Heart, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const features = [
  {
    icon: Clock,
    title: "Fast Delivery",
    description: "Hot & fresh in under 30 mins, guaranteed."
  },
  {
    icon: Leaf,
    title: "Fresh Ingredients",
    description: "Locally-sourced organic ingredients."
  },
  {
    icon: Award,
    title: "Expert Chefs",
    description: "Prepared by award-winning culinary experts."
  },
  {
    icon: Heart,
    title: "Made with Love",
    description: "Crafted with passion and attention to detail."
  },
];

export function Features() {
  return (
    <Reveal>
      <section className="py-24 px-4 bg-gradient-to-br from-white to-orange-50/50 overflow-hidden">
        <div className="mx-auto max-w-7xl flex flex-col lg:flex-row gap-20 items-center">
          
          {/* Left: Image Side */}
          <div className="w-full lg:w-1/2 relative z-10 mt-10 lg:mt-0">
            {/* Main Image */}
            <div className="relative rounded-[2rem] overflow-hidden h-[400px] md:h-[550px] shadow-2xl group border-[8px] border-white z-10 w-full md:w-11/12 ml-auto">
              <img 
                src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80" 
                alt="Delicious food cooking" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 mix-blend-multiply" />
            </div>

            {/* Floating Image element 1 */}
            <div className="absolute -top-10 -left-6 md:-left-12 lg:-left-20 w-40 h-40 md:w-64 md:h-64 rounded-full overflow-hidden border-[8px] border-white shadow-xl z-20 animate-[spin_60s_linear_infinite]">
              <img 
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80" 
                alt="Fresh salad bowl"
                className="w-full h-full object-cover" 
              />
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-8 -right-2 md:right-8 bg-white p-5 md:p-6 rounded-2xl shadow-2xl shadow-orange-900/10 border border-orange-100 flex items-center gap-4 z-20 transition-transform hover:-translate-y-2">
              <div className="bg-orange-100 p-3 md:p-4 rounded-full text-orange-600">
                <ShieldCheck size={32} className="md:w-10 md:h-10" />
              </div>
              <div>
                <p className="font-outfit font-black text-3xl md:text-4xl text-gray-900 tracking-tight">100%</p>
                <p className="text-gray-500 font-inter font-semibold text-sm md:text-base whitespace-nowrap uppercase tracking-wider">Quality Guarantee</p>
              </div>
            </div>
            
            {/* Background Blob decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-orange-300/20 blur-[80px] rounded-full -z-10 pointer-events-none"></div>
          </div>

          {/* Right: Content Side */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-outfit font-black text-gray-900 mb-6 leading-[1.1] tracking-tight">
              Why People Choose <span className="text-orange-600 relative inline-block">
                TastyFlow
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-orange-300 -z-10 opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="transparent" />
                </svg>
              </span>
            </h2>
            
            <p className="text-lg text-gray-600 mb-12 font-inter font-medium leading-relaxed max-w-xl">
              From fresh ingredients to lightning-fast delivery, we are committed to making your dining experiences seamless, delightful, and incredibly tasty.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div key={idx} className="group flex flex-col gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-orange-100 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all hover:scale-110 hover:shadow-orange-600/30">
                      <Icon size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold font-outfit text-gray-900 mb-2 tracking-tight group-hover:text-orange-700 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm font-inter font-medium text-gray-500 leading-relaxed pr-4">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
