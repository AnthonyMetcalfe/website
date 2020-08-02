import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import moment from "moment";

@Injectable({
  providedIn: "root"
})
export class ApiService {
  private apiEndpoint = "https://localhost:8000/";
  constructor(private http: HttpClient) {}

  get<T>(url: string): Observable<T> {
    return this.http
      .get(this.apiEndpoint + url)
      .pipe(map((response: string) => JSON.parse(response, this.reviver) as T));
  }

  post<T, R>(url: string, body: T): Observable<R> {
    return this.http
      .post(this.apiEndpoint + url, body)
      .pipe(
        map((response: string) =>
          response != null
            ? (JSON.parse(response) as R)
            : ((true as unknown) as R)
        )
      );
  }

  postToExternal<T, R>(url: string, body: T): Observable<R> {
    return this.http
      .post(this.apiEndpoint + url, body)
      .pipe(
        map((response: string) =>
          response != null
            ? (JSON.parse(JSON.stringify(response)) as R)
            : ((true as unknown) as R)
        )
      );
  }

  put<T, R>(url: string, body: T): Observable<R> {
    return this.http
      .put(this.apiEndpoint + url, body)
      .pipe(
        map((response: string) =>
          response != null
            ? (JSON.parse(response) as R)
            : ((true as unknown) as R)
        )
      );
  }

  private reviver(name, value) {
    if (
      typeof value === "string" &&
      value.length >= 19 &&
      value.length <= 32 &&
      /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+(-\d\d:\d\d)?)?Z?$/.test(value)
    ) {
      return moment(value);
    }
    return value;
  }
}
