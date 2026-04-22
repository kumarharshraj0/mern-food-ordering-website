import React, { useState } from 'react';
import { Reveal } from '@/components/ui/Reveal';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, Facebook, Instagram, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    // Simulate API call
    setTimeout(() => {
      toast.success("Message sent! We'll get back to you soon. 🧡");
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSending(false);
    }, 1500);
  };

  const contactDetails = [
    {
      title: 'Email Us',
      value: 'support@foodhub.in',
      sub: 'We reply within 24 hours',
      icon: Mail,
      link: 'mailto:support@foodhub.in'
    },
    {
      title: 'Call Us',
      value: '+91 80 1234 5678',
      sub: 'Mon-Sun, 9am-10pm',
      icon: Phone,
      link: 'tel:+918012345678'
    },
    {
      title: 'Our Office',
      value: '123 Food Street, MG Road',
      sub: 'Bangalore, Karnataka 560001',
      icon: MapPin,
      link: '#'
    }
  ];

  return (
    <div className="bg-stone-50 min-h-screen pt-20 font-inter">
      {/* Hero Header */}
      <section className="py-24 px-6 bg-white border-b border-stone-100">
        <div className="max-w-7xl mx-auto text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-orange-600 text-sm font-black uppercase tracking-[2px] mb-6">
              Contact Us
            </div>
            <h1 className="text-5xl md:text-7xl font-outfit font-black text-stone-900 mb-6">
              Get in <span className="text-orange-600">touch.</span>
            </h1>
            <p className="text-xl text-stone-500 max-w-2xl mx-auto font-medium">
              Have a question or need help with your order? Send us a message and our team will help you out.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Details Left Side */}
          <div className="space-y-12">
            <Reveal>
              <h2 className="text-3xl font-black text-stone-900 mb-8 tracking-tight">Direct Support</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                {contactDetails.map((item, i) => (
                  <a
                    key={i}
                    href={item.link}
                    className="group bg-white p-8 rounded-3xl border border-stone-200 hover:border-orange-500 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 flex items-start gap-6"
                  >
                    <div className="p-4 rounded-2xl bg-stone-50 group-hover:bg-orange-500 transition-colors">
                      <item.icon className="w-6 h-6 text-stone-400 group-hover:text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-stone-900 text-lg mb-1">{item.title}</h3>
                      <p className="text-stone-700 font-bold mb-1">{item.value}</p>
                      <p className="text-stone-400 text-sm font-medium">{item.sub}</p>
                    </div>
                  </a>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="p-10 rounded-3xl bg-stone-900 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                  <MessageCircle size={120} />
                </div>
                <h3 className="text-2xl font-bold mb-4 relative z-10">Connect With Us</h3>
                <p className="text-stone-400 font-medium mb-8 relative z-10">Follow us on social media for the latest updates, food trends, and exclusive offers.</p>
                <div className="flex gap-4 relative z-10">
                  <button className="h-12 w-12 rounded-2xl bg-white/10 hover:bg-orange-500 flex items-center justify-center transition-colors">
                    <Facebook className="h-5 w-5" />
                  </button>
                  <button className="h-12 w-12 rounded-2xl bg-white/10 hover:bg-orange-500 flex items-center justify-center transition-colors">
                    <Instagram className="h-5 w-5" />
                  </button>
                  <button className="h-12 w-12 rounded-2xl bg-white/10 hover:bg-orange-500 flex items-center justify-center transition-colors">
                    <Twitter className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Contact Form Right Side */}
          <Reveal delay={0.1}>
            <div className="bg-white p-10 md:p-12 rounded-[40px] shadow-2xl shadow-stone-200 border border-stone-100">
              <h2 className="text-3xl font-black text-stone-900 mb-8 tracking-tight">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-black text-stone-400 uppercase tracking-widest px-2">Your Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all font-bold text-stone-900"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black text-stone-400 uppercase tracking-widest px-2">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all font-bold text-stone-900"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-stone-400 uppercase tracking-widest px-2">Subject</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all font-bold text-stone-900"
                    placeholder="How can we help?"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-stone-400 uppercase tracking-widest px-2">Your Message</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all font-bold text-stone-900 resize-none"
                    placeholder="Tell us everything..."
                  />
                </div>
                <Button
                  disabled={sending}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-8 rounded-2xl shadow-xl shadow-orange-500/20 text-lg group transition-all duration-300"
                >
                  {sending ? 'Sending...' : (
                    <>
                      Send Message
                      <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </Reveal>

        </div>
      </section>

      {/* Stylized Map Placeholder */}
      <section className="py-24 px-6">
        <Reveal>
          <div className="max-w-7xl mx-auto rounded-[40px] overflow-hidden relative h-[400px] bg-stone-200 group">
            <img
              src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=2000&q=80"
              alt="City Map"
              className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 duration-100 duration-700 scale-110"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white p-6 rounded-3xl shadow-2xl flex items-center gap-4 animate-bounce">
                <div className="h-10 w-10 bg-orange-600 rounded-full flex items-center justify-center">
                  <MapPin className="text-white h-5 w-5" />
                </div>
                <span className="font-bold text-stone-900">FoodHub Office, MG Road</span>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
};

export default Contact;
