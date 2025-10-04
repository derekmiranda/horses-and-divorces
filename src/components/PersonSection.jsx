import { useEffect, useState } from "react";

export default function PersonSection({ person, onChoose }) {
  return (
    <div>
      <div className="person-img">
        <img
          src={person.image}
          alt={person.name}
          style={{ width: "150px", height: "auto" }}
        />
      </div>
      <button onClick={() => onChoose(person)}>{person.name}</button>
      <p>{person.description}</p>
    </div>
  );
}