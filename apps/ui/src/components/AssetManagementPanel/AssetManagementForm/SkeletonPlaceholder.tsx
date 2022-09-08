import React, { FunctionComponent } from "react";
import { LoaderSkeleton } from "../../UI/LoaderSkeleton";

export const SkeletonPlaceholder: FunctionComponent = () => {
  return (
    <div className="mt-4 mb-6" data-testid="loading-skeleton-placeholder">
      <LoaderSkeleton className="mb-2" width="90px" />
      <LoaderSkeleton />
    </div>
  );
};
