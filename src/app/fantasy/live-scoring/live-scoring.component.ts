import { Component, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { Observable, combineLatest } from 'rxjs';
import { Owner } from 'src/app/models/owner.model';
import { Select } from '@ngxs/store';
import { filter, switchMap, map } from 'rxjs/operators';
import { ScoringSettings } from 'src/app/models/scoring-settings.model';
import _ from 'lodash';
import { FantasyService } from 'src/app/fantasy.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-live-scoring',
  templateUrl: './live-scoring.component.html',
  styleUrls: ['./live-scoring.component.scss']
})
export class LiveScoringComponent implements OnInit {
  columns: string[];
  liveScoring: Observable<Owner[]>;
  isMobile = false;
  @Select(state => state.fantasy.isMidWeek) isMidWeek: Observable<boolean>;
  @Select(state => state.fantasy.week) week: Observable<number>;
  @Select(state => state.fantasy.userDict) userDict: Observable<
    Map<number, User>
  >;

  constructor(
    private fantasyService: FantasyService,
    private mediaObserver: MediaObserver
  ) {}

  ngOnInit() {
    this.mediaObserver
      .asObservable()
      .pipe(
        filter(values => values != null && values.length > 0),
        map(values => values[0])
      )
      .subscribe(value => {
        this.columns =
          value.mqAlias === 'xs' || value.mqAlias === 'sm'
            ? ['user', 'team', 'weeklyPoints', 'weeklyPlayersRemaining']
            : ['team', 'weeklyPoints', 'weeklyPlayersRemaining'];
      });

    this.liveScoring = this.isMidWeek.pipe(
      filter(isMidweek => isMidweek),
      switchMap(() => this.week),
      switchMap(weekNumber =>
        combineLatest([
          this.fantasyService.getWeeklyStats(weekNumber),
          this.fantasyService.getMatchups(weekNumber),
          this.fantasyService.getLeague(),
          this.userDict
        ])
      ),
      map(([stats, matchups, league, userDict]) => {
        const scoringSettings: ScoringSettings = league.scoring_settings;
        const scoring: Owner[] = [];
        matchups.forEach(m => {
          const o: Owner = {
            user: userDict[m.roster_id].display_name,
            name: userDict[m.roster_id].metadata.team_name,
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
  }
}
