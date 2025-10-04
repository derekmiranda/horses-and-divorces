import { useEffect, useState } from "react";
import "./QuizPage.css"

function PersonSection({ children }) {
  return (
    <div>
      <div className="person-img"></div>
      <button>{children}</button>
    </div>
  )
}

async function testGetCelebrities() {
  try {
    const data = await getCelebrities();
    console.log("Fetched data:", data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

testGetCelebrities();

function QuizPage() {
  return (
    <>
      <h1>horses and divorces / wiki-exes</h1>
      <section className="quiz-row">
        <PersonSection>this one?</PersonSection>
        <p>who has the most divorces?</p>
        <PersonSection>or this one?</PersonSection>
      </section>
    </>
  )
}

export default QuizPage
