import { Component, OnInit } from "@angular/core";
import { Observable, forkJoin } from "rxjs";
import { take } from "rxjs/operators";

import { ExerciseService } from "../exercise.service";
import { Exercise } from "../models/exercise.model";

@Component({
  selector: "am-exercises",
  templateUrl: "./exercises.component.html",
  styleUrls: ["./exercises.component.scss"]
})
export class ExercisesComponent implements OnInit {
  exercises: Exercise[];
  randomExercise: Exercise;

  constructor(private exerciseService: ExerciseService) {}

  getRandomExercise() {
    const count = this.exercises.length;
    const milliseconds = new Date().getTime();
    this.randomExercise = this.exercises[milliseconds % count];
    this.exerciseService
      .toggleUserExercise(this.randomExercise.id, true)
      .subscribe(x => console.log(x));
  }

  ngOnInit() {
    forkJoin([
      this.exerciseService.getExercises(),
      this.exerciseService.getUserExercises()
    ])
      .pipe(take(1))
      .subscribe(([exercises, userExercises]) => {
        this.exercises = exercises.map(e => ({
          ...e,
          hidden: userExercises.find(ue => ue.exerciseId === e.id)?.hidden
        }));
        console.log(userExercises);
      });
  }
}
