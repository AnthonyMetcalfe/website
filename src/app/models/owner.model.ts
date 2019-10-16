export interface Owner {
  user: string;
  name: string;
  wins: number;
  ties: number;
  losses: number;
  weeklyChange?: number;
}
