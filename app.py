from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
# SQLite 데이터베이스 설정
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///events.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# 이벤트 모델 정의
class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(80), nullable=False)
    event_type = db.Column(db.String(80), nullable=False)
    date = db.Column(db.String(80), nullable=False)

# 애플리케이션 컨텍스트 내에서 데이터베이스 테이블 생성
with app.app_context():
    db.create_all()

@app.route('/')
def home():
    return render_template('test.html')

@app.route('/add_event', methods=['POST'])
def add_event():
    data = request.json
    new_event = Event(user_id=data['user_id'], event_type=data['event_type'], date=datetime.now().date().isoformat())
    db.session.add(new_event)
    db.session.commit()
    return jsonify({'message': '참 잘했어용~!'}), 200

@app.route('/get_events', methods=['GET'])
def get_events():
    events = Event.query.all()  # 모든 이벤트 조회
    events_data = [{'user_id': event.user_id, 'event_type': event.event_type, 'date': event.date} for event in events]
    return jsonify(events_data)

if __name__ == '__main__':
    app.run(debug=True)
