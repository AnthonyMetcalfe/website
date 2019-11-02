import { Injectable } from '@angular/core';
import { Roster } from './models/roster.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { User } from './models/user.model';
import { League } from './models/league.model';
import { TeamMatchup } from './models/team-matchup';
import { PlayerStats } from './models/player-stats.model';
import { Dictionary } from 'lodash';
import { Player } from './models/player.model';
import { HttpClient } from '@angular/common/http';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class FantasyService {
  private apiEndpoint = 'https://api.sleeper.app/v1/league/468987145315414016/';

  constructor(private apiService: ApiService, private http: HttpClient) {}

  getPlayers(): Observable<Map<string, Player>> {
    return this.apiService.get<Map<string, Player>>('assets/players.json').pipe(
      map(players =>
        Object.values(players).filter(
          player =>
            player.active &&
            ['QB', 'RB', 'WR', 'TE', 'DEF', 'K'].includes(player.position)
        )
      ),
      map(players => {
        const playersDict: Map<string, Player> = new Map<string, Player>();
        players.forEach(player => {
          playersDict[player.player_id] = player;
        });
        return playersDict;
      })
    );
  }

  getRosters(): Observable<Roster[]> {
    return this.apiService.get<Roster[]>(this.apiEndpoint + 'rosters');
  }

  getUsers(): Observable<User[]> {
    return this.apiService.get<User[]>(this.apiEndpoint + 'users');
  }

  getLeague(): Observable<League> {
    return this.apiService.get<League>(this.apiEndpoint);
  }

  getMatchups(week: number): Observable<TeamMatchup[]> {
    return this.apiService.get<TeamMatchup[]>(
      this.apiEndpoint + 'matchups/' + week
    );
  }

  getWeeklyStats(week: number): Observable<Dictionary<PlayerStats>> {
    return this.apiService.get<Dictionary<PlayerStats>>(
      'https://api.sleeper.app/v1/stats/nfl/regular/2019/' + week
    );
  }

  isMidWeek(): boolean {
    return moment().day() >= 4 || moment().day() <= 1;
  }
}
