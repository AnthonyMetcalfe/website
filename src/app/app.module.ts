import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatTooltipModule } from "@angular/material/tooltip";
import { SatPopoverModule } from "@ncstate/sat-popover";

import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTableModule } from "@angular/material/table";
import { StandingsComponent } from "./standings/standings.component";
import { HomepageComponent } from "./homepage/homepage.component";
import { NavBarComponent } from "./nav-bar/nav-bar.component";
import { HttpClientModule } from "@angular/common/http";
import { NgxsModule } from "@ngxs/store";
import { FantasyState } from "./fantasy-store/fantasy.state";
import { FantasyComponent } from "./fantasy/fantasy.component";
import { FantasyStandingsComponent } from "./fantasy/history/fantasy-standings.component";
import { Routes, RouterModule } from "@angular/router";
import { LiveScoringComponent } from "./fantasy/live-scoring/live-scoring.component";
import { AdventComponent } from "./advent/advent.component";
import { AdventImagePageComponent } from "./advent/image-page/advent-image-page.component";
import { AdventImageExplainerDialogComponent } from "./advent/image-explainer-dialog/advent-image-explainer-dialog.component";

export const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: HomepageComponent
      },
      {
        path: "fantasy",
        component: FantasyComponent,
        children: [
          { path: "standings", component: FantasyStandingsComponent },
          { path: "live-scoring", component: LiveScoringComponent }
        ]
      },
      {
        path: "advent",
        component: AdventComponent
      },
      { path: "advent/:adventDay", component: AdventImagePageComponent }
    ]
  }
];

@NgModule({
  declarations: [
    AdventComponent,
    AdventImageExplainerDialogComponent,
    AdventImagePageComponent,
    AppComponent,
    StandingsComponent,
    HomepageComponent,
    NavBarComponent,
    FantasyComponent,
    FantasyStandingsComponent,
    LiveScoringComponent
  ],
  entryComponents: [AdventImageExplainerDialogComponent],
  imports: [
    NgxsModule.forRoot([]),
    NgxsModule.forFeature([FantasyState]),
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    HttpClientModule,
    MatButtonModule,
    MatDialogModule,
    MatTooltipModule,
    MatGridListModule,
    MatIconModule,
    MatTabsModule,
    MatTableModule,
    SatPopoverModule,
    RouterModule.forRoot(routes, { useHash: true })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
