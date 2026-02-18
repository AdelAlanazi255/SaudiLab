import React from 'react';
import TryPage from '../_TryPage';
import { cssTryData } from '../_tryData';

export default function Lesson1Try() {
  const d = cssTryData.lesson1;
  return <TryPage title={d.title} backTo={d.backTo} initialCode={d.code} />;
}
