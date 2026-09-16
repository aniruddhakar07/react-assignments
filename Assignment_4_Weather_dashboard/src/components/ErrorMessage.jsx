export default function ErrorMessage({ message }) {
  return (
    <div className="error-box" role="alert">
      <div className="error-title">Couldn't load the weather</div>
      <div>{message}</div>
    </div>
  )
}
