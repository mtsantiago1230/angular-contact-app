import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Contact } from '../../models/contact.model';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  // clave para almacenar en localStorage
  private storageKey = 'contacts';
  // BehaviorSubject para manejar el estado de los contactos
  private contacts$ = new BehaviorSubject<Contact[]>([]);

  constructor(private http: HttpClient) {
    this.loadContacts();
  }

  // Cargar contactos desde localStorage o archivo JSON
  private loadContacts() {
    const local = localStorage.getItem(this.storageKey);

    // si existen contactos en localStorage, cargarlos, si no, desde el JSON
    if (local) {
      this.contacts$.next(JSON.parse(local));
    } else {
      this.http.get<Contact[]>('contacts.json').subscribe((data) => {
        this.contacts$.next(data);
        this.saveToStorage(data);
      });
    }
  }

  // Obtener el observable de contactos para suscribirse
  getContacts() {
    return this.contacts$.asObservable();
  }

  // Agregar un nuevo contacto
  add(contact: Contact) {
    const current = this.contacts$.value;
    contact.id = Date.now();
    current.push(contact);
    this.updateState(current);
  }

  // Actualizar un contacto existente
  update(contact: Contact) {
    let current = this.contacts$.value.map((c) => (c.id === contact.id ? contact : c));
    this.updateState(current);
  }

  // Actualizar el estado de los contactos
  private updateState(contacts: Contact[]) {
    this.contacts$.next(contacts);
    this.saveToStorage(contacts);
  }

  // Guardar los contactos en el localStorage
  private saveToStorage(data: Contact[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }
}
