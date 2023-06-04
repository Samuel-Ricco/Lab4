import React from "react";
import { Book } from "../models/Book";
import { Mappings } from "../utils/Mappings";
import { Modal, PrimaryButton, TextField } from "@fluentui/react";

interface IAddModalProps {
  isVisible: boolean;
  onSave: (newBook: Book) => void;
  onClose: () => void;
}

interface IAddModalState {
  bookTitle: string;
  bookAuthor: string;
  bookYear: string;
  bookPages: string;
}

export class AddModal extends React.Component<IAddModalProps, IAddModalState> {
  constructor(props: IAddModalProps) {
    super(props);

    this.state = {
      bookTitle: Mappings.title,
      bookAuthor: Mappings.authorName,
      bookYear: Mappings.publishYear,
      bookPages: Mappings.pages,
    };
  }

  public handleTitleChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ) => {
    // Gestisce il cambiamento del titolo del libro
    this.setState({ bookTitle: newValue || "" });
  };

  public handleAuthorChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ) => {
    // Gestisce il cambiamento dell'autore del libro
    this.setState({ bookAuthor: newValue || "" });
  };

  public handleYearChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ) => {
    // Gestisce il cambiamento dell'anno di pubblicazione del libro
    this.setState({ bookYear: newValue || "" });
  };

  public handlePagesChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ) => {
    // Gestisce il cambiamento del numero di pagine del libro
    this.setState({ bookPages: newValue || "" });
  };

  public createBook = () => {
    const newBook: Book = new Book(
      this.state.bookTitle,
      this.state.bookAuthor,
      parseInt(this.state.bookYear),
      parseInt(this.state.bookPages)
    );
    this.props.onSave(newBook);
  };

  public render(): React.ReactElement<IAddModalProps> {
    return (
      <Modal
        isOpen={this.props.isVisible}
        onDismiss={this.props.onClose}
        isBlocking={false}
        containerClassName="modal-container"
      >
        <div
          className="modal-content"
          style={{
            backgroundColor: "#f5f5f5",
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "20px",
            width: "400px",
            margin: "0 auto",
          }}
        >
          <h2 className="Title">Aggiungi un Libro</h2>
          <div className="TextFields">
            {/* Campo di testo per il titolo */}
            <TextField
              label="Titolo"
              value={this.state.bookTitle}
              onChange={this.handleTitleChange}
            />
            {/* Campo di testo per l'autore */}
            <TextField
              label="Autore"
              value={this.state.bookAuthor}
              onChange={this.handleAuthorChange}
            />
            {/* Campo di testo per l'anno di pubblicazione */}
            <TextField
              label="Anno di pubblicazione"
              value={this.state.bookYear}
              onChange={this.handleYearChange}
            />
            {/* Campo di testo per il numero di pagine */}
            <TextField
              label="Pagine"
              value={this.state.bookPages}
              onChange={this.handlePagesChange}
            />
          </div>

          <div
            className="Buttons"
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {/* Bottone "Elimina" */}
            <PrimaryButton text="Chiudi" onClick={this.props.onClose} />
            {/* Bottone "Salva" */}
            <PrimaryButton text="Salva" onClick={this.createBook} />
          </div>
        </div>
      </Modal>
    );
  }
}
