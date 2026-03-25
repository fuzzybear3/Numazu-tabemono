import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("locale")?.value;

  const acceptLanguage = (await headers()).get("accept-language") ?? "";
  const browserPrefersJapanese = acceptLanguage.toLowerCase().includes("ja");
  const fallback = browserPrefersJapanese ? "ja" : "en";

  const locale = cookieLocale ?? fallback;
  const validLocale = ["en", "ja"].includes(locale) ? locale : "en";

  return {
    locale: validLocale,
    messages: (await import(`../messages/${validLocale}.json`)).default,
  };
});
