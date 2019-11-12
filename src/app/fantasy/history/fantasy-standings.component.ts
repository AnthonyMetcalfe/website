import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { combineLatest, Observable, of, from } from "rxjs";
import { map, tap, take, switchMap, concatMap, filter } from "rxjs/operators";
import { User } from "../../models/user.model";
import { Roster } from "../../models/roster.model";
import { TeamMatchup } from "../../models/team-matchup";
import { Owner } from "../../models/owner.model";
import _, { Dictionary } from "lodash";
import { ScoringSettings } from "../../models/scoring-settings.model";
import { FantasyService } from "../../fantasy.service";
import { PlayerStats } from "../../models/player-stats.model";
import moment from "moment";
import { Player } from "../../models/player.model";
import { Select, Store } from "@ngxs/store";
import { LoadFantasyInformation } from "../../fantasy-store/fantasy.action";

@Component({
  selector: "app-fantasy-standings",
  templateUrl: "./fantasy-standings.component.html",
  styleUrls: ["./fantasy-standings.component.scss"]
})
export class FantasyStandingsComponent implements OnInit {
  completedWeeks: number[];
  @Select(state => state.fantasy.players) players: Observable<
    Map<string, Player>
  >;
  @Select(state => state.fantasy.rosters) rosters: Observable<Roster[]>;
  @Select(state => state.fantasy.users) users: Observable<User[]>;
  @Select(state => state.fantasy.isMidWeek) isMidWeek: Observable<boolean>;
  @Select(state => state.fantasy.week) week: Observable<number>;
  @Select(state => state.fantasy.userDict) userDict: Observable<
    Map<number, User>
  >;
  loading = true;
  liveScoring: Observable<Owner[]>;

  weeklyStandings: Owner[][] = [];

  owners: Observable<Owner[]>;

  constructor(private fantasyService: FantasyService, private store: Store) {}

  ngOnInit() {
    // TODO: split up Live Scoring / History / Standings.
    // TODO: store previous weeks?

    this.owners = combineLatest([this.users, this.rosters, this.week]).pipe(
      filter(([users, rosters, week]) => users != null && rosters != null),
      tap(([users, rosters, week]) => {
        rosters.forEach(
          roster =>
            (this.userDict[roster.roster_id] = users.find(
              user => user.user_id === roster.owner_id
            ))
        );

        this.completedWeeks = _.range(1, week);
      }),
      switchMap(() => {
        const standings: Owner[] = [];

        let loadingCounter = 0;

        this.loading = true;

        return from(this.completedWeeks).pipe(
          concatMap(weekNumber =>
            this.fantasyService.getPreviousMatchups(weekNumber)
          ),
          map(teams => teams.sort((a, b) => b.points - a.points)),
          map((teams: TeamMatchup[]) => {
            let j = 0;
            const groupedTeams = _.groupBy(teams, team => team.points);
            Object.keys(groupedTeams)
              .sort((a, b) => +b - +a)
              .forEach(pointAmount => {
                const teamArray = groupedTeams[pointAmount];
                // if groupedteams > 1 then need to do special tie logic
                // else do it normally
                const tieNumber = teamArray.length - 1;
                teamArray.forEach(team => {
                  const userName = this.userDict[team.roster_id].display_name;
                  const user = standings.find(owner => owner.user === userName);
                  const userIndex = user ? standings.indexOf(user) : -1;
                  if (user != null) {
                    standings[userIndex] = {
                      ...user,
                      wins: user.wins + 9 - j - tieNumber,
                      losses: user.losses + j,
                      ties: user.ties + tieNumber,
                      name: this.userDict[team.roster_id].metadata.team_name
                    };
                  } else {
                    standings.push({
                      user: this.userDict[team.roster_id].display_name,
                      wins: 9 - j - tieNumber,
                      losses: j,
                      ties: tieNumber,
                      name: this.userDict[team.roster_id].metadata.team_name
                    });
                  }
                });
                j += tieNumber + 1;
              });
            teams.map(team => team.points);

            const previousWeek = this.weeklyStandings[
              this.weeklyStandings.length - 1
            ];

            const sortedStandings = [
              ...standings
                .sort((a, b) =>
                  a.wins > b.wins ? -1 : a.wins < b.wins ? 1 : 0
                )
                .map((owner, index) => {
                  return {
                    ...owner,
                    weeklyChange:
                      previousWeek != null
                        ? previousWeek.findIndex(o => o.user === owner.user) -
                            index !==
                          0
                          ? previousWeek.findIndex(o => o.user === owner.user) -
                            index
                          : null
                        : null
                  };
                })
            ];

            this.weeklyStandings.push(
              JSON.parse(JSON.stringify(sortedStandings))
            );

            if (loadingCounter >= this.completedWeeks.length - 1) {
              this.loading = false;
            }

            loadingCounter += 1;

            return sortedStandings;
          })
        );
      })
    );
  }
}
