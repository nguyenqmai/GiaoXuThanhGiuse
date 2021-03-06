import {Component, ElementRef, Input, Renderer, ViewChild} from '@angular/core';

@Component({
    selector: 'expandable',
    templateUrl: 'expandable.component.html'
})
export class ExpandableComponent {

    @ViewChild('expandWrapper', { read: ElementRef, static: true }) expandWrapper;
    @Input('expanded') expanded;
    @Input('expandHeight') expandHeight;

    constructor(public renderer: Renderer) {

    }

    ngAfterViewInit() {
        this.renderer.setElementStyle(this.expandWrapper.nativeElement, 'height', this.expandHeight + 'px');
    }

}
