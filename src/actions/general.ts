import { redirect as nextRedirect } from "next/navigation";
import "server-only";

export class ActionResponse {
  static error(message: string) {
    return { error: message };
  }

  static success<R extends object>(data: R) {
    return { error: null, ...data };
  }

  static redirect = nextRedirect;
}
