import React, { useState } from "react";
import { Loader2 } from "lucide-react";

const OptimizedImage = ({ src, alt, className, priority = false, ...props }) => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    // High-quality food placeholder using Unsplash
    const placeholder = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=10&q=10";

    return (
        <div className={`relative overflow-hidden ${className}`}>
            {/* Blurred Placeholder */}
            <img
                src={placeholder}
                alt=""
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${loaded ? "opacity-0" : "opacity-100"
                    }`}
                aria-hidden="true"
            />

            {/* Actual Image */}
            <img
                src={error ? "/placeholder.png" : src}
                alt={alt}
                className={`h-full w-full object-cover transition-all duration-700 ${loaded ? "scale-100 opacity-100" : "scale-105 opacity-0"
                    }`}
                onLoad={() => setLoaded(true)}
                onError={() => setError(true)}
                loading={priority ? "eager" : "lazy"}
                {...props}
            />

            {!loaded && !error && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                    <Loader2 className="h-6 w-6 animate-spin text-orange-500 opacity-20" />
                </div>
            )}
        </div>
    );
};

export default OptimizedImage;
