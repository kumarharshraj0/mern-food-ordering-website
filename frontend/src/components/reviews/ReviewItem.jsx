import { Star, User } from "lucide-react";

const ReviewItem = ({ review }) => {
    const { user, rating, comment, createdAt } = review;

    return (
        <div className="py-6 border-b border-gray-50 last:border-0">
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                        <User size={20} />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 text-sm">{user?.name || "Anonymous"}</h4>
                        <p className="text-xs text-gray-400">
                            {new Date(createdAt).toLocaleDateString(undefined, {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                            })}
                        </p>
                    </div>
                </div>
                <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            size={14}
                            className={`${star <= rating ? "fill-orange-500 text-orange-500" : "text-gray-200"
                                }`}
                        />
                    ))}
                </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed pl-13">
                {comment}
            </p>
        </div>
    );
};

export default ReviewItem;
