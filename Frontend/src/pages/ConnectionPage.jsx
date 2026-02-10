// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const API = "http://localhost:4000/api/connections";

// const Connections = () => {
//   const navigate = useNavigate();

//   const [requests, setRequests] = useState([]);
//   const [connections, setConnections] = useState([]);
//   const [suggestions, setSuggestions] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const token = localStorage.getItem("token");

//   const api = axios.create({
//     baseURL: API,
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   /* FETCH ALL DATA */
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [reqRes, connRes, sugRes] = await Promise.all([
//           api.get("/requests"),
//           api.get("/list"),
//           api.get("/suggestions"),
//         ]);

//         setRequests(reqRes.data);
//         setConnections(connRes.data);
//         setSuggestions(sugRes.data);
//       } catch (err) {
//         console.error("Failed to load connections", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   /* ACTION HANDLERS */

//   const sendRequest = async (userId) => {
//     try {
//       await api.post(`/request/${userId}`);
//       setSuggestions((prev) =>
//         prev.map((p) => (p._id === userId ? { ...p, status: "sent" } : p)),
//       );
//     } catch (err) {
//       alert(err.response?.data?.message || "Failed to send request");
//     }
//   };

//   const acceptRequest = async (userId) => {
//     try {
//       await api.patch(`/accept/${userId}`);

//       const acceptedUser = requests.find((r) => r._id === userId);

//       setRequests((prev) => prev.filter((r) => r._id !== userId));
//       setConnections((prev) => [...prev, acceptedUser]);
//     } catch (err) {
//       alert(err.response?.data?.message || "Failed to accept request");
//     }
//   };

//   const removeFriend = async (userId) => {
//     try {
//       await api.delete(`/remove/${userId}`);
//       setConnections((prev) => prev.filter((c) => c._id !== userId));
//     } catch (err) {
//       alert(err.response?.data?.message || "Failed to remove friend");
//     }
//   };

//   const rejectRequest = async (userId) => {
//     try {
//       await api.patch(`/reject/${userId}`);
//       setRequests((prev) => prev.filter((r) => r._id !== userId));
//     } catch (err) {
//       alert(err.response?.data?.message || "Failed to reject request");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p className="text-sm text-gray-500">Loading connections...</p>
//       </div>
//     );
//   }

//   /* CARD */
//   const Card = ({ person, action }) => (
//     <div
//       onClick={() => navigate(`/profile/${person._id}`)}
//       className="w-full bg-white border border-gray-200 rounded-md
//                  hover:shadow-sm transition cursor-pointer"
//     >
//       <div className="flex items-center gap-3 px-4 py-3">
//         <img
//           src={person.avatar}
//           alt={person.name}
//           className="w-10 h-10 rounded-full"
//         />

//         <div className="flex-1 min-w-0">
//           <p className="text-sm font-semibold text-gray-900 truncate">
//             {person.name}
//           </p>

//           <p className="text-xs text-gray-600 truncate">
//             {person.role} • {person.affiliation}
//           </p>

//           <p className="text-[11px] text-gray-500 mt-0.5">
//             {person.mutualCount || 0} mutual connections
//           </p>
//         </div>

//         <div onClick={(e) => e.stopPropagation()}>{action}</div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-[#f3f2ef] py-6">
//       <div className="max-w-3xl mx-auto px-4">
//         {/* INVITATIONS */}
//         <section className="mb-8">
//           <h2 className="text-sm font-semibold text-gray-700 mb-2">
//             Invitations
//           </h2>

//           {requests.length === 0 && (
//             <p className="text-xs text-gray-500">No pending invitations</p>
//           )}

//           <div className="space-y-2">
//             {requests.map((p) => (
//               <Card
//                 key={p._id}
//                 person={p}
//                 action={
//                   <>
//                     <button
//                       onClick={() => acceptRequest(p._id)}
//                       className="px-3 py-1 text-xs rounded-full
//                                  bg-blue-600 text-white"
//                     >
//                       Accept
//                     </button>
//                     <button
//                       onClick={() => rejectRequest(p._id)}
//                       className="px-3 py-1 text-xs rounded-full
//                                  bg-gray-100 text-gray-700"
//                     >
//                       Ignore
//                     </button>
//                   </>
//                 }
//               />
//             ))}
//           </div>
//         </section>

//         {/* CONNECTIONS */}
//         <section className="mb-8">
//           <h2 className="text-sm font-semibold text-gray-700 mb-2">
//             Connections
//           </h2>

//           {connections.length === 0 && (
//             <p className="text-xs text-gray-500">You have no connections yet</p>
//           )}

//           <div className="space-y-2">
//             {connections.map((p) => (
//               <Card
//                 key={p._id}
//                 person={p}
//                 action={
//                   <button
//                     onClick={() => navigate(`/chat/${p._id}`)}
//                     className="px-3 py-1 text-xs rounded-full
//                                border border-gray-400 text-gray-700"
//                   >
//                     Message
//                   </button>
//                 }
//               />
//             ))}
//           </div>
//         </section>

//         {/* SUGGESTIONS */}
//         <section>
//           <h2 className="text-sm font-semibold text-gray-700 mb-2">
//             People you may know
//           </h2>

//           <div className="space-y-2">
//             {suggestions.map((p) => (
//               <Card
//                 key={p._id}
//                 person={p}
//                 action={
//                   p.status === "sent" ? (
//                     <span className="text-xs text-gray-400">Pending</span>
//                   ) : (
//                     <button
//                       onClick={() => sendRequest(p._id)}
//                       className="px-3 py-1 text-xs rounded-full
//                                  border border-blue-600 text-blue-600"
//                     >
//                       Connect
//                     </button>
//                   )
//                 }
//               />
//             ))}
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// };

// export default Connections;


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:4000/api/connections";

const Connections = () => {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [connections, setConnections] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  /* AXIOS INSTANCE */
  const api = axios.create({
    baseURL: API,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  /* LOAD DATA */
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [reqRes, connRes, sugRes] = await Promise.all([
          api.get("/requests"),
          api.get("/list"),
          api.get("/suggestions"),
        ]);

        setRequests(reqRes.data);
        setConnections(connRes.data);
        setSuggestions(sugRes.data);
      } catch (err) {
        console.error("Failed to load connections", err);
        alert("Failed to load connections data");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  /* ACTIONS */

  const sendRequest = async (recipientId) => {
    try {
      await api.post(`/request/${recipientId}`);

      setSuggestions(prev =>
        prev.map(u =>
          u._id === recipientId ? { ...u, status: "sent" } : u
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send request");
    }
  };

  const acceptRequest = async (requesterId) => {
    try {
      await api.patch(`/accept/${requesterId}`);

      const acceptedUser = requests.find(r => r._id === requesterId);

      setRequests(prev => prev.filter(r => r._id !== requesterId));
      setConnections(prev => [...prev, acceptedUser]);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to accept request");
    }
  };

  const rejectRequest = async (requesterId) => {
    try {
      await api.patch(`/reject/${requesterId}`);
      setRequests(prev => prev.filter(r => r._id !== requesterId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reject request");
    }
  };

  const removeFriend = async (friendId) => {
    try {
      await api.delete(`/remove/${friendId}`);
      setConnections(prev => prev.filter(c => c._id !== friendId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove friend");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-500">Loading connections...</p>
      </div>
    );
  }

  /* USER CARD */
  const Card = ({ person, action }) => (
    <div
      onClick={() => navigate(`/profile/${person._id}`)}
      className="w-full bg-white border border-gray-200 rounded-md
                 hover:shadow-sm transition cursor-pointer"
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <img
          src={person.avatar || `https://ui-avatars.com/api/?name=${person.name}`}
          alt={person.name}
          className="w-10 h-10 rounded-full"
        />

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {person.name}
          </p>

          <p className="text-xs text-gray-600 truncate">
            {person.role} • {person.affiliation}
          </p>
        </div>

        <div onClick={(e) => e.stopPropagation()}>{action}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f3f2ef] py-6">
      <div className="max-w-3xl mx-auto px-4">

        {/* INVITATIONS */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">
            Invitations
          </h2>

          {requests.length === 0 && (
            <p className="text-xs text-gray-500">No pending invitations</p>
          )}

          <div className="space-y-2">
            {requests.map(user => (
              <Card
                key={user._id}
                person={user}
                action={
                  <>
                    <button
                      onClick={() => acceptRequest(user._id)}
                      className="px-3 py-1 text-xs rounded-full bg-blue-600 text-white"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => rejectRequest(user._id)}
                      className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700"
                    >
                      Ignore
                    </button>
                  </>
                }
              />
            ))}
          </div>
        </section>

        {/* CONNECTIONS */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">
            Connections
          </h2>

          {connections.length === 0 && (
            <p className="text-xs text-gray-500">You have no connections yet</p>
          )}

          <div className="space-y-2">
            {connections.map(user => (
              <Card
                key={user._id}
                person={user}
                action={
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/chat/${user._id}`)}
                      className="px-3 py-1 text-xs rounded-full border border-gray-400 text-gray-700"
                    >
                      Message
                    </button>
                    <button
                      onClick={() => removeFriend(user._id)}
                      className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                }
              />
            ))}
          </div>
        </section>

        {/* SUGGESTIONS */}
        <section>
          <h2 className="text-sm font-semibold text-gray-700 mb-2">
            People you may know
          </h2>

          <div className="space-y-2">
            {suggestions.length === 0 && (
              <p className="text-xs text-gray-500">No suggestions available</p>
            )}

            {suggestions.map(user => (
              <Card
                key={user._id}
                person={user}
                action={
                  user.status === "sent" ? (
                    <span className="text-xs text-gray-400">Pending</span>
                  ) : (
                    <button
                      onClick={() => sendRequest(user._id)}
                      className="px-3 py-1 text-xs rounded-full border border-blue-600 text-blue-600"
                    >
                      Connect
                    </button>
                  )
                }
              />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default Connections;

