export interface ExtractedEventData {
  event_type?: string;
  guest_count?: number;
  budget?: number;
  budget_currency?: string;
  event_date?: string;
  location_preference?: string;
  theme?: string;
  dietary_requirements?: string[];
  special_requirements?: string[];
  duration?: string;
  indoor_outdoor?: 'indoor' | 'outdoor' | 'both';
}
