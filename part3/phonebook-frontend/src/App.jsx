import { useEffect, useState } from 'react'
import personService from './services/persons'

import './index.css'

const Persons = ({ persons, removePerson }) => {

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

const Notification = ({ message }) => {
  if (message.content === null) {
    return
  }

  return (
    <div className={message.type}>
      {message.content}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [personToShow, setPersonToShow] = useState(persons)
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState({ 'content': null, 'type': 'success' })

  const initPersons = () => {
    personService.getAll().then(data => { setPersons(data), setPersonToShow(data.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))) })
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
          .then(() => {
            initPersons()
            setMessage({ 'content': `Information of ${newPerson.name} has been changed`, 'type': 'success' })
          }).catch(error => {
            // this is the way to access the error message
            setMessage({ 'content': error.response.data.error, 'type': 'error' })
          })
      }
      return
    }

    personService.create(newPerson).then(data => {
      const newPersons = persons.concat(data)
      setPersons(newPersons)
      setPersonToShow(newPersons.filter(p => p.name.toLowerCase().includes(search.toLowerCase())))
      setMessage({ 'content': `Added ${newPerson.name}`, 'type': 'success' })
      setNewName('')
      setNewNumber('')
    }).catch(error => {
      // this is the way to access the error message
      setMessage({ 'content': error.response.data.error, 'type': 'error' })
    })

  }

  const removePerson = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .remove(person.id)
        .then(() => {
          initPersons()
          setMessage({ 'content': `Information of ${person.name} has been removed from server`, 'type': 'error' })
        })
    }
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
      <Notification message={message} />
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
      <Persons persons={personToShow} removePerson={removePerson} />
    </div>
  )
}

export default App