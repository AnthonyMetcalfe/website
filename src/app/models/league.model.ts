import { ScoringSettings } from './scoring-settings.model';

export interface League {
  total_rosters: number;
  status: string;
  sport: string;
  settings: any;
  season_type: string;
  season: string;
  scoring_settings: ScoringSettings;
  previous_league_id: string;
  league_id: string;
  draft_id: string;
}
