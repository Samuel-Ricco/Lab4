import * as React from "react";
import { SPHelper } from "../utils/SPHelper";
import {
  DetailsList,
  IColumn,
  SelectionMode,
} from "@fluentui/react/lib/DetailsList";
import { Book } from "../models/Book";
import { MyModal } from "./MyModal";
import { PrimaryButton } from "@fluentui/react";

interface IListerProps {}

interface IListerState {
  books: Book[];
  selectedBook: Book | null;
  showModal: boolean;
}

export class Lister extends React.Component<IListerProps, IListerState> {
  // Definizione delle colonne per DetailsList
  private columns: IColumn[] = [
    { key: "column1", name: "Title", fieldName: "title", minWidth: 100 },
    { key: "column2", name: "Author", fieldName: "authorName", minWidth: 100 },
    {
      key: "column3",
      name: "Publish Year",
      fieldName: "publishYear",
      minWidth: 100,
    },
    { key: "column4", name: "Pages", fieldName: "pages", minWidth: 100 },
  ];

  constructor(props: IListerProps) {
    super(props);
    this.state = {
      books: [],
      selectedBook: null,
      showModal: false,
    };
  }

  public handleSaveBook = async (updatedBook: Book) => {
    try {
      const { books, selectedBook } = this.state;

      // Effettua la chiamata a SharePoint per aggiornare il libro
      await SPHelper.updateBook(updatedBook);

      // Aggiorna lo stato con il libro modificato
      const updatedBooks = books.map((book) =>
        book.id === selectedBook.id ? updatedBook : book
      );

      this.setState({ books: updatedBooks, showModal: false });
    } catch (error) {
      console.error("Errore durante il salvataggio del libro:", error);
    }
  };

  public handleActiveItemChanged = (item?: Book) => {
    // Gestisce il cambio dell'elemento selezionato nella DetailsList
    this.setState({ selectedBook: item });
  };

  public handleOpenModal = () => {
    // Apre la modale solo se è stato selezionato un libro
    if (this.state.selectedBook) {
      this.setState({ showModal: true });
    }
  };

  public handleCloseModal = () => {
    // Chiude la modale
    this.setState({ showModal: false });
  };

  async componentDidMount() {
    try {
      // Recupera la lista dei libri dallo SPHelper
      const books = await SPHelper.getAll();
      this.setState({ books });
    } catch (error) {
      console.error("Error retrieving books:", error);
    }
  }

  render() {
    const { books, selectedBook, showModal } = this.state;

    return (
      <div>
        <div className="List">
          {/* DetailsList per visualizzare la lista dei libri */}
          <DetailsList
            items={books}
            columns={this.columns}
            selectionMode={SelectionMode.single}
            onActiveItemChanged={this.handleActiveItemChanged}
          />
          <div style={{ textAlign: "center" }}>
            {/* Bottone "Modifica" */}
            <PrimaryButton
              text="Modifica"
              onClick={this.handleOpenModal}
              disabled={!selectedBook}
              style={{ marginTop: "10px" }}
            />
          </div>
        </div>
        {/* Modale per la modifica del libro */}
        {selectedBook && showModal && (
          <MyModal
            isVisible={showModal}
            selectedBook={selectedBook}
            onSave={this.handleSaveBook}
            onClose={this.handleCloseModal}
          />
        )}
      </div>
    );
  }
}
