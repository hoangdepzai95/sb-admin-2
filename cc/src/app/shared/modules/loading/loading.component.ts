import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-loading',
    templateUrl: './loading.template.html'
})

export class  LoadingComponent {

    @Input()
    loading: boolean;

    @Input()
    className: string;

}
