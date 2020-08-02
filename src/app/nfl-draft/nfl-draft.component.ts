import { Component, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { range } from "lodash";

import { NFLProspect } from "../models/nfl-prospect";
import { NFLTeam } from "../models/nfl-team.model";
import { NFLDraftService } from "../nfl-draft.service";
import { UserDraftPick } from "../models/user-draft-pick.model";
import { tap } from "rxjs/operators";

@Component({
  selector: "am-nfl-draft",
  templateUrl: "./nfl-draft.component.html",
  styleUrls: ["./nfl-draft.component.scss"]
})
export class NFLDraftComponent implements OnDestroy, OnInit {
  prospects: Observable<NFLProspect[]>;
  teams: Observable<NFLTeam[]>;
  myPicks: Observable<UserDraftPick[]>;
  teamDictionary: { [id: number]: string } = {};

  private onDestroy = new Subject();

  constructor(private nflDraftService: NFLDraftService) {}

  ngOnDestroy() {
    this.onDestroy.next();
  }

  ngOnInit() {
    this.prospects = this.nflDraftService.getProspects();
    this.teams = this.nflDraftService.getTeams().pipe(
      tap(teams =>
        teams.forEach(team => {
          this.teamDictionary[team.id] = team.name;
        })
      )
    );
    this.myPicks = this.nflDraftService.getMyPicks();

    this.myPicks.subscribe();
    this.teams.subscribe();
    this.prospects.subscribe();
  }
}
