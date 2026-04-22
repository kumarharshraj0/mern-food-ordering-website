import { Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Food Enthusiast",
    content:
      "The quality of food is exceptional! Every dish arrives hot and fresh, just like dining at a restaurant.",
    rating: 5,
    image:
      "https://placehold.co/80x80?text=Smiling+woman",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Busy Professional",
    content:
      "FoodHub has been a lifesaver for my hectic schedule. The variety of restaurants is amazing.",
    rating: 5,
    image:
      "https://placehold.co/80x80?text=Professional+man",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Home Chef",
    content:
      "The authenticity and presentation are impressive. Packaging keeps everything perfect.",
    rating: 5,
    image:
      "https://placehold.co/80x80?text=Happy+woman",
  },
  {
    id: 4,
    name: "David Thompson",
    role: "Restaurant Owner",
    content:
      "Even as a restaurant owner, I order regularly. Service and quality are consistently excellent.",
    rating: 5,
    image:
      "https://placehold.co/80x80?text=Chef",
  },
  {
    id: 5,
    name: "Lisa Park",
    role: "College Student",
    content:
      "Perfect for late-night study sessions! Great prices and super fast delivery.",
    rating: 5,
    image:
      "https://placehold.co/80x80?text=Student",
  },
  {
    id: 6,
    name: "James Wilson",
    role: "Fitness Coach",
    content:
      "Healthy options with great taste. Makes it easy to maintain my diet.",
    rating: 5,
    image:
      "https://placehold.co/80x80?text=Coach",
  },
];

export function TestimonialsSection() {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const interval = setInterval(() => {
      if (!isPaused) {
        container.scrollLeft += 1;
        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollLeft = 0;
        }
      }
    }, 20);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <Reveal>
      <section className="bg-gradient-to-b from-white to-orange-50 py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-orange-700 md:text-5xl">
            What Our Customers Say
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-orange-900/70">
            Join thousands of happy customers who trust us for their daily meals
          </p>
        </div>

        {/* Slider */}
        <div
          ref={scrollRef}
          className="relative overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="flex gap-6 pb-4">
            {[...testimonials, ...testimonials].map((t, index) => (
              <div
                key={`${t.id}-${index}`}
                className="w-[380px] flex-shrink-0 rounded-2xl border border-orange-200 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                {/* User */}
                <div className="mb-4 flex items-center gap-4">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="h-16 w-16 rounded-full object-cover border border-orange-200"
                    loading="lazy"
                  />
                  <div>
                    <h4 className="text-lg font-semibold text-orange-900">
                      {t.name}
                    </h4>
                    <p className="text-sm text-orange-900/60">{t.role}</p>
                  </div>
                </div>

                {/* Rating */}
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-orange-500 text-orange-500"
                    />
                  ))}
                </div>

                {/* Content */}
                <p className="text-sm leading-relaxed text-orange-900/70">
                  “{t.content}”
                </p>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-orange-900/60">
          Hover over the testimonials to pause scrolling
        </p>
      </div>
    </section>
    </Reveal>
  );
}
