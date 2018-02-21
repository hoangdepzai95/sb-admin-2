import { trigger, animate, transition, style } from '@angular/animations';

export const heightAnimation = trigger('heightAnimation', [
    transition(':enter', [
        style({ minHeight: '0px' }),
        animate('281ms', style({ minHeight: '4000px' }))
    ])
]);
