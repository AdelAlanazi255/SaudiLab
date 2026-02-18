import React from 'react';
import TryPage from '../_TryPage';
import { cssTryData } from '../_tryData';

export default function Lesson7Try() {
  const d = cssTryData.lesson7;
  return <TryPage title={d.title} backTo={d.backTo} initialCode={d.code} />;
}
