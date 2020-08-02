import { NFLTeam } from "./nfl-team.model";
import { NFLProspect } from "./nfl-prospect";

export interface UserDraftPick {
  pickNumber: number;
  team: NFLTeam;
  prospect: NFLProspect;
}
