enum DropzoneBoxUiState {
  DRAG_REJECT = "border-red-400 bg-red-100",
  DRAG_ACTIVE = "border-emerald-400 bg-emerald-50",
  DRAG_ACCEPT = "border-emerald-400 bg-emerald-50",
  VERIFICATION_PENDING = "border-cloud-100 bg-white",
  VERIFICATION_ERROR = "border-red-400 bg-red-100",
  ACTION_ERROR = "border-red-400 bg-red-100",
  DEFAULT = "border-cloud-100 bg-white",
}

interface GetDropzoneBoxUi {
  isDragReject: boolean;
  isDragActive: boolean;
  isDragAccept: boolean;
  isVerificationPending: boolean;
  isVerificationError: boolean | null;
  isActionError?: boolean | null;
}

export const getDropzoneBoxUi = ({
  isDragReject,
  isDragActive,
  isDragAccept,
  isVerificationPending,
  isVerificationError,
  isActionError,
}: GetDropzoneBoxUi): string => {
  switch (true) {
    case isDragReject:
      return DropzoneBoxUiState.DRAG_REJECT;
    case isDragActive:
      return DropzoneBoxUiState.DRAG_ACTIVE;
    case isDragAccept:
      return DropzoneBoxUiState.DRAG_ACCEPT;
    case isVerificationPending:
      return DropzoneBoxUiState.VERIFICATION_PENDING;
    case isVerificationError:
      return DropzoneBoxUiState.VERIFICATION_ERROR;
    case isActionError:
      return DropzoneBoxUiState.ACTION_ERROR;
    default:
      return DropzoneBoxUiState.DEFAULT;
  }
};
