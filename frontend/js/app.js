// Base API URL pointing to Docker container
const API_URL = 'http://localhost:5000/api/events';

let events = [];
let userRegistrations = [];

$(document).ready(function() {
    loadEventsFromApi();
    loadRegistrations();
    setupEventListeners();
    updateRoleUI();
});

// Fetch events from Flask REST API
function loadEventsFromApi() {
    $.get(API_URL)
        .done(function(data) {
            events = data;
            renderEvents();
        })
        .fail(function() {
            console.error('Failed to load events from backend API.');
        });
}

// Load local registrations
function loadRegistrations() {
    const storedRegs = localStorage.getItem('htw_registrations');
    userRegistrations = storedRegs ? JSON.parse(storedRegs) : [];
}

// Save registrations to localStorage
function saveRegistrations() {
    localStorage.setItem('htw_registrations', JSON.stringify(userRegistrations));
}

// Event Listeners
function setupEventListeners() {
    $('.nav-btn').on('click', function() {
        const viewId = $(this).attr('data-view');
        switchView(viewId);
    });

    $('#userRole').on('change', function() {
        updateRoleUI();
    });

    $('#searchInput').on('input', filterEvents);
    $('#categoryFilter').on('change', filterEvents);

    $('#backToCatalogBtn').on('click', function() {
        switchView('catalogView');
    });

    $('#registrationForm').on('submit', handleRegistration);
    $('#cancelRegBtn').on('click', function() {
        switchView('catalogView');
    });

    $('#openCreateEventModal').on('click', function() {
        $('#formTitle').text('Add Event');
        $('#eventId').val('');
        $('#eventForm')[0].reset();
        $('#eventForm').removeClass('hidden');
    });

    $('#cancelEventBtn').on('click', function() {
        $('#eventForm').addClass('hidden');
    });

    $('#eventForm').on('submit', handleSaveEvent);
}

// Control View Visibility
function switchView(viewId) {
    $('.view-section').addClass('hidden');
    $('#' + viewId).removeClass('hidden');
    
    $('.nav-btn').removeClass('active');
    $(`.nav-btn[data-view="${viewId}"]`).addClass('active');

    if (viewId === 'myRegistrationsView') {
        renderRegistrations();
    } else if (viewId === 'organizerDashboardView') {
        renderOrganizerEvents();
    }
}

// Role Switching
function updateRoleUI() {
    const role = $('#userRole').val();

    if (role === 'guest') {
        $('.student-only').hide();
        $('.organizer-only').hide();
        switchView('catalogView');
    } else if (role === 'student') {
        $('.student-only').show();
        $('.organizer-only').hide();
    } else if (role === 'organizer') {
        $('.student-only').hide();
        $('.organizer-only').show();
    }
}

// Render Event Cards
function renderEvents(filteredList) {
    const listToRender = filteredList || events;
    const $container = $('#eventsList');
    $container.empty();

    if (listToRender.length === 0) {
        $container.append('<p>No events found.</p>');
        return;
    }

    listToRender.forEach(evt => {
        const cardHtml = `
            <div class="event-card">
                <div>
                    <span class="badge">${escapeHtml(evt.category)}</span>
                    <h3>${escapeHtml(evt.title)}</h3>
                    <div class="meta-info">
                        <p><strong>Date:</strong> ${escapeHtml(evt.date)}</p>
                        <p><strong>Location:</strong> ${escapeHtml(evt.location)}</p>
                    </div>
                    <p>${escapeHtml(evt.description.substring(0, 90))}...</p>
                </div>
                <div style="margin-top: 1rem;">
                    <button class="btn-primary view-details-btn" data-id="${evt.id}">View Details</button>
                </div>
            </div>
        `;
        $container.append(cardHtml);
    });

    $('.view-details-btn').on('click', function() {
        const id = $(this).attr('data-id');
        openEventDetail(id);
    });
}

// Filter Events
function filterEvents() {
    const query = $('#searchInput').val().toLowerCase().trim();
    const category = $('#categoryFilter').val();

    const filtered = events.filter(evt => {
        const matchesQuery = evt.title.toLowerCase().includes(query) || evt.description.toLowerCase().includes(query);
        const matchesCategory = (category === 'all') || (evt.category === category);
        return matchesQuery && matchesCategory;
    });

    renderEvents(filtered);
}

// Single Event Details
function openEventDetail(id) {
    const evt = events.find(e => e.id === id);
    if (!evt) return;

    const currentRole = $('#userRole').val();
    let registerButton = '';

    if (currentRole === 'student') {
        registerButton = `<button class="btn-primary start-reg-btn" data-id="${evt.id}">Register for this Event</button>`;
    } else if (currentRole === 'guest') {
        registerButton = `<p><em>Please switch role to "Student" above to register.</em></p>`;
    }

    const detailHtml = `
        <h2>${escapeHtml(evt.title)}</h2>
        <span class="badge" style="margin: 1rem 0;">${escapeHtml(evt.category)}</span>
        <p><strong>Date:</strong> ${escapeHtml(evt.date)}</p>
        <p><strong>Location:</strong> ${escapeHtml(evt.location)}</p>
        <hr style="margin: 1rem 0; border: none; border-top: 1px solid #E0E0E0;">
        <p style="margin-bottom: 1.5rem;">${escapeHtml(evt.description)}</p>
        ${registerButton}
    `;

    $('#eventDetailContent').html(detailHtml);
    switchView('detailView');

    $('.start-reg-btn').on('click', function() {
        const eventId = $(this).attr('data-id');
        $('#regEventId').val(eventId);
        switchView('registerView');
    });
}

// Student Registration Form
function handleRegistration(e) {
    e.preventDefault();

    const eventId = $('#regEventId').val();
    const name = $('#studentName').val().trim();
    const email = $('#studentEmail').val().trim();
    const program = $('#studyProgram').val().trim();

    $('#nameError').text('');
    $('#emailError').text('');

    let isValid = true;
    if (name.length < 2) {
        $('#nameError').text('Please enter a valid full name.');
        isValid = false;
    }

    if (!email.endsWith('@htw-berlin.de')) {
        $('#emailError').text('Must be a valid @htw-berlin.de email address.');
        isValid = false;
    }

    if (!isValid) return;

    const evt = events.find(e => e.id === eventId);
    const newReg = {
        id: 'reg-' + Date.now(),
        eventId: eventId,
        eventTitle: evt ? evt.title : 'Event',
        studentName: name,
        studentEmail: email,
        studyProgram: program,
        regDate: new Date().toLocaleDateString()
    };

    userRegistrations.push(newReg);
    saveRegistrations();

    alert('Registration successful!');
    $('#registrationForm')[0].reset();
    switchView('myRegistrationsView');
}

// Render Student Registrations
function renderRegistrations() {
    const $container = $('#studentRegistrationsList');
    $container.empty();

    if (userRegistrations.length === 0) {
        $container.append('<p>You have not registered for any events yet.</p>');
        return;
    }

    userRegistrations.forEach(reg => {
        const itemHtml = `
            <div style="border: 1px solid #E0E0E0; border-radius: 6px; padding: 1rem; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h4>${escapeHtml(reg.eventTitle)}</h4>
                    <p style="font-size: 0.85rem; color: #666;">Registered: ${escapeHtml(reg.regDate)} | Program: ${escapeHtml(reg.studyProgram)}</p>
                </div>
                <button class="btn-danger cancel-reg-btn" data-id="${reg.id}">Cancel</button>
            </div>
        `;
        $container.append(itemHtml);
    });

    $('.cancel-reg-btn').on('click', function() {
        const regId = $(this).attr('data-id');
        userRegistrations = userRegistrations.filter(r => r.id !== regId);
        saveRegistrations();
        renderRegistrations();
    });
}

// Send POST / PUT requests to Flask API
function handleSaveEvent(e) {
    e.preventDefault();

    const id = $('#eventId').val();
    const payload = {
        title: $('#eventTitle').val().trim(),
        category: $('#eventCategory').val(),
        date: $('#eventDate').val(),
        location: $('#eventLocation').val().trim(),
        description: $('#eventDescription').val().trim()
    };

    if (id) {
        // PUT update
        $.ajax({
            url: `${API_URL}/${id}`,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(payload),
            success: function() {
                loadEventsFromApi();
                $('#eventForm').addClass('hidden');
                $('#eventForm')[0].reset();
            }
        });
    } else {
        // POST create
        $.ajax({
            url: API_URL,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(payload),
            success: function() {
                loadEventsFromApi();
                $('#eventForm').addClass('hidden');
                $('#eventForm')[0].reset();
            }
        });
    }
}

// Organizer Events View
function renderOrganizerEvents() {
    const $container = $('#organizerEventsList');
    $container.empty();

    if (events.length === 0) {
        $container.append('<p>No events managed yet.</p>');
        return;
    }

    events.forEach(evt => {
        const itemHtml = `
            <div style="border: 1px solid #E0E0E0; border-radius: 6px; padding: 1rem; margin-top: 1rem; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h4>${escapeHtml(evt.title)} <span class="badge">${escapeHtml(evt.category)}</span></h4>
                    <p style="font-size: 0.85rem; color: #666;">Date: ${escapeHtml(evt.date)} | Location: ${escapeHtml(evt.location)}</p>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn-secondary edit-evt-btn" data-id="${evt.id}">Edit</button>
                    <button class="btn-danger delete-evt-btn" data-id="${evt.id}">Delete</button>
                </div>
            </div>
        `;
        $container.append(itemHtml);
    });

    $('.edit-evt-btn').on('click', function() {
        const id = $(this).attr('data-id');
        const evt = events.find(e => e.id === id);
        if (evt) {
            $('#formTitle').text('Edit Event');
            $('#eventId').val(evt.id);
            $('#eventTitle').val(evt.title);
            $('#eventCategory').val(evt.category);
            $('#eventDate').val(evt.date);
            $('#eventLocation').val(evt.location);
            $('#eventDescription').val(evt.description);
            $('#eventForm').removeClass('hidden');
        }
    });

    $('.delete-evt-btn').on('click', function() {
        const id = $(this).attr('data-id');
        if (confirm('Are you sure you want to delete this event?')) {
            $.ajax({
                url: `${API_URL}/${id}`,
                type: 'DELETE',
                success: function() {
                    loadEventsFromApi();
                }
            });
        }
    });
}

// Basic XSS Prevention
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}