import React, { useEffect } from 'react';

export default function ManageSubscription() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.location.replace('/account');
    }
  }, []);

  return null;
}
