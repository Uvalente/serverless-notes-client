import React, { useState, useEffect } from "react";
import { ListGroup } from "react-bootstrap";
import { API } from "aws-amplify";
import { LinkContainer } from 'react-router-bootstrap'
import { useAppContext } from '../libs/contextLib'
import { onError } from '../libs/errorLib'
import "./Home.css";

export default function Home() {
  const [notes, setNotes] = useState([])
  const { isAuthenticated } = useAppContext()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    function loadNotes() {
      return API.get('notes', '/notes')
    }

    async function onLoad() {
      if (!isAuthenticated) {
        return
      }

      try {
        const notes = await loadNotes()
        setNotes(notes)
      } catch (e) {
        onError(e)
      }

      setIsLoading(false)
    }

    onLoad()
  }, [isAuthenticated])

  function renderNotesList(notes) {
    return [{}].concat(notes).map((note, i) =>
      i !== 0 ? (
        <LinkContainer key={note.noteId} to={`/notes/${note.noteId}`}>
          <ListGroup.Item>
            <p className='h5'>
            {note.content.trim().split("\n")[0]}
            </p>
            <p className='h6 text-muted'>
              {"Created: " + new Date(note.createdAt).toLocaleString()}
            </p>
          </ListGroup.Item>
        </LinkContainer>
      ) : (
          <LinkContainer key="new" to="/notes/new">
            <ListGroup.Item>
              <h5 className='my-0'>
                <b>{"\uFF0B"}</b> Create a new note
              </h5>
            </ListGroup.Item>
          </LinkContainer>
        )
    )
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1>Scratch</h1>
        <p>A simple note taking app</p>
      </div>
    )
  }

  function renderNotes() {
    return (
      <div className='notes'>
        <h1 className='my-4'>
          Your Notes
        </h1>
        <ListGroup>
          {!isLoading && renderNotesList(notes)}
        </ListGroup>

      </div>
    )
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderNotes() : renderLander()}
    </div>
  );
}