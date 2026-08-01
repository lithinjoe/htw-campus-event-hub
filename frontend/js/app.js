const API_URL = 'http://localhost:5000/api/events';

let events = [];
let userRegistrations = [];

$(document).ready(function() {
    fetchEvents();
    loadRegistrations();
    bindEvents();
    updateRoleUI();
});

function fetchEvents() {
    $.get(API_URL)
        .done(function(data) {
            events = data;
            renderEvents();
        })
        .fail(function() {
            console.warn('Backend offline. Loading local data...');
            events = [
                {
                    id: "evt-101",
                    title: "Cyber Security & Cloud Defense Workshop",
                    category: "Workshop",
                    date: "2026-08-10",
                    location: "Building C, Room 104",
                    description: "Hands-on session covering network security and threat analysis."
                }
            ];
            renderEvents();
        });
}

function loadRegistrations() {
    const data = localStorage.getItem('htw_registrations');
    userRegistrations = data ? JSON.parse(data) : [];
}

function saveRegistrations() {
    localStorage.setItem('htw_registrations', JSON.stringify(userRegistrations));
}

function bindEvents() {
    $('.nav-btn').on('click', function() {
        switchView($(this).attr('data-view'));
    });

    $('#userRole').on('change', updateRoleUI);
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

function updateRoleUI() {
    const role = $('#userRole').val();
    if (role === 'guest') {
        $('.student-only, .organizer-only').hide();
        switchView('catalogView');
    } else if (role === 'student') {
        $('.student-only').show();
        $('.organizer-only').hide();
    } else if (role === 'organizer') {
        $('.student-only').hide();
        $('.organizer-only').show();
    }
}

function renderEvents(filteredList) {
    const list = filteredList || events;
    const $container = $('#eventsList');
    $container.empty();

    if (list.length === 0) {
        $container.append('<p>No events found.</p>');
        return;
    }

    list.forEach(evt => {
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
        openEventDetail($(this).attr('data-id'));
    });
}

function filterEvents() {
    const query = $('#searchInput').val().toLowerCase().trim();
    const cat = $('#categoryFilter').val();

    const filtered = events.filter(e => {
        const matchText = e.title.toLowerCase().includes(query) || e.description.toLowerCase().includes(query);
        const matchCat = (cat === 'all') || (e.category === cat);
        return matchText && matchCat;
    });

    renderEvents(filtered);
}

function openEventDetail(id) {
    const evt = events.find(e => e.id === id);
    if (!evt) return;

    const role = $('#userRole').val();
    let regBtn = '';

    if (role === 'student') {
        regBtn = `<button class="btn-primary start-reg-btn" data-id="${evt.id}">Register for this Event</button>`;
    } else if (role === 'guest') {
        regBtn = `<p><em>Switch role to "Student" in top bar to register.</em></p>`;
    }

    const detailHtml = `
        <h2>${escapeHtml(evt.title)}</h2>
        <span class="badge" style="margin: 1rem 0;">${escapeHtml(evt.category)}</span>
        <p><strong>Date:</strong> ${escapeHtml(evt.date)}</p>
        <p><strong>Location:</strong> ${escapeHtml(evt.location)}</p>
        <hr style="margin: 1rem 0; border: none; border-top: 1px solid #E0E0E0;">
        <p style="margin-bottom: 1.5rem;">${escapeHtml(evt.description)}</p>
        ${regBtn}
    `;

    $('#eventDetailContent').html(detailHtml);
    switchView('detailView');

    $('.start-reg-btn').on('click', function() {
        $('#regEventId').val($(this).attr('data-id'));
        switchView('registerView');
    });
}

function handleRegistration(e) {
    e.preventDefault();

    const eventId = $('#regEventId').val();
    const name = $('#studentName').val().trim();
    const email = $('#studentEmail').val().trim();
    const program = $('#studyProgram').val().trim();

    $('#nameError, #emailError').text('');

    let valid = true;
    if (name.length < 2) {
        $('#nameError').text('Enter your full name.');
        valid = false;
    }

    if (!email.toLowerCase().endsWith('@htw-berlin.de')) {
        $('#emailError').text('Must use a valid @htw-berlin.de address.');
        valid = false;
    }

    if (!valid) return;

    const evt = events.find(e => e.id === eventId);
    userRegistrations.push({
        id: 'reg-' + Date.now(),
        eventId: eventId,
        eventTitle: evt ? evt.title : 'Campus Event',
        studentName: name,
        studentEmail: email,
        studyProgram: program,
        regDate: new Date().toLocaleDateString()
    });

    saveRegistrations();
    alert('Registered successfully!');
    $('#registrationForm')[0].reset();
    switchView('myRegistrationsView');
}

function renderRegistrations() {
    const $container = $('#studentRegistrationsList');
    $container.empty();

    if (userRegistrations.length === 0) {
        $container.append('<p>No active registrations found.</p>');
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
        const id = $(this).attr('data-id');
        userRegistrations = userRegistrations.filter(r => r.id !== id);
        saveRegistrations();
        renderRegistrations();
    });
}

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

    const isUpdate = Boolean(id);
    const url = isUpdate ? `${API_URL}/${id}` : API_URL;
    const type = isUpdate ? 'PUT' : 'POST';

    $.ajax({
        url: url,
        type: type,
        contentType: 'application/json',
        data: JSON.stringify(payload),
        success: function() {
            fetchEvents();
            $('#eventForm').addClass('hidden')[0].reset();
        },
        error: function(err) {
            alert('Failed to save event to API.');
            console.error(err);
        }
    });
}

function renderOrganizerEvents() {
    const $container = $('#organizerEventsList');
    $container.empty();

    if (events.length === 0) {
        $container.append('<p>No events found.</p>');
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
        if (confirm('Delete this event?')) {
            $.ajax({
                url: `${API_URL}/${id}`,
                type: 'DELETE',
                success: function() {
                    fetchEvents();
                }
            });
        }
    });
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}