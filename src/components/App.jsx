import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { nanoid } from 'nanoid';
import css from './Contacts.module.css';
import { ContactForm, Filter, ContactList } from '.';

const toastConfig = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'light',
};

export const App = () => {
  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const contsctsJSON = localStorage.getItem('contacts');
    const parsContacts = JSON.parse(contsctsJSON) ?? [];

    if (parsContacts.length !== 0) {
      setContacts(parsContacts);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  const addContact = ({ name, number }) => {
    const existing = contacts.find(
      e => e.name.trim().toLowerCase() === name.trim().toLowerCase()
    );
    if (existing) {
      return toast.error(`${name} is already in contacts`, toastConfig);
    }

    const contact = {
      id: nanoid(10),
      name,
      number,
    };
    console.log(contact);
    setContacts(prevState => [...prevState, contact]);
  };

  const changeFilter = e => {
    setFilter(e.currentTarget.value);
  };

  const getVisibleContact = () => {
    const normalizedFilter = filter.toLowerCase();
    return contacts.filter(e =>
      e.name.toLowerCase().includes(normalizedFilter)
    );
  };

  const deleteContact = id => {
    setContacts(prevState =>
      prevState.filter(({ id: contact_ID }) => contact_ID !== id)
    );
  };

  const visibleContacts = getVisibleContact();
  return (
    <section className={css.contactsStyle}>
      <h2 className={css.title}>Phonebook</h2>
      <ContactForm contactData={addContact} />
      <h2 className={css.title}>Contacts</h2>
      <Filter value={filter} onChange={changeFilter} />
      <ContactList arr={visibleContacts} deleteContact={deleteContact} />
      <ToastContainer />
    </section>
  );
};
