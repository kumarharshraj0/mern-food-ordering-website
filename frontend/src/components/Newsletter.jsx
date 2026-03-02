import React from "react";
import { Mail, ArrowRight } from "lucide-react";

export function Newsletter() {
    return (
        <section className="py-20 px-4 bg-orange-50">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-3xl p-8 md:p-16 shadow-2xl shadow-orange-900/5 relative overflow-hidden border border-orange-100">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-orange-400/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-orange-400/10 rounded-full blur-3xl" />

                    <div className="relative flex flex-col lg:flex-row items-center justify-between gap-12">
                        <div className="lg:max-w-xl text-center lg:text-left">
                            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                                Get Updates on Healthy Meals & Offers!
                            </h2>
                            <p className="text-lg text-gray-600 max-w-lg mx-auto lg:mx-0">
                                Join our 10,000+ members and get weekly curated recipes,
                                nutrition tips, and exclusive restaurant discounts.
                            </p>
                        </div>

                        <div className="w-full max-w-md">
                            <form className="flex flex-col sm:flex-row items-stretch gap-3">
                                <div className="flex-1 relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-orange-500 transition-all outline-none shadow-sm font-medium"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="bg-orange-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-orange-700 transition-all shadow-lg hover:shadow-orange-600/30 flex items-center justify-center gap-2"
                                >
                                    Join Us <ArrowRight size={20} />
                                </button>
                            </form>
                            <p className="mt-4 text-xs text-center text-gray-400 font-medium">
                                We respect your privacy. Unsubscribe at any time.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
