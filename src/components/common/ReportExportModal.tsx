import React from 'react';
import { GranularExportModal } from './GranularExportModal';
import { AnalysisResult } from '../../types/analysis';
import { IdeaForgeGeneratedConcept } from '../../types/creator';

export interface ReportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: AnalysisResult;
  concept?: IdeaForgeGeneratedConcept;
  reportType?: 'executive' | 'creator';
  targetElementSelector?: string;
}

export const ReportExportModal: React.FC<ReportExportModalProps> = (props) => {
  return <GranularExportModal {...props} />;
};

export default ReportExportModal;
