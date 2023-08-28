import {
  Contact,
  CreateContactResponse,
  DeleteContactResponse,
  GetContactResponse,
  GetContactsResponse,
  SortDirection,
  UpdateContactResponse,
} from 'common/type/Contact';
import React, { useCallback, useContext, useState } from 'react';

import { API_PATHS } from 'common/Config';
import { AppContext } from 'store/AppContext';
import { MessageType } from 'common/type/Message';
import { v4 as uuid } from 'uuid';

export interface ContactContextProps {
  contacts: Contact[];
  currentContact: Contact | undefined;
  sortDirection: SortDirection;
  createContact: (c: Contact, callbackFnc?: () => void) => void;
  getContact: (contactId: string) => void;
  getContacts: () => void;
  deleteContact: (contactId: string) => void;
  clearCurrentContact: () => void;
  updateContact: (c: Contact, callbackFnc?: () => void) => void;
  changeSortDirs: () => void;
}

export const ContactContext = React.createContext<ContactContextProps>({
  contacts: [],
  currentContact: undefined,
  sortDirection: SortDirection.ASC,
  createContact: (_c: Contact, _callbackFnc?: () => void) => {},
  getContact: (_contactId: string) => {},
  getContacts: () => {},
  deleteContact: (_contactId: string) => {},
  clearCurrentContact: () => {},
  updateContact: (_c: Contact, _callbackFnc?: () => void) => {},
  changeSortDirs: () => {},
});

export const ContactContextProvider = ({ children }) => {
  /* Context */
  const { message$ } = useContext(AppContext);

  /* States */
  const [currentContact, setCurrentContact] = useState<Contact | undefined>();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    SortDirection.ASC
  );

  // Get all contacts
  const handleGetContacts = useCallback(() => {
    const url = API_PATHS.CONTACT_API;
    fetch(url)
      .then(async (res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json() as Promise<GetContactsResponse>;
      })
      .then((res) => {
        const { statusCode, message, data } = res;
        if (+statusCode !== 200) throw new Error(message);
        setContacts(
          data.sort((a, b) => {
            if (sortDirection === SortDirection.ASC) {
              return a.first_name > b.first_name ? 1 : -1;
            }
            return b.first_name > a.first_name ? 1 : -1;
          })
        );
      })
      .catch((err) => {
        message$.next({
          id: uuid(),
          type: MessageType.ERROR,
          msg: `Fetch contacts failed:\n${
            err instanceof Error ? err.message : 'Unknown error'
          }`,
        });
      });
  }, [message$, sortDirection]);

  // Get a single contact
  const handleGetContact = useCallback(
    (contactId: string) => {
      const url = `${API_PATHS.CONTACT_API}/${contactId}`;
      fetch(url)
        .then((res) => {
          if (!res.ok) throw new Error(res.statusText);
          return res.json() as Promise<GetContactResponse>;
        })
        .then((res) => {
          const { statusCode, message, data } = res;
          if (+statusCode !== 200) {
            throw new Error(message);
          }
          setCurrentContact(data as Contact);
        })
        .catch((err) => {
          message$.next({
            id: uuid(),
            type: MessageType.ERROR,
            msg: `Failed to get contact - ${contactId} :\n${
              err instanceof Error ? err.message : 'Unknown error'
            }`,
          });
        });
    },
    [message$]
  );

  // Create contact
  const handleCreateContact = useCallback(
    (contact: Contact, callbackFnc?: () => void) => {
      const url = API_PATHS.CONTACT_API;
      const body = { contact };
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
        .then((res) => {
          if (!res.ok) throw new Error(res.statusText);
          return res.json() as Promise<CreateContactResponse>;
        })
        .then(async (res) => {
          const { statusCode, message } = res;
          if (+statusCode !== 201) throw new Error('Create contact failed');
          callbackFnc?.();
          // Add a brief delay before displaying message
          await new Promise((resolve) => setTimeout(resolve, 250));
          message$.next({
            id: uuid(),
            type: MessageType.SUCCESS,
            msg: message,
          });
        })
        .catch((err) => {
          message$.next({
            id: uuid(),
            type: MessageType.ERROR,
            msg: `Create contact failed:\n${
              err instanceof Error ? err.message : 'Unknown error'
            }`,
          });
        });
    },
    [message$]
  );

  // Update contact
  const handleUpdateContact = useCallback(
    (contact: Contact, callbackFnc?: () => void) => {
      const url = `${API_PATHS.CONTACT_API}/${contact.id}`;
      const body = {
        info: contact,
      };
      fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
        .then((res) => {
          if (!res.ok) throw new Error(res.statusText);
          return res.json() as Promise<UpdateContactResponse>;
        })
        .then(async (res) => {
          const { statusCode, message, data } = res;
          if (+statusCode !== 201) throw new Error('Invalid status code');
          setContacts((prev) => {
            const newList = [
              ...prev.map((c: Contact) => {
                return (c.id === (data as Contact).id ? data : c) as Contact;
              }),
            ];
            return newList;
          });
          callbackFnc?.();
          // Add a brief delay before displaying message
          await new Promise((resolve) => setTimeout(resolve, 250));
          message$.next({
            id: uuid(),
            type: MessageType.SUCCESS,
            msg: message,
          });
        })
        .catch((err) => {
          message$.next({
            id: uuid(),
            type: MessageType.ERROR,
            msg: `Update contact failed:\n${
              err instanceof Error ? err.message : 'Unknown error'
            }`,
          });
        });
    },
    [message$]
  );

  const handleDeleteContact = useCallback(
    (contactId: string) => {
      const url = `${API_PATHS.CONTACT_API}/${contactId}`;
      fetch(url, {
        method: 'DELETE',
      })
        .then((res) => {
          if (!res.ok) throw new Error(res.statusText);
          return res.json() as Promise<DeleteContactResponse>;
        })
        .then((res) => {
          const { statusCode, message, data } = res;
          if (+statusCode !== 200) throw new Error('Delete contact failed');
          setContacts((prevList) => [
            ...prevList.filter((c) => c.id !== (data as Contact)?.id),
          ]);
          message$.next({
            id: uuid(),
            type: MessageType.SUCCESS,
            msg: message,
          });
        })
        .catch((err) => {
          message$.next({
            id: uuid(),
            type: MessageType.ERROR,
            msg: `Delete contact failed:\n${
              err instanceof Error ? err.message : 'Unknown error'
            }`,
          });
        });
    },
    [message$]
  );

  // Sort Contact
  const handleSortContact = useCallback(() => {
    setContacts((prev) => [
      ...prev.sort((a, b) => {
        if (sortDirection === SortDirection.DESC) {
          return a.first_name > b.first_name ? 1 : -1;
        }
        return b.first_name > a.first_name ? 1 : -1;
      }),
    ]);
    setSortDirection((prev) =>
      prev === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC
    );
  }, [sortDirection]);

  // Clear current contact
  const handleClearContact = useCallback(
    () => setCurrentContact(undefined),
    []
  );

  const defaultValue = {
    contacts,
    currentContact,
    sortDirection,
    createContact: handleCreateContact,
    clearCurrentContact: handleClearContact,
    getContact: handleGetContact,
    getContacts: handleGetContacts,
    updateContact: handleUpdateContact,
    deleteContact: handleDeleteContact,
    changeSortDirs: handleSortContact,
  };

  return (
    <ContactContext.Provider value={defaultValue}>
      {children}
    </ContactContext.Provider>
  );
};
