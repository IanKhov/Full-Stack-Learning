const Persons = ({ personsToShow, onDelete }) => {
  return (
    <div>
      {personsToShow.map(person => 
        <Person key={person.id} person={person} onDelete={onDelete} />
      )}
    </div>
  )
}

const Person = ({ person, onDelete }) => {
  return (
    <p>
      {person.name} {person.number}{' '}
      <button type="button" onClick={() => onDelete(person.id)}>
        delete
      </button>
    </p>
  )
}

export default Persons