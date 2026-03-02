import ReviewItem from "./ReviewItem";
import { MessageSquareOff } from "lucide-react";

const ReviewList = ({ reviews = [], loading = false }) => {
    if (loading) {
        return (
            <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                        <div className="flex justify-between mb-4">
                            <div className="flex gap-3">
                                <div className="h-10 w-10 rounded-full bg-gray-100" />
                                <div className="space-y-2">
                                    <div className="h-4 w-24 bg-gray-100 rounded" />
                                    <div className="h-3 w-16 bg-gray-50 rounded" />
                                </div>
                            </div>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <div key={s} className="h-4 w-4 bg-gray-100 rounded-full" />
                                ))}
                            </div>
                        </div>
                        <div className="h-4 w-full bg-gray-50 rounded" />
                    </div>
                ))}
            </div>
        );
    }

    if (reviews.length === 0) {
        return (
            <div className="py-12 text-center">
                <div className="inline-flex items-center justify-center p-4 bg-gray-50 rounded-full text-gray-300 mb-4">
                    <MessageSquareOff size={32} />
                </div>
                <h4 className="text-gray-900 font-bold mb-1">No reviews yet</h4>
                <p className="text-gray-400 text-sm">Be the first to share your experience!</p>
            </div>
        );
    }

    return (
        <div className="divide-y divide-gray-50">
            {reviews.map((review) => (
                <ReviewItem key={review._id} review={review} />
            ))}
        </div>
    );
};

export default ReviewList;
