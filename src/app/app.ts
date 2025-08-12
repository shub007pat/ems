import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('employee-management-system');

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Check if user is already authenticated on app start
    this.authService.checkAuthStatus();
  }
}
