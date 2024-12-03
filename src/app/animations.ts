import { animate, animateChild, group, query, style, transition, trigger } from "@angular/animations";


export const routeAnimations =
    trigger('routeAnimations', [
        transition('turnos <=> usuarios', [
            style({ position: 'relative' }),
            query(':enter, :leave', [
                style({
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '100%'
                })
            ]),
            query(':enter', [
                style({ right: '-100%' })
            ], { optional: true }),
            query(':leave', animateChild(), { optional: true }),
            group([
                query(':enter', [
                    animate('300ms ease-out', style({ right: '0%' }))
                ], { optional: true }),
                query(':leave', [
                    animate('300ms ease-out', style({ right: '100%' }))
                ], { optional: true }),
            ])
        ]),

        transition('homePage <=> usuarios', [
            style({ position: 'relative' }),
            query(':enter, :leave', [
                style({
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%'
                })
            ], { optional: true }),
            query(':enter', [
                style({ transform: 'translateY(100%)' }) //estado antes de que entre
            ], { optional: true }),
            group([
                query(':enter', [
                    animate('300ms ease-out', style({ transform: 'translateY(0)' }))    //cuando entra
                ], { optional: true }),
                query(':leave', [
                    animate('200ms ease-out', style({ transform: 'translateY(-100%)', opacity: 0 })) //cuando se va
                ], { optional: true }),
            ]),
        ]),
        transition('* <=> *', [
            style({ position: 'relative' }),
            query(':enter, :leave', [
                style({
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%'
                })
            ], { optional: true }),
            query(':enter', [
                style({ transform: 'translateY(100%)' })
            ], { optional: true }),
            query(':leave', animateChild(), { optional: true }),
            group([
                query(':enter', [
                    animate('1000ms ease-out', style({ transform: 'translateY(0)' }))
                ], { optional: true }),
                query(':leave', [
                    animate('1000ms ease-out', style({ transform: 'translateX(-100%)', opacity: 0 }))
                ], { optional: true }),
                query('@*', animateChild(), { optional: true })
            ]),
        ])
    ]);
