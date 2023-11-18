import { useEffect, useState } from 'react'

const Persons = ({ persons }) => (
  persons.map(person => (
    <p key={person.name}>{person.name} {person.number}</p>
  ))
)

const Filter = ({ search, handleSearchChange }) => {
  return (
    <div>
      <p>filter shown with <input value={search} onChange={handleSearchChange} /></p>
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [personToShow, setPersonToShow] = useState(persons)
  const [search, setSearch] = useState('')

  const initDataHook = () => {
    console.log('effect')
    const url = 'http://localhost:3001/persons'
    fetch(url)
      .then(response => response.json())
      .then(data => { setPersons(data), setPersonToShow(data) })
  }
  useEffect(initDataHook, [])

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.find(p => p.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }
    setPersons([...persons, { name: newName, number: newNumber }])
    setNewName('')
    setNewNumber('')
  }

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
    setPersonToShow(persons.filter(p => p.name.toLowerCase().includes(event.target.value.toLowerCase())))
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }


  return (
    <div>
      <h2>Phonebook</h2>
      <Filter search={search} handleSearchChange={handleSearchChange} />
      <h2>add a new</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>number: <input value={newNumber} onChange={handleNumberChange} /></div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <Persons persons={personToShow} />
    </div>
  )
}

export default App