
import { useState } from "react";
import "./ResponderDashboard.css";

const initialTasks = [
  {
    id: "SHY-103",
    type: "Security Assistance",
    location: "A Block · Ground Floor",
    reporter: "Rahul Verma",
    time: "09:15 AM",
    priority: "Urgent",
    status: "Assigned",
    description: "Suspicious activity reported near the main corridor.",
  },
  {
    id: "SHY-101",
    type: "Medical Emergency",
    location: "Hostel North · Room 204",
    reporter: "Ananya Shah",
    time: "08:50 AM",
    priority: "Urgent",
    status: "On The Way",
    description: "A student has requested immediate medical assistance.",
  },
  {
    id: "SHY-102",
    type: "Safety Hazard",
    location: "Central Library",
    reporter: "Arjun Singh",
    time: "08:20 AM",
    priority: "Normal",
    status: "Resolved",
    description: "A damaged electrical socket was reported.",
  },
];

const navItems = [
  ["My Overview", "▦"],
  ["Assigned Incidents", "◉"],
  ["My Activity", "◷"],
];

const statusOptions = [
  "Assigned",
  "Accepted",
  "On The Way",
  "On Scene",
  "Resolved",
];

export default function ResponderDashboard() {
  const [page, setPage] = useState("My Overview");
  const [tasks, setTasks] = useState(initialTasks);
  const [available, setAvailable] = useState(true);
  const [filter, setFilter] = useState("All");
  const [notice, setNotice] = useState("");

  const pending = tasks.filter(
    (task) => task.status !== "Resolved"
  ).length;

  const completed = tasks.filter(
    (task) => task.status === "Resolved"
  ).length;

  const urgent = tasks.filter(
    (task) =>
      task.priority === "Urgent" &&
      task.status !== "Resolved"
  ).length;

  function updateTask(id, status) {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === id ? { ...task, status } : task
      )
    );

    setNotice(`${id} updated: ${status}`);
  }

  function changePage(name) {
    setPage(name);
    setNotice("");
    setFilter("All");
  }

  const visibleTasks = tasks.filter((task) => {
    if (page === "My Activity") {
      return task.status === "Resolved";
    }

    if (filter === "All") return true;
    return task.status === filter;
  });

  return (
    <div className="rd-app">
      <aside className="rd-sidebar">
        <div className="rd-brand">
          <div className="rd-brand-icon">S</div>
          <div>
            <h2>SAHAYAK</h2>
            <p>Responder Operations</p>
          </div>
        </div>

        <div className="rd-profile">
          <div className="rd-profile-avatar">RS</div>
          <div>
            <h3>Responder Staff</h3>
            <p>Emergency Response Team</p>
          </div>
          <span className="rd-profile-dot" />
        </div>

        <p className="rd-label">WORKSPACE</p>

        <nav className="rd-nav">
          {navItems.map(([name, icon]) => (
            <button
              key={name}
              className={page === name ? "rd-nav-link active" : "rd-nav-link"}
              onClick={() => changePage(name)}
            >
              <span>{icon}</span>
              {name}
              {name === "Assigned Incidents" && pending > 0 && (
                <small>{pending}</small>
              )}
            </button>
          ))}
        </nav>

        <div className="rd-sidebar-card">
          <span className="rd-sidebar-symbol">✦</span>
          <h3>Stay Alert.</h3>
          <p>Every second matters. Respond quickly and keep the campus safe.</p>
        </div>

        <div className="rd-sidebar-footer">
          <span /> Secure responder access
        </div>
      </aside>

      <main className="rd-main">
        <header className="rd-topbar">
          <div>
            <span>Responder Portal</span>
            <b>/ {page}</b>
          </div>

          <div className="rd-top-right">
            <span className="rd-shift-tag">● Active Shift</span>
            <div className="rd-top-avatar">RS</div>
          </div>
        </header>

        {notice && (
          <div className="rd-notice" role="status">
            {notice}
            <button onClick={() => setNotice("")}>×</button>
          </div>
        )}

        {page === "My Overview" && (
          <>
            <section className="rd-hero">
              <div>
                <p className="rd-eyebrow">FIELD OPERATIONS / 01</p>
                <h1>Ready to Respond?</h1>
                <p>
                  Welcome back, Responder. Your campus response
                  assignments are waiting.
                </p>
                <button onClick={() => changePage("Assigned Incidents")}>
                  View assigned incidents →
                </button>
              </div>
              <div className="rd-hero-art">
                <div className="rd-hero-ring">✚</div>
                <span className="rd-hero-orbit orbit-one" />
                <span className="rd-hero-orbit orbit-two" />
              </div>
            </section>

            <section className="rd-availability">
              <div>
                <div className="rd-availability-icon">⌁</div>
                <div>
                  <h3>Your availability</h3>
                  <p>
                    {available
                      ? "You are available for new assignments."
                      : "You are currently unavailable for new assignments."}
                  </p>
                </div>
              </div>

              <button
                className={available ? "rd-toggle on" : "rd-toggle"}
                onClick={() => {
                  setAvailable(!available);
                  setNotice(
                    !available
                      ? "You are now available."
                      : "You are now marked unavailable."
                  );
                }}
                aria-label="Toggle availability"
              >
                <span />
                {available ? "Available" : "Unavailable"}
              </button>
            </section>

            <section className="rd-stats">
              <Stat icon="◉" label="Assigned Cases" value={tasks.length} color="cyan" />
              <Stat icon="⚡" label="Urgent Cases" value={urgent} color="amber" />
              <Stat icon="◷" label="Pending Cases" value={pending} color="blue" />
              <Stat icon="✓" label="Resolved Cases" value={completed} color="green" />
            </section>

            <section className="rd-panel">
              <div className="rd-panel-heading">
                <div>
                  <h2>Priority Assignments</h2>
                  <p>Cases that need your attention.</p>
                </div>
                <button onClick={() => changePage("Assigned Incidents")}>
                  View all →
                </button>
              </div>

              <div className="rd-task-list">
                {tasks.filter((task) => task.status !== "Resolved").map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onUpdate={updateTask}
                  />
                ))}
                {pending === 0 && <p className="rd-empty">No pending assignments.</p>}
              </div>
            </section>
          </>
        )}

        {page === "Assigned Incidents" && (
          <PageHeading
            title="Assigned Incidents"
            subtitle="Review and update the emergency cases assigned to you."
            eyebrow="FIELD TASKS / 02"
          >
            <div className="rd-panel">
              <div className="rd-filter-row">
                <h2>All Assignments</h2>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option>All</option>
                  {statusOptions.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div className="rd-task-list">
                {visibleTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onUpdate={updateTask}
                  />
                ))}
                {visibleTasks.length === 0 && (
                  <p className="rd-empty">No incidents match this filter.</p>
                )}
              </div>
            </div>
          </PageHeading>
        )}

        {page === "My Activity" && (
          <PageHeading
            title="My Activity"
            subtitle="Your completed response assignments."
            eyebrow="RESPONSE HISTORY / 03"
          >
            <div className="rd-panel">
              <div className="rd-panel-heading">
                <div>
                  <h2>Completed Cases</h2>
                  <p>Your resolved incident records.</p>
                </div>
                <span className="rd-completed-count">{completed} Completed</span>
              </div>

              {visibleTasks.map((task) => (
                <div className="rd-history-item" key={task.id}>
                  <div className="rd-history-check">✓</div>
                  <div>
                    <h3>{task.type}</h3>
                    <p>{task.id} · {task.location}</p>
                  </div>
                  <span>Resolved</span>
                </div>
              ))}

              {visibleTasks.length === 0 && (
                <p className="rd-empty">No completed cases yet.</p>
              )}
            </div>
          </PageHeading>
        )}

        <footer className="rd-footer">
          <span>© 2026 SAHAYAK Campus Safety</span>
          <span>Responder Operations · Demo v1.0</span>
        </footer>
      </main>
    </div>
  );
}

function Stat({ icon, label, value, color }) {
  return (
    <div className="rd-stat">
      <div className={`rd-stat-icon ${color}`}>{icon}</div>
      <div>
        <p>{label}</p>
        <h2>{value}</h2>
      </div>
    </div>
  );
}

function PageHeading({ title, subtitle, eyebrow, children }) {
  return (
    <section className="rd-page">
      <p className="rd-eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="rd-page-subtitle">{subtitle}</p>
      {children}
    </section>
  );
}

function TaskCard({ task, onUpdate }) {
  const nextAction = {
    Assigned: ["Accept", "Accepted"],
    Accepted: ["Start Response", "On The Way"],
    "On The Way": ["Mark On Scene", "On Scene"],
    "On Scene": ["Resolve Case", "Resolved"],
  };

  const action = nextAction[task.status];

  return (
    <article className="rd-task-card">
      <div className="rd-task-top">
        <div className="rd-task-symbol">
          {task.type.includes("Medical")
            ? "✚"
            : task.type.includes("Security")
            ? "⚑"
            : "⚠"}
        </div>

        <div className="rd-task-title">
          <div>
            <h3>{task.type}</h3>
            <span>{task.id}</span>
          </div>
          <span className={`rd-priority ${task.priority.toLowerCase()}`}>
            {task.priority}
          </span>
        </div>
      </div>

      <p className="rd-task-description">{task.description}</p>

      <div className="rd-task-meta">
        <span>⌖ {task.location}</span>
        <span>♙ {task.reporter}</span>
        <span>◷ {task.time}</span>
      </div>

      <div className="rd-task-bottom">
        <span className={`rd-status ${task.status.toLowerCase().replaceAll(" ", "-")}`}>
          {task.status}
        </span>

        {action ? (
          <button
            onClick={() => onUpdate(task.id, action[1])}
          >
            {action[0]} →
          </button>
        ) : (
          <span className="rd-done">✓ Case completed</span>
        )}
      </div>
    </article>
  );
}
