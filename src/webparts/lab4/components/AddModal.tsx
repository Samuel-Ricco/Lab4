import React from "react";
import { Book } from "../models/Book";
import { Mappings } from "../utils/Mappings";
import { Modal, PrimaryButton, TextField } from "@fluentui/react";

interface IAddModalProps {
  isVisible: boolean;
  onSave: (updatedBook: Book) => void;
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
            <TextField label="Titolo" value={this.state.bookTitle} />
            {/* Campo di testo per l'autore */}
            <TextField label="Autore" value={this.state.bookAuthor} />
            {/* Campo di testo per l'anno di pubblicazione */}
            <TextField
              label="Anno di pubblicazione"
              value={this.state.bookYear}
            />
            {/* Campo di testo per il numero di pagine */}
            <TextField label="Pagine" value={this.state.bookPages} />
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
            <PrimaryButton text="Salva" />
          </div>
        </div>
      </Modal>
    );
  }
}
