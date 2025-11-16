import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  // Configuración de la aplicación
  providers: [
    provideBrowserGlobalErrorListeners(), // captura errores globales
    provideZoneChangeDetection({ eventCoalescing: true }), // optimización de la detección de cambios
    provideRouter(routes), // Rutas de la aplicación
    provideHttpClient(), // Cliente HTTP para realizar solicitudes
  ],
};
