import React, { FunctionComponent } from "react";
import { useLocation, useParams } from "react-router-dom";
import { EventProps } from "../../../components/UI/ResourceEvent";
import { events } from "../";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { ChevronLeft, ExternalLink, PlayCircle, Download } from "react-feather";
import { Page } from "../../../components/Layout/Page";
import { isFuture, format } from "date-fns";
import { formatTime } from "../../../common/utils/dateTime";
import { LinkButton } from "@govtechsg/tradetrust-ui-components";
import ReactMarkdown from "react-markdown";
import { getFileName } from "../../../utils";

export const EventPageDetail: FunctionComponent = () => {
  const locationPath = useLocation();
  const params: { slug: string } = useParams();
  const detail: EventProps = events.find((eventDetail) => eventDetail.slug === params.slug);

  const {
    title,
    thumbnail,
    blurb,
    link,
    date,
    timeStart,
    timeEnd,
    videoLink,
    slides,
    registerLink,
    location,
    downloadableMediaContent,
    eventDetails,
  } = detail.attributes;

  return (
    <>
      <Helmet>
        <meta
          property="description"
          content="Check out our events and browse through our latest news and official statements."
        />
        <meta
          property="og:description"
          content="Check out our events and browse through our latest news and official statements."
        />
        <meta property="og:title" content="TradeTrust - An easy way to check and verify your documents" />
        <meta property="og:url" content={`${window.location.origin}${locationPath.pathname}`} />
        <title>TradeTrust - {title}</title>
      </Helmet>
      <Page title="Event">
        <div className="flex my-4">
          <div className="w-auto">
            <Link to="/event" className="text-gray-800 flex flex-nowrap items-center">
              <ChevronLeft />
              <span>Back</span>
            </Link>
          </div>
        </div>
        <div className="w-full lg:w-9/12">
          <div className="bg-white text-gray-600 shadow-lg rounded-lg p-8">
            <h2 className="font-medium lg:font-bold text-4xl mb-6 lg:mb-10">{title}</h2>
            {thumbnail && <img className="object-cover w-full h-96 mb-10" src={thumbnail} />}
            <div className="flex flex-col-reverse lg:flex-row">
              <div className="border-r border-cloud-100 border-solid w-full lg:w-2/6 mt-4 lg:mt-0">
                <div className="font-bold">Event Date and Time</div>
                <div>{format(new Date(date), "d MMM yyyy")}</div>
                {timeStart && timeEnd && (
                  <span>
                    {formatTime(timeStart, "HH:mm")} - {formatTime(timeEnd, "HH:mm")} ({formatTime(timeStart, "zzz")})
                  </span>
                )}
                {location && (
                  <>
                    <div className="font-bold">Location</div>
                    <div className="lg:w-4/6">{location}</div>
                  </>
                )}
                <div className="flex flex-col pt-4">
                  {videoLink && (
                    <div className="w-full sm:w-auto mb-2 sm:mb-0">
                      <a
                        className="text-lg text-cerulean-200 font-medium hover:text-cerulean-300 inline-block pr-4 cursor-pointer"
                        href={videoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-testid="watch-link"
                      >
                        <div className="flex">
                          <div className="w-auto">
                            <PlayCircle />
                          </div>
                          <div className="flex-grow px-2">Watch Event</div>
                        </div>
                      </a>
                    </div>
                  )}
                  <div className="w-full sm:w-auto mb-2 sm:mb-0 mt-4">
                    <a
                      className="text-lg text-cerulean-200 font-medium hover:text-cerulean-300 inline-block pr-4"
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid="event-link"
                    >
                      <div className="flex">
                        <div className="w-auto">
                          <ExternalLink />
                        </div>
                        <div className="flex-grow px-2">Event Link</div>
                      </div>
                    </a>
                  </div>

                  {slides && (
                    <div className="w-full sm:w-auto mb-2 sm:mb-0 mt-4">
                      <a
                        className="text-lg text-cerulean-200 font-medium hover:text-cerulean-300 inline-block pr-4 cursor-pointer"
                        href={slides}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-testid="event-slides"
                      >
                        <div className="flex">
                          <div className="w-auto">
                            <ExternalLink />
                          </div>
                          <div className="flex-grow px-2">Event Slides</div>
                        </div>
                      </a>
                    </div>
                  )}
                  {downloadableMediaContent !== undefined &&
                    downloadableMediaContent.map((downloadableContent, index) => {
                      if (!downloadableContent) return null;
                      const fileName = getFileName(downloadableContent);

                      return (
                        <div key={`downloadableContent-${index}`} className="w-full sm:w-auto mb-2 sm:mb-0 mt-4">
                          <a
                            className="text-lg text-cerulean-200 font-medium hover:text-cerulean-300 inline-block pr-4 cursor-pointer"
                            href={downloadableContent}
                            download
                            data-testid={`downloadableContent-${index}`}
                          >
                            <div className="flex">
                              <div className="w-auto">
                                <Download />
                              </div>
                              <div className="flex-grow px-2">{fileName}</div>
                            </div>
                          </a>
                        </div>
                      );
                    })}
                </div>
                {isFuture(new Date(date)) && registerLink && (
                  <LinkButton
                    href={registerLink}
                    target="_blank"
                    className="bg-cerulean-300 rounded-xl text-white hover:bg-cerulean-500 hover:text-white inline-block mb-2 mt-4"
                  >
                    Register
                  </LinkButton>
                )}
              </div>
              <div className="w-full lg:w-4/6 lg:pl-14 mb-4">
                <h3>About this event</h3>
                <div className="mt-2 mb-4">{blurb}</div>
                {eventDetails && <ReactMarkdown className="wysiwyg">{eventDetails}</ReactMarkdown>}
              </div>
            </div>
          </div>
        </div>
      </Page>
    </>
  );
};
