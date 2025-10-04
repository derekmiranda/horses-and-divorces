// import { useEffect, useState } from "react";
// import { getCelebrities } from "../services/wikidataApi";

// export default function CelebrityList() {
//   const [celebrities, setCelebrities] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchCelebrities() {
//       setLoading(true);
//       try {
//         const data = await getCelebrities(); // Fetch celebrities from API
//         setCelebrities(data.slice(0, 2)); // Limit to 2 celebrities
//       } catch (error) {
//         console.error("Error fetching celebrities:", error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchCelebrities();
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <ul>
//       {celebrities.map((c, i) => (
//         <li key={i}>
//           <strong>{c.name}</strong> — {c.spouseCount} spouse(s)
//         </li>
//       ))}
//     </ul>
//   );
// }
