import * as React from "react";
import { SPHelper } from "../utils/SPHelper";
import {
  DetailsList,
  IColumn,
  SelectionMode,
  Selection,
} from "@fluentui/react/lib/DetailsList";
import { Book } from "../models/Book";
// import { EditModal } from "./EditModal";
import { PrimaryButton } from "@fluentui/react";
// import { AddModal } from "./AddModal";
import { Modals } from "./Modals";
import styles from "./Lab4.module.scss";

interface IListerProps {}

interface IListerState {
  books: Book[];
  selectedBook: Book | null;
  showModal: boolean;
  isEditMode: boolean;
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
      showModal: false,
      isEditMode: false,
    };

    // Inizializzazione della selection e specifica della callBack
    this.selection = new Selection({
      onSelectionChanged: this.handleSelectionChanged,
    });
  }

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

  public handleSaveBook = async (updatedBook: Book) => {
    try {
      const { books, selectedBook } = this.state;

      // Effettua la chiamata a SharePoint per aggiornare il libro
      await SPHelper.updateBook(updatedBook);

      // Aggiorna lo stato con il libro modificato
      const updatedBooks = books.map((book) =>
        book.id === selectedBook!.id ? updatedBook : book
      );

      this.setState({ books: updatedBooks, showModal: false });
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
      this.setState({ books: updatedBooks, showModal: false });
    } catch (error) {
      console.error("Errore durante l'eliminazione del libro:", error);
    }
  };

  public handleAddBook = async (newBook: Book) => {
    try {
      await SPHelper.addBook(newBook);

      // Recupera nuovamente la lista dei libri dal server dopo l'aggiunta
      const updatedBooks = await SPHelper.getAll();

      this.setState({ books: updatedBooks, showModal: false });
    } catch (error) {
      console.log(error);
    }
  };

  private handleOpenEditModal = () => {
    if (this.state.selectedBook) {
      this.setState({ isEditMode: true });
      this.setState({ showModal: true });
    }
  };

  private handleOpenAddModal = () => {
    this.setState({ isEditMode: false });
    this.setState({ showModal: true });
  };

  handleCloseModal = () => {
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
    const { books, selectedBook, showModal, isEditMode } = this.state;

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
          <div className={styles["lister-content"]}>
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

        {showModal && (
          <Modals
            isVisible={showModal}
            selectedBook={selectedBook}
            isEditMode={isEditMode}
            onSaveAdd={this.handleAddBook}
            onSaveEdit={this.handleSaveBook}
            onDelete={this.handelDeleteBook}
            onClose={this.handleCloseModal}
          />
        )}
      </div>
    );
  }
}
