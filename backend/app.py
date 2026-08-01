from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# In-memory storage for events
events = [
    {
        "id": "evt-101",
        "title": "Cyber Security & Cloud Defense Workshop",
        "category": "Workshop",
        "date": "2026-08-10",
        "location": "Building C, Room 104",
        "description": "An interactive workshop covering modern network security, cloud storage models, and basic threat analysis."
    },
    {
        "id": "evt-102",
        "title": "HTW Tech Career Day 2026",
        "category": "Career",
        "date": "2026-08-18",
        "location": "Auditorium Max",
        "description": "Connect with tech companies across Berlin offering internships, working student positions, and entry-level roles."
    }
]

# GET all events
@app.route('/api/events', methods=['GET'])
def get_events():
    return jsonify(events), 200

# POST create new event
@app.route('/api/events', methods=['POST'])
def add_event():
    data = request.get_json()
    if not data or 'title' not in data:
        return jsonify({'error': 'Invalid payload'}), 400
    
    data['id'] = f"evt-{len(events) + 101}"
    events.append(data)
    return jsonify(data), 201

# PUT update event
@app.route('/api/events/<event_id>', methods=['PUT'])
def update_event(event_id):
    data = request.get_json()
    for evt in events:
        if evt['id'] == event_id:
            evt.update(data)
            return jsonify(evt), 200
    return jsonify({'error': 'Event not found'}), 404

# DELETE event
@app.route('/api/events/<event_id>', methods=['DELETE'])
def delete_event(event_id):
    global events
    events = [evt for evt in events if evt['id'] != event_id]
    return jsonify({'message': 'Deleted successfully'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)