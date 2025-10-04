import { useEffect, useState } from "react";
import "./QuizPage.css"
import  PersonSection from "./PersonSection";

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
