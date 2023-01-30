import './index.css'

const FaqItems = props => {
  const {details} = props
  const {question, answer} = details

  return (
    <li className="faq-list">
      <p className="ques">{question}</p>
      <p className="ans">{answer}</p>
    </li>
  )
}

export default FaqItems
