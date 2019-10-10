import { RosterSettings } from './roster-settings.model';

export interface Roster {
  owner_id: string;
  players: string[];
  reserve: string[];
  settings: RosterSettings;
  starters: string[];
}
