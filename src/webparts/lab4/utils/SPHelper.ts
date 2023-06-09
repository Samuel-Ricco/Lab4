import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPFI, spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/lists/types";
import { Book, IBook } from "../models/Book";

import { Mappings } from "./Mappings";

export class SPHelper {
  private static _sp: SPFI;

  static Init(spfxContext: WebPartContext) {
    try {
      if (!!spfxContext) {
        SPHelper._sp = spfi().using(SPFx(spfxContext));
      }
    } catch (e) {
      console.error(e);
    }
  }

  public static getAll = async () => {
    try {
      const result = await SPHelper._sp.web.lists
        .getByTitle(Mappings.spListNameBooks)
        .items();

      //TODO eliminare
      console.log(
        SPHelper._sp.web.lists.getByTitle(Mappings.spListNameBooks).items()
      );
      /////////////////////
      return result.map<IBook>((i: any) => {
        return {
          id: i[Mappings.id],
          title: i[Mappings.title],
          authorName: i[Mappings.authorNameCode],
          publishYear: i[Mappings.publishYearCode],
          pages: i[Mappings.pages],
        };
      });
    } catch (e) {
      console.error(e);
    }
  };

  public static updateBook = async (book: Book) => {
    try {
      // Ottieni l'elemento della lista di SharePoint corrispondente all'id del libro
      const item = SPHelper._sp.web.lists
        .getByTitle(Mappings.spListNameBooks)
        .items.getById(book.id);

      // Aggiorna i campi dell'elemento con i valori del libro modificato
      await item.update({
        [Mappings.title]: book.title,
        [Mappings.authorNameCode]: book.authorName,
        [Mappings.publishYearCode]: book.publishYear,
        [Mappings.pages]: book.pages,
      });
    } catch (e) {
      console.error(e);
    }
  };

  public static addBook = async (book: Book) => {
    try {
      const list = SPHelper._sp.web.lists.getByTitle(Mappings.spListNameBooks);

      const newItem = await list.items.add({
        [Mappings.title]: book.title,
        [Mappings.authorNameCode]: book.authorName,
        [Mappings.publishYearCode]: book.publishYear,
        [Mappings.pages]: book.pages,
      });

      return newItem.data;
    } catch (error) {
      console.error("Errore durante l'aggiunta del libro:", error);
      throw error;
    }
  };

  public static deleteBook = async (book: Book) => {
    try {
      const item = SPHelper._sp.web.lists
        .getByTitle(Mappings.spListNameBooks)
        .items.getById(book.id);
      item.delete();
    } catch (e) {
      console.error(e);
    }
  };
}
