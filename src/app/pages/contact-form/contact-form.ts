import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Contact } from '../../models/contact.model';
import { ContactService } from '../../core/services/contact.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-form',
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  standalone: true,
  templateUrl: './contact-form.html',
})
export class ContactForm implements OnInit {
  form!: FormGroup; // Definir el formulario
  editMode = false; //  Indica si estamos editando o creando
  contactId!: number; // ID del contacto a editar

  constructor(
    private fb: FormBuilder, // FormBuilder para crear el formulario
    private route: ActivatedRoute, // Para obtener parámetros de la ruta
    private router: Router, // Para navegar entre rutas
    private contactService: ContactService // Servicio para manejar contactos, guardar y actualizar
  ) {}

  // Inicializar el formulario y cargar datos si es edición
  ngOnInit(): void {
    // Definir el formulario con validadores
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)]],
      phones: this.fb.array([], this.noEmptyPhones.bind(this)),
    });

    // Agregar un teléfono inicial
    this.addPhone();

    // obtener el ID del contacto de la ruta si existe
    this.contactId = Number(this.route.snapshot.paramMap.get('id'));

    // Si hay un ID, estamos en modo edición
    if (this.contactId) {
      this.editMode = true;
      // Cargar el contacto desde el servicio desde el servicio ya que es un observable
      this.contactService.getContacts().subscribe((list) => {
        const contact = list.find((c) => c.id === this.contactId);
        if (contact) this.loadContact(contact);
      });
    }
  }

  // Obtener el array de teléfonos del formulario para manipularlo fácilmente
  get phones() {
    return this.form.get('phones') as FormArray;
  }

  // Crear un nuevo control de teléfono con validadores
  createPhoneControl(value: string = '') {
    return this.fb.control(value, [
      Validators.required,
      Validators.pattern(/^[0-9+\-\s]+$/), // solo caracteres permitidos
      this.minDigitsValidator(7), // mínimo 7 dígitos
    ]);
  }

  // Validador personalizado para mínimo de dígitos
  minDigitsValidator(min: number) {
    // como recibe un parámetro, debe devolver una función validadora
    return (control: AbstractControl) => {
      const value = control.value || '';
      const digits = value.replace(/\D/g, ''); // quitar todo excepto dígitos

      // si hay menos dígitos que el mínimo, devolver error
      return digits.length < min ? { minDigits: true } : null;
    };
  }

  // Validador personalizado para evitar teléfonos vacíos
  noEmptyPhones(control: AbstractControl) {
    const array = control as FormArray;

    // buscamos algún control vacío
    const hasEmpty = array.controls.some((c) => !c.value || c.value.trim() === '');

    // si hay alguno vacío, devolver error
    return hasEmpty ? { emptyPhone: true } : null;
  }

  // Agregar un nuevo teléfono al array
  addPhone() {
    this.phones.push(this.createPhoneControl());
  }

  // Eliminar un teléfono del array por índice
  removePhone(i: number) {
    this.phones.removeAt(i);
  }

  // cargamos datos de un contacto existente en el formulario
  loadContact(contact: Contact) {
    // actualizamos los campos del formulario
    this.form.patchValue({
      name: contact.name,
      email: contact.email,
    });

    // console.log(this.phones);
    // resetear el array
    this.phones.clear();

    // recrear los controles con validadores
    contact.phones.forEach((p) => {
      this.phones.push(this.createPhoneControl(p));
    });
  }

  // Guardar el contacto, ya sea nuevo o editado
  save() {
    // Si el formulario no es válido, marcar todos los campos como tocados para mostrar errores
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Crear el objeto Contact desde los valores del formulario
    const data: Contact = { id: this.contactId, ...this.form.value };

    // actualizar o agregar según el modo
    if (this.editMode) this.contactService.update(data);
    else this.contactService.add(data);

    // Volver a la lista de contactos
    this.router.navigate(['/']);
  }

  // Cancelar y volver a la lista de contactos
  cancel() {
    this.router.navigate(['/']);
  }
}
