import { getSortedByDateDesc, getCmsContentWithSlug } from "../../utils";

export * from "./event";

const rawEvents = getCmsContentWithSlug(require.context("../../../cms/event/", false, /\.md$/));
export const events = getSortedByDateDesc(rawEvents);
