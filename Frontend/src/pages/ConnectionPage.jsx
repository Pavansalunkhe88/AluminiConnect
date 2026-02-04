import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/*
STATUS FLOW (LIKE LINKEDIN)
request   -> Accept / Ignore
none      -> Connect
sent      -> Pending
connected -> Message
*/

const Connections = () => {
  const navigate = useNavigate();

  const [people, setPeople] = useState([
    {
      id: 1,
      name: "Dr. Sarah Chen",
      role: "Professor",
      affiliation: "Computer Science Dept.",
      avatar: "https://ui-avatars.com/api/?name=Sarah+Chen",
      mutualCount: 12,
      status: "request"
    },
    {
      id: 2,
      name: "Priya Sharma",
      role: "Final Year Student",
      affiliation: "Information Technology",
      avatar: "https://ui-avatars.com/api/?name=Priya+Sharma",
      mutualCount: 8,
      status: "connected"
    },
    {
      id: 3,
      name: "Alex Thompson",
      role: "Software Engineer",
      affiliation: "Alumni",
      avatar: "https://ui-avatars.com/api/?name=Alex+Thompson",
      mutualCount: 5,
      status: "none"
    }
  ]);

  /* UPDATE STATUS */
  const updateStatus = (id, status) => {
    setPeople(prev =>
      prev.map(p =>
        p.id === id ? { ...p, status } : p
      )
    );
  };

  /* GROUP USERS */
  const requests = people.filter(p => p.status === "request");
  const connections = people.filter(p => p.status === "connected");
  const suggestions = people.filter(
    p => p.status === "none" || p.status === "sent"
  );

  /* CARD COMPONENT */
  const Card = ({ person, action }) => (
    <div
      onClick={() => navigate(`/profile/${person.id}`)}
      className="w-full bg-white border border-gray-200 rounded-md
                 hover:shadow-sm transition cursor-pointer"
    >
      <div className="flex items-center gap-3 px-4 py-3">

        {/* AVATAR */}
        <img
          src={person.avatar}
          alt={person.name}
          className="w-10 h-10 rounded-full"
        />

        {/* INFO */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {person.name}
          </p>

          {/* ROLE + AFFILIATION (FOR ALL USERS) */}
          <p className="text-xs text-gray-600 truncate">
            {person.role} • {person.affiliation}
          </p>

          {/* MUTUAL CONNECTIONS */}
          <p className="text-[11px] text-gray-500 mt-0.5">
            {person.mutualCount} mutual connections
          </p>
        </div>

        {/* ACTION AREA */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-2"
        >
          {action}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f3f2ef] py-6">
      <div className="max-w-3xl mx-auto px-4">

        {/* INVITATIONS */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">
            Invitations
          </h2>

          {requests.length === 0 && (
            <p className="text-xs text-gray-500">
              No pending invitations
            </p>
          )}

          <div className="space-y-2">
            {requests.map(p => (
              <Card
                key={p.id}
                person={p}
                action={
                  <>
                    <button
                      onClick={() => updateStatus(p.id, "connected")}
                      className="px-3 py-1 text-xs rounded-full
                                 bg-blue-600 text-white"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => updateStatus(p.id, "none")}
                      className="px-3 py-1 text-xs rounded-full
                                 bg-gray-100 text-gray-700"
                    >
                      Ignore
                    </button>
                  </>
                }
              />
            ))}
          </div>
        </div>

        {/* CONNECTIONS */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">
            Connections
          </h2>

          {connections.length === 0 && (
            <p className="text-xs text-gray-500">
              You have no connections yet
            </p>
          )}

          <div className="space-y-2">
            {connections.map(p => (
              <Card
                key={p.id}
                person={p}
                action={
                  <button
                    onClick={() => alert("Messaging allowed (connected only)")}
                    className="px-3 py-1 text-xs rounded-full
                               border border-gray-400 text-gray-700"
                  >
                    Message
                  </button>
                }
              />
            ))}
          </div>
        </div>

        {/* PEOPLE YOU MAY KNOW — ALWAYS LAST */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">
            People you may know
          </h2>

          <div className="space-y-2">
            {suggestions.length === 0 && (
              <div className="bg-white border border-gray-200 rounded-md px-4 py-3">
                <p className="text-xs text-gray-500">
                  No suggestions available right now
                </p>
              </div>
            )}

            {suggestions.map(p => (
              <Card
                key={p.id}
                person={p}
                action={
                  p.status === "sent" ? (
                    <span className="text-xs text-gray-400">
                      Pending
                    </span>
                  ) : (
                    <button
                      onClick={() => updateStatus(p.id, "sent")}
                      className="px-3 py-1 text-xs rounded-full
                                 border border-blue-600 text-blue-600"
                    >
                      Connect
                    </button>
                  )
                }
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Connections;
