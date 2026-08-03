from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

event_counter = 103

events = [
    {
        "id": "evt-101",
        "title": "Cyber Security & Cloud Defense Workshop",
        "category": "Workshop",
        "date": "2026-08-10",
        "location": "Building C, Room 104",
        "description": "Hands-on session covering basics of network security, cloud setup, and threat monitoring.",
        "imageUrl": "https://htweventstore.blob.core.windows.net/banners/cyber-security.jpg"
    },
    {
        "id": "evt-102",
        "title": "HTW Tech Career Day 2026",
        "category": "Career",
        "date": "2026-08-18",
        "location": "Auditorium Max",
        "description": "Meet Berlin tech employers recruiting for working student roles and internships.",
        "imageUrl": "https://htweventstore.blob.core.windows.net/banners/career-day.jpg"
    }
]

@app.route('/api/events', methods=['GET'])
def get_events():
    return jsonify(events), 200

@app.route('/api/events', methods=['POST'])
def add_event():
    global event_counter
    data = request.get_json()
    
    if not data or 'title' not in data:
        return jsonify({'error': 'Title is required'}), 400
    
    event_counter += 1
    data['id'] = f"evt-{event_counter}"
    
    if 'imageUrl' not in data or not data['imageUrl']:
        data['imageUrl'] = "https://htweventstore.blob.core.windows.net/banners/default-event.jpg"
        
    events.append(data)
    return jsonify(data), 201

@app.route('/api/events/<event_id>', methods=['PUT'])
def update_event(event_id):
    data = request.get_json() or {}
    data.pop('id', None)
    for evt in events:
        if evt['id'] == event_id:
            evt.update(data)
            return jsonify(evt), 200
    return jsonify({'error': 'Event missing'}), 404

@app.route('/api/events/<event_id>', methods=['DELETE'])
def delete_event(event_id):
    global events
    initial_count = len(events)
    events = [e for e in events if e['id'] != event_id]
    
    if len(events) == initial_count:
        return jsonify({'error': 'Event not found'}), 404
        
    return jsonify({'message': 'Deleted'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)