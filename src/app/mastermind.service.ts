import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApiService } from "./api.service";
import { UserLoginForm } from "./models/user-login-form";
import { User } from "./models/user.model";
import { Board } from "./models/board.model";
import { BoardForm } from "./models/board-form.model";

@Injectable({
  providedIn: "root"
})
export class MastermindService {
  constructor(private apiService: ApiService) {}

  completeBoard(boardId: number, roundsNeeded: number) {
    return this.apiService.put<any, Board>(
      "mastermind/boards/" + boardId + "/complete",
      { roundsNeeded }
    );
  }

  createBoard(form: BoardForm): Observable<boolean> {
    return this.apiService.post<BoardForm, any>("mastermind/board", form);
  }

  getBoards(): Observable<Board[]> {
    return this.apiService.get<any>("mastermind/boards");
  }

  updateBoard(boardId: number, roundsNeeded: number) {
    return this.apiService.put<any, Board>(
      "mastermind/boards/" + boardId + "/update",
      { roundsNeeded }
    );
  }
}
