import React from "react";
import { LoaderSkeleton } from "./LoaderSkeleton";

export default {
  title: "UI/LoaderSkeleton",
  component: LoaderSkeleton,
  parameters: {
    componentSubtitle: "Types of loaders, with custom parameters.",
  },
};

export const Skeleton = () => {
  return <LoaderSkeleton />;
};

export const SkeletonCustomWidth = () => {
  return <LoaderSkeleton width="90px" />;
};

export const SkeletonLoaded = () => {
  return <LoaderSkeleton>Some text loaded.</LoaderSkeleton>;
};
