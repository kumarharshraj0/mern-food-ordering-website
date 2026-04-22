import React from 'react';
import { Reveal } from '@/components/ui/Reveal';
import { Users, Utensils, Zap, Heart, Award, Globe } from 'lucide-react';

const About = () => {
  const stats = [
    { label: 'Orders Delivered', value: '2.5M+', icon: Zap },
    { label: 'Partner Restaurants', value: '12,000+', icon: Utensils },
    { label: 'Happy Customers', value: '1M+', icon: Users },
    { label: 'Cities Covered', value: '450+', icon: Globe },
  ];

  const values = [
    {
      title: 'Customer Obsessed',
      description: 'We put our customers at the heart of everything we do, ensuring every meal is a celebration.',
      icon: Heart,
    },
    {
      title: 'Quality First',
      description: 'We partner only with the best local restaurants that maintain the highest standards of hygiene.',
      icon: Award,
    },
    {
      title: 'Innovation Driven',
      description: 'Leveraging cutting-edge technology to make food delivery seamless and lightning-fast.',
      icon: Zap,
    },
  ];

  const team = [
    { name: 'Anjali Sharma', role: 'Founder & CEO', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80' },
    { name: 'Rajesh Kumar', role: 'Head of Culinary', image: 'https://images.unsplash.com/photo-1595273670150-db0a3d39d444?auto=format&fit=crop&w=400&q=80' },
    { name: 'Priya Singh', role: 'Operations Director', image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=400&q=80' },
    { name: 'Arjun Mehta', role: 'Tech Lead', image: 'https://images.unsplash.com/photo-1533108344127-a586d2b02479?auto=format&fit=crop&w=400&q=80' },
  ];

  return (
    <div className="bg-white overflow-x-hidden font-inter">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=2000&q=80"
            alt="Chef preparing food"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-stone-900/70" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <Reveal>
            <h1 className="text-5xl md:text-7xl font-outfit font-black text-white mb-6 tracking-tight">
              Food delivered <br />
              <span className="text-orange-400">fresh and fast.</span>
            </h1>
            <p className="text-xl text-stone-300 max-w-2xl mx-auto font-medium">
              We help you find the best food from local restaurants in Bangalore and get it delivered to your home quickly.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-stone-50 border-y border-stone-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="text-center group">
                  <div className="inline-flex p-4 rounded-2xl bg-white shadow-sm mb-4 group-hover:bg-orange-500 transition-colors duration-300">
                    <stat.icon className="w-6 h-6 text-orange-600 group-hover:text-white" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-stone-900 mb-1">{stat.value}</h3>
                  <p className="text-stone-500 font-bold uppercase tracking-widest text-xs">{stat.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <Reveal>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80"
                  alt="Restaurant interior"
                  className="rounded-3xl shadow-2xl relative z-10"
                />
                <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-orange-500 rounded-3xl -z-0 opacity-20 animate-pulse" />
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-orange-600 text-sm font-black uppercase tracking-[2px]">
                   A Little Secret
                </div>
                <h2 className="text-4xl md:text-5xl font-outfit font-black text-stone-900 leading-tight">
                  Started in Bangalore, <br />
                  <span className="text-orange-600">growing across India.</span>
                </h2>
                <div className="space-y-4 text-lg text-stone-600 leading-relaxed font-medium">
                  <p>
                    FoodHub started in 2018 in Bangalore. Our founder, Anjali Sharma, wanted to make it easier for local food shops to sell their meals online.
                  </p>
                  <p>
                    Now, we work with over 12,000 restaurants. We believe good food should be easy to get for everyone, and we work hard to make that happen every day.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-32 bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <Reveal>
              <h2 className="text-4xl md:text-5xl font-outfit font-black mb-6">What We Stand For</h2>
            <p className="text-stone-400 max-w-xl mx-auto text-lg">
              We follow simple rules to make sure you get the best service every time you order from us.
            </p>
            </Reveal>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {values.map((v, i) => (
              <Reveal key={i} delay={i * 0.2}>
                <div className="p-10 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                  <v.icon className="w-12 h-12 text-orange-500 mb-6 group-hover:scale-110 transition-transform" />
                  <h3 className="text-2xl font-bold mb-4">{v.title}</h3>
                  <p className="text-stone-400 font-medium leading-relaxed">{v.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <Reveal>
              <h2 className="text-4xl md:text-5xl font-outfit font-black text-stone-900">Meet the Foodies</h2>
              <p className="text-stone-500 max-w-xl mx-auto text-lg font-medium">
                The passionate minds behind your favorite delivery app.
              </p>
            </Reveal>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="group text-center">
                  <div className="relative mb-6 overflow-hidden rounded-3xl aspect-[3/4]">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-orange-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h4 className="text-xl font-bold text-stone-900">{member.name}</h4>
                  <p className="text-orange-600 font-bold text-sm uppercase tracking-widest">{member.role}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
