export default function Announcements({ logs }) {
  const announcements = logs.filter(l => l.type === "NEW_ANNOUNCEMENT");

  return (
    <div>
      <h2>Live Announcements</h2>

      {announcements.length === 0 ? (
        <p>No announcements yet...</p>
      ) : (
        announcements.map((a, index) => (
          <div key={index} style={{
            background: "#eee",
            padding: "10px",
            margin: "10px 0",
            borderRadius: "6px"
          }}>
            {a.payload}
          </div>
        ))
      )}
    </div>
  );
}
