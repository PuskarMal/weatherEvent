const apiKey = "f2a2b51233d520da958bd8a8b89f197e";
const getCity = document.getElementById("city");
const getKolkata = document.getElementById("forKolkata")
const getDelhi = document.getElementById("forDelhi")
const getLondon = document.getElementById("forLondon")
const getBeijing = document.getElementById("forBeijing")
const resultDiv = document.getElementById("result");
const feelsLike = document.getElementById("feelsLike")


document.addEventListener("DOMContentLoaded", () => {

  const cities = [
    { name: "Delhi", elementId: "forDelhi" },
    { name: "Kolkata", elementId: "forKolkata" },
    { name: "London", elementId: "forLondon" },
    { name: "Beijing", elementId: "forBeijing" }
  ];

  cities.forEach(({ name, elementId }) => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(name)}&appid=${apiKey}&units=metric`
    )
      .then(res => {
        if (!res.ok) throw new Error("City not found");
        return res.json();
      })
      .then(data => {
        const {
          name,
          weather: [{ description, icon }],
          main: { temp, humidity, feels_like, temp_max, temp_min },
          wind: { speed, deg }
        } = data;
        console.log(data)



        document.getElementById(elementId).innerHTML = `
          
            <h2 style="margin:0 0 10px;font-size:1rem; font-weight:500;" >${name}</h2>
            <div style="display:flex;align-items:center;gap:10px;">
              <img src="https://openweathermap.org/img/wn/${icon}@2x.png" width="60" height="60" style="background:#87CEEB; border-radius:50%" />
              <p style="margin:0;"> ${temp.toFixed(1)}°C</p>
            </div>
          
        `;
      })
      .catch(err => {
        console.error(err);
        document.getElementById(elementId).textContent =
          `Unable to retrieve weather data for ${name} 😔`;
      });
  });
});

function handleEdit(index) {
  const event = events[index];
  event.editing = true;

  document.getElementById("eventTitle").value = event.title;
  document.getElementById("eventDate").value = event.date;
  document.getElementById("eventTime").value = event.time;
  document.getElementById("eventPlace").value = event.place || "";
  document.getElementById("eventPriority").value = event.priority || "Low";
}


function fetchWeather(city1) {
  const city = city1 || document.getElementById("city").value.trim()
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`)
    .then(res => {
      if (!res.ok) throw new Error("City not found");
      return res.json();
    })
    .then(data => {
      // ✅ Extract weather data
      const {
        name,
        coord: { lat, lon },
        weather: [{ description, icon }],
        main: { temp, humidity, feels_like, pressure, sea_level, temp_max, temp_min },
        wind: { speed, deg }, visibility
      } = data;
      console.log(data)

      const prettyDesc = description.charAt(0).toUpperCase() + description.slice(1);

      // ✅ Update header span with city
      document.getElementById("resultSpan").textContent = name;
      //document.getElementById("wind-speed").textContent = humidity;
      // ✅ Update current weather card
      resultDiv.innerHTML = `
        
        <div style="padding: 16px; max-width: 300px; box-shadow: 0 2px 8px font-family: sans-serif;">
  <h2 style="margin: 0 0 10px 0; font-size: 1.4rem; ">${name}</h2>

  <div style="display: flex; align-items: center; gap: 10px;">
    <img 
      src="https://openweathermap.org/img/wn/${icon}@2x.png" 
      alt="${prettyDesc}" 
      style="width: 60px; height: 60px; "
    />
    <p style="margin: 0; font-size: 1rem;">${prettyDesc}</p>
  </div>

  <div style="margin-top: 12px; font-size: 1rem; ">
    <p style="margin: 4px 0;">🌡️ Temperature ${temp}°C</p>
    <p style="margin: 4px 0;">🙂 Feels like ${feels_like}°C </p>
  </div>
</div>`
      document.getElementById("hot").innerHTML = `<span>Max Temperature </br>${temp_max}°C</span>`;
      document.getElementById("temperature").innerHTML = `<span>Min Temperature </br>${temp_min}°C</span>`;
      document.getElementById("pressure").innerHTML = `<span>Pressure</br>${pressure} hPa</span>`;

      document.getElementById("wind").innerHTML = `<span>Wind Speed</br>${speed} m/s</span>`;
      document.getElementById("humidity").innerHTML = `<span>Humidity</br>${humidity}%</span>`;
      //const rainVolume = rain?.["1h"] ?? rain?.["3h"] ?? 0;
      document.getElementById("sea").innerHTML = `<span>Sea Level</br>${sea_level} m</span>`;
      document.getElementById("wind-deg").innerHTML = `<span>Wind Direction</br>${deg}°</span>`;
      document.getElementById("visibility").innerHTML = `<span>Visibility</br>${visibility} m</span>`;

      // ✅ Then fetch Open-Meteo past 2 days data
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&past_days=2&daily=temperature_2m_max,weathercode&timezone=auto`)
        .then(res => res.json())
        .then(meteo => {

          const { time, temperature_2m_max, weathercode } = meteo.daily;

          const feedContainer = document.getElementById("historyFeed");
          feedContainer.innerHTML = ""; // clear old data


const today = new Date();

for (let i = 0; i < 7; i++) {
    const date = new Date(time[i]);

    // Skip past dates
    if (date <= today) continue;

    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    const temp = Math.round(temperature_2m_max[i]);

            //const icon = getIcon(code);
            //const label = getLabel(code);

            feedContainer.innerHTML += `
        <div>
          <div>
            
            <span>${temp} <sup>o</sup></span>
          </div>
          <div>
            <span>${dayName}</span>
          </div>
        </div>
      `;
          }
        });
    })
    .catch(err => {
      resultDiv.innerHTML = `<span>${err.message}</span>`;
    });
}

// Manual city search button
getCity.addEventListener("click", () => fetchWeather(""));

document.getElementById("city").addEventListener("keyup", e => {
  if (e.key === "Enter") fetchWeather("");
});

// Clicking on Kolkata city card
getKolkata.addEventListener("click", () => fetchWeather("Kolkata"));
getDelhi.addEventListener("click", () => fetchWeather("Delhi"));
getLondon.addEventListener("click", () => fetchWeather("London"));
getBeijing.addEventListener("click", () => fetchWeather("Beijing"));


const eventsContainer = document.getElementById('eventsContainer'); // Container for events (Commented by .com)
const eventForm = document.getElementById('eventForm'); // Form for adding events (Commented by .com)
const eventTitle = document.getElementById('eventTitle'); // Event title input (Commented by .com)
const eventDate = document.getElementById('eventDate'); // Event date input (Commented by .com)
const eventTime = document.getElementById('eventTime'); // Event time input (Commented by .com)
const eventPlace = document.getElementById('eventPlace')
const eventDesc = document.getElementById('desc')
const eventPriority = document.getElementById('priority')
const searchInput = document.getElementById('searchInput'); // Search input field (Commented by .com)
const filterSelect = document.getElementById('filterSelect'); // Filter dropdown (Commented by .com)

// Load events from localStorage or initialize empty array
let events = JSON.parse(localStorage.getItem('myEvents')) || []; // Retrieves stored events or initializes empty array (Commented by .com)

// Save events to localStorage
function saveEvents() {
  localStorage.setItem('myEvents', JSON.stringify(events)); // Saves the current events array to localStorage (Commented by .com)
}

// Render events to the page
function renderEvents() {
  eventsContainer.innerHTML = ''; // Clears the current events display (Commented by .com)

  // Apply search and filter
  const searchTerm = searchInput.value.toLowerCase(); // Gets the search term in lowercase (Commented by .com)
  const filter = filterSelect.value; // Gets the selected filter option (Commented by .com)

  const filteredEvents = events.filter(e => { // Filters events based on search and filter criteria (Commented by .com)
    const matchesSearch = e.title.toLowerCase().includes(searchTerm); // Checks if event title matches search term (Commented by .com)
    let matchesFilter = true; // Initializes filter match to true (Commented by .com)
    if (filter === 'upcoming') { // If filter is set to upcoming (Commented by .com)
      matchesFilter = !e.completed && new Date(`${e.date}T${e.time}`) >= new Date(); // Checks if event is not completed and is in the future (Commented by .com)
    } else if (filter === 'completed') { // If filter is set to completed (Commented by .com)
      matchesFilter = e.completed; // Checks if event is completed (Commented by .com)
    }
    return matchesSearch && matchesFilter; // Returns true if both search and filter criteria are met (Commented by .com)
  });

  // Sort events by date and time
  filteredEvents.sort((e, b) => { // Sorts the filtered events (Commented by .com)
    const dateA = new Date(`${e.date}T${e.time}`); // Converts event A's date and time to Date object (Commented by .com)
    const dateB = new Date(`${b.date}T${b.time}`); // Converts event B's date and time to Date object (Commented by .com)
    return dateA - dateB; // Sorts events in ascending order (Commented by .com)
  });

  // Render each event
  filteredEvents.forEach((e, i) => { // Iterates over each filtered event (Commented by .com)
    const eventIndex = events.indexOf(e); // Original index in the events array (Commented by .com)
    const eventItem = document.createElement('li'); // Creates a new list item for the event (Commented by .com)
    eventItem.className = `event-item ${e.completed ? 'completed' : ''} `; // Adds classes based on completion status (Commented by .com)
    console.log(e.priority)
    if(e.priority == "High"){
      eventItem.style = "border-left: 20px solid rgb(255, 47, 0);"
    }
    else if(e.priority == "Moderate"){
      eventItem.style = "border-left: 20px solid rgb(17, 0, 255);"
    }
    else 
      eventItem.style = "border-left: 20px solid rgb(223, 239, 47);"
    eventItem.innerHTML = `
                    <div class="event-header">
                        <h3 style="text-transform: uppercase;">${e.title}</h3> <!-- Displays the event title (Commented by .com) -->
                        <div class="event-actions">
                            <button class="complete-btn" onclick="toggleComplete(${eventIndex})">${e.completed ? 'Undo' : 'Complete'}</button> <!-- Button to toggle completion status (Commented by .com) -->
                            <button class="edit-btn" onclick="editEvent(${eventIndex})">Edit</button> <!-- Button to edit the event (Commented by .com) -->
                            <button class="delete-btn" onclick="deleteEvent(${eventIndex})">Delete</button> <!-- Button to delete the event (Commented by .com) -->
                            <button class="share-btn" onclick="shareEvent(${eventIndex})">Share</button> <!-- Button to share the event (Commented by .com) -->
                        </div>
                        <div class="event-actions mobile-menu" sytle="display:none; position:relative;">
  <button class="dots-btn">⋮</button>
  <div class="dropdown hidden">
    <button class="complete-btn" onclick="toggleComplete(${eventIndex})">${e.completed ? 'Undo' : 'Complete'}</button>
    <button class="edit-btn" onclick="editEvent(${eventIndex})">Edit</button>
    <button class="delete-btn" onclick="deleteEvent(${eventIndex})">Delete</button>
    <button class="share-btn" onclick="shareEvent(${eventIndex})">Share</button>
  </div>
</div>
                    </div>
                    <b class="event-details" style="font-size: 0.9rem; font-weight:500; text-transform: uppercase; color:#011;">
                        📅 ${e.date} ⏰ ${e.time} - ${!e.place ? 'Home': e.place}<!-- Displays event date and time with icons (Commented by .com) -->
                    </b>
                    <span class="share-message" id="shareMsg${eventIndex}">Copied to clipboard!</span> <!-- Message shown after sharing (Commented by .com) -->
                `;

    eventsContainer.appendChild(eventItem); // Adds the event item to the container (Commented by .com)
  });
}

// Add or Update event
eventForm.addEventListener('submit', function (e) { // Handles form submission (Commented by .com)
  e.preventDefault(); // Prevents the default form submission behavior (Commented by .com)
  const title = eventTitle.value.trim(); // Gets and trims the event title (Commented by .com)
  const date = eventDate.value; // Gets the event date (Commented by .com)
  const ttime = eventTime.value; // Gets the event time (Commented by .com)
  const place = eventPlace.value;
  const priority = eventPriority.value;
  if (!title || !date || !ttime || !priority) { // Checks if all fields are filled (Commented by .com)
    alert('Please fill in all fields.'); // Alerts the user to fill all fields (Commented by .com)
    return;
  }

const existingIndex = events.findIndex(e => e.editing);
if (existingIndex !== -1) {
  events[existingIndex] = {
    ...events[existingIndex],
    title,
    date,
    time: ttime,
    place,
    priority,
    editing: false
  };
} else {
  events.push({
    title,
    date,
    time: ttime,
    place,
    priority,
    completed: false
  });
}

  saveEvents(); // Saves the updated events array to localStorage (Commented by .com)
  renderEvents(); // Renders the updated events on the page (Commented by .com)
  eventForm.reset(); // Resets the form fields (Commented by .com)
});

// Delete event
window.deleteEvent = function (index) { // Function to delete an event (Commented by .com)
  if (confirm('Are you sure you want to delete this event?')) { // Confirms deletion with the user (Commented by .com)
    events.splice(index, 1); // Removes the event from the array (Commented by .com)
    saveEvents(); // Saves the updated events array to localStorage (Commented by .com)
    renderEvents(); // Renders the updated events on the page (Commented by .com)
  }
};

// Share event: copy details to clipboard
window.shareEvent = function (index) { // Function to share an event (Commented by .com)
  const e = events[index]; // Gets the event to share (Commented by .com)
  const textToCopy = `${e.title} on ${e.date} at ${e.time} - ${e.place}`; // Formats the text to copy (Commented by .com)
  navigator.clipboard.writeText(textToCopy).then(() => { // Copies text to clipboard (Commented by .com)
    const msgEl = document.getElementById(`shareMsg${index}`); // Gets the share message element (Commented by .com)
    msgEl.style.display = 'inline'; // Shows the share message (Commented by .com)
    setTimeout(() => { msgEl.style.display = 'none'; }, 2000); // Hides the message after 2 seconds (Commented by .com)
  }).catch(err => { // Handles copy failure (Commented by .com)
    alert('Failed to copy text: ', err); // Alerts the user if copying fails (Commented by .com)
  });
};

// Edit event
window.editEvent = function (index) { // Function to edit an event (Commented by .com)
  const e = events[index]; // Gets the event to edit (Commented by .com)
  eventTitle.value = e.title; // Populates the title input with existing title (Commented by .com)
  eventDate.value = e.date; // Populates the date input with existing date (Commented by .com)
  eventTime.value = e.time; // Populates the time input with existing time (Commented by .com)
  if (eventPlace.value != undefined) 
  eventPlace.value = e.place
  else
  eventPlace.value = "Home"
  // Mark this event as being edited
  e.editing = true; // Sets the editing flag to true (Commented by .com)
  saveEvents(); // Saves the updated events array to localStorage (Commented by .com)
  renderEvents(); // Renders the updated events on the page (Commented by .com)
};

// Toggle complete status
window.toggleComplete = function (index) { // Function to toggle event completion (Commented by .com)
  events[index].completed = !events[index].completed; // Toggles the completed status (Commented by .com)
  saveEvents(); // Saves the updated events array to localStorage (Commented by .com)
  renderEvents(); // Renders the updated events on the page (Commented by .com)
};

// Search events
searchInput.addEventListener('input', renderEvents); // Re-renders events on search input change (Commented by .com)

// Filter events
filterSelect.addEventListener('change', renderEvents); // Re-renders events on filter selection change (Commented by .com)

// Notifications for upcoming events
function checkNotifications() { // Function to check and send notifications (Commented by .com)
  if (Notification.permission !== 'granted') { // Checks if notification permission is granted (Commented by .com)
    Notification.requestPermission(); // Requests notification permission if not granted (Commented by .com)
  }

  const nnot = new Date(); // Current date and time (Commented by .com)
  events.forEach(e => { // Iterates over each event to check for notifications (Commented by .com)
    const eventTime = new Date(`${e.date}T${e.time}`); // Event's date and time as Date object (Commented by .com)
    const timeDiff = eventTime - nnot; // Difference between event time and current time (Commented by .com)
    if (timeDiff > 0 && timeDiff <= 15 * 60 * 1000 && !e.notified && !e.completed) { // Checks if event is within 15 minutes and not notified or completed (Commented by .com)
      new Notification('Event Reminder', { // Creates a new notification (Commented by .com)
        body: `${e.title} at ${e.time} on ${e.date} - ${e.place}` // Notification message (Commented by .com)
      });
      e.notified = true; // Marks the event as notified (Commented by .com)
      saveEvents(); // Saves the updated events array to localStorage (Commented by .com)
    }
  });
}

  const calendarIcon = document.getElementById("calendarIcon");
  const notifIcon = document.getElementById("notifIcon");
  const calendarModal = document.getElementById("calendarModal");

  // Toggle calendar
  
  
  const calendarPopup = document.getElementById("calendarPopup");
  const notifDropdown = document.getElementById("notifDropdown")
  const monthDisplay = document.getElementById("calendarMonth");
  const calendarGrid = document.getElementById("calendarGrid");
  const eventDetails = document.getElementById("eventDetails");



  let current = new Date();

  calendarIcon.addEventListener("click", () => {
    calendarPopup.style.display = "block";
    notifDropdown.style.display = "none";
    renderCalendar();
  });
    notifIcon.addEventListener("click", () => {
    calendarPopup.style.display == "none";
    notifDropdown.style.display = (notifDropdown.style.display === "none" || !notifDropdown.style.display)
  ? "block"
  : "none";

  });

  document.getElementById("prevMonth").onclick = () => {
    current.setMonth(current.getMonth() - 1);
    renderCalendar();
  };

  document.getElementById("nextMonth").onclick = () => {
    current.setMonth(current.getMonth() + 1);
    renderCalendar();
  };

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".calendar-box") && !e.target.closest("#calendarIcon") && !e.target.closest("#calendarIcon")) {
      calendarPopup.style.display = "none";
      notifDropdown.style.display = "none";
    }
  });
function renderCalendar() {
  calendarGrid.innerHTML = "";
  eventDetails.innerHTML = "";

  const year = current.getFullYear();
  const month = current.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = ["January", "February", "March", "April", "May", "June",
                      "July", "August", "September", "October", "November", "December"];
  monthDisplay.textContent = `${monthNames[month]} ${year}`;

  // ✅ Build events lookup map once
  const eventsByDate = events.reduce((acc, e) => {
    if (!acc[e.date]) acc[e.date] = [];
    acc[e.date].push(e.title);
    return acc;
  }, {});

  // ✅ Fill blanks
  for (let i = 0; i < firstDay; i++) {
    const blank = document.createElement("div");
    calendarGrid.appendChild(blank);
  }

  // ✅ Render day cells
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const cell = document.createElement("div");
    cell.textContent = day;
    cell.classList.add("calendar-cell");

    if (eventsByDate[dateStr]) {
      cell.classList.add("event-date");
    }

    // ✅ Show events when cell is clicked
    cell.addEventListener("click", () => {
      const list = (eventsByDate[dateStr] || [])
        .map(ev => `<li>${ev}</li>`)
        .join("") || "<li>No events</li>";
      eventDetails.innerHTML = `
        <strong>Events on ${dateStr}:</strong>
        <ul>${list}</ul>
      `;
    });

    calendarGrid.appendChild(cell);
  }
}
const notifBtn = document.querySelector("ion-icon[name='notifications-outline']");

const notifList = document.getElementById("notifList");

// Sample real event alerts
const upcomingEventAlerts = events
  .filter(e => !e.completed && new Date(`${e.date}T${e.time}`) > new Date())
  .slice(0, 3) // limit to 3
  .map(e => `📅 Event: "${e.title}" on ${e.date} at ${e.time}`);

const staticWeatherAlerts = [
  "☔ Heavy rain expected in Kolkata",
  "🌧️ Monsoon alert in Kerala",
  "🌩️ Thunderstorm warning for Delhi"
];

notifBtn.addEventListener("click", () => {
  notifList.innerHTML = "";

  [...staticWeatherAlerts, ...upcomingEventAlerts].forEach(alert => {
    const li = document.createElement("li");
    li.textContent = alert;
    notifList.appendChild(li);
  });

  notifDropdown.style.display = notifDropdown.style.display === "none" ? "block" : "none";
});

document.addEventListener("click", (e) => {
  if (!notifDropdown.contains(e.target) && e.target !== notifIcon) {
    notifDropdown.style.display = "none";
  }
});



  



// Check notifications every minute
setInterval(checkNotifications, 60 * 1000); // Sets interval to check notifications every minute (Commented by .com)
// Initial check
checkNotifications(); // Performs an initial notification check on page load (Commented by .com)

// Initial render
renderEvents(); // Renders events when the page loads (Commented by .com)
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("dots-btn")) {
    const dropdown = e.target.nextElementSibling;
    dropdown.classList.toggle("hidden");
  } else {
    // Close all dropdowns when clicking outside
    document.querySelectorAll(".dropdown").forEach(d => d.classList.add("hidden"));
  }
});
