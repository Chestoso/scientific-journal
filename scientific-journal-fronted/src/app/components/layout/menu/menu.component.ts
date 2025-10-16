import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenuitemComponent } from '../menuitem/menuitem.component';

@Component({
  selector: 'app-menu',
  imports: [CommonModule, MenuitemComponent, RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

  model: MenuItem[] = [];

  ngOnInit() {
      this.model = [
        
          
          {
              label: 'Pages',
              icon: 'pi pi-fw pi-briefcase',
              routerLink: ['/pages'],
              items: [

                {
                    label: 'Teacher',
                    icon: 'pi pi-fw pi-users',
                    routerLink: ['/layout/teacher']
                },

                {
                    label: 'Article',
                    icon: 'pi pi-fw pi-file', 
                    routerLink: ['/layout/article']
                },

                {
                    label: 'Article Publication',
                    icon: 'pi pi-fw pi-book', 
                    routerLink: ['/layout/article-publication']
                },

                {
                    label: 'Requirement Verification',
                    icon: 'pi pi-fw pi-check-square',
                    routerLink: ['/layout/requirement-verification']
                },

                {
                    label: 'Reviewer',
                    icon: 'pi pi-fw pi-user-edit',
                    routerLink: ['/layout/reviewer']
                },
                
                {
                    label: 'Evaluation',
                    icon: 'pi pi-fw pi-clipboard',
                    routerLink: ['/layout/evaluation']
                },

                {
                    label: 'Evaluation Detail',
                    icon: 'pi pi-fw pi-list',
                    routerLink: ['/layout/evaluation-detail']
                },
              
              ]
          },
         
      ];
  }
}
