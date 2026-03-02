import { Clock, Leaf, Award, Heart } from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Fast Delivery",
    description:
      "Get your food delivered hot and fresh in under 30 minutes, guaranteed",
  },
  {
    icon: Leaf,
    title: "Fresh Ingredients",
    description:
      "We source only the finest, locally-sourced organic ingredients for every dish",
  },
  {
    icon: Award,
    title: "Expert Chefs",
    description:
      "Our dishes are prepared by award-winning chefs with years of culinary expertise",
  },
  {
    icon: Heart,
    title: "Made with Love",
    description:
      "Every meal is crafted with passion and attention to the smallest details",
  },
];

export function Features() {
  return (
    <section className="bg-gradient-to-b from-orange-50 via-orange-50 to-white py-20 px-4 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-orange-700 md:text-5xl">
            Why Choose Us
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-orange-900/70">
            We’re committed to delivering not just meals, but memorable dining
            experiences
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="group rounded-2xl border border-orange-200 bg-white p-8 text-center transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 transition-all group-hover:bg-orange-600">
                  <Icon className="h-8 w-8 text-orange-600 transition-colors group-hover:text-white" />
                </div>

                <h3 className="mb-3 text-xl font-semibold text-orange-900">
                  {feature.title}
                </h3>

                <p className="text-sm leading-relaxed text-orange-900/70">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
