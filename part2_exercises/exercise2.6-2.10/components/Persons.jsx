const Persons = ({ personsToShow }) => {
  return (
    <div>
      {personsToShow.map(person => 
        <Person key={person.name} person={person} />
      )}
    </div>
  )
}

const Person = ({ person }) => {
  return (
    <p>{person.name} {person.number}</p>
  )
}

export default Persons