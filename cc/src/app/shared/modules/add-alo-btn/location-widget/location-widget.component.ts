import { Component, HostListener, ElementRef, EventEmitter, Output } from '@angular/core';

declare const $: any;

@Component({
    selector: 'location-widget',
    templateUrl: './location-widget.template.html'
})

export class LocationWidgetComponent {

    @Output()
    locationChange = new EventEmitter<any>();

    left = 0;
    top = 0;
    movingIcon: boolean;
    mousePosition: { x: number, y: number  };

    constructor(private elRef: ElementRef) {
    }

    leftChange(left: number) {
        this.left = left;
    }

    topChange(top: number) {
        this.top = top;
    }

    startMoveIcon(e) {
        this.movingIcon = true;
        this.mousePosition = { x: e.screenX, y: e.screenY  };
    }

    @HostListener('document:mouseup')
    onMouseUp() {
        if (this.movingIcon) {
            this.locationChange.emit(this.mousePosition);
        }
        this.movingIcon = false;
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(e) {
        if (this.movingIcon) {
            const $dragArea = $(this.elRef.nativeElement).find('.drag-area');
            const areaWidth = $dragArea.width();
            const areaHeight = $dragArea.height();
            const newPercentLeft = ((this.left * 0.01 * areaWidth) + (e.screenX - this.mousePosition.x)) / areaWidth;
            const newPercentTop = ((this.top * 0.01 * areaHeight) + (e.screenY - this.mousePosition.y )) / areaHeight;
            if (newPercentLeft >= 0 && newPercentLeft <= 1) {
                this.left = newPercentLeft * 100;
            }

            if (newPercentTop >= 0 && newPercentTop <= 1) {
                this.top = newPercentTop * 100;
            }
            this.mousePosition = { x: e.screenX, y: e.screenY };
        }
    }
}
