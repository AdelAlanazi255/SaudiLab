import React from 'react';
import OriginalLayout from '@theme-original/Layout';
import RequireAdminRoute from '@site/src/components/RequireAdminRoute';
import RequireTryAuthRoute from '@site/src/components/RequireTryAuthRoute';

export default function Layout(props) {
  return (
    <OriginalLayout {...props}>
      <RequireAdminRoute>
        <RequireTryAuthRoute>{props.children}</RequireTryAuthRoute>
      </RequireAdminRoute>
    </OriginalLayout>
  );
}
