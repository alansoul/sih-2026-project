import { render } from '@testing-library/react';

import OrgFeatureAnalytics from './feature-analytics';

describe('OrgFeatureAnalytics', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<OrgFeatureAnalytics />);
    expect(baseElement).toBeTruthy();
  });
});
