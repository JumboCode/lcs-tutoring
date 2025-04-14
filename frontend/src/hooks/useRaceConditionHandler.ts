import { useState, useCallback } from "react";

export const useRaceConditionHandler = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAsyncOperation = useCallback(
    async <T>(asyncOperation: () => Promise<T>): Promise<T | null> => {
      // If already processing, return early
      if (isProcessing) {
        console.warn(
          "Operation already in progress. Skipping to prevent race condition."
        );
        return null;
      }

      try {
        // Set processing flag to true
        setIsProcessing(true);

        // Execute the async operation
        const result = await asyncOperation();

        // Return the result
        return result;
      } catch (error) {
        // Log any errors
        console.error("Error in async operation:", error);
        throw error;
      } finally {
        // Reset processing flag
        setIsProcessing(false);
      }
    },
    [isProcessing]
  );

  return { handleAsyncOperation, isProcessing };
};
