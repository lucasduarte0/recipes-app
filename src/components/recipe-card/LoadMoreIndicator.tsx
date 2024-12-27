import { Loader2 } from "lucide-react";
import { forwardRef, HTMLProps } from "react";

interface LoadMoreIndicatorProps
  extends Omit<HTMLProps<HTMLDivElement>, "ref"> {
  isFetching: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
}

const LoadMoreIndicator = forwardRef<HTMLDivElement, LoadMoreIndicatorProps>(
  ({ isFetching, isFetchingNextPage, hasNextPage, ...props }, ref) => {
    return (
      <div ref={ref} {...props} className="w-full flex justify-center p-4">
        {isFetchingNextPage || isFetching ? (
          <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
        ) : hasNextPage ? (
          <div className="text-gray-500">
            Load more recipes when scrolling...
          </div>
        ) : (
          <div className="text-gray-500">No more recipes to load</div>
        )}
      </div>
    );
  }
);

LoadMoreIndicator.displayName = "LoadMoreIndicator";

export default LoadMoreIndicator;
