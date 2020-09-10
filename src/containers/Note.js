import React, { useRef, useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { API, Storage } from "aws-amplify";
import { Form } from "react-bootstrap";
import { onError } from "../libs/errorLib";
import config from "../config"
import LoaderButton from "../components/LoaderButton";
import { s3Upload } from "../libs/awsLib";
import "./Note.css"

export default function Note() {
  const file = useRef(null)
  const { id } = useParams()
  const history = useHistory()
  const [note, setNote] = useState(null)
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    function loadNote() {
      return API.get("notes", `/notes/${id}`)
    }

    async function onLoad() {
      try {
        const note = await loadNote()
        const { content, attachment } = note

        if (attachment) {
          note.attachmentURL = await Storage.vault.get(attachment)
        }

        setContent(content)
        setNote(note)
      } catch (e) {
        onError(e)
      }
    }

    onLoad()
  }, [id])

  function validateForm() {
    return content.length > 0
  }

  function formatFilename(str) {
    return str.replace(/^\w+-/, "")
  }

  function saveNote(note) {
    return API.put("notes", `/notes/${id}`, {
      body: note
    })
  }

  function deleteNote() {
    return API.del("notes", `/notes/${id}`);
  }

  function handleFileChange(e) {
    file.current = e.target.files[0]
  }

  async function handleSubmit(e) {
    let attachment
    e.preventDefault()

    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(`Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE /
        1000000} MB.`)
      return
    }

    setIsLoading(true)

    try {
      if (file.current) {
        attachment = await s3Upload(file.current)
        // delete old file
      }
      await saveNote({
        content,
        attachment: attachment || note.attachment
      })
      history.push('/')
    } catch (e) {
      onError(e)
      setIsLoading(false)
    }

  }

  async function handleDelete(e) {
    e.preventDefault()

    const confirmed = window.confirm("Are you sure you want to delete this note?")

    if (!confirmed) {
      return
    }

    setIsDeleting(true)

    try {
      await deleteNote()
      history.push('/')
      // delete attachment
    } catch (e) {
      onError(e)
      setIsDeleting(false)
    }
  }

  return (
    <div className="Note">
      {note && (
        <form onSubmit={handleSubmit}>
          <Form.Group controlId="content">
            <Form.Control
              value={content}
              as="textarea"
              onChange={e => setContent(e.target.value)}
            />
          </Form.Group>
          {note.attachment && (
            <Form.Group>
              <Form.Label>Attachment</Form.Label>
              <Form.Text>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={note.attachmentURL}
                >
                  {formatFilename(note.attachment)}
                </a>
              </Form.Text>
            </Form.Group>
          )}
          <Form.Group controlId="file">
            {!note.attachment && <Form.Label>Attachment</Form.Label>}
            <Form.Control onChange={handleFileChange} type="file" />
          </Form.Group>
          <LoaderButton
            block
            type="submit"
            isLoading={isLoading}
            disabled={!validateForm()}
          >
            Save
        </LoaderButton>
          <LoaderButton
            block
            variant="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Delete
        </LoaderButton>
        </form>
      )}
    </div>
  )
}