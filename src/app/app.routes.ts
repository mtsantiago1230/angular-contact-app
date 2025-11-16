import { Routes } from '@angular/router';
import { ContactForm } from './pages/contact-form/contact-form';
import { ContactList } from './pages/contact-list/contact-list';

export const routes: Routes = [
  { path: '', redirectTo: 'contacts', pathMatch: 'full' },
  {
    path: 'contacts',
    component: ContactList,
  },
  {
    path: 'contacts/new',
    component: ContactForm,
  },
  {
    path: 'contacts/:id',
    component: ContactForm,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
