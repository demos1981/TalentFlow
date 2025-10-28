import React, { useState } from 'react';
import { CandidateProfile } from '../../services/candidateService';
import CandidateCard from './CandidateCard';
import { ChevronLeft, ChevronRight, Users, Star, MapPin, Briefcase } from 'lucide-react';
import './CandidateList.css';

interface CandidateListProps {
  candidates: CandidateProfile[];
  onPageChange: (page: number) => void;
  currentPage: number;
  totalPages: number;
  total: number;
}

const CandidateList: React.FC<CandidateListProps> = ({
  candidates,
  onPageChange,
  currentPage,
  totalPages,
  total
}) => {
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);

  const handleCandidateClick = (candidateId: string) => {
    setSelectedCandidate(selectedCandidate === candidateId ? null : candidateId);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      setSelectedCandidate(null); // Закриваємо детальний перегляд при зміні сторінки
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Кнопка "Перша сторінка"
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="pagination-btn"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="dots1" className="pagination-dots">...</span>);
      }
    }

    // Номери сторінок
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`pagination-btn ${i === currentPage ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }

    // Кнопка "Остання сторінка"
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="dots2" className="pagination-dots">...</span>);
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="pagination-btn"
        >
          {totalPages}
        </button>
      );
    }

    return (
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-btn pagination-arrow"
        >
          <ChevronLeft size={16} />
        </button>
        
        {pages}
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-btn pagination-arrow"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    );
  };

  const renderResultsSummary = () => (
    <div className="results-summary">
      <div className="results-info">
        <Users className="results-icon" />
        <span>
          Показано <strong>{candidates.length}</strong> з <strong>{total}</strong> кандидатів
        </span>
      </div>
      
      <div className="results-stats">
        <div className="stat-item">
          <Star className="stat-icon" />
          <span>Середній рейтинг: <strong>
            {candidates.length > 0 
              ? (candidates.reduce((sum, c) => sum + (c.rating || 0), 0) / candidates.length).toFixed(1)
              : '0.0'
            }
          </strong></span>
        </div>
        
        <div className="stat-item">
          <MapPin className="stat-icon" />
          <span>Локації: <strong>
            {new Set(candidates.map(c => c.user?.city || c.user?.location).filter(Boolean)).size}
          </strong></span>
        </div>
        
        <div className="stat-item">
          <Briefcase className="stat-icon" />
          <span>Досвід: <strong>
            {candidates.length > 0 
              ? (candidates.reduce((sum, c) => sum + (c.yearsOfExperience || 0), 0) / candidates.length).toFixed(1)
              : '0'
            } років
          </strong></span>
        </div>
      </div>
    </div>
  );

  if (candidates.length === 0) {
    return (
      <div className="no-results">
        <Users className="no-results-icon" />
        <h3>Кандидатів не знайдено</h3>
        <p>Спробуйте змінити параметри пошуку або фільтри</p>
      </div>
    );
  }

  return (
    <div className="candidate-list">
      {renderResultsSummary()}
      
      <div className="candidates-grid">
        {candidates.map((candidate) => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            isExpanded={selectedCandidate === candidate.id}
            onClick={() => handleCandidateClick(candidate.id)}
          />
        ))}
      </div>
      
      {renderPagination()}
    </div>
  );
};

export default CandidateList;




