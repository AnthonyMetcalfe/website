import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApiService } from "./api.service";
import { Exercise } from "./models/exercise.model";
import { UserExercise } from "./models/user-exercise.model";

@Injectable({
  providedIn: "root"
})
export class ExerciseService {
  constructor(private apiService: ApiService) {}

  getExercises(): Observable<Exercise[]> {
    return this.apiService.get<Exercise[]>("health/exercises");
  }

  getUserExercises(): Observable<UserExercise[]> {
    return this.apiService.get<UserExercise[]>("health/user-exercises");
  }

  toggleUserExercise(exerciseId: number, hidden: boolean): Observable<boolean> {
    return this.apiService.post<{ hidden: boolean }, boolean>(
      "health/exercises/" + exerciseId + "/toggle",
      { hidden }
    );
  }
}
