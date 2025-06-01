// 'use client';

// import React, { useState } from 'react';

// export default function MyProfile() {
//   const [profile, setProfile] = useState({
//     name: 'John Doe',
//     email: 'john.doe@example.com',
//     phone: '012-345-6789',
//   });

//   const [editMode, setEditMode] = useState(false);
//   const [formData, setFormData] = useState(profile);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSave = () => {
//     setProfile(formData);
//     setEditMode(false);
//   };

//   return (
//     <div className="mx-auto mt-12 max-w-md rounded-lg bg-white p-6 shadow-md">
//       <h1 className="mb-6 text-center text-2xl font-semibold">My Profile</h1>

//       <div className="space-y-4">
//         <div>
//           <label className="text-gray-700 block text-sm font-medium">
//             Name
//           </label>
//           {editMode ? (
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               className="border-gray-300 mt-1 block w-full rounded-md border px-3 py-2"
//             />
//           ) : (
//             <p className="text-gray-900 mt-1">{profile.name}</p>
//           )}
//         </div>

//         <div>
//           <label className="text-gray-700 block text-sm font-medium">
//             Email
//           </label>
//           {editMode ? (
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               className="border-gray-300 mt-1 block w-full rounded-md border px-3 py-2"
//             />
//           ) : (
//             <p className="text-gray-900 mt-1">{profile.email}</p>
//           )}
//         </div>

//         <div>
//           <label className="text-gray-700 block text-sm font-medium">
//             Phone
//           </label>
//           {editMode ? (
//             <input
//               type="tel"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               className="border-gray-300 mt-1 block w-full rounded-md border px-3 py-2"
//             />
//           ) : (
//             <p className="text-gray-900 mt-1">{profile.phone}</p>
//           )}
//         </div>
//       </div>

//       <div className="mt-6 flex justify-center">
//         {editMode ? (
//           <>
//             <button
//               onClick={handleSave}
//               className="mr-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
//             >
//               Save
//             </button>
//             <button
//               onClick={() => setEditMode(false)}
//               className="border-gray-300 hover:bg-gray-100 rounded border px-4 py-2"
//             >
//               Cancel
//             </button>
//           </>
//         ) : (
//           <button
//             onClick={() => setEditMode(true)}
//             className="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
//           >
//             Edit Profile
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }
