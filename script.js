const COHORT = "2401-FTB-ET-WEB-AM";
const API_URL = "https://fsa-crud-2aa9294fe819.herokuapp.com/api/" + COHORT;

const state = {
    events: [],
    event: null,
    guests: [],
    rsvps: [],
};

const $eventList = document.querySelector("#eventList");
const $eventDetails = document.querySelector("#eventDetails");
const $guests = document.querySelector("#guests");
const $guestList = document.querySelector("#guestList");

window.addEventListener("hashchange", selectEvent);

async function fetchEvents() {
    try {
        const response = await fetch(`${API_URL}/events`);
        const result = await response.json();

        if (!result.success) {
            throw new Error(`Invalid response format: ${result}`);
        }

        state.events = result.data; // Update state with fetched events
        console.log('Fetched result:', state.events);
        renderEvents();
    } catch (error) {
        console.error('Error fetching events:', error.message);
    }
}

function renderEvents() {
    const events = state.events.map(renderEvent);
    $eventList.replaceChildren(...events);
}

function renderEvent(event) {
    const article = document.createElement("article");
    const date = event.date.slice(0, 10);

    article.innerHTML = `
    <h3><a href="#${event.id}">${event.name} #${event.id}</a></h3>
    <time datetime="${date}">${date}</time>
    <address>${event.location}</address>
    <button class="delete-event-btn" data-event-id="${event.id}">Delete</button>
  `;

    return article;
}

document.addEventListener("click", async (event) => {
    if (event.target.classList.contains("delete-event-btn")) {
        const eventId = event.target.dataset.eventId;
        await deleteEvent(eventId);
    }
});

async function deleteEvent(eventId) {
    try {
        // Remove the event from state.events based on the eventId
        state.events = state.events.filter(event => event.id !== parseInt(eventId));

        // Re-render the events list
        renderEvents();

        console.log('Event deleted successfully.');
    } catch (error) {
        console.error('Error deleting event:', error.message);
    }
}

function selectEvent() {
    getEventFromHash();
    renderEventDetails();
}

function getEventFromHash() {
    const id = window.location.hash.slice(1);
    state.event = state.events.find((event) => event.id === +id);
}

async function getGuests() {
    try {
        const response = await fetch(`${API_URL}/events`);
        const json = await response.json();
        state.guests = json.data;
    } catch (error) {
        console.error(error);
    }
}

function renderGuests() {
    // Render guests based on state.guests and state.event
}

async function getRsvps() {
    try {
        const response = await fetch(`${API_URL}/rsvps`);
        const json = await response.json();
        state.rsvps = json.data;
    } catch (error) {
        console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const eventForm = document.getElementById('partyForm');

    // Initial render with mock data
    const mockEvents = [];
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

    async function addEvent(event) {
        event.preventDefault();

        const newEvent = {
            name: document.getElementById('partyName').value,
            date: formatDate(document.getElementById('partyDate').value),
            location: document.getElementById('partyLocation').value,
            description: document.getElementById('partyDescription').value,
        };

        try {
            const response = await fetch(`${API_URL}/events`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newEvent)
            }) 
            console.log('Add event response:', response);
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

/**
 * Render details about the currently selected event
 */
function renderEventDetails() {
    if (!state.event) {
        $eventDetails.innerHTML = "<p>Select an event to see more.</p>";
        $guests.hidden = true;
        return;
    }

    const date = state.event.date ? state.event.date.slice(0, 10) : '';

    $eventDetails.innerHTML = `
    <h2>${state.event.name} #${state.event.id}</h2>
    <time datetime="${date}">${date}</time>
    <address>${state.event.location}</address>
    <p>${state.event.description}</p>
  `;

    renderGuests();
}