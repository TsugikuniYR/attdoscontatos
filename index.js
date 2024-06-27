// script.js
document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('appContainer');
    const themeToggleBtn = document.getElementById('themeToggle');

    themeToggleBtn.addEventListener('click', () => {
        appContainer.classList.toggle('dark-mode');
        document.body.classList.toggle('dark-mode');
    });

    const contactForm = document.getElementById('contactForm');
    const contactList = document.getElementById('contactList');
    const searchInput = document.getElementById('searchName');
    const searchButton = document.getElementById('searchButton');
    const phoneInput = document.getElementById('phone');

    let contacts = [];

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const phone = formatPhoneNumber(document.getElementById('phone').value);
        const email = document.getElementById('email').value;

        const contact = { id: Date.now(), name, phone, email, favorite: false };
        contacts.push(contact);

        renderContacts();
        contactForm.reset();
    });

    function renderContacts(filteredContacts = contacts) {
        // Ordena os contatos: favoritos primeiro, depois não favoritos
        filteredContacts.sort((a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0));

        contactList.innerHTML = '';

        if (filteredContacts.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'No contacts found.';
            contactList.appendChild(li);
        } else {
            filteredContacts.forEach(contact => {
                const li = document.createElement('li');
                const favoriteButton = document.createElement('button');
                favoriteButton.innerHTML = '&#x2B50;'; // Estrela como conteúdo do botão
                favoriteButton.classList.add('favorite-button');
                if (contact.favorite) {
                    favoriteButton.classList.add('active');
                }
                favoriteButton.addEventListener('click', () => toggleFavorite(contact.id));

                li.innerHTML = `
                    <span>${contact.name}${contact.favorite ? ' &#x2B50;' : ''} - ${contact.phone} - ${contact.email}</span>
                    <div>
                        <button onclick="editContact(${contact.id})"><img src="edit.png" alt="Edit"></button>
                        <button onclick="deleteContact(${contact.id})"><img src="delete.png" alt="Delete"></button>
                    </div>
                `;
                li.querySelector('div').appendChild(favoriteButton); // Adiciona o botão de favorito ao lado dos botões edit/delete
                contactList.appendChild(li);
            });
        }
    }

    window.editContact = function(id) {
        const contact = contacts.find(contact => contact.id === id);
        if (contact) {
            document.getElementById('name').value = contact.name;
            document.getElementById('phone').value = contact.phone;
            document.getElementById('email').value = contact.email;
            contacts = contacts.filter(contact => contact.id !== id);
            renderContacts();
        }
    };

    window.deleteContact = function(id) {
        contacts = contacts.filter(contact => contact.id !== id);
        renderContacts();
    };

    searchButton.addEventListener('click', () => {
        const searchName = searchInput.value.trim().toLowerCase();
        const filteredContacts = contacts.filter(contact => contact.name.toLowerCase().includes(searchName));
        renderContacts(filteredContacts);
    });

    function toggleFavorite(id) {
        const contact = contacts.find(contact => contact.id === id);
        if (contact) {
            contact.favorite = !contact.favorite;
            renderContacts();
        }
    }

    // Função para formatar o número de telefone
    function formatPhoneNumber(phoneNumber) {
        // Limpa todos os caracteres não numéricos do número de telefone
        phoneNumber = phoneNumber.replace(/\D/g, '');
        
        // Formata o número conforme o padrão (55) 85 1234-5678
        const formattedPhoneNumber = `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 4)} ${phoneNumber.slice(4, 8)}-${phoneNumber.slice(8, 12)}`;
        
        return formattedPhoneNumber;
    }

    // Event listener para formatar o número de telefone enquanto o usuário digita
    phoneInput.addEventListener('input', () => {
        phoneInput.value = formatPhoneNumber(phoneInput.value);
    });
});