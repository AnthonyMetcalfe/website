import { RosterSettings } from './roster-settings.model';

export interface Roster {
  owner_id: string;
  players: string[];
  reserve: string[];
  roster_id: number;
  settings: RosterSettings;
  starters: string[];
}
