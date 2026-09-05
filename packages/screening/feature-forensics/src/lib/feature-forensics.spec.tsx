import { render } from '@testing-library/react';

import OrgFeatureForensics from './feature-forensics';

describe('OrgFeatureForensics', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<OrgFeatureForensics />);
    expect(baseElement).toBeTruthy();
  });
});
