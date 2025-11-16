import { Component, OnInit } from '@angular/core';
import { ContactService } from '../../core/services/contact.service';
import { Contact } from '../../models/contact.model';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-list',
  imports: [RouterModule, CommonModule],
  standalone: true,
  templateUrl: './contact-list.html',
})
export class ContactList implements OnInit {
  contacts: Contact[] = [];

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    // Suscribirse al observable de contactos para obtener la lista actualizada
    this.contactService.getContacts().subscribe((data) => {
      this.contacts = data;
    });
  }
}
