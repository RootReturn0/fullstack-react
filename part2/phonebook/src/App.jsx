import { useEffect, useState } from 'react'

import personService from './services/persons'

const Persons = ({ persons, initPersons }) => {
  const removePerson = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .remove(person.id)
        .then(() => initPersons())
    }
  }
  return persons.map(person => (
    <p key={person.name}>{person.name} {person.number} <button onClick={() => removePerson(person)} >delete</button></p>
  ))
}

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

  const initPersons = () => {
    personService.getAll().then(data => { setPersons(data), setPersonToShow(data) })
  }
  useEffect(initPersons, [])

  const addPerson = (event) => {
    event.preventDefault()
    const newPerson = { name: newName, number: newNumber }
    const existingPerson = persons.find(p => p.name === newName)
    if (existingPerson) {
      if (window.confirm(`${newPerson.name} is already added to phonebook, replace the old number with a new one?`)) {
        personService
          .update(existingPerson.id, newPerson)
          .then(() => initPersons())
      }
      return
    }

    personService.create(newPerson).then(data => {
      setPersons(persons.concat(data))
      setPersonToShow(persons.concat(data))
    })
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
      <Persons persons={personToShow} initPersons={initPersons} />
    </div>
  )
}

export default App