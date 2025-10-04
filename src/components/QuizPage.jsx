import "./QuizPage.css"

function PersonSection({ children }) {
  return (
    <div>
      <div className="person-img"></div>
      <button>{children}</button>
    </div>
  )
}

function QuizPage() {
  return (
    <>
      <h1>horses and divorces / wiki-exes</h1>
      <main className="quiz-page">
      <PersonSection>this one?</PersonSection> 
      <p>who has the most divorces?</p>
      <PersonSection>or this one?</PersonSection>
      </main>
    </>
  )
}

export default QuizPage
