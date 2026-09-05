import { render } from '@testing-library/react';

import OrgFeatureAuditTrail from './feature-audit-trail';

describe('OrgFeatureAuditTrail', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<OrgFeatureAuditTrail />);
    expect(baseElement).toBeTruthy();
  });
});
