import { Roster } from '../models/roster.model';
import { User } from '../models/user.model';
import { Player } from '../models/player.model';
import { League } from '../models/league.model';

export interface FantasyStateModel {
  rosters: Roster[];
  users: User[];
  league: League;
  players: Map<string, Player>;
  isMidWeek: boolean;
  week: number;
}
