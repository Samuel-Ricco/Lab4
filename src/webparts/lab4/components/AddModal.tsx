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
  //TODO
  bookTitle: string;
  bookAuthor: string;
  bookYear: string;
  bookPages: string;
  errorMessage: string | null;
}

export class AddModal extends React.Component<IAddModalProps, IAddModalState> {
  constructor(props: IAddModalProps) {
    super(props);

    this.state = {
      bookTitle: Mappings.title,
      bookAuthor: Mappings.authorName,
      bookYear: Mappings.publishYear,
      bookPages: Mappings.pages,
      errorMessage: null,
    };
  }

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

  public render(): React.ReactElement<IAddModalProps> {
    const { isVisible, onClose } = this.props;
    const { bookTitle, bookAuthor, bookYear, bookPages, errorMessage } =
      this.state;

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
