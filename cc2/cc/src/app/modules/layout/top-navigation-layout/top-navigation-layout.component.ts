import { Component, HostListener } from '@angular/core';
import { OnInit } from '@angular/core';

import { detectBody } from '../../../app.helpers';

declare const jQuery: any;

@Component({
  selector: 'app-topnavigationlayout',
  templateUrl: 'top-navigation-layout.template.html',
})
export class TopNavigationLayoutComponent implements OnInit {

  public ngOnInit(): any {
    detectBody();
  }

  @HostListener('window:resize')
  public onResize() {
    detectBody();
  }

}
