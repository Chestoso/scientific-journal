import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TeacherComponent } from './components/teacher/teacher.component';
import { LayoutComponent } from './components/layout/layout/layout.component';
import { LoginComponent } from './components/login/login.component';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'scientificjournel';
}
