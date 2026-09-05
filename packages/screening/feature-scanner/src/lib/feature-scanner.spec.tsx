import { render } from '@testing-library/react';

import OrgFeatureScanner from './feature-scanner';

describe('OrgFeatureScanner', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<OrgFeatureScanner />);
    expect(baseElement).toBeTruthy();
  });
});
