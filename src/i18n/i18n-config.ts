import { AcceptLanguageResolver, HeaderResolver, QueryResolver } from "nestjs-i18n";
import path from "path";
import { DEFAULT_I18N_DIR, DEFAULT_LANGUAGE } from "src/common";

export const i18nConfig = {
    fallbackLanguage: DEFAULT_LANGUAGE,
    loaderOptions: {
        path: path.join(__dirname, DEFAULT_I18N_DIR),
        watch: true,
    },
    resolvers: [
        { use: QueryResolver, options: ['lang'] },
        { use: HeaderResolver, options: ['x-custom-lang'] },
        AcceptLanguageResolver,
    ],
}