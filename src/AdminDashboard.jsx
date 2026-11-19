
import { useMemo, useState } from "react";
import "./AdminDashboard.css";

const initialIncidents = [
  { id: "SHY-103", type: "Security", zone: "A Block", reporter: "Rahul Verma", time: "09:15 AM", priority: "Urgent", status: "On Scene" },
  { id: "SHY-101", type: "Medical", zone: "Hostel North", reporter: "Ananya Shah", time: "08:50 AM", priority: "Urgent", status: "Reported" },
  { id: "SHY-104", type: "Medical", zone: "C Block", reporter: "Riya Sharma", time: "08:35 AM", priority: "Urgent", status: "Reported" },
  { id: "SHY-102", type: "Hazard", zone: "Library", reporter: "Arjun Singh", time: "08:20 AM", priority: "Watch", status: "On The Way" },
  { id: "SHY-100", type: "Fire", zone: "Cafeteria", reporter: "Neha Gupta", time: "Yesterday", priority: "Urgent", status: "Resolved" },
];

const responders = [
  { name: "Aman Sharma", role: "Security Team", zone: "A Block", status: "Available", initials: "AS" },
  { name: "Priya Singh", role: "Medical Team", zone: "Hostel North", status: "On Duty", initials: "PS" },
  { name: "Karan Mehta", role: "Fire Safety", zone: "Main Gate", status: "Available", initials: "KM" },
  { name: "Neha Verma", role: "Security Team", zone: "C Block", status: "On Duty", initials: "NV" },
];

const menuItems = [
  ["Overview", "▦"],
  ["Incident Management", "◉"],
  ["Student Reports", "▤"],
  ["Responders", "♙"],
  ["Campus Zones", "⌖"],
  ["Analytics", "▥"],
];

export default function AdminDashboard() {
  const [page, setPage] = useState("Overview");
  const [incidents, setIncidents] = useState(initialIncidents);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");

  const urgentCount = incidents.filter(
    (item) => item.priority === "Urgent" && item.status !== "Resolved"
  ).length;

  const openCount = incidents.filter(
    (item) => item.status !== "Resolved"
  ).length;

  const resolvedCount = incidents.filter(
    (item) => item.status === "Resolved"
  ).length;

  const filteredIncidents = useMemo(() => {
    return incidents.filter((item) => {
      const matchesFilter = filter === "All" || item.status === filter;
      const query = search.toLowerCase();
      const matchesSearch =
        item.id.toLowerCase().includes(query) ||
        item.type.toLowerCase().includes(query) ||
        item.zone.toLowerCase().includes(query) ||
        item.reporter.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [incidents, filter, search]);

  function updateStatus(id, newStatus) {
    setIncidents((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
    setNotice(`${id} status updated to ${newStatus}.`);
  }

  function navigate(name) {
    setPage(name);
    setNotice("");
    setFilter("All");
    setSearch("");
  }

  return (
    <div className="ad-app">
      <aside className="ad-sidebar">
        <div className="ad-brand">
          <div className="ad-brand-icon">स</div>
          <div>
            <h2>Sahayak</h2>
            <p>Admin Control Center</p>
          </div>
        </div>

        <div className="ad-admin-profile">
          <div className="ad-avatar">AD</div>
          <div>
            <h4>Campus Admin</h4>
            <p>Administrator</p>
          </div>
          <span className="ad-online" />
        </div>

        <p className="ad-menu-label">ADMINISTRATION</p>

        <nav className="ad-navigation">
          {menuItems.map(([name, icon]) => (
            <button
              key={name}
              className={page === name ? "ad-nav-item active" : "ad-nav-item"}
              onClick={() => navigate(name)}
            >
              <span className="ad-nav-icon">{icon}</span>
              {name}
              {name === "Incident Management" && openCount > 0 && (
                <span className="ad-nav-count">{openCount}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="ad-sidebar-alert">
          <span>⚡</span>
          <h3>Emergency desk</h3>
          <p>Monitor reports and coordinate campus response.</p>
          <button onClick={() => navigate("Incident Management")}>
            View incidents →
          </button>
        </div>

        <div className="ad-sidebar-footer">
          <span /> Admin access · Demo mode
        </div>
      </aside>

      <main className="ad-main">
        <header className="ad-topbar">
          <div className="ad-breadcrumb">
            Admin Portal <span>/</span> <strong>{page}</strong>
          </div>

          <div className="ad-top-actions">
            <div className="ad-campus-tag"><span /> KRMU Campus</div>
            <button
              className="ad-bell"
              onClick={() => setNotice("No new admin notifications.")}
              aria-label="Notifications"
            >
              ♧
            </button>
            <div className="ad-top-avatar">AD</div>
          </div>
        </header>

        {notice && (
          <div className="ad-notice" role="status">
            {notice}
            <button onClick={() => setNotice("")}>×</button>
          </div>
        )}

        {page === "Overview" && (
          <>
            <section className="ad-welcome">
              <div>
                <p className="ad-eyebrow">ADMINISTRATION DASHBOARD</p>
                <h1>Campus Safety Overview</h1>
                <p>
                  Monitor campus incidents, manage responders and keep
                  everyone informed.
                </p>
              </div>
              <div className="ad-welcome-symbol">✦</div>
              <button onClick={() => navigate("Incident Management")}>
                Manage incidents →
              </button>
            </section>

            <section className="ad-stats">
              <StatCard icon="◉" title="Total Incidents" value={incidents.length} note="All recorded reports" color="teal" />
              <StatCard icon="⚡" title="Urgent Cases" value={urgentCount} note="Require attention" color="orange" />
              <StatCard icon="✓" title="Resolved Cases" value={resolvedCount} note="Marked as resolved" color="green" />
              <StatCard icon="♙" title="Active Responders" value={responders.length} note="Registered in demo" color="blue" />
            </section>

            <div className="ad-overview-grid">
              <section className="ad-panel">
                <div className="ad-panel-heading">
                  <div>
                    <h2>Incident Overview</h2>
                    <p>Current incident distribution by category.</p>
                  </div>
                  <span className="ad-heading-icon">▥</span>
                </div>

                <div className="ad-category-list">
                  {["Fire", "Medical", "Security", "Hazard"].map((type) => {
                    const count = incidents.filter((item) => item.type === type).length;
                    const percentage = incidents.length
                      ? (count / incidents.length) * 100
                      : 0;

                    return (
                      <div className="ad-category-row" key={type}>
                        <div className="ad-category-top">
                          <strong>{type}</strong>
                          <span>{count} reports</span>
                        </div>
                        <div className="ad-progress">
                          <span style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="ad-panel">
                <div className="ad-panel-heading">
                  <div>
                    <h2>Responder Availability</h2>
                    <p>Registered response team overview.</p>
                  </div>
                  <button onClick={() => navigate("Responders")}>View all →</button>
                </div>

                <div className="ad-responder-summary">
                  <div className="ad-responder-number">
                    <strong>{responders.filter((r) => r.status === "Available").length}</strong>
                    <span>Available</span>
                  </div>
                  <div className="ad-responder-number">
                    <strong>{responders.filter((r) => r.status === "On Duty").length}</strong>
                    <span>On duty</span>
                  </div>
                </div>

                {responders.slice(0, 3).map((person) => (
                  <div className="ad-mini-responder" key={person.name}>
                    <div className="ad-responder-avatar">{person.initials}</div>
                    <div>
                      <strong>{person.name}</strong>
                      <p>{person.role}</p>
                    </div>
                    <span className={`ad-responder-status ${person.status === "Available" ? "available" : "onduty"}`}>
                      {person.status}
                    </span>
                  </div>
                ))}
              </section>
            </div>

            <section className="ad-panel ad-recent-panel">
              <div className="ad-panel-heading">
                <div>
                  <h2>Recent Incidents</h2>
                  <p>Latest reports submitted on campus.</p>
                </div>
                <button onClick={() => navigate("Incident Management")}>Manage all →</button>
              </div>
              <IncidentTable
                incidents={incidents.slice(0, 4)}
                onUpdate={updateStatus}
              />
            </section>
          </>
        )}

        {page === "Incident Management" && (
          <PageSection
            eyebrow="RESPONSE OPERATIONS"
            title="Incident Management"
            subtitle="Review incoming reports and update their response status."
          >
            <div className="ad-panel">
              <div className="ad-toolbar">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search ID, type, zone or reporter..."
                />
                <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                  <option>All</option>
                  <option>Reported</option>
                  <option>On The Way</option>
                  <option>On Scene</option>
                  <option>Resolved</option>
                </select>
              </div>
              <IncidentTable incidents={filteredIncidents} onUpdate={updateStatus} />
              {filteredIncidents.length === 0 && (
                <p className="ad-empty">No matching incidents found.</p>
              )}
            </div>
          </PageSection>
        )}

        {page === "Student Reports" && (
          <PageSection
            eyebrow="REPORT REVIEW"
            title="Student Reports"
            subtitle="Reports submitted by students in this prototype."
          >
            <div className="ad-panel">
              <IncidentTable incidents={incidents} onUpdate={updateStatus} />
            </div>
          </PageSection>
        )}

        {page === "Responders" && (
          <PageSection
            eyebrow="RESPONSE TEAM"
            title="Responder Management"
            subtitle="View the availability of registered campus responders."
          >
            <div className="ad-responder-grid">
              {responders.map((person) => (
                <div className="ad-panel ad-person-card" key={person.name}>
                  <div className="ad-person-avatar">{person.initials}</div>
                  <h3>{person.name}</h3>
                  <p>{person.role}</p>
                  <div className="ad-person-zone">⌖ {person.zone}</div>
                  <span className={`ad-responder-status ${person.status === "Available" ? "available" : "onduty"}`}>
                    {person.status}
                  </span>
                </div>
              ))}
            </div>
          </PageSection>
        )}

        {page === "Campus Zones" && (
          <PageSection
            eyebrow="CAMPUS DIRECTORY"
            title="Campus Zones"
            subtitle="Overview of the campus areas used in incident reports."
          >
            <div className="ad-zone-grid">
              {[
                ["A Block", "Academic building", "🏢"],
                ["C Block", "Academic building", "🏫"],
                ["Library", "Study and reading area", "📚"],
                ["Hostel North", "Student accommodation", "🏠"],
                ["Hostel South", "Student accommodation", "🏠"],
                ["Cafeteria", "Food and dining area", "🍽️"],
                ["Main Gate", "Campus entrance", "🚪"],
                ["Parking Area", "Vehicle parking", "🅿️"],
              ].map(([name, detail, icon]) => (
                <div className="ad-panel ad-zone-card" key={name}>
                  <span>{icon}</span>
                  <h3>{name}</h3>
                  <p>{detail}</p>
                  <small>Incident reports: {incidents.filter((i) => i.zone === name).length}</small>
                </div>
              ))}
            </div>
          </PageSection>
        )}

        {page === "Analytics" && (
          <PageSection
            eyebrow="CAMPUS INSIGHTS"
            title="Safety Analytics"
            subtitle="A summary of incident activity in the current demo data."
          >
            <div className="ad-stats">
              <StatCard icon="◉" title="Total Reports" value={incidents.length} note="Recorded in this demo" color="teal" />
              <StatCard icon="⚡" title="Urgent Reports" value={urgentCount} note="Unresolved urgent cases" color="orange" />
              <StatCard icon="✓" title="Resolved" value={resolvedCount} note="Completed reports" color="green" />
            </div>
            <div className="ad-panel">
              <div className="ad-panel-heading">
                <div>
                  <h2>Category Breakdown</h2>
                  <p>Number of reports in each category.</p>
                </div>
              </div>
              {["Fire", "Medical", "Security", "Hazard"].map((type) => (
                <div className="ad-category-row" key={type}>
                  <div className="ad-category-top">
                    <strong>{type}</strong>
                    <span>{incidents.filter((i) => i.type === type).length}</span>
                  </div>
                  <div className="ad-progress">
                    <span
                      style={{
                        width: `${incidents.length ? incidents.filter((i) => i.type === type).length / incidents.length * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="ad-demo-note">
              Analytics are calculated from sample data in this browser session,
              not from a live campus database.
            </p>
          </PageSection>
        )}

        <footer className="ad-footer">
          <span>© 2026 Sahayak Campus Safety</span>
          <span>Admin Control Center · Prototype v1.0</span>
        </footer>
      </main>
    </div>
  );
}

function StatCard({ icon, title, value, note, color }) {
  return (
    <div className="ad-stat-card">
      <div className={`ad-stat-icon ${color}`}>{icon}</div>
      <div>
        <p>{title}</p>
        <h2>{value}</h2>
        <span>{note}</span>
      </div>
    </div>
  );
}

function PageSection({ eyebrow, title, subtitle, children }) {
  return (
    <section className="ad-page-content">
      <div className="ad-page-heading">
        <p className="ad-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

function IncidentTable({ incidents, onUpdate }) {
  return (
    <div className="ad-table-wrap">
      <table className="ad-table">
        <thead>
          <tr>
            <th>Incident</th>
            <th>Category / Zone</th>
            <th>Reporter</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Update status</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((item) => (
            <tr key={item.id}>
              <td><strong>{item.id}</strong><small>{item.time}</small></td>
              <td>{item.type}<small>{item.zone}</small></td>
              <td>{item.reporter}</td>
              <td>
                <span className={`ad-priority ${item.priority.toLowerCase()}`}>
                  {item.priority}
                </span>
              </td>
              <td>
                <span className={`ad-table-status ${item.status.toLowerCase().replaceAll(" ", "-")}`}>
                  {item.status}
                </span>
              </td>
              <td>
                <select
                  aria-label={`Update status for ${item.id}`}
                  value={item.status}
                  onChange={(e) => onUpdate(item.id, e.target.value)}
                >
                  <option>Reported</option>
                  <option>On The Way</option>
                  <option>On Scene</option>
                  <option>Resolved</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
