document.addEventListener("DOMContentLoaded", function () {
    var calendarEl = document.getElementById("calendar");
    var calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth",
      selectable: true,
      events: []
    });
  
    let addedEvents = []; // 이미 추가된 이벤트를 저장할 배열
  
    // 서버로부터 모든 이벤트 데이터를 불러와 달력에 표시하고 addedEvents 배열을 업데이트
    fetch("/get_events")
      .then(function (response) {
        return response.json();
      })
      .then(function (events) {
        events.forEach(function (event) {
          calendar.addEvent({
            title: event.event_type,
            start: event.date,
            allDay: true
          });
          addedEvents.push({ date: event.date, event_type: event.event_type }); // 이벤트 추가
        });
        updateStatistics(); // 초기 통계 정보 업데이트
      })
      .catch(function (error) {
        console.error("Error:", error);
      });
  
    calendar.render();
  
    document
      .getElementById("medicineTaken")
      .addEventListener("click", function () {
        addEvent("오약완😊");
      });
  
    document
      .getElementById("exerciseCompleted")
      .addEventListener("click", function () {
        addEvent("오운완😊");
      });
  
    function addEvent(eventType) {
      let now = new Date();
      let today = `${now.getFullYear()}-${(now.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;
  
      // 오늘 날짜에 대한 해당 이벤트가 이미 추가되었는지 확인
      if (
        addedEvents.some(
          (event) => event.date === today && event.event_type === eventType
        )
      ) {
        alert("내일 다시 와주세용~!!");
        return;
      }
  
      fetch("/add_event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user_id: "example_user",
          event_type: eventType,
          date: today
        })
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message);
          calendar.addEvent({
            title: eventType,
            start: today,
            allDay: true
          });
          addedEvents.push({ date: today, event_type: eventType }); // 이벤트 배열 업데이트
          updateStatistics(); // 이벤트 추가 후 통계 정보 업데이트
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  
    function updateStatistics() {
      fetch("/get_statistics?user_id=example_user")
        .then((response) => response.json())
        .then((data) => {
          document.getElementById("statistics").innerHTML = `오약완: ${
            data["오약완😊"] || 0
          }, 오운완: ${data["오운완😊"] || 0}`;
        })
        .catch((error) => console.error("Error:", error));
    }
  
    updateStatistics(); // 초기 통계 정보 업데이트
  });
  