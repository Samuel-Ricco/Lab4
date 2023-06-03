import * as React from "react";
import { Book } from "../models/Book";
import {
  ColorClassNames,
  PrimaryButton,
  TextField,
  Modal,
} from "@fluentui/react";
import styles from "./Lab4.module.scss";

const title: string = "Modifica Libro";

interface IMyModalState {
  bookTitle: string;
  bookAuthor: string;
  bookYear: string;
  bookPages: string;
}

interface IMyModalProps {
  isVisible: boolean;
  selectedBook: Book;
  onSave: (updatedBook: Book) => void;
  onClose: () => void;
}

export class MyModal extends React.Component<IMyModalProps, IMyModalState> {
  constructor(props: IMyModalProps) {
    super(props);

    this.state = {
      bookTitle: props.selectedBook.title,
      bookAuthor: props.selectedBook.authorName,
      bookYear: props.selectedBook.publishYear.toString(),
      bookPages: props.selectedBook.pages.toString(),
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

  public updateBook = () => {
    // Aggiorna il libro con i nuovi valori inseriti
    const { selectedBook } = this.props;
    const { bookTitle, bookAuthor, bookYear, bookPages } = this.state;

    const updatedBook: Book = {
      ...selectedBook,
      title: bookTitle,
      authorName: bookAuthor,
      publishYear: parseInt(bookYear),
      pages: parseInt(bookPages),
    };

    this.props.onSave(updatedBook);
  };

  public render(): React.ReactElement<IMyModalProps> {
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
          <h2 className="Title">
            <title>{title}</title>
          </h2>
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
            <PrimaryButton text="Elimina" className={styles.redButton} />
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
}
