import React from 'react';

export enum FeatureId {
  SEARCH = 'search',
  INTERPELLATION = 'interpellation',
  SPEECH_CORRECTION = 'speech_correction',
  SPEECH_GENERATOR = 'speech_generator',
  TOPIC_BREAKDOWN = 'topic_breakdown',
  POSITION_PAPER = 'position_paper',
}

export interface NavItem {
  id: FeatureId;
  label: string;
  icon: React.ReactNode;
  description: string;
}

export interface SearchResult {
  text: string;
  sources?: {
    uri: string;
    title: string;
  }[];
}

export interface PositionPaperData {
  topic: string;
  committee: string;
  delegation: string;
  delegateName: string;
  content: string;
}