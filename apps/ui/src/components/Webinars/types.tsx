export type WebinarSingle = {
  title: string;
  description: string;
  resource: {
    youtubeEmbedCode: string;
    tag: string;
    downloads: DownloadsType[];
    videoChapters?: VideoChaptersType[];
  };
};

type DownloadsType = {
  fileName: string;
  path: string;
};

type VideoChaptersType = {
  title: string;
  timeStamp: number;
};
