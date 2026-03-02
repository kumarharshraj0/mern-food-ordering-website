import { useState } from "react";
import { Star, Send, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

const ReviewForm = ({ onSubmit, loading = false, initialRating = 5, initialComment = "" }) => {
    const [rating, setRating] = useState(initialRating);
    const [comment, setComment] = useState(initialComment);
    const [hover, setHover] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) return toast.error("Please select a rating");

        try {
            await onSubmit({ rating, comment });
            setComment("");
            setRating(5);
        } catch (err) {
            // Error handled by parent/context
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
                    Your Rating
                </label>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                            className="transition-transform active:scale-90"
                        >
                            <Star
                                size={32}
                                className={`transition-colors ${star <= (hover || rating)
                                        ? "fill-orange-500 text-orange-500"
                                        : "text-gray-200"
                                    }`}
                            />
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                    Your Review
                </label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="What did you like or dislike?"
                    className="w-full p-4 border border-gray-100 rounded-xl focus:ring-4 focus:ring-orange-500/10 focus:outline-none text-sm bg-gray-50/30 min-h-[120px]"
                    required
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-600/20 hover:bg-orange-700 transition-all active:scale-95 disabled:opacity-50"
            >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                {loading ? "Submitting..." : "Submit Review"}
            </button>
        </form>
    );
};

export default ReviewForm;
