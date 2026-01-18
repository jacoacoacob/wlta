import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { RouterContextProvider } from "react-router";
import type { Database } from "~/database.types";
import { getAssertIsLoggedIn, getDb, isNull, isString } from "~/utils";
import { getFormString, getOptionalFormString } from "~/utils/form-data";

export interface ServiceParams {
  context: Readonly<RouterContextProvider>;
  request: Request;
}

export class BaseService {
  protected db: SupabaseClient<Database>;
  protected user: User;
  
  private _request: Request;
  private _formData: null | FormData = null;

  constructor({ context, request }: ServiceParams) {
    this._request = request;

    this.db = getDb(context);
    this.user = getAssertIsLoggedIn(context);
  }

  protected async getForm() {
    if (isNull(this._formData)) {
      this._formData = await this._request.formData();
    }

    const formData = this._formData;

    return {
      getString(key: string) {
        return getFormString(formData, key);
      },
      getOptionalString(key: string) {
        const data = getOptionalFormString(formData, key);

        if (!isString(data)) {
          console.warn(`${key} cannot be cast to string`)
          return;
        }
        
        return data;
      },
      getArray(key: string) {
        const data = getFormString(formData, key);

        return data.split(",").filter((value) => value.trim().length > 0);
      },
      getOptionalArray(key: string) {
        const data = getOptionalFormString(formData, key);

        if (!isString(data)) {
          console.warn(`${key} cannot be cast to string`);
          return;
        }

        return data.split(",").filter((value) => value.trim().length > 0);
      }
    }
  }
}
