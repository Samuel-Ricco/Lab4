import React from "react";
import { Book } from "../models/Book";
import {
  ColorClassNames,
  Modal,
  PrimaryButton,
  TextField,
} from "@fluentui/react";
import styles from "./Lab4.module.scss";

interface IModalsProps {
  isVisible: boolean;
  selectedBook: Book;
  isEditMode: boolean;
  onSave: (updatedBook: Book) => void;
  onClose: () => void;
  onDelete: (selectedBook: Book) => void;
}

interface IModalsState {
  bookTitle: string;
  bookAuthor: string;
  bookYear: string;
  bookPages: string;
  errorMessage: string | null;
}

export class Modals extends React.Component<IModalsProps, IModalsState> {
  constructor(props: IModalsProps) {
    super(props);

    this.state = {
      bookTitle: props.selectedBook.title,
      bookAuthor: props.selectedBook.authorName,
      bookYear: props.selectedBook.publishYear.toString(),
      bookPages: props.selectedBook.pages.toString(),
      errorMessage: null,
    };
  }

  // Metodi condivisi----------------
  public handleTitleChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ) => {
    this.setState({ bookTitle: newValue || "" });
  };

  public handleAuthorChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ) => {
    this.setState({ bookAuthor: newValue || "" });
  };

  public handleYearChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ) => {
    this.setState({ bookYear: newValue || "" });
  };

  public handlePagesChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ) => {
    this.setState({ bookPages: newValue || "" });
  };

  //Metodi edit-------------------
  public updateBook = () => {
    // Aggiorna il libro con i nuovi valori inseriti
    const { selectedBook } = this.props;
    const { bookTitle, bookAuthor, bookYear, bookPages } = this.state;

    if (isNaN(parseInt(bookYear)) || isNaN(parseInt(bookPages))) {
      this.setState({
        errorMessage: "I valori dei campi numerici non sono validi.",
      });
      return;
    }

    const updatedBook: Book = {
      ...selectedBook,
      title: bookTitle,
      authorName: bookAuthor,
      publishYear: parseInt(bookYear),
      pages: parseInt(bookPages),
    };

    this.props.onSave(updatedBook);
  };

  public deleteBook = () => {
    const { selectedBook } = this.props;
    this.props.onDelete(selectedBook);
  };

  //Metodo dell'Add-----------------
  public createBook = () => {
    const { bookTitle, bookAuthor, bookYear, bookPages } = this.state;

    // Effettua la validazione dei campi numerici
    if (isNaN(parseInt(bookYear)) || isNaN(parseInt(bookPages))) {
      this.setState({
        errorMessage: "I valori dei campi numerici non sono validi.",
      });
      return;
    }

    const newBook: Book = new Book(
      bookTitle,
      bookAuthor,
      parseInt(bookYear),
      parseInt(bookPages)
    );
    this.props.onSave(newBook);
  };

  //Render------------------------
  public render(): React.ReactElement<IModalsProps> {
    const { isVisible, onClose } = this.props;
    const { bookTitle, bookAuthor, bookYear, bookPages, errorMessage } =
      this.state;
    if (this.props.isEditMode) {
      //return dell'edit
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
            <h2 className="Title">Modifica il libro</h2>
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
              <PrimaryButton
                text="Elimina"
                className={styles.redButton}
                onClick={this.deleteBook}
              />
              {/* Bottone "Salva" */}
              <PrimaryButton
                text="Salva"
                color={ColorClassNames.green}
                onClick={this.updateBook}
              />
            </div>
          </div>
        </Modal>
      );
    }
    //return dell'add
    return (
      <Modal
        isOpen={isVisible}
        onDismiss={onClose}
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
              value={bookTitle}
              onChange={this.handleTitleChange}
            />
            {/* Campo di testo per l'autore */}
            <TextField
              label="Autore"
              value={bookAuthor}
              onChange={this.handleAuthorChange}
            />
            {/* Campo di testo per l'anno di pubblicazione */}
            <TextField
              label="Anno di pubblicazione"
              value={bookYear}
              onChange={this.handleYearChange}
            />
            {/* Campo di testo per il numero di pagine */}
            <TextField
              label="Numero di pagine"
              value={bookPages}
              onChange={this.handlePagesChange}
            />
          </div>
          {/* Visualizza il messaggio di errore se presente */}
          {errorMessage && (
            <div className="ErrorMessage">
              <span
                style={{ fontWeight: "bold", color: "red", fontSize: "16px" }}
              >
                {errorMessage}
              </span>
            </div>
          )}
          <div
            className="Buttons"
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {/* Bottone di salvataggio */}
            <PrimaryButton text="Salva" onClick={this.createBook} />
            {/* Bottone di chiusura */}
            <PrimaryButton text="Chiudi" onClick={onClose} />
          </div>
        </div>
      </Modal>
    );
  }
}
