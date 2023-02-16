import { render as TLRender } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

export const render = (element: React.ReactNode) => {
  return TLRender(<Router>{element}</Router>);
};
