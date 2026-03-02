import React from 'react';
import { COURSES } from '@site/src/course/courseMap';

export const CSS_FREE_MODE = COURSES.css.access.freeMode;

export default function CssGate({ children }) {
  return <>{children}</>;
}
