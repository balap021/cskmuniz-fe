import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject, tap } from "rxjs";
import { Router } from "@angular/router";
import {
  User,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from "../models/user.interface";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    // Check for stored token on service initialization
    const token = localStorage.getItem("token");
    if (token) {
      this.getCurrentUser().subscribe({
        error: () => {
          // Token is invalid, clear it
          localStorage.removeItem("token");
          this.currentUserSubject.next(null);
        },
      });
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap((response) => {
          localStorage.setItem("token", response.token);
          this.currentUserSubject.next(response.user);
        }),
      );
  }

  register(userData: RegisterRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/register`, userData)
      .pipe(
        tap((response) => {
          localStorage.setItem("token", response.token);
          this.currentUserSubject.next(response.user);
        }),
      );
  }

  logout(): void {
    localStorage.removeItem("token");
    this.currentUserSubject.next(null);
    this.router.navigate(["/admin/login"]);
  }

  getCurrentUser(): Observable<User> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    return this.http
      .get<User>(`${this.apiUrl}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(tap((user) => this.currentUserSubject.next(user)));
  }

  getToken(): string | null {
    return localStorage.getItem("token");
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getAuthHeaders(): { [key: string]: string } {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}
