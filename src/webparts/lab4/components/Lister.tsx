import * as React from "react";
import { SPHelper } from "../utils/SPHelper";
import {
  DetailsList,
  IColumn,
  SelectionMode,
} from "@fluentui/react/lib/DetailsList";
import { Book } from "../models/Book";
import { EditModal } from "./EditModal";
import { PrimaryButton } from "@fluentui/react";
import { AddModal } from "./AddModal";
//import { Selection } from "@fluentui/react/lib/DetailsList";

interface IListerProps {}

interface IListerState {
  books: Book[];
  selectedBook: Book | null;
  showEditModal: boolean;
  showAddModal: boolean;
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
      showEditModal: false,
      showAddModal: false,
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

      this.setState({ books: updatedBooks, showEditModal: false });
    } catch (error) {
      console.error("Errore durante il salvataggio del libro:", error);
    }
  };

  public handelDeleteBook = async (deletedBook: Book) => {
    try {
      const { books } = this.state;
      await SPHelper.deleteBook(deletedBook);

      const updatedBooks = books.filter(
        (element) => element.id !== deletedBook.id
      );
      this.setState({ books: updatedBooks, showEditModal: false });
    } catch (error) {
      console.error("Errore durante l'eliminazione del libro:", error);
    }
  };

  public handleAddBook = () => {
    //TODO
  };

  public handleActiveItemChanged = (item?: Book) => {
    // Gestisce il cambio dell'elemento selezionato nella DetailsList
    this.setState({ selectedBook: item });
  };

  public handleOpenEditModal = () => {
    // Apre la modale solo se è stato selezionato un libro
    if (this.state.selectedBook) {
      this.setState({ showEditModal: true });
    }
  };

  public handleOpenAddModal = () => {
    this.setState({ showAddModal: true });
  };

  public handleCloseEditModal = () => {
    // Chiude la modale
    this.setState({ showEditModal: false });
  };

  public handleCloseAddModal = () => {
    // Chiude la modale
    this.setState({ showAddModal: false });
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
    const {
      books,
      selectedBook,
      showEditModal: showEditModal,
      showAddModal: showAddModal,
    } = this.state;

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
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            {/* Bottone "Modifica" */}

            <PrimaryButton
              text="Aggiungi"
              onClick={this.handleOpenAddModal}
              style={{ marginTop: "10px" }}
            />

            <PrimaryButton
              text="Modifica"
              onClick={this.handleOpenEditModal}
              disabled={!selectedBook}
              style={{ marginTop: "10px" }}
            />
          </div>
        </div>
        {/* Modale per la modifica del libro */}
        {selectedBook && showEditModal && (
          <EditModal
            isVisible={showEditModal}
            selectedBook={selectedBook}
            onSave={this.handleSaveBook}
            onClose={this.handleCloseEditModal}
            onDelete={this.handelDeleteBook}
          />
        )}

        {showAddModal && (
          <AddModal
            isVisible={showAddModal}
            onSave={this.handleAddBook}
            onClose={this.handleCloseAddModal}
          />
        )}
      </div>
    );
  }
}
