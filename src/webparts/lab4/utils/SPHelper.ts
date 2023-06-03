import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPFI, spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { IBook } from "../models/Book";

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
      return result.map<IBook>((i: any) => {
        return {
          title: i[Mappings.title],
          authorName: i[Mappings.authorName],
          publishYear: i[Mappings.publishYear],
          pages: i[Mappings.pages],
        };
      });
    } catch (e) {
      console.error(e);
    }
  };
}
