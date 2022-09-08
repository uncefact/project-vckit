import React from "react";
import { Tag, TagBordered, TagBorderedSm, TagBorderedLg } from "./Tag";

export default {
  title: "UI/Tag",
  component: Tag,
  parameters: {
    componentSubtitle: "Types of Tags, Solid, Bordered.",
  },
};

export const SolidTeal = () => {
  return <Tag className="text-white bg-turquoise">SolidDefault</Tag>;
};

export const BorderedWhite = () => {
  return <TagBordered className="text-white border-white">BorderedWhite</TagBordered>;
};

export const BorderedRed = () => {
  return <TagBordered className="text-red-500 border-red-500">TagBorderedRed</TagBordered>;
};

export const BorderedGraySmall = () => {
  return <TagBorderedSm className="text-gray-600">BorderedGraySmall</TagBorderedSm>;
};

export const BorderedRedLarge = () => {
  return <TagBorderedLg className="text-red-500 border-red-500">BorderedRedLarge</TagBorderedLg>;
};
