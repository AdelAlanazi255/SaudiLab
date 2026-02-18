import React from 'react';
import TryPage from '../_TryPage';
import { cssTryData } from '../_tryData';

export default function Lesson3Try() {
  const d = cssTryData.lesson3;
  return <TryPage title={d.title} backTo={d.backTo} initialCode={d.code} />;
}
