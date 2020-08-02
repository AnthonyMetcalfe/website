import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule } from "@angular/material/dialog";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule, Routes } from "@angular/router";
import { NgxsModule } from "@ngxs/store";
import { NgxWebstorageModule } from "ngx-webstorage";

import { AdventComponent } from "./advent/advent.component";
import { AdventImageExplainerDialogComponent } from "./advent/image-explainer-dialog/advent-image-explainer-dialog.component";
import { AdventImagePageComponent } from "./advent/image-page/advent-image-page.component";
import { AppComponent } from "./app.component";
import { AuthGuardService } from "./auth/auth-guard.service";
import { AuthInterceptor } from "./auth/auth.interceptor";
import { AuthService } from "./auth/auth.service";
import { FantasyState } from "./fantasy-store/fantasy.state";
import { FantasyComponent } from "./fantasy/fantasy.component";
import { FantasyStandingsComponent } from "./fantasy/history/fantasy-standings.component";
import { LiveScoringComponent } from "./fantasy/live-scoring/live-scoring.component";
import { OliviaComponent } from "./gifts/olivia.component";
import { HomepageComponent } from "./homepage/homepage.component";
import { LoginComponent } from "./login/login.component";
import { BoardComponent } from "./mastermind/board/board.component";
import { MastermindComponent } from "./mastermind/mastermind.component";
import { TutorialComponent } from "./mastermind/tutorial/tutorial.component";
import { FantasyNavBarComponent } from "./nav-bar/fantasy/fantasy.component";
import { MastermindNavBarComponent } from "./nav-bar/mastermind/mastermind.component";
import { NavBarComponent } from "./nav-bar/nav-bar.component";
import { NFLDraftNavBarComponent } from "./nav-bar/nfl-draft/nfl-draft.component";
import { UserNavBarComponent } from "./nav-bar/user/user.component";
import { NFLDraftComponent } from "./nfl-draft/nfl-draft.component";
import { StandingsComponent } from "./standings/standings.component";
import { UserState } from "./user/user.state";
import { ExercisesComponent } from "./exercises/exercises.component";

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
      {
        path: "exercises",
        component: ExercisesComponent
      },
      {
        path: "mastermind",
        component: MastermindComponent,
        canActivate: [AuthGuardService]
      },
      {
        path: "nfl-draft",
        component: NFLDraftComponent,
        canActivate: [AuthGuardService]
      },
      { path: "advent/:adventDay", component: AdventImagePageComponent },
      { path: "merry-christmas-olivia", component: OliviaComponent }
    ]
  }
];

@NgModule({
  declarations: [
    AdventComponent,
    AdventImageExplainerDialogComponent,
    AdventImagePageComponent,
    AppComponent,
    BoardComponent,
    ExercisesComponent,
    FantasyComponent,
    FantasyNavBarComponent,
    FantasyStandingsComponent,
    HomepageComponent,
    LiveScoringComponent,
    LoginComponent,
    MastermindComponent,
    MastermindNavBarComponent,
    NavBarComponent,
    NFLDraftComponent,
    NFLDraftNavBarComponent,
    OliviaComponent,
    StandingsComponent,
    TutorialComponent,
    UserNavBarComponent
  ],
  entryComponents: [
    AdventImageExplainerDialogComponent,
    LoginComponent,
    TutorialComponent
  ],
  imports: [
    NgxsModule.forRoot([]),
    NgxsModule.forFeature([FantasyState]),
    NgxsModule.forFeature([UserState]),
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatListModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatSidenavModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTabsModule,
    MatTableModule,
    MatToolbarModule,
    RouterModule.forRoot(routes),
    NgxWebstorageModule.forRoot({
      prefix: "am",
      separator: "|",
      caseSensitive: false
    })
  ],
  providers: [
    AuthService,
    AuthGuardService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  exports: [FormsModule, ReactiveFormsModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
