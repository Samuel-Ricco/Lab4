import React from "react";
import { Book } from "../models/Book";
import {
  ColorClassNames,
  Modal,
  PrimaryButton,
  TextField,
} from "@fluentui/react";
import styles from "./Lab4.module.scss";

interface ICustomModalProps {
  isVisible: boolean;
  selectedBook: Book;
  isEditMode: boolean;
  onSaveAdd: (updatedBook: Book) => void;
  onSaveEdit: (updatedBook: Book) => void;
  onClose: () => void;
  onDelete: (selectedBook: Book) => void;
}

interface ICustomModalState {
  bookTitle: string;
  bookAuthor: string;
  bookYear: string;
  bookPages: string;
  errorMessage: string | null;
}

export class CustomModal extends React.Component<
  ICustomModalProps,
  ICustomModalState
> {
  constructor(props: ICustomModalProps) {
    super(props);

    if (props.selectedBook != null) {
      this.state = {
        bookTitle: props.selectedBook.title,
        bookAuthor: props.selectedBook.authorName,
        bookYear: props.selectedBook.publishYear.toString(),
        bookPages: props.selectedBook.pages.toString(),
        errorMessage: null,
      };
    } else if (props.selectedBook == null) {
      this.state = {
        bookTitle: "",
        bookAuthor: "",
        bookYear: "",
        bookPages: "",
        errorMessage: null,
      };
    }
  }

  // Metodi condivisi----------------

  //TODO racchiudere in un unico metodo se possibile
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

  //Metodi dell'edit-----------------
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

    this.props.onSaveEdit(updatedBook);
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
    this.props.onSaveAdd(newBook);
  };

  //Render------------------------
  public render(): React.ReactElement<ICustomModalProps> {
    const { onClose } = this.props;
    const { errorMessage } = this.state;
    //return dell'edit
    return (
      <Modal
        isOpen={this.props.isVisible}
        onDismiss={this.props.onClose}
        isBlocking={false}
      >
        <div className={styles["modal-content"]}>
          {this.props.isEditMode ? (
            <h2 className="Title">Modifica il libro</h2>
          ) : (
            <h2 className="Title">Aggiungi un libro</h2>
          )}

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

          <div className={styles["buttons-content"]}>
            {this.props.isEditMode ? (
              <>
                {/* Bottone di eliminazione */}
                <PrimaryButton
                  text="Elimina"
                  className={styles.redButton}
                  onClick={this.deleteBook}
                />
                {/* Bottone di salvataggio */}
                <PrimaryButton
                  text="Salva"
                  color={ColorClassNames.green}
                  onClick={this.updateBook}
                />
              </>
            ) : (
              <>
                {/* Bottone di salvataggio */}
                <PrimaryButton text="Salva" onClick={this.createBook} />
                {/* Bottone di chiusura */}
                <PrimaryButton text="Chiudi" onClick={onClose} />
              </>
            )}
          </div>
        </div>
      </Modal>
    );
  }
}
