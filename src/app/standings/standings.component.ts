import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { combineLatest, Observable, of, from } from 'rxjs';
import { map, tap, take, switchMap, concatMap, filter } from 'rxjs/operators';
import { User } from '../models/user.model';
import { Roster } from '../models/roster.model';
import { TeamMatchup } from '../models/team-matchup';
import { Owner } from '../models/owner.model';
import _, { Dictionary } from 'lodash';
import { ScoringSettings } from '../models/scoring-settings.model';
import { FantasyService } from '../fantasy.service';
import { PlayerStats } from '../models/player-stats.model';
import moment from 'moment';
import { Player } from '../models/player.model';
import { Select, Store } from '@ngxs/store';
import { LoadFantasyInformation } from '../fantasy-store/fantasy.action';

@Component({
  selector: 'app-standings',
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.scss']
})
export class StandingsComponent implements OnInit {
  completedWeeks: number[];
  @Select(state => state.fantasy.players) players: Observable<
    Map<string, Player>
  >;
  @Select(state => state.fantasy.rosters) rosters: Observable<Roster[]>;
  @Select(state => state.fantasy.users) users: Observable<User[]>;
  @Select(state => state.fantasy.isMidWeek) isMidWeek: Observable<boolean>;
  @Select(state => state.fantasy.week) week: Observable<number>;
  userDict: Map<number, User> = new Map<number, User>();
  loading = true;
  liveScoring: Observable<Owner[]>;

  weeklyStandings: Owner[][] = [];

  owners: Observable<Owner[]>;

  constructor(private fantasyService: FantasyService, private store: Store) {}

  ngOnInit() {
    // TODO: Move the call to LoadFantasyInformation into an overarching component, split up Live Scoring / History / Standings.

    this.store.dispatch(new LoadFantasyInformation());

    this.liveScoring = this.isMidWeek.pipe(
      filter(isMidweek => isMidweek),
      switchMap(() => this.week),
      switchMap(weekNumber =>
        combineLatest([
          this.fantasyService.getWeeklyStats(weekNumber),
          this.fantasyService.getMatchups(weekNumber),
          this.fantasyService.getLeague()
        ])
      ),
      map(([stats, matchups, league]) => {
        const scoringSettings: ScoringSettings = league.scoring_settings;
        const scoring: Owner[] = [];
        matchups.forEach(m => {
          const o: Owner = {
            user: this.userDict[m.roster_id].display_name,
            name: this.userDict[m.roster_id].metadata.team_name,
            weeklyPoints: 0,
            weeklyPlayersRemaining: 0
          };
          m.starters.forEach(starter => {
            if (stats[starter]) {
              const scoringKeys = _.intersection(
                Object.keys(scoringSettings),
                Object.keys(stats[starter])
              );
              scoringKeys.forEach(
                key =>
                  (o.weeklyPoints += stats[starter][key] * scoringSettings[key])
              );
            } else {
              o.weeklyPlayersRemaining++;
            }
          });

          scoring.push(o);
        });
        return scoring.sort((a, b) => b.weeklyPoints - a.weeklyPoints);
      })
    );

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
          concatMap(weekNumber => this.fantasyService.getMatchups(weekNumber)),
          map(teams => teams.sort((a, b) => b.points - a.points)),
          map((teams: TeamMatchup[]) => {
            let j = 0;
            const groupedTeams = _.groupBy(teams, team => team.points);
            Object.keys(groupedTeams)
              .sort((a, b) => +b - +a)
              .forEach(pointAmount => {
                groupedTeams[pointAmount].forEach(team => {
                  const userName = this.userDict[team.roster_id].display_name;
                  // If there is a tie.
                  if (groupedTeams[pointAmount].length > 0) {
                    const tieNumber = groupedTeams[pointAmount].length - 1;
                    if (
                      standings.find(owner => owner.user === userName) != null
                    ) {
                      standings.find(owner => owner.user === userName).wins +=
                        9 - j - tieNumber;
                      standings.find(owner => owner.user === userName).losses +=
                        j - tieNumber;
                      standings.find(
                        owner => owner.user === userName
                      ).ties += tieNumber;
                      standings.find(
                        owner => owner.user === userName
                      ).name = this.userDict[team.roster_id].metadata.team_name;
                    } else {
                      standings.push({
                        user: this.userDict[team.roster_id].display_name,
                        wins: 9 - j - tieNumber,
                        losses: j - tieNumber,
                        ties: tieNumber,
                        name: this.userDict[team.roster_id].metadata.team_name
                      });
                    }
                  } else {
                    if (
                      standings.find(owner => owner.user === userName) != null
                    ) {
                      standings.find(owner => owner.user === userName).wins +=
                        9 - j;
                      standings.find(
                        owner => owner.user === userName
                      ).losses += j;
                      standings.find(
                        owner => owner.user === userName
                      ).ties += 0;
                      standings.find(
                        owner => owner.user === userName
                      ).name = this.userDict[team.roster_id].metadata.team_name;
                    } else {
                      standings.push({
                        user: this.userDict[team.roster_id].display_name,
                        wins: 9 - j,
                        losses: j,
                        ties: 0,
                        name: this.userDict[team.roster_id].metadata.team_name
                      });
                    }
                  }
                  j += 1;
                });
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
