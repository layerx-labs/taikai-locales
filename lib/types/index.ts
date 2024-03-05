import emails from '@locales/en/emails';
import frontend from '@locales/en/frontend';
import notifications from '@locales/en/notifications';

export * from './enums';
export type Locale = 'en' | 'br' | 'fr';

export type CompileEmailTemplateInput = {
  context: Record<string, any>;
  locale: Locale;
  templateName: keyof typeof emails;
};

export type CompileNotificationTemplateInput = {
  context: Record<string, any>;
  locale: Locale;
  templateName: keyof typeof notifications;
};

type RemoveFileExtension<T extends string> = T extends `${infer Prefix}.${string}` ? Prefix : T;
type _FrontendFiles = keyof typeof frontend;
export type FrontendFiles = RemoveFileExtension<_FrontendFiles>;
