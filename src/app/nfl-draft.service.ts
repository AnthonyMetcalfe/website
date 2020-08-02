import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApiService } from "./api.service";
import { NFLProspect } from "./models/nfl-prospect";
import { NFLTeam } from "./models/nfl-team.model";
import { UserDraftPick } from "./models/user-draft-pick.model";

@Injectable({
  providedIn: "root"
})
export class NFLDraftService {
  constructor(private apiService: ApiService) {}

  getMyPicks(): Observable<UserDraftPick[]> {
    return this.apiService.get<UserDraftPick[]>("football/my-picks");
  }

  getProspects(): Observable<NFLProspect[]> {
    return this.apiService.get<NFLProspect[]>("football/prospects");
  }

  getTeams(): Observable<NFLTeam[]> {
    return this.apiService.get<NFLTeam[]>("football/teams");
  }
}
