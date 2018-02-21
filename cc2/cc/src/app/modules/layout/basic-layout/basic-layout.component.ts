import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { HostListener } from '@angular/core';
import { debounce } from 'lodash';

import { detectBody } from '../../../app.helpers';

declare const jQuery: any;

@Component({
    selector: 'app-basic',
    templateUrl: 'basic-layout.template.html',
})
export class BasicLayoutComponent implements OnInit {

    constructor() {
        this.onResize = debounce(this.onResize, 100);
    }

    public ngOnInit(): any {
        detectBody();
    }
    @HostListener('window:resize')
    public onResize() {
        detectBody();
    }

}
