import {
  Dropdown,
  DropdownItem,
  DropdownProps,
  OverlayContext,
  showDocumentTransferMessage,
  IconError,
} from "@govtechsg/tradetrust-ui-components";
import React, { FunctionComponent, useContext } from "react";
import { ChainId, ChainInfoObject } from "../../../constants/chain-info";
import { useProviderContext } from "../../../common/contexts/provider";
import { getChainInfo } from "../../../common/utils/chain-utils";
import { LoadingModal } from "../../UI/Overlay";

interface NetworkSelectViewProps {
  onChange: (network: ChainInfoObject) => void;
  currentChainId: ChainId | undefined;
  networks: ChainInfoObject[];
}

interface NetworkSelectDropdownItemProps extends DropdownItemLabelProps {
  onClick?: () => void;
}

interface DropdownItemLabelProps {
  network: ChainInfoObject;
  className?: string;
  active?: boolean;
}

/**
 * Dropdown control for the network selection
 */
const WrappedDropdown = (props: DropdownProps) => {
  const { children, className, ...rest } = props;
  return (
    <div className={className} style={{ minWidth: "12.5em" }}>
      <Dropdown className="rounded-md py-1 pl-4 p-2 border border-gray-300 bg-white" {...rest}>
        {children}
      </Dropdown>
    </div>
  );
};

/**
 * Label for the items of the dropdown list
 */
const DropdownItemLabel: FunctionComponent<DropdownItemLabelProps> = ({ className, active, network }) => {
  return (
    <div className={className}>
      <div className="flex items-center" data-testid={`network-select-dropdown-label-${network.chainId}`}>
        <img className="mr-2 w-5 h-5 rounded-full" src={network.iconImage} alt={network.label} />
        <span className="w-full">{network.label}</span>
        {active ? <span className="m-1 p-1 bg-emerald-500 rounded-lg justify-self-end" /> : null}
      </div>
    </div>
  );
};

/**
 * Item component for the dropdown list
 */
const NetworkSelectDropdownItem = (props: NetworkSelectDropdownItemProps) => {
  const { className, network, active, ...rest } = props;
  return (
    <div className={className}>
      <DropdownItem {...rest}>
        <DropdownItemLabel network={network} active={active} />
      </DropdownItem>
    </div>
  );
};

/**
 * Network Selection dropdown component
 */
const NetworkSelectView: FunctionComponent<NetworkSelectViewProps> = ({ onChange, networks, currentChainId }) => {
  const itemsList = networks.map((network, i) => {
    return (
      <NetworkSelectDropdownItem
        key={i}
        network={network}
        active={network.chainId === currentChainId}
        onClick={() => {
          if (onChange) onChange(network);
        }}
      />
    );
  });

  let selectedLabel: React.ReactNode = (
    <div className="bg-white">
      <IconError className="mr-2 w-5 h-5 rounded-full" />
      Unsupported Network
    </div>
  );
  try {
    if (currentChainId) {
      selectedLabel = <DropdownItemLabel network={getChainInfo(currentChainId)} />;
    }
  } catch (e: any) {
    console.log(e.message);
  }

  return (
    <WrappedDropdown
      dropdownButtonText={selectedLabel}
      className="inline-block text-sm"
      classNameShared="w-full max-w-xs"
    >
      <div>
        <span className="text-cloud-500 p-3 pr-8 cursor-default">Select a Network</span>
        {itemsList}
      </div>
    </WrappedDropdown>
  );
};

export const NetworkSelect: FunctionComponent = () => {
  const { changeNetwork, supportedChainInfoObjects, currentChainId } = useProviderContext();
  const { showOverlay, setOverlayVisible } = useContext(OverlayContext);
  const closeOverlay = () => {
    showOverlay(undefined);
    setOverlayVisible(false);
  };

  const changeHandler = async (network: ChainInfoObject) => {
    try {
      showOverlay(<LoadingModal title={"Changing Network..."} content={"Please respond to the metamask window"} />);
      await changeNetwork(network.chainId);
      closeOverlay();
    } catch (e: any) {
      showOverlay(
        showDocumentTransferMessage("You've cancelled changing network.", {
          isSuccess: false,
        })
      );
    }
  };

  return (
    <NetworkSelectView currentChainId={currentChainId} onChange={changeHandler} networks={supportedChainInfoObjects} />
  );
};
