import React from "react";
import { Download, Smartphone, Apple, Play } from "lucide-react";

export function AppDownload() {
    return (
        <section className="py-20 px-4 bg-gradient-to-r from-orange-600 to-orange-500">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="flex-1 text-white">
                    <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                        Order Food on the Go!
                    </h2>
                    <p className="text-xl text-orange-50 mb-8 opacity-90 max-w-lg">
                        Download our top-rated app and get exclusive deals, real-time tracking,
                        and faster checkouts. Your favorite meals are just a tap away.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <button className="flex items-center gap-3 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-900 transition-all border border-gray-800">
                            <Apple fill="white" size={24} />
                            <div className="text-left">
                                <p className="text-[10px] uppercase font-bold opacity-60">Download on</p>
                                <p className="text-lg font-bold -mt-1">App Store</p>
                            </div>
                        </button>
                        <button className="flex items-center gap-3 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-900 transition-all border border-gray-800">
                            <Play fill="white" size={24} />
                            <div className="text-left">
                                <p className="text-[10px] uppercase font-bold opacity-60">Get it on</p>
                                <p className="text-lg font-bold -mt-1">Google Play</p>
                            </div>
                        </button>
                    </div>
                </div>

                <div className="relative flex-1 flex justify-center mt-12 md:mt-0">
                    {/* Mock Mobile App Frame */}
                    <div className="relative w-64 h-[500px] bg-white rounded-[3rem] border-8 border-gray-900 shadow-2xl overflow-hidden transform md:rotate-6 hover:rotate-0 transition-transform duration-500">
                        <div className="absolute top-0 w-full h-6 bg-gray-900 flex justify-center">
                            <div className="w-16 h-4 bg-gray-900 rounded-b-xl" />
                        </div>
                        {/* App Mock Content Layer */}
                        <div className="pt-8 px-4 space-y-4">
                            <div className="h-4 w-20 bg-gray-100 rounded" />
                            <div className="h-32 w-full bg-orange-100 rounded-xl" />
                            <div className="space-y-2">
                                <div className="h-4 w-full bg-gray-100 rounded" />
                                <div className="h-4 w-3/4 bg-gray-100 rounded" />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="h-24 bg-gray-100 rounded-lg" />
                                <div className="h-24 bg-gray-100 rounded-lg" />
                            </div>
                        </div>
                    </div>

                    {/* Floating Element */}
                    <div className="absolute -bottom-8 -left-8 md:bottom-20 md:-left-20 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 animate-bounce">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                <Download size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-bold">Offer</p>
                                <p className="text-sm font-black text-gray-900">50% OFF FIRST ORDER</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
