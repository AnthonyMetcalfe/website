import { Component, OnInit } from '@angular/core';
import _ from 'lodash';
import { Store } from '@ngxs/store';
import { LoadFantasyInformation } from '../fantasy-store/fantasy.action';

@Component({
  selector: 'app-fantasy',
  templateUrl: './fantasy.component.html',
  styleUrls: ['./fantasy.component.scss']
})
export class FantasyComponent implements OnInit {
  tabs: { name: string; link: string }[];

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(new LoadFantasyInformation());

    this.tabs = [
      { name: 'Standings', link: 'standings' },
      { name: 'Live Scoring', link: 'live-scoring' }
    ];
  }
}
