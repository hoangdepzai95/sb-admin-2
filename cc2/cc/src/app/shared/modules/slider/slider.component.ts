import { Component, Input, HostListener, EventEmitter, Output, ElementRef, OnInit } from '@angular/core';

declare const $: any;

@Component({
    selector: 'app-slider',
    templateUrl: './slider.template.html'
})

export class SliderComponent implements OnInit {

    @Input()
    percent: number;

    @Input()
    className = '';

    @Input()
    vertical: boolean;

    @Output()
    percentChange = new EventEmitter<any>();

    active: boolean;

    mousePosition: number;

    positionField = 'screenX';

    constructor(private elRef: ElementRef) {
    }

    ngOnInit() {
        this.positionField = this.vertical ? 'screenY' : 'screenX';
    }

    activeSlider(e) {
        this.active = true;
        this.mousePosition =  e[this.positionField];
    }

    @HostListener('document:mouseup')
    onMouseUp() {
        this.active = false;
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(e) {
        if (this.active) {
            const $slider = $(this.elRef.nativeElement).find('.slider');
            const sliderSize = this.vertical ? $slider.height() : $slider.width();
            const newPercent = ((this.percent * 0.01 * sliderSize) + (e[this.positionField] - this.mousePosition)) / sliderSize;
            if (newPercent >= 0 && newPercent <= 1) {
                this.percentChange.emit(newPercent * 100);
            }
            this.mousePosition = e[this.positionField];
        }
    }
}
