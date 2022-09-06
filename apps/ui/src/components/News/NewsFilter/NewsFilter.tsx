import React, { FunctionComponent } from "react";
import { Input, Dropdown, DropdownItem } from "@govtechsg/tradetrust-ui-components";
import { Search } from "react-feather";
import { NewsTag, NewsSort } from "./../types";

interface NewsFilterProps {
  searchStr: string;
  setSearchStr: (searchStr: string) => void;
  dropdownFilter?: NewsTag | undefined;
  setDropdownFilter: (dropdownFilter: NewsTag | undefined) => void;
  dropdownSort?: NewsSort | undefined;
  setDropdownSort: (dropdownSort: NewsSort | undefined) => void;
}

export const NewsFilter: FunctionComponent<NewsFilterProps> = ({
  searchStr,
  setSearchStr,
  dropdownFilter,
  setDropdownFilter,
  dropdownSort,
  setDropdownSort,
}) => {
  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSearchStr(event.target.value);
  };

  return (
    <div className="flex flex-wrap mb-4">
      <div className="w-full lg:w-60 mb-2 lg:mb-0">
        <div className="relative">
          <Search className="absolute top-1/2 -mt-2 left-2" width="16" height="16" />
          <Input
            className="rounded-md pl-8 max-w-xs"
            type="text"
            placeholder="Search"
            hasError={false}
            value={searchStr}
            onChange={handleChangeSearch}
          />
        </div>
      </div>
      <div className="w-full lg:w-60 mb-2 lg:mb-0 lg:ml-auto lg:mr-4">
        <div className="relative">
          <svg
            className="absolute top-1/2 -mt-1 left-3 z-20"
            width="12"
            height="9"
            viewBox="0 0 12 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line x1="1" y1="2" x2="11" y2="2" stroke="#454B50" strokeWidth="2" strokeLinecap="round" />
            <path d="M1 7H10.5" stroke="#454B50" strokeWidth="2" strokeLinecap="round" />
            <circle cx="4" cy="7" r="1" fill="white" stroke="#454B50" strokeWidth="2" />
            <circle cx="8" cy="2" r="1" fill="white" stroke="#454B50" strokeWidth="2" />
          </svg>
          <Dropdown
            data-testid="dropdown-button-filter"
            dropdownButtonText={dropdownFilter ?? "Filter"}
            className="rounded-md py-1 pl-8 pr-2 border border-gray-300 bg-white"
            classNameShared="w-full max-w-xs"
          >
            <DropdownItem
              data-testid="show-all"
              onClick={() => {
                setDropdownFilter(undefined);
              }}
            >
              Show all
            </DropdownItem>
            {Object.entries(NewsTag).map((entry, index) => {
              const key = entry[0];
              const value = entry[1];

              return (
                <DropdownItem
                  key={index}
                  data-testid={key}
                  onClick={() => {
                    setDropdownFilter(NewsTag[key as keyof typeof NewsTag]);
                  }}
                >
                  {value}
                </DropdownItem>
              );
            })}
          </Dropdown>
        </div>
      </div>
      <div className="w-full lg:w-60">
        <div className="relative">
          <svg
            className="absolute top-1/2 -mt-1 left-3 z-20"
            width="11"
            height="10"
            viewBox="0 0 11 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M1 5L7 5" stroke="#454B50" strokeWidth="2" strokeLinecap="round" />
            <path d="M1 1H10" stroke="#454B50" strokeWidth="2" strokeLinecap="round" />
            <path d="M1 9H4" stroke="#454B50" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <Dropdown
            data-testid="dropdown-button-sort"
            dropdownButtonText={dropdownSort ?? "Sort By"}
            className="rounded-md py-1 pl-8 pr-2 border border-gray-300 bg-white"
            classNameShared="w-full max-w-xs"
          >
            <DropdownItem
              onClick={() => {
                setDropdownSort(undefined);
              }}
            >
              Clear
            </DropdownItem>
            {Object.entries(NewsSort).map((entry, index) => {
              const key = entry[0];
              const value = entry[1];

              return (
                <DropdownItem
                  data-testid={value}
                  key={index}
                  onClick={() => {
                    setDropdownSort(NewsSort[key as keyof typeof NewsSort]);
                  }}
                >
                  {value}
                </DropdownItem>
              );
            })}
          </Dropdown>
        </div>
      </div>
    </div>
  );
};
