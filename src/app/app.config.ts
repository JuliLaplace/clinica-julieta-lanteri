import { ApplicationConfig, provideZoneChangeDetection, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideAnimations } from '@angular/platform-browser/animations'
import localeEsAR from '@angular/common/locales/es-AR';
import { DatePipe, registerLocaleData } from '@angular/common';
registerLocaleData(localeEsAR, 'es-AR');
    

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideFirebaseApp(() => initializeApp({"projectId":"clinica-julieta-lanteri","appId":"1:1014338628225:web:1f973cab54795b6ba6fb80","storageBucket":"clinica-julieta-lanteri.appspot.com","apiKey":"AIzaSyCnudJQAyYB9inRXCYJtjeo2oyAufvHmUw","authDomain":"clinica-julieta-lanteri.firebaseapp.com","messagingSenderId":"1014338628225"})), 
    provideAuth(() => getAuth()), 
    provideFirestore(() => getFirestore()), 
    provideAnimationsAsync(), 
    provideAnimations(), 
    { provide: LOCALE_ID, useValue: 'es-AR' },
    DatePipe,
  ]
};
