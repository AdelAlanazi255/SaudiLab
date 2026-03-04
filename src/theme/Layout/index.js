import React from 'react';
import OriginalLayout from '@theme-original/Layout';
import RequireAdminRoute from '@site/src/components/RequireAdminRoute';

export default function Layout(props) {
  return (
    <OriginalLayout {...props}>
      <RequireAdminRoute>{props.children}</RequireAdminRoute>
    </OriginalLayout>
  );
}
