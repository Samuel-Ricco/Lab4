import * as React from "react";
import { SPHelper } from "../utils/SPHelper";
import {
  DetailsList,
  IColumn,
  SelectionMode,
  Selection,
} from "@fluentui/react/lib/DetailsList";
import { Book } from "../models/Book";
import { EditModal } from "./EditModal";
import { PrimaryButton } from "@fluentui/react";
import { AddModal } from "./AddModal";

interface IListerProps {}

interface IListerState {
  books: Book[];
  selectedBook: Book | null;
  showEditModal: boolean;
  showAddModal: boolean;
}

export class Lister extends React.Component<IListerProps, IListerState> {
  // Definizione della selection per poter controllare la deselezione
  private selection: Selection;

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

    // Inizializzazione della selection e specifica della callBack
    this.selection = new Selection({
      onSelectionChanged: this.handleSelectionChanged,
    });
  }

  // Metodo chiamato quando la selezione cambia nella DetailsList
  public handleSelectionChanged = () => {
    const selectedItems = this.selection.getSelection() as Book[];
    if (selectedItems.length > 0) {
      // Se è stato selezionato almeno un elemento, imposta il primo elemento come selectedBook
      this.setState({ selectedBook: selectedItems[0] });
    } else {
      // Altrimenti, imposta selectedBook a null
      this.setState({ selectedBook: null });
    }
  };

  // Metodo chiamato quando si salva un libro modificato
  public handleSaveBook = async (updatedBook: Book) => {
    try {
      const { books, selectedBook } = this.state;

      // Effettua la chiamata a SharePoint per aggiornare il libro
      await SPHelper.updateBook(updatedBook);

      // Aggiorna lo stato con il libro modificato
      const updatedBooks = books.map((book) =>
        book.id === selectedBook!.id ? updatedBook : book
      );

      this.setState({ books: updatedBooks, showEditModal: false });
    } catch (error) {
      console.error("Errore durante il salvataggio del libro:", error);
    }
  };

  // Metodo chiamato quando si elimina un libro
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

  // Metodo chiamato quando si aggiunge un nuovo libro
  public handleAddBook = async (newBook: Book) => {
    try {
      const { books } = this.state;

      // Effettua la validazione dei campi numerici
      if (isNaN(newBook.pages) || isNaN(newBook.publishYear)) {
        // Visualizza un messaggio di errore o gestisci la situazione in base alle tue esigenze
        console.error("I valori dei campi numerici non sono validi.");
        return;
      }

      // Procedi con l'aggiunta del libro solo se i valori numerici sono validi
      await SPHelper.addBook(newBook);
      books.push(newBook);

      const updatedBooks = books;
      this.setState({ books: updatedBooks, showAddModal: false });
    } catch (error) {
      console.log(error);
    }
  };

  // Metodo chiamato quando si apre la modale di modifica
  public handleOpenEditModal = () => {
    // Apre la modale solo se è stato selezionato un libro
    if (this.state.selectedBook) {
      this.setState({ showEditModal: true });
    }
  };

  // Metodo chiamato quando si apre la modale di aggiunta
  public handleOpenAddModal = () => {
    this.setState({ showAddModal: true });
  };

  // Metodo chiamato quando si chiude la modale di modifica
  public handleCloseEditModal = () => {
    // Chiude la modale
    this.setState({ showEditModal: false });
  };

  // Metodo chiamato quando si chiude la modale di aggiunta
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
    const { books, selectedBook, showEditModal, showAddModal } = this.state;

    return (
      <div>
        <div className="List">
          {/* DetailsList per visualizzare la lista dei libri */}
          <DetailsList
            items={books}
            columns={this.columns}
            selectionMode={SelectionMode.single}
            selection={this.selection}
            onActiveItemChanged={this.handleSelectionChanged}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            {/* Bottone "Aggiungi" */}
            <PrimaryButton
              text="Aggiungi"
              onClick={this.handleOpenAddModal}
              style={{ marginTop: "10px" }}
            />
            {/* Bottone "Modifica" */}
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
        {/* Modale per l'aggiunta di un nuovo libro */}
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
