import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CartSheet({ open, onOpenChange }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-end">
      <div className="w-80 bg-white h-full p-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Your Cart
          </h2>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          Cart is empty (placeholder)
        </p>
      </div>
    </div>
  );
}
