import { screen } from '@testing-library/react';

import App from './App';

describe('My Test Suite', () => {
  it('My Test Case', () => {
    expect(true).toBe(true);
  });

  test('App', () => {
    const { getByText } = screen(<App />);

    const div = getByText('Basic Example');
    expect(div).toBeInTheDocument();
  });
});
