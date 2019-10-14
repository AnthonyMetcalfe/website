import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { combineLatest, Observable, of, from } from 'rxjs';
import { map, tap, take, switchMap, concatMap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { Roster } from '../models/roster.model';
import { TeamMatchup } from '../models/team-matchup';
import { Owner } from '../models/owner.model';
import _ from 'lodash';

@Component({
  selector: 'app-standings',
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.scss']
})
export class StandingsComponent implements OnInit {
  completedWeeks: number[];
  rosters: Observable<Roster[]>;
  rostersUrl = 'https://api.sleeper.app/v1/league/468987145315414016/rosters';
  usersUrl = 'https://api.sleeper.app/v1/league/468987145315414016/users';
  matchupsUrl =
    'https://api.sleeper.app/v1/league/468987145315414016/matchups/';
  users: Observable<User[]>;
  weekOneMatchups: Observable<any>;
  userDict: Map<number, User> = new Map<number, User>();

  owners: Observable<Owner[]>;

  constructor(private http: HttpClient) {}

  // getWeekMatchup(week: number): void {
  //   if (week > this.completedWeeks) {
  //     return;
  //   }
  //   this.http
  //     .get(this.matchupsUrl + week)
  //     .pipe(
  //       take(1),
  //       map(
  //         (data: string) => JSON.parse(JSON.stringify(data)) as TeamMatchup[]
  //       ),
  //       map(teams => teams.sort((a, b) => b.points - a.points))
  //     )
  //     .subscribe(teams => {
  //       let j = 0;
  //       teams.forEach((team: TeamMatchup) => {
  //         const userName = this.userDict[team.roster_id].display_name;
  //         this.owners.find(owner => owner.user === userName).wins += 9 - j;
  //         this.owners.find(owner => owner.user === userName).losses += j;
  //         this.owners.find(owner => owner.user === userName).ties += 0;
  //         this.owners.find(
  //           owner => owner.user === userName
  //         ).name = this.userDict[team.roster_id].metadata.team_name;
  //         j += 1;
  //       });

  //       this.getWeekMatchup(week + 1);
  //     });
  // }

  ngOnInit() {
    this.users = this.http.get(this.usersUrl).pipe(
      take(1),
      map((data: string) => JSON.parse(JSON.stringify(data)) as User[])
    );

    this.rosters = this.http.get(this.rostersUrl).pipe(
      take(1),
      map((data: string) => JSON.parse(JSON.stringify(data)) as Roster[])
    );

    this.owners = combineLatest([this.users, this.rosters]).pipe(
      tap(([users, rosters]) => {
        rosters.forEach(
          roster =>
            (this.userDict[roster.roster_id] = users.find(
              user => user.user_id === roster.owner_id
            ))
        );

        this.completedWeeks = _.range(
          1,
          rosters[0].settings.wins +
            rosters[0].settings.losses +
            rosters[0].settings.ties +
            1
        );
      }),
      switchMap(([users, rosters]) => {
        const standings: Owner[] = [];

        return from(this.completedWeeks).pipe(
          concatMap(weekNumber => this.http.get(this.matchupsUrl + weekNumber)),
          map(
            (data: string) => JSON.parse(JSON.stringify(data)) as TeamMatchup[]
          ),
          map(teams => teams.sort((a, b) => b.points - a.points)),
          map((teams: TeamMatchup[]) => {
            let j = 0;
            teams.forEach((team: TeamMatchup) => {
              const userName = this.userDict[team.roster_id].display_name;
              if (standings.find(owner => owner.user === userName) != null) {
                standings.find(owner => owner.user === userName).wins += 9 - j;
                standings.find(owner => owner.user === userName).losses += j;
                standings.find(owner => owner.user === userName).ties += 0;
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
              j += 1;
            });
            return standings;
          })
        );
      }),
      map(standings => [
        ...standings.sort((a, b) =>
          a.wins > b.wins ? -1 : a.wins < b.wins ? 1 : 0
        )
      ])
    );
  }

  // this.weekOneMatchups = this.http.get(this.matchupsUrl + 1).pipe(
  //   take(1),
  //   map((data: string) => JSON.parse(JSON.stringify(data)) as TeamMatchup[]),
  //   map(teams => teams.sort((a, b) => b.points - a.points)),
  //   tap(teams => {
  //     console.log(teams);
  //     let i = 0;
  //     teams.forEach((team: TeamMatchup) => {
  //       this.owners.push({
  //         user: this.userDict[team.roster_id].display_name,
  //         wins: 9 - i,
  //         losses: i,
  //         ties: 0,
  //         name: this.userDict[team.roster_id].metadata.team_name
  //       });
  //       i += 1;
  //     });
  //   }),
  //   tap(x => console.log(this.owners))
  // );
}
