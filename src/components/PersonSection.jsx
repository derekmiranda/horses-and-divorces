import { useEffect, useState } from "react";

export default function PersonSection({ person, onChoose }) {
  return (
    <div
      className="person-section"
      onClick={() => onChoose(person)}
    >
      <div className="person-image-container">
        <img
          src={person.image}
          alt={person.name}
          className="person-image"
        />
        <div className="person-name-overlay">
          <span className="person-name">{person.name}</span>
        </div>
      </div>
    </div>
  );
}