import { FunctionComponent, Children, ReactNode } from 'react';
import { MemoryRouter, Routes } from 'react-router-dom';

interface RouterWrapperProps {
  children: ReactNode;
}
export const RouterWrapper: FunctionComponent<RouterWrapperProps> = ({
  children,
}) => {
  return (
    <MemoryRouter>
      <Routes>{Children.map(children, (child) => child)}</Routes>
    </MemoryRouter>
  );
};
