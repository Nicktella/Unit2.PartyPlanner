const API_URL = "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2401-FTB-ET-WEB-AM/events";

const state = {
    events: [],
};

// Declare eventListElement here
const eventListElement = document.getElementById('eventList');

// Function to fetch events
async function fetchEvents() {
    try {
        const response = await fetch(API_URL);
        const result = await response.json();

        if (!result.success) {
            throw new Error(`Invalid response format: ${result}`);
        }

        const events = result.data;
        console.log('Fetched result:', events);
        renderEvents(events);
    } catch (error) {
        console.error('Error fetching events:', error.message);
    }
}

// Function to render events
function renderEvents(events) {
    // Render each event
    events.forEach(renderEvent);
}

// Function to render a single event
function renderEvent(event) {
    if (!event) {
        console.error('Invalid event data:', event);
        return;
    }

    const eventElement = document.createElement('div');
    eventElement.id = `event-${event.id}`;
    eventElement.classList.add('event-box');
    eventElement.innerHTML = `
        <p><strong>Name:</strong> ${event.name}</p>
        <p><strong>Date:</strong> ${event.date}</p>
        <p><strong>Location:</strong> ${event.location}</p>
        <p><strong>Description:</strong> ${event.description}</p>
        <button onclick="deleteEvent(${event.id})">Delete</button>
    `;
    eventListElement.appendChild(eventElement);
}

// Function to delete an event
async function deleteEvent(id) {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        document.getElementById(`event-${id}`).remove();
    } catch (error) {
        console.error('Error deleting event:', error.message);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const eventForm = document.getElementById('partyForm'); // Corrected to match the HTML

    // Initial render with mock data
    const mockEvents = [
        // Mock event data
    ];

    renderEvents(mockEvents);

    // Fetch and render real event data
    fetchEvents();

    if (eventForm) {
        eventForm.addEventListener('submit', addEvent);
    }

    function formatDate(date) {
        const formattedDate = new Date(date);
        return formattedDate.toISOString();
    }

    // Function to add an event
    async function addEvent(event) {
        event.preventDefault();

        const newEvent = {
            name: document.getElementById('partyName').value, // Corrected to match the HTML
            date: formatDate(document.getElementById('partyDate').value), // Corrected to match the HTML
            location: document.getElementById('partyLocation').value, // Corrected to match the HTML
            description: document.getElementById('partyDescription').value, // Corrected to match the HTML
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newEvent),
            });
            console.log('Add event response:', response); // Add this line for logging
            if (!response.ok) {
                throw new Error('Failed to add event');
            }

            const event = await response.json();
            renderEvent(event);
        } catch (error) {
            console.error('Error adding event:', error.message);
        }
    }
});
