export interface Board {
  id: number;
  creator?: string;
  solver?: string;
  difficultyLevel?: number;
  firstSpot: number;
  secondSpot: number;
  thirdSpot: number;
  fourthSpot: number;
  roundsNeeded?: number;
  isCompleted?: boolean;
}
