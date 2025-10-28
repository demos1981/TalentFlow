import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Briefcase, 
  Star, 
  Eye,
  MessageSquare,
  Heart,
  Share2,
  Download,
  Award,
  Clock,
  X
} from 'lucide-react';
import { useLanguageStore } from '../stores/languageStore';

const CandidatesPage: React.FC = () => {
  console.log('🎯 CandidatesPage: Component rendering...');
  console.log('🔍 CandidatesPage: Render timestamp:', Date.now());
  console.log('🔍 CandidatesPage: Stack trace:', new Error().stack);
  
  const { t } = useLanguageStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');

  // Location search states
  const [locationInput, setLocationInput] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Поки що порожній масив - дані будуть завантажуватися з бекенду
  const candidates: any[] = [];

  const experienceLevels = [
    t('junior'),
    t('middle'), 
    t('senior'),
    t('lead'),
    t('architect')
  ];

  // Function to search locations using Geoapify API
  const searchLocations = async (query: string) => {
    console.log('🔍 CandidatesPage: searchLocations called with:', query);
    console.log('🔍 CandidatesPage: searchLocations timestamp:', Date.now());
    if (query.length < 2) {
      setLocationSuggestions([]);
      return;
    }

    try {
      // Using Geoapify Autocomplete API
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY || '133124c54ccb4da299757320b12813f7'}&limit=5`
      );
      
      if (response.ok) {
        const data = await response.json();
        const suggestions = data.features?.map((feature: any) => {
          const city = feature.properties.city || feature.properties.name;
          const country = feature.properties.country;
          return `${city}, ${country}`;
        }).filter((suggestion: string) => suggestion.includes(','));
        
        setLocationSuggestions(suggestions);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
      // Fallback to a simple local search
      const commonLocations = [
        'New York, USA', 'London, UK', 'Berlin, Germany', 'Paris, France',
        'Tokyo, Japan', 'Sydney, Australia', 'Toronto, Canada', 'Amsterdam, Netherlands',
        'Kyiv, Ukraine', 'Lviv, Ukraine', 'Odessa, Ukraine', 'Kharkiv, Ukraine',
        'Warsaw, Poland', 'Prague, Czech Republic', 'Vienna, Austria', 'Stockholm, Sweden',
        'San Francisco, USA', 'Los Angeles, USA', 'Chicago, USA', 'Miami, USA',
        'Madrid, Spain', 'Barcelona, Spain', 'Rome, Italy', 'Milan, Italy',
        'Zurich, Switzerland', 'Brussels, Belgium', 'Copenhagen, Denmark', 'Oslo, Norway'
      ];
      
      const filtered = commonLocations.filter(location =>
        location.toLowerCase().includes(query.toLowerCase())
      );
      setLocationSuggestions(filtered.slice(0, 5));
    }
  };

  // Handle location input change with debounce
  const handleLocationInputChange = (value: string) => {
    console.log('🔍 CandidatesPage: handleLocationInputChange called with:', value);
    console.log('🔍 CandidatesPage: handleLocationInputChange timestamp:', Date.now());
    console.log('🔍 CandidatesPage: handleLocationInputChange stack:', new Error().stack);
    setLocationInput(value);
    setSelectedLocation(value);
    setShowLocationSuggestions(true);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      searchLocations(value);
    }, 300); // 300ms delay
  };

  // Handle location selection
  const handleLocationSelect = (location: string) => {
    setLocationInput(location);
    setSelectedLocation(location);
    setShowLocationSuggestions(false);
  };

  // Clear location
  const clearLocation = () => {
    setLocationInput('');
    setSelectedLocation('');
    setLocationSuggestions([]);
    setShowLocationSuggestions(false);
  };

  // Handle click outside to close suggestions
  useEffect(() => {
    console.log('🔍 CandidatesPage: useEffect triggered for click outside handler');
    console.log('🔍 CandidatesPage: useEffect timestamp:', Date.now());
    
    const handleClickOutside = (event: MouseEvent) => {
      if (locationInputRef.current && !locationInputRef.current.contains(event.target as Node)) {
        setShowLocationSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      // Cleanup timeout on unmount
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const getAvailabilityClass = (availability: string) => {
    if (availability === 'Готовий до роботи') return 'available';
    if (availability.includes('тижні')) return 'weeks';
    if (availability.includes('місяць')) return 'month';
    return 'unavailable';
  };

  return (
    <div className="dashboard-content">
      {/* Candidates Header */}
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <h1 className="dashboard-title">{t('candidates')}</h1>
          <p className="dashboard-greeting-subtitle">
            {t('findBestSpecialists')}
          </p>
          <div className="dashboard-actions">
            <button className="btn btn-primary">
              <Search className="icon" />
              {t('findCandidates')}
            </button>
            <button className="btn btn-secondary">
              <Filter className="icon" />
              {t('filters')}
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="dashboard-section-card">
        <div className="dashboard-section-content">
          <div className="search-filters">
            <div className="search-input-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder={t('searchCandidatesPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filters-row">
              <div className="location-search-container" ref={locationInputRef}>
                <div className="location-input-wrapper">
                  <MapPin className="location-icon" />
                  <input
                    type="text"
                    value={locationInput}
                    onChange={(e) => handleLocationInputChange(e.target.value)}
                    placeholder={t('allLocations')}
                    className="location-input"
                  />
                  {locationInput && (
                    <button
                      type="button"
                      onClick={clearLocation}
                      className="clear-location-btn"
                    >
                      <X className="clear-icon" />
                    </button>
                  )}
                </div>
                
                {showLocationSuggestions && locationSuggestions.length > 0 && (
                  <div className="location-suggestions">
                    {locationSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="location-suggestion"
                        onClick={() => handleLocationSelect(suggestion)}
                      >
                        <MapPin className="suggestion-icon" />
                        <span>{suggestion}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <select
                value={selectedExperience}
                onChange={(e) => setSelectedExperience(e.target.value)}
                className="filter-select"
              >
                <option value="">{t('allLevels')}</option>
                {experienceLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Candidates Grid */}
      <div className="dashboard-sections-grid">
        <div className="dashboard-section-card">
          <h2 className="dashboard-section-title">{t('foundCandidates')} ({candidates.length})</h2>
          <div className="candidates-list">
            {candidates.map(candidate => (
              <div key={candidate.id} className="candidate-card">
                <div className="candidate-header">
                  <div className="candidate-avatar">
                    <span className="candidate-avatar-text">
                      {candidate.name.split(' ').map((n: string) => n[0]).join('')}
                    </span>
                  </div>
                  <div className="candidate-info">
                    <h3 className="candidate-name">{candidate.name}</h3>
                    <div className="candidate-title">{candidate.title}</div>
                  </div>
                  <div className="candidate-actions">
                    <button className="candidate-action-btn">
                      <Heart className="icon" />
                    </button>
                    <button className="candidate-action-btn">
                      <Share2 className="icon" />
                    </button>
                  </div>
                </div>
                
                <div className="candidate-details">
                  <div className="candidate-detail-item">
                    <MapPin className="icon" />
                    <span>{candidate.location}</span>
                  </div>
                  <div className="candidate-detail-item">
                    <Briefcase className="icon" />
                    <span>{candidate.experience}</span>
                  </div>
                  <div className="candidate-detail-item">
                    <Award className="icon" />
                    <span>{candidate.salary}</span>
                  </div>
                  <div className="candidate-detail-item">
                    <Clock className="icon" />
                    <span>{candidate.lastActive}</span>
                  </div>
                </div>
                
                <p className="candidate-description">{candidate.description}</p>
                
                <div className="candidate-skills">
                  {candidate.skills.map((skill: string) => (
                    <span key={skill} className="candidate-skill">{skill}</span>
                  ))}
                </div>
                
                <div className="candidate-footer">
                  <div className="candidate-stats">
                    <span className="candidate-stat">
                      <Eye className="icon" />
                      {candidate.views} {t('views')}
                    </span>
                    <span className="candidate-stat">
                      <Star className="icon" />
                      {candidate.matches} {t('matches')}
                    </span>
                  </div>
                  
                  <div className="candidate-actions-main">
                    <button className="btn btn-primary btn-sm">
                      <MessageSquare className="icon" />
                      {t('write')}
                    </button>
                    <button className="btn btn-outline btn-sm">
                      <Download className="icon" />
                      CV
                    </button>
                  </div>
                </div>
                
                {candidate.isPremium && (
                  <div className="premium-badge">Premium</div>
                )}
                
                <div className={`availability-badge ${getAvailabilityClass(candidate.availability)}`}>
                  {candidate.availability}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidatesPage;
