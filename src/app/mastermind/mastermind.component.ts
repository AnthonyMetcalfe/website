import { Component, HostListener, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Select, Store } from "@ngxs/store";
import { range } from "lodash";
import { combineLatest, Observable, Subject, BehaviorSubject } from "rxjs";
import {
  map,
  shareReplay,
  take,
  takeUntil,
  tap,
  switchMap,
  withLatestFrom
} from "rxjs/operators";

import { ApiService } from "../api.service";
import { MastermindService } from "../mastermind.service";
import { Board } from "../models/board.model";
import { User } from "../models/user.model";
import { UserService } from "../user.service";
import { MatDialog } from "@angular/material/dialog";
import { TutorialComponent } from "./tutorial/tutorial.component";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "am-mastermind",
  templateUrl: "./mastermind.component.html",
  styleUrls: ["./mastermind.component.scss"]
})
export class MastermindComponent implements OnDestroy, OnInit {
  allowDuplicates = false;
  availableBoards: Observable<Board[]>;
  board: Board;
  boardArray: number[] = [];
  boardOptions: number[];
  creating = false;
  currentGuessBoard: number[] = [];
  form: FormGroup;
  guessingBoard: number[] = [-1, -1, -1, -1];
  myBoards: Observable<Board[]>;
  oldGuesses: OldGuess[] = [];
  previousGuesses: number[][] = [];
  previousResults: number[][] = [];
  setting = false;
  solved = false;
  usernames: Observable<string[]>;

  @Select(state => state.user.user) user: Observable<User>;

  private onDestroy = new Subject();
  private refreshBoards = new BehaviorSubject(false);

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private mastermindService: MastermindService,
    private snackBar: MatSnackBar,
    private store: Store,
    private userService: UserService
  ) {
    this.form = this.formBuilder.group({
      solver: "",
      difficultyLevel: 0
    });
  }

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.boardOptions = range(
      0,
      Math.floor((event.target.innerHeight - 320) / 53) - 1
    );
  }

  addGuess(guess: number) {
    if (
      this.currentGuessBoard.length < 4 &&
      (!this.currentGuessBoard.includes(guess) ||
        this.board.difficultyLevel > 0)
    ) {
      this.currentGuessBoard.push(guess);
    }
  }

  addToBoard(guess: number) {
    if (
      this.currentGuessBoard.length < 4 &&
      (!this.currentGuessBoard.includes(guess) ||
        this.form.get("difficultyLevel").value > 0)
    ) {
      this.currentGuessBoard.push(guess);
    }
  }

  createBoard() {
    this.resetSetup();
    this.creating = true;
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }

  ngOnInit() {
    this.usernames = combineLatest([
      this.store.select(state => state.user.usernames),
      this.user
    ]).pipe(
      map(([usernames, user]) =>
        usernames.filter(username => username !== user.username)
      )
    );

    this.boardOptions = range(
      0,
      Math.floor((window.innerHeight - 320) / 53) - 1
    );

    this.form
      .get("difficultyLevel")
      .valueChanges.pipe(takeUntil(this.onDestroy))
      .subscribe(difficultyLevel => {
        if (!difficultyLevel) {
          this.currentGuessBoard = [...new Set(this.currentGuessBoard)];
        }
      });

    const allBoards: Observable<Board[]> = this.refreshBoards
      .pipe(
        switchMap(() => this.mastermindService.getBoards()),
        withLatestFrom(this.user),
        map(([boards, user]) =>
          boards.filter(board => board.creator !== user.username)
        ),
        takeUntil(this.onDestroy)
      )
      .pipe(shareReplay());

    this.myBoards = combineLatest([allBoards, this.user]).pipe(
      map(([boards, user]) =>
        boards.filter(board => board.solver === user.username)
      )
    );

    this.availableBoards = allBoards.pipe(
      map(boards => boards.filter(board => !board.solver))
    );
  }

  makeBoard() {
    if (this.currentGuessBoard.length === 4) {
      this.mastermindService
        .createBoard({
          ...this.form.value,
          firstSpot: this.currentGuessBoard[0],
          secondSpot: this.currentGuessBoard[1],
          thirdSpot: this.currentGuessBoard[2],
          fourthSpot: this.currentGuessBoard[3]
        })
        .subscribe(success => {
          if (success) {
            this.snackBar.open("Board created!", "Close", { duration: 2000 });
            this.resetSetup();
          }
        });
    }
  }

  makeGuess() {
    if (this.currentGuessBoard.length === 4) {
      const g = this.currentGuessBoard;
      const results = g
        .map((value, index) =>
          this.boardArray[index] === value
            ? 2
            : this.boardArray.includes(value)
            ? 1
            : 0
        )
        .filter(r => r > 0)
        .sort((a, b) => b - a);

      this.currentGuessBoard = [];
      this.previousGuesses.push(g);
      this.previousResults.push(results);

      if (results.filter(r => r === 2).length === 4) {
        this.solved = true;
        this.mastermindService
          .completeBoard(this.board.id, this.previousGuesses.length)
          .pipe(take(1))
          .subscribe(() => this.refreshBoards.next(true));
      } else {
        this.mastermindService
          .updateBoard(this.board.id, this.previousGuesses.length)
          .pipe(take(1))
          .subscribe(board => {
            this.board = board;
            this.refreshBoards.next(true);
          });
      }
    }
  }

  playBoard(board: Board) {
    this.resetSetup();
    this.board = board;
    for (let i = 0; i < board.roundsNeeded; i++) {
      this.previousGuesses.push([-1, -1, -1, -1]);
      this.previousResults.push([]);
    }
    this.boardArray = [
      board.firstSpot,
      board.secondSpot,
      board.thirdSpot,
      board.fourthSpot
    ];
  }

  removeGuess(guessIndex: number) {
    this.currentGuessBoard.splice(guessIndex, 1);
  }

  resetSetup() {
    this.form.patchValue({ solver: "", difficultyLevel: 0 });
    this.creating = false;
    this.board = null;
    this.solved = false;
    this.boardArray = [];
    this.previousGuesses = [];
    this.previousResults = [];
    this.currentGuessBoard = [];
  }

  setBoard() {
    this.oldGuesses = [];
    this.setting = true;
    this.solved = false;
  }

  showTutorial() {
    this.dialog.open(TutorialComponent);
  }
}

interface OldGuess {
  guesses: number[];
  results: number[];
}
