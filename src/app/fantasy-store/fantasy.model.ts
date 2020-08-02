import { Roster } from "../models/roster.model";
import { OldUser } from "../models/old-user.model";
import { Player } from "../models/player.model";
import { League } from "../models/league.model";

export interface FantasyStateModel {
  rosters: Roster[];
  users: OldUser[];
  league: League;
  players: Map<string, Player>;
  isMidWeek: boolean;
  week: number;
  userDict: Map<number, OldUser>;
}
