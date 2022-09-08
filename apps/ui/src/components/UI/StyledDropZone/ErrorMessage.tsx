import { FunctionComponent } from "react";

interface ErrorMessageProps {
  id: string;
  message: string;
}

export const ErrorMessage: FunctionComponent<ErrorMessageProps> = ({ id, message }) => {
  return (
    <p className="max-w-lg text-rose text-lg mb-2" data-testid={id}>
      {message}
    </p>
  );
};
