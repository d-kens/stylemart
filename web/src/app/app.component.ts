import { Component, inject, OnInit } from '@angular/core';
import { FaConfig, FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fontAwesomeIcons } from './shared/font-awesome-icons';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './layout/footer/footer.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  imports: [FontAwesomeModule, NavbarComponent, RouterOutlet, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  private faIconLibrary = inject(FaIconLibrary);
  private faConfig = inject(FaConfig);


  ngOnInit(): void {
    this.initFontAwesome()
  }


  private initFontAwesome() {
    this.faConfig.defaultPrefix = 'far';
    this.faIconLibrary.addIcons(...fontAwesomeIcons);
  }

  
}
