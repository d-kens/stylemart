import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthService } from '../../auth/data-access/services/auth.service';
import { User } from '../../auth/data-access/models/user.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, FontAwesomeModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  isAuthenticated$; 
  isMenuOpen = false;

  user: { firstName: string; lastName: string } | null = null; 
  userInitials: string | null = null;
  
  constructor(private authService: AuthService, private toastr: ToastrService, private router: Router) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
  }

  ngOnInit() {
    this.isAuthenticated$.subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.getUserInfo();
      } else {
        this.userInitials = ''; 
      }
    });
  }

  getUserInfo() {
    this.authService.getAuthenticatedUser().subscribe({
      next: (user: User) => {
        this.userInitials = this.getInitials(user.firstName, user.lastName);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  getInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(): void {
    this.closeDropDownMenu();
    this.authService.logout().subscribe({
      next: () => {
        this.toastr.success("Logged out")
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.toastr.error("Logout unsuccessful: ", error.message);
      }
    })
  }

  closeDropDownMenu(): void {
    let bodyElement = document.activeElement as HTMLElement;

    if(bodyElement) {
      bodyElement.blur();
    }
  }
  

}
